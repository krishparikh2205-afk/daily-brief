# 🌅 Daily Brief — The 10-Minute Morning Lens

> **Distraction-Free, High-Signal Morning Intelligence for College Students & Engineers**  
> *Designed to eliminate phone scrolling by packing world geopolitics, athletics, frontier science, social trends, live seismic alerts, daily facts, cognitive engineering games, and mindful meditation into a single 10-to-15 minute daily experience.*

🌐 **Live Website**: [https://krishparikh2205-afk.github.io/daily-brief/](https://krishparikh2205-afk.github.io/daily-brief/)  
📦 **GitHub Repository**: [https://github.com/krishparikh2205-afk/daily-brief](https://github.com/krishparikh2205-afk/daily-brief)

---

## 🧭 Why Daily Brief Exists

Modern social media feeds are engineered for infinite scroll, doom loops, and algorithmic agitation. **Daily Brief is the exact opposite**:
1. **Definite End**: It has a dedicated **10-Minute Reading Mode** with a scroll progress bar, estimated time remaining, and an **"All Caught Up"** completion banner. When you hit the bottom, your briefing is done—close your laptop and build your day.
2. **Autonomous Midnight IST Refresh**: The site updates automatically every single day at **12:00 AM IST (18:30 UTC)** with zero manual intervention via GitHub Actions.
3. **Zero Tracking & Zero Ads**: No trackers, no cookies, no third-party telemetry. All game progress and theme preferences stay private in your browser's `localStorage`.
4. **Real Article Imagery**: Displays authentic news photos extracted from publisher feeds (`og:image`, `media:content`, enclosures) with direct credit lines and graceful CSS gradient fallbacks.

---

## 🍱 Content Sections (in order)

1. **🌍 World Pulse — Politics & Geopolitics**:
   - Curated reporting across 8 regions: **India, USA, UK, Europe, Middle East, Russia-Ukraine, China & Asia-Pacific, Africa, and Latin America**.
   - Regional tab filters, 2-line summaries, relative timestamps, and original article links.
   - **Ongoing Matters Tracker**: Monitors active shifts in long-term geopolitical conflicts, trade talks, and summits with a clear *"What changed since yesterday"* card.
2. **🏆 Sports & Achievements**:
   - Football, cricket, tennis, world athletics, record-breaking milestones.
   - **Achievement of the Day** highlight card and live tournament/series score board.
3. **⚡ Tech & Science**:
   - Artificial intelligence models, space exploration missions, semiconductor hardware breakthroughs, quantum computing, and cybersecurity.
4. **📱 Instagram & Social Trends**:
   - Platform updates, creator economy shifts, and viral moments sourced ethically from leading tech and digital culture news feeds—**without needing to open social media apps**.
5. **🌋 Disasters & Emergencies**:
   - **Live USGS Earthquake Telemetry**: Automatically queries the USGS GeoJSON feed for **Magnitude 5.0+** seismic events worldwide from the past 24 hours, displaying magnitude badges, depth, time in IST, and direct Google Maps coordinate links.
   - Calm, factual weather and disaster advisories from meteorological bodies.
6. **💡 5 Daily Facts (Guaranteed Unique & Deduplicated)**:
   - Exactly 5 new facts per day across Science, History, Space, Human Body, and Geography.
   - Sourced from Wikipedia REST APIs (*"On this day"*) and curated evergreen databases, deduplicated against `data/seen-facts.json` so no fact ever repeats.
7. **🧠 Mind Gym — Daily Cognitive Training Hub**:
   - **Adult engineering-grade mental workout** deterministically generated from a date-based seed (`YYYYMMDD` IST):
     - **🧩 Logic Grid**: "Who owns what" deduction matrix with clues and clickable cell states (Blank → ❌ → ✔️).
     - **🔢 Sudoku (Medium & Hard)**: 9x9 board with pencil notes, conflict detection, and hint system.
     - **🎯 Number Cipher / Math Target**: Countdown/KenKen arithmetic target challenge.
     - **⚡ Mental Math Sprint**: 60-second rapid-fire math scaling with accuracy (percentages, squares, fractions, multiplication).
     - **🧠 N-Back Memory Trainer**: Neuro-cognitive working memory test with adjustable depth ($N=1$ to $4$).
     - **🧬 Pattern Master**: Algorithmic sequence rule-discovery engine.
     - **🔨 Word Forge (ICT Vocabulary)**: Anagram and word ladder solver with dedicated **Engineering / ICT Mode** (DSP, Nyquist, Mutex, Sharding, Semaphore, Bandwidth).
   - Streak tracking, daily brain score, and personal best stored in `localStorage`.
8. **🕉️ Dhyan — 5-Minute Daily Hindu Meditation**:
   - **Bhagavad Gita Verse of the Day**: Rotates through verses by calendar date with authentic Sanskrit Devanagari script, IAST transliteration, word meaning, and English translation.
   - **Thought of the Day**: Practical reflections drawn from Upanishads, Patanjali Yoga Sutras, and Vedanta.
   - **Daily Mantra**: Sacred chants (Gayatri, Mahamrityunjaya, Shanti Patha) with pronunciation and meaning.
   - **5-Minute Pranayama Sanctuary**: Fullscreen zen mode, 4-4-6 rhythmic breathing guide (Inhale 4s, Hold 4s, Exhale 6s), and soothing **Web Audio API synthesized Om drone (136.1 Hz)** and singing bowl chime (toggleable, zero network latency).
   - **Hindu Calendar Panchang**: Today's Tithi, Paksha, Nakshatra, and Vikram Samvat.

---

## ⚙️ Architecture & Autonomous Automation

```
GitHub Actions Cron (18:30 UTC = 00:00 IST)
                │
                ▼
       scripts/fetch-all.mjs
   ┌────────────┴────────────┐
   ▼                         ▼
Live RSS / USGS / APIs   Fallback Cache (stale flag)
   └────────────┬────────────┘
                ▼
         data/today.json
   + data/archive/YYYY-MM-DD.json
                │
                ▼
   Automated Git Commit & Push
                │
                ▼
 GitHub Pages Deployment (Static HTML/CSS/JS)
```

- **Cron Schedule**: `.github/workflows/update-and-deploy.yml` triggers on `cron: '30 18 * * *'` (18:30 UTC = 12:00 AM IST Midnight).
- **Keepalive Heartbeat**: Commits a timestamp to `data/keepalive.txt` on every run, preventing GitHub from sleeping the 60-day cron schedule on inactive repositories.
- **Fail-Safe Stale Cache**: If any upstream RSS source goes down or times out, the ingestion script retains the previous day's cached data for that section and sets `isStale: true` rather than crashing the build.

---

## 🛠️ User Guide: How to Customize

### 1. How to Add or Change News Sources
Open `scripts/fetch-all.mjs`. Each section specifies its RSS endpoints in clean arrays:
```javascript
// Example: Adding an India source in scripts/fetch-all.mjs
const feeds = {
  india: ['https://www.thehindu.com/news/national/feeder/default.rss', 'The Hindu'],
  // Add your new source:
  // newSource: ['https://example.com/rss.xml', 'Publisher Name']
};
```

### 2. How to Edit Categories or Sports Teams
- To modify sports categories, edit the `fetchSports` function in `scripts/fetch-all.mjs`.
- Keyword filters can be updated under `text.includes('cricket')`, `text.includes('football')`, etc.

### 3. How to Change the Daily Update Time
Edit `.github/workflows/update-and-deploy.yml`:
```yaml
on:
  schedule:
    # Format: minute hour day month day-of-week (UTC)
    # 18:30 UTC = 12:00 AM IST
    # If you want 6:00 AM IST (00:30 UTC), change to:
    - cron: '30 0 * * *'
```

### 4. How to Force an Instant Manual Refresh
1. Go to your GitHub repository: [krishparikh2205-afk/daily-brief](https://github.com/krishparikh2205-afk/daily-brief).
2. Click the **Actions** tab at the top.
3. Select **"Daily Brief - Fetch & Deploy to Pages"** on the left sidebar.
4. Click the **"Run workflow"** dropdown button on the right, select branch `main`, and click **"Run workflow"**.
5. Within ~90 seconds, the fresh data will be fetched, committed, and deployed live to GitHub Pages.

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/krishparikh2205-afk/daily-brief.git
cd daily-brief

# 2. Install dependencies
npm install

# 3. Run the daily data ingestion pipeline locally
node scripts/fetch-all.mjs

# 4. Start the local development server
npm run serve
# Visit http://localhost:3000 in your browser
```

---

## 📜 License & Attribution
- Content aggregated under fair-use excerpts strictly for personal morning briefing with full attribution and links to original publishers.
- Bhagavad Gita verses and Upanishadic wisdom derived from public domain and open scholarly datasets.
- Crafted for focus, tranquility, and lifelong learning.
