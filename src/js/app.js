/**
 * DAILY BRIEF - CORE APPLICATION LOGIC
 * Coordinates news data rendering, uplifting world progress, athletics & sports,
 * live marquee ticker, 30-minute deep dive mode, share system, and community reader circle.
 */

import { MindGym } from './games.js';
import { DhyanSession } from './dhyan.js';

class DailyBriefApp {
  constructor() {
    this.data = null;
    this.targetMidnight = null;
    this.readingModeActive = false;
    this.currentSportsFilter = 'all';
    this.currentUser = null;
    this.init();
  }

  async init() {
    this.initTheme();
    this.initAuthModal();
    this.initShareFeature();
    await this.loadData();
    this.initCountdown();
    this.initScrollSpy();
    this.initReadingMode();
    this.initRegionTabs();
    this.initSportsTabs();
  }

  /* -------------------------------------------------------------
     THEME MANAGEMENT (DARK / LIGHT)
     ------------------------------------------------------------- */
  initTheme() {
    const saved = localStorage.getItem('dailyBrief_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.setTheme(theme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dailyBrief_theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  /* -------------------------------------------------------------
     FETCH TODAY.JSON
     ------------------------------------------------------------- */
  async loadData() {
    try {
      const res = await fetch('./data/today.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.data = await res.json();
      this.render();
    } catch (e) {
      console.error('Failed to fetch data/today.json:', e);
      const badge = document.getElementById('last-updated-badge');
      if (badge) badge.innerHTML = `⚠️ Offline preview`;
    }
  }

  /* -------------------------------------------------------------
     RENDER ALL SECTIONS
     ------------------------------------------------------------- */
  render() {
    if (!this.data) return;

    // Header Meta
    const meta = this.data.meta || {};
    const lastUp = document.getElementById('last-updated-badge');
    if (lastUp && meta.lastUpdatedIST) {
      lastUp.innerHTML = `<span class="live-pulse"></span> Last updated: ${meta.lastUpdatedIST}`;
    }

    if (meta.targetMidnightIST) {
      this.targetMidnight = new Date(meta.targetMidnightIST).getTime();
    }

    // 0. Breaking News Wire Ticker
    this.renderTicker();

    // 1. World Pulse
    this.renderWorldPulse();

    // 2. Uplifting World Progress & Good News
    this.renderGoodNews();

    // 3. Sports & Athletics
    this.renderSports();

    // 4. Tech & Science
    this.renderTechScience();

    // 5. Social Trends
    this.renderSocialTrends();

    // 6. Disasters
    this.renderDisasters();

    // 7. Nature & Animal Facts
    this.renderDailyFacts();

    // 8. Mind Gym
    new MindGym(this.data.mindGym || {});

    // 9. Dhyan
    this.renderDhyan();
    new DhyanSession();
  }

  /* -------------------------------------------------------------
     BREAKING NEWS LIVE WIRE TICKER
     ------------------------------------------------------------- */
  renderTicker() {
    const track = document.getElementById('breaking-ticker-track');
    if (!track) return;

    const headlines = [];
    const wp = this.data.worldPulse || {};
    Object.values(wp.regions || {}).forEach(arr => {
      (arr || []).forEach(it => {
        if (it.title) headlines.push(`🌍 ${it.source}: ${it.title}`);
      });
    });

    const gn = this.data.goodNews || {};
    (gn.items || []).forEach(it => {
      if (it.title) headlines.push(`🌟 GOOD NEWS: ${it.title}`);
    });

    const sp = this.data.sports || {};
    (sp.latestScores || []).forEach(sc => {
      headlines.push(`🏃 SCORES: ${sc.match} — ${sc.result}`);
    });

    if (headlines.length > 0) {
      track.innerHTML = headlines.map(h => `<span class="ticker-item">${h}</span>`).join('');
    }
  }

  /* -------------------------------------------------------------
     COUNTDOWN TO 12:00 AM IST
     ------------------------------------------------------------- */
  initCountdown() {
    const timerEl = document.getElementById('countdown-timer');
    if (!timerEl) return;

    const updateTimer = () => {
      const now = Date.now();
      let target = this.targetMidnight;

      if (!target || target <= now) {
        const istOffset = 5.5 * 3600 * 1000;
        const istNow = new Date(now + istOffset);
        const nextIstDate = new Date(Date.UTC(
          istNow.getUTCFullYear(),
          istNow.getUTCMonth(),
          istNow.getUTCDate() + 1,
          -5, -30, 0
        ));
        target = nextIstDate.getTime();
      }

      const diff = Math.max(0, target - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* -------------------------------------------------------------
     SECTION 1: WORLD PULSE
     ------------------------------------------------------------- */
  renderWorldPulse() {
    const wp = this.data.worldPulse || {};
    const regions = wp.regions || {};
    const grid = document.getElementById('world-pulse-grid');
    if (!grid) return;

    // Ongoing Tracker Card
    const tracker = wp.ongoingTracker || [];
    const trackerHTML = `
      <div class="bento-card col-4 ongoing-tracker-card">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <h4 style="font-family:var(--font-display); font-size:1.05rem; font-weight:700;">Ongoing Matters Tracker</h4>
          <span style="font-size:0.7rem; font-weight:700; color:var(--wp-accent);">GLOBAL SHIFTS</span>
        </div>
        <p style="font-size:0.8rem; color:var(--text-secondary);">What shifted over the last 24 hours in key geopolitical negotiations:</p>
        <div style="display:flex; flex-direction:column; gap:0.35rem; margin-top:0.25rem;">
          ${tracker.map(item => `
            <div class="ongoing-item">
              <div class="ongoing-topic-header">
                <span class="ongoing-topic-title">${item.topic}</span>
                <span class="ongoing-status-chip">${item.status}</span>
              </div>
              <div class="ongoing-change">${item.whatChanged}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    let allStories = [];
    Object.entries(regions).forEach(([regName, items]) => {
      (items || []).forEach(it => {
        allStories.push({ ...it, regionKey: regName });
      });
    });

    this.allWorldStories = allStories;
    this.ongoingTrackerHTML = trackerHTML;
    this.renderWorldStoriesFiltered('all');
  }

  renderWorldStoriesFiltered(filterRegion) {
    const grid = document.getElementById('world-pulse-grid');
    if (!grid) return;

    const filtered = (filterRegion === 'all')
      ? this.allWorldStories
      : this.allWorldStories.filter(s => s.regionKey === filterRegion);

    let cardsHTML = '';
    filtered.slice(0, 8).forEach((item, idx) => {
      const colSpan = (idx === 0) ? 'col-8' : 'col-4';
      cardsHTML += this.createNewsCard(item, colSpan, 'var(--wp-accent)');
    });

    grid.innerHTML = (filterRegion === 'all')
      ? (cardsHTML.slice(0, cardsHTML.indexOf('</div>', 400) + 6) + this.ongoingTrackerHTML + cardsHTML.slice(cardsHTML.indexOf('</div>', 400) + 6))
      : (cardsHTML + this.ongoingTrackerHTML);
  }

  initRegionTabs() {
    const tabs = document.querySelectorAll('.region-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const reg = btn.dataset.region;
        this.renderWorldStoriesFiltered(reg);
      });
    });
  }

  /* -------------------------------------------------------------
     SECTION 2: UPLIFTING WORLD PROGRESS & GOOD NEWS
     ------------------------------------------------------------- */
  renderGoodNews() {
    const gn = this.data.goodNews || {};
    const items = gn.items || [];
    const grid = document.getElementById('good-news-grid');
    if (!grid) return;

    let html = '';
    items.forEach((it, idx) => {
      const col = (idx === 0) ? 'col-8' : (idx === 1 ? 'col-4' : 'col-4');
      html += this.createNewsCard(it, col, 'var(--gn-accent)', 'good-news-card');
    });
    grid.innerHTML = html;
  }

  /* -------------------------------------------------------------
     SECTION 3: SPORTS & ATHLETICS (WITH RUNNING & TRACK)
     ------------------------------------------------------------- */
  renderSports() {
    const sp = this.data.sports || {};
    const grid = document.getElementById('sports-grid');
    if (!grid) return;

    const spot = sp.achievementOfTheDay || {};
    const spotlightHTML = `
      <div class="bento-card col-8 achievement-spotlight">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.4rem;">🏆</span>
          <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--sp-accent); letter-spacing:0.08em;">Athletics & Peak Feat of the Day</span>
        </div>
        <h3 style="font-family:var(--font-display); font-size:1.5rem; font-weight:700; margin:0.35rem 0;">${spot.title}</h3>
        <p style="font-size:0.95rem; color:var(--text-primary); line-height:1.5;">${spot.achievement}</p>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.25rem;">${spot.detail}</p>
        <div class="card-footer-row">
          <span class="card-source-chip">${spot.source}</span>
          <a href="${spot.url}" target="_blank" rel="noopener noreferrer" class="read-link" style="color:var(--sp-accent);">Full Athletics Report →</a>
        </div>
      </div>
    `;

    // Live Scores Ticker
    const scores = sp.latestScores || [];
    const tickerHTML = `
      <div class="bento-card col-4 scores-ticker-card">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <h4 style="font-family:var(--font-display); font-size:1.05rem; font-weight:700;">Live Scores & Trials</h4>
          <span class="live-pulse"></span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.25rem;">
          ${scores.map(s => `
            <div class="score-row">
              <span class="score-match">${s.match}</span>
              <span class="score-result">${s.result}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const cats = sp.categories || {};
    this.sportsItems = {
      all: [
        ...(cats.athletics || []),
        ...(cats.cricket || []),
        ...(cats.football || []),
        ...(cats.tennis || []),
        ...(cats.general || [])
      ],
      athletics: cats.athletics || [],
      cricket: cats.cricket || [],
      football: cats.football || [],
      tennis: cats.tennis || []
    };

    this.sportsHeaderHTML = spotlightHTML + tickerHTML;
    this.renderSportsFiltered('all');
  }

  renderSportsFiltered(sportKey) {
    const grid = document.getElementById('sports-grid');
    if (!grid) return;

    const list = this.sportsItems[sportKey] || this.sportsItems.all;
    let itemsHTML = '';
    list.slice(0, 6).forEach(it => {
      itemsHTML += this.createNewsCard(it, 'col-4', 'var(--sp-accent)');
    });

    grid.innerHTML = (sportKey === 'all')
      ? (this.sportsHeaderHTML + itemsHTML)
      : itemsHTML;
  }

  initSportsTabs() {
    const tabs = document.querySelectorAll('.sports-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const sport = btn.dataset.sport;
        this.renderSportsFiltered(sport);
      });
    });
  }

