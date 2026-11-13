import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser({
  timeout: 8000,
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
  // 1. Enclosure
  if (item.enclosure && item.enclosure.url && /\.(jpg|jpeg|png|webp|avif)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }
  // 2. Media Content
  if (item.mediaContent && item.mediaContent.length > 0) {
    for (const mc of item.mediaContent) {
      const url = mc?.['$']?.url || mc?.url;
      if (url && typeof url === 'string') return url;
    }
  }
  // 3. Media Thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.length > 0) {
    for (const mt of item.mediaThumbnail) {
      const url = mt?.['$']?.url || mt?.url;
      if (url && typeof url === 'string') return url;
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
 * Fetch og:image from article URL with a fast timeout (3.5s)
 */
export async function fetchOgImage(articleUrl) {
  if (!articleUrl || !articleUrl.startsWith('http')) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timer);
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
  } catch (e) {
    // Timeout or network error - gracefully return null
  } finally {
    clearTimeout(timer);
  }
  return null;
}

/**
 * Parse an RSS feed safely
 */
export async function safeParseFeed(url) {
  try {
    return await parser.parseURL(url);
  } catch (e) {
    console.warn(`[WARN] Failed to parse feed ${url}: ${e.message}`);
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
  // In UTC terms: next 18:30 UTC
  const targetMidnight = new Date();
  // Find upcoming midnight in IST
  const istYear = istTime.getUTCFullYear();
  const istMonth = istTime.getUTCMonth();
  const istDate = istTime.getUTCDate();
  
  // Midnight IST tomorrow in UTC is: tomorrow 00:00:00 IST = today 18:30:00 UTC
  const nextMidnightIST = new Date(Date.UTC(istYear, istMonth, istDate + 1, -5, -30, 0));
  // If nextMidnightIST is in the past, add another day
  while (nextMidnightIST.getTime() <= now.getTime()) {
    nextMidnightIST.setTime(nextMidnightIST.getTime() + 24 * 3600 * 1000);
  }

  const dateStr = istTime.toISOString().split('T')[0];
  
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };
  const formattedIST = new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST';

  return {
    nowIso: now.toISOString(),
    istDateStr: dateStr,
    formattedIST,
    nextMidnightUtcIso: nextMidnightIST.toISOString()
  };
}

/**
 * Relative time helper (e.g. "2h ago")
 */
export function getRelativeTime(pubDate) {
  if (!pubDate) return 'Today';
  const now = Date.now();
  const itemTime = new Date(pubDate).getTime();
  if (isNaN(itemTime)) return 'Today';
  const diffHours = Math.round((now - itemTime) / (1000 * 60 * 60));
  if (diffHours <= 0) return 'Just now';
  if (diffHours === 1) return '1h ago';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
