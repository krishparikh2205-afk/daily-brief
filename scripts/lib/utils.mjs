import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 DailyBrief/1.0'
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

/**
 * Clean text from HTML, excess whitespace, and trim to ~2 punchy sentences
 */
export function cleanSummary(rawText, maxLen = 220) {
  if (!rawText) return '';
  // Strip HTML
  let text = rawText.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If too long, cut to sentence boundary
  if (text.length > maxLen) {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      let combined = sentences[0];
      if (sentences.length > 1 && (combined.length + sentences[1].length) <= maxLen + 40) {
        combined += ' ' + sentences[1];
      }
      text = combined.trim();
    } else {
      text = text.substring(0, maxLen).trim() + '...';
    }
  }
  return text;
}

/**
 * Extract image URL from feed item
 */
export function extractFeedImage(item) {
  if (!item) return null;

  // 1. Enclosure
  if (item.enclosure && item.enclosure.url && /\.(jpg|jpeg|png|webp|avif)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }
  // 2. Media Content
  if (item.mediaContent && item.mediaContent.length > 0) {
    for (const mc of item.mediaContent) {
      const url = mc?.['$']?.url || mc?.url;
      if (url && typeof url === 'string' && url.startsWith('http')) return url;
    }
  }
  // 3. Media Thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.length > 0) {
    for (const mt of item.mediaThumbnail) {
      const url = mt?.['$']?.url || mt?.url;
      if (url && typeof url === 'string' && url.startsWith('http')) return url;
    }
  }
  // 4. HTML img in content or description
  const content = item.contentEncoded || item.content || item.description || '';
  const imgMatch = content.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
  if (imgMatch && imgMatch[1]) {
    // Avoid tracking pixels (1x1)
    if (!/1x1|feedburner|doubleclick/i.test(imgMatch[1])) {
      return imgMatch[1];
    }
  }

  return null;
}

/**
 * Fetch og:image from article URL with a strict 2-second timeout
 */
export async function fetchOgImage(articleUrl, timeoutMs = 2000) {
  if (!articleUrl || !articleUrl.startsWith('http')) return null;

  try {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('fetchOgImage timeout')), timeoutMs);
      if (timer.unref) timer.unref();
    });

    const fetchPromise = (async () => {
      const res = await fetch(articleUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) return null;
      const html = await res.text();
      const $ = cheerio.load(html);
      const og = $('meta[property="og:image"]').attr('content') ||
                 $('meta[property="og:image:url"]').attr('content') ||
                 $('meta[name="twitter:image"]').attr('content') ||
                 $('meta[name="twitter:image:src"]').attr('content');
      if (og && og.startsWith('http')) {
        return og;
      }
      return null;
    })();

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    if (timer) clearTimeout(timer);
    return result;
  } catch (e) {
    return null;
  }
}

/**
 * Parse an RSS feed safely with strict 5-second hard timeout
 */
export async function safeParseFeed(url, timeoutMs = 5000) {
  try {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Feed timeout: ${url}`)), timeoutMs);
      if (timer.unref) timer.unref();
    });
    const result = await Promise.race([parser.parseURL(url), timeoutPromise]);
    if (timer) clearTimeout(timer);
    return result;
  } catch (e) {
    console.warn(`[WARN] Feed bypassed (${url}): ${e.message}`);
    return { items: [] };
  }
}

/**
 * Format date in Indian Standard Time (IST)
 */
export function getISTDateInfo() {
  const now = new Date();
  // IST offset is UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);

  // Next midnight IST
  const targetMidnight = new Date();
  const istYear = istTime.getUTCFullYear();
  const istMonth = istTime.getUTCMonth();
  const istDate = istTime.getUTCDate();

  // Next midnight IST = next day 00:00 IST = 18:30 UTC of current day
  const nextMidnightUtc = new Date(Date.UTC(istYear, istMonth, istDate + 1, -5, -30, 0));

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };

  const formattedIST = new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST';
  const istDateStr = `${istYear}-${String(istMonth + 1).padStart(2, '0')}-${String(istDate).padStart(2, '0')}`;

  return {
    nowIso: now.toISOString(),
    formattedIST,
    istDateStr,
    nextMidnightUtcIso: nextMidnightUtc.toISOString()
  };
}

/**
 * Get human-readable relative time string
 */
export function getRelativeTime(pubDateStr) {
  if (!pubDateStr) return 'Recent';
  try {
    const pub = new Date(pubDateStr);
    const now = new Date();
    const diffMs = now - pub;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `${days}d ago`;
    }
  } catch (e) {
    return 'Today';
  }
}