  /* -------------------------------------------------------------
     SECTION 4: TECH & SCIENCE
     ------------------------------------------------------------- */
  renderTechScience() {
    const ts = this.data.techScience || {};
    const grid = document.getElementById('tech-science-grid');
    if (!grid) return;

    const items = ts.items || [];
    let html = '';
    items.forEach((it, idx) => {
      const col = (idx === 0) ? 'col-6' : (idx === 1 ? 'col-6' : 'col-4');
      html += this.createNewsCard(it, col, 'var(--tc-accent)');
    });
    grid.innerHTML = html;
  }

  /* -------------------------------------------------------------
     SECTION 5: INSTAGRAM & SOCIAL TRENDS
     ------------------------------------------------------------- */
  renderSocialTrends() {
    const st = this.data.socialTrends || {};
    const grid = document.getElementById('social-trends-grid');
    if (!grid) return;

    const items = st.items || [];
    let html = '';
    items.forEach((it, idx) => {
      const col = (idx === 0) ? 'col-6' : (idx === 1 ? 'col-6' : 'col-4');
      html += this.createNewsCard(it, col, 'var(--sc-accent)');
    });
    grid.innerHTML = html;
  }

  /* -------------------------------------------------------------
     SECTION 6: DISASTERS & EMERGENCIES
     ------------------------------------------------------------- */
  renderDisasters() {
    const ds = this.data.disasters || {};
    const grid = document.getElementById('disasters-grid');
    if (!grid) return;

    const quakes = ds.earthquakes || [];
    const emergencies = ds.emergencies || [];

    const quakesHTML = `
      <div class="bento-card col-7">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <h4 style="font-family:var(--font-display); font-size:1.15rem; font-weight:700;">USGS Live Seismic Feed (M5.0+ / 24h)</h4>
          <span style="font-size:0.75rem; color:var(--text-muted);">Real-time GeoJSON</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-secondary);">Direct scientific monitoring from USGS stations globally. Factual, un-hyped telemetry:</p>
        
        <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:0.25rem;">
          ${quakes.length === 0 ? `<p style="font-size:0.85rem; color:var(--text-muted);">No magnitude 5.0+ earthquakes recorded globally in the past 24 hours.</p>` : ''}
          ${quakes.map(q => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:0.6rem 0.8rem; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <span class="earthquake-badge ${parseFloat(q.mag)>=6.0 ? 'mag-strong':'mag-moderate'}">${q.mag}</span>
                <div>
                  <div style="font-weight:600; font-size:0.9rem;">${q.place}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${q.time} • Depth: ${q.depthKm} km</div>
                </div>
              </div>
              <div style="display:flex; gap:0.4rem;">
                <a href="${q.mapUrl}" target="_blank" rel="noopener noreferrer" class="read-link" style="color:var(--ds-accent); font-size:0.75rem;">🗺️ Map</a>
                <a href="${q.usgsUrl}" target="_blank" rel="noopener noreferrer" class="read-link" style="color:var(--text-muted); font-size:0.75rem;">USGS</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const emerHTML = `
      <div class="bento-card col-5">
        <h4 style="font-family:var(--font-display); font-size:1.15rem; font-weight:700;">Global Weather & Climate Advisories</h4>
        <p style="font-size:0.85rem; color:var(--text-secondary);">Factual disaster response alerts and storm pathways:</p>
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.25rem;">
          ${emergencies.map(em => `
            <div style="padding:0.75rem; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
              <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--ds-accent);">${em.region} • ${em.status}</span>
              <div style="font-weight:700; font-size:0.95rem; margin:0.2rem 0;">${em.title}</div>
              <p style="font-size:0.82rem; color:var(--text-secondary);">${em.summary}</p>
              <div class="card-footer-row" style="margin-top:0.4rem; padding-top:0.3rem;">
                <span style="font-size:0.75rem; color:var(--text-muted);">${em.source}</span>
                <a href="${em.url}" target="_blank" rel="noopener noreferrer" class="read-link" style="color:var(--ds-accent); font-size:0.75rem;">Advisory Bulletin →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    grid.innerHTML = quakesHTML + emerHTML;
  }

  /* -------------------------------------------------------------
     SECTION 7: NATURE & ANIMAL INTELLIGENCE FACTS
     ------------------------------------------------------------- */
  renderDailyFacts() {
    const facts = this.data.dailyFacts || [];
    const container = document.getElementById('daily-facts-grid');
    if (!container) return;

    let html = '';
    facts.forEach(f => {
      html += `
        <div class="bento-card col-4 fact-card" style="border-color:rgba(132, 204, 22, 0.3);">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span class="fact-emoji">${f.emoji || '🦁'}</span>
            <span style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--fc-accent); letter-spacing:0.06em;">${f.category}</span>
          </div>
          <h4 class="fact-title" style="margin:0.5rem 0 0.35rem; font-size:1.1rem;">${f.title}</h4>
          <p class="fact-body" style="font-size:0.88rem; line-height:1.55;">${f.fact}</p>
          <div class="card-footer-row" style="margin-top:auto; padding-top:0.75rem;">
            <span style="font-size:0.74rem; color:var(--text-muted);">${f.source}</span>
            <a href="${f.sourceUrl}" target="_blank" rel="noopener noreferrer" class="read-link" style="color:var(--fc-accent);">Learn Science →</a>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  /* -------------------------------------------------------------
     SECTION 9: DHYAN (HINDU MEDITATION & WISDOM)
     ------------------------------------------------------------- */
  renderDhyan() {
    const dh = this.data.dhyan || {};
    const panchang = dh.panchang || {};
    const verse = dh.verseOfTheDay || {};
    const thought = dh.thoughtOfTheDay || {};
    const mantra = dh.dailyMantra || {};

    const pEl = document.getElementById('panchang-badge');
    if (pEl) {
      pEl.textContent = `📅 ${panchang.tithi || 'Shukla Paksha'} • Nakshatra: ${panchang.nakshatra || 'Ashwini'} • ${panchang.vikramSamvat || 'Vikram Samvat'}`;
    }

    const vEl = document.getElementById('gita-verse-content');
    if (vEl) {
      vEl.innerHTML = `
        <div class="sanskrit-verse">${verse.sanskrit || ''}</div>
        <div class="verse-transliteration">${verse.transliteration || ''}</div>
        <div class="verse-english">“${verse.english || ''}”</div>
        <div style="margin-top:1rem; font-size:0.8rem; color:var(--dh-gold); font-weight:700;">
          Bhagavad Gita — Chapter ${verse.chapter}, Verse ${verse.verse} (${verse.theme || 'Wisdom'})
        </div>
      `;
    }

    const tEl = document.getElementById('thought-of-the-day-content');
    if (tEl) {
      tEl.innerHTML = `
        <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--dh-gold);">${thought.source}</div>
        <h4 style="font-family:var(--font-display); font-size:1.15rem; font-weight:700; margin:0.35rem 0;">${thought.title}</h4>
        <p style="font-style:italic; font-size:0.95rem; color:#fef08a; margin-bottom:0.5rem;">“${thought.quote}”</p>
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">${thought.reflection}</p>
      `;
    }

    const mEl = document.getElementById('daily-mantra-content');
    if (mEl) {
      mEl.innerHTML = `
        <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--dh-gold);">${mantra.name}</div>
        <div style="font-family:var(--font-sanskrit); font-size:1.2rem; color:#fef08a; margin:0.4rem 0;">${mantra.sanskrit}</div>
        <div style="font-style:italic; font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.4rem;">${mantra.transliteration}</div>
        <p style="font-size:0.85rem; color:var(--text-primary); line-height:1.5;">${mantra.meaning}</p>
        <div style="margin-top:0.5rem; font-size:0.75rem; color:var(--dh-gold);">✨ ${mantra.benefit}</div>
      `;
    }
  }

  /* -------------------------------------------------------------
     REUSABLE NEWS CARD GENERATOR (WITH REAL IMAGES & FALLBACKS)
     ------------------------------------------------------------- */
  createNewsCard(item, colSpan = 'col-4', accentColor = 'var(--wp-accent)', extraClass = '') {
    const hasImage = Boolean(item.imageUrl);
    const mediaHTML = hasImage ? `
      <div class="card-media-wrapper">
        <img src="${item.imageUrl}" alt="${item.title}" class="card-img" loading="lazy" onerror="this.parentElement.style.display='none';" />
        <span class="img-credit-tag">Image: ${item.source}</span>
      </div>
    ` : '';

    return `
      <article class="bento-card ${colSpan} ${extraClass}">
        ${mediaHTML}
        <div class="card-meta-row">
          <span class="card-source-chip">${item.source}</span>
          <span>${item.time}</span>
        </div>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="card-headline">${item.title}</a>
        <p class="card-summary">${item.summary}</p>
        <div class="card-footer-row">
          <span style="font-size:0.72rem; text-transform:uppercase; font-weight:700; color:${accentColor};">${item.category || ''}</span>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="read-link" style="color:${accentColor};">Read full story →</a>
        </div>
      </article>
    `;
  }

  /* -------------------------------------------------------------
     SCROLL SPY & STICKY NAV PILLS
     ------------------------------------------------------------- */
  initScrollSpy() {
    const pills = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('.section-wrapper');

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 140;

      sections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) {
          currentSectionId = sec.id;
        }
      });

      pills.forEach(pill => {
        pill.classList.toggle('active', pill.dataset.target === currentSectionId);
      });
    }, { passive: true });
  }

  /* -------------------------------------------------------------
     30-MINUTE DEEP DIVE READING MODE PROGRESS
     ------------------------------------------------------------- */
  initReadingMode() {
    const btn = document.getElementById('reading-mode-toggle');
    const progressBar = document.getElementById('reading-progress-bar');
    const timeRemainingEl = document.getElementById('reading-time-remaining');

    if (btn) {
      btn.addEventListener('click', () => {
        this.readingModeActive = !this.readingModeActive;
        btn.classList.toggle('active', this.readingModeActive);
        btn.innerHTML = this.readingModeActive ? `⏱️ 30-Min: Active` : `⏱️ 30-Min Deep Dive`;
        this.showToast(this.readingModeActive ? '30-Minute Deep Dive Reading Mode engaged!' : 'Reading mode deactivated');
      });
    }

    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const pct = Math.min(100, Math.max(0, (scrolled / docHeight) * 100));

      if (progressBar) {
        progressBar.style.width = `${pct}%`;
      }

      if (timeRemainingEl && this.readingModeActive) {
        const remainingMinutes = Math.max(1, Math.ceil((1 - (pct / 100)) * 30));
        timeRemainingEl.textContent = `⏱️ ~${remainingMinutes} min read left`;
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------------
     SHARE SYSTEM (WEB SHARE API + MODAL FALLBACK)
     ------------------------------------------------------------- */
  initShareFeature() {
    const shareBtn = document.getElementById('share-brief-btn');
    const footerShare = document.getElementById('footer-share-trigger');
    const modal = document.getElementById('share-modal');
    const closeBtn = document.getElementById('share-modal-close');
    const copyBtn = document.getElementById('share-copy-btn');
    const inputCopy = document.getElementById('share-input-copy');

    const triggerShare = async () => {
      const shareData = {
        title: 'Daily Brief — 30-Minute Morning Intelligence',
        text: 'Zero doomscrolling. Stay updated with world news, athletics, good news, wild nature facts, mind gym, and meditation by Krish Parikh:',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          this.showToast('Thanks for sharing Daily Brief!');
          return;
        } catch (err) {
          // Fallback to modal if cancelled or unsupported
        }
      }

      if (modal) modal.style.display = 'flex';
    };

    if (shareBtn) shareBtn.addEventListener('click', triggerShare);
    if (footerShare) footerShare.addEventListener('click', triggerShare);
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.style.display = 'none');

    // Click outside to close
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.showToast('📋 Live URL copied to clipboard!');
      } catch (e) {
        this.showToast('Copied: ' + window.location.href);
      }
    };

    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
    if (inputCopy) inputCopy.addEventListener('click', copyToClipboard);
  }

  /* -------------------------------------------------------------
     READER CIRCLE & AUTH / ADD PEOPLE MODAL
     ------------------------------------------------------------- */
  initAuthModal() {
    const btn = document.getElementById('auth-modal-btn');
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('auth-modal-close');
    const tabs = document.querySelectorAll('.modal-tab');
    const tabContents = document.querySelectorAll('.modal-tab-content');
    const loginKrishBtn = document.getElementById('login-as-krish-btn');
    const addMemberForm = document.getElementById('add-member-form');
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');

    if (btn && modal) {
      btn.addEventListener('click', () => modal.style.display = 'flex');
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    // Modal Tabs
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(tb => tb.classList.remove('active'));
        t.classList.add('active');
        const target = t.dataset.tab;
        tabContents.forEach(tc => {
          tc.style.display = (tc.id === `tab-${target}`) ? 'block' : 'none';
        });
      });
    });

    // Load initial members from localStorage
    const savedMembers = localStorage.getItem('dailyBrief_members');
    this.members = savedMembers ? JSON.parse(savedMembers) : [
      { name: "Krish Parikh", email: "krishparikh25@users.noreply.github.com", college: "PDPU ICT Gandhinagar (Admin)" },
      { name: "Aryan Sharma", email: "aryan.s@pdpu.ac.in", college: "PDPU ICT 2026" },
      { name: "Diya Patel", email: "diya.p@pdpu.ac.in", college: "PDPU ICT 2026" }
    ];
    this.renderMembersList();

    // Check signed in user
    const savedUser = localStorage.getItem('dailyBrief_user');
    if (savedUser) {
      this.setUser(JSON.parse(savedUser));
    }

    // 1-Click Login as Krish Parikh
    if (loginKrishBtn) {
      loginKrishBtn.addEventListener('click', () => {
        this.setUser({
          name: "Krish Parikh",
          email: "krishparikh25@users.noreply.github.com",
          badge: "KP • PDPU ICT"
        });
        if (modal) modal.style.display = 'none';
        this.showToast('👋 Welcome back, Krish Parikh (PDPU ICT)!');
      });
    }

    // Sign in form
    if (signinForm) {
      signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const name = email.split('@')[0];
        this.setUser({ name, email, badge: "Reader" });
        if (modal) modal.style.display = 'none';
        this.showToast(`Signed in as ${name}!`);
      });
    }

    // Sign up form
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const college = document.getElementById('signup-college').value;
        this.setUser({ name, email, badge: college || "PDPU ICT" });
        this.addMemberToList(name, email, college);
        if (modal) modal.style.display = 'none';
        this.showToast(`Welcome to Daily Brief, ${name}!`);
      });
    }

    // Add Member form
    if (addMemberForm) {
      addMemberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('member-name').value;
        const email = document.getElementById('member-email').value;
        const college = document.getElementById('member-college').value;
        this.addMemberToList(name, email, college);
        addMemberForm.reset();
        this.showToast(`🎉 Added ${name} to Daily Brief Reader Circle!`);
      });
    }
  }

  setUser(userObj) {
    this.currentUser = userObj;
    localStorage.setItem('dailyBrief_user', JSON.stringify(userObj));
    const label = document.getElementById('auth-user-label');
    const avatar = document.getElementById('auth-user-avatar');
    if (label) label.textContent = userObj.name.split(' ')[0];
    if (avatar) avatar.textContent = userObj.name.substring(0, 1).toUpperCase();
  }

  addMemberToList(name, email, college) {
    this.members.push({ name, email, college: college || "PDPU ICT" });
    localStorage.setItem('dailyBrief_members', JSON.stringify(this.members));
    this.renderMembersList();
  }

  renderMembersList() {
    const container = document.getElementById('members-list');
    if (!container) return;
    container.innerHTML = this.members.map((m, idx) => `
      <div class="member-chip">
        <div>
          <strong>${m.name}</strong> • <span style="color:var(--text-muted); font-size:0.75rem;">${m.college}</span>
        </div>
        <span style="font-size:0.75rem; color:#10b981;">Active Reader ✓</span>
      </div>
    `).join('');
  }

  /* -------------------------------------------------------------
     TOAST NOTIFICATIONS
     ------------------------------------------------------------- */
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DailyBriefApp();
});
