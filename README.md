# 🌅 Daily Brief — The 30-Minute Morning Deep Dive

> **Comprehensive, Distraction-Free Morning Intelligence for College Students & Engineers**  
> *Curated to replace social media phone scrolling with an intentional, high-signal 30-minute daily deep dive into global geopolitics, uplifting world progress, athletics and running, frontier science, digital culture trends, live seismic alerts, wild animal intelligence, cognitive engineering training, and peaceful Vedic mindfulness.*

🌐 **Live Website**: [https://krishparikh2205-afk.github.io/daily-brief/](https://krishparikh2205-afk.github.io/daily-brief/)  
📦 **GitHub Repository**: [https://github.com/krishparikh2205-afk/daily-brief](https://github.com/krishparikh2205-afk/daily-brief)  
👤 **Creator & Curator**: **Krish Parikh** • PDPU ICT, Gandhinagar • 📞 **+91 93137 75724**

---

## 🧭 Why Daily Brief Exists

Modern algorithmic feeds are engineered for addiction, outrage, and endless scrolling. **Daily Brief is the antithesis**:
1. **Definite 30-Minute Boundary**: It features an integrated **⏱️ 30-Minute Deep Dive Reading Mode** with dynamic reading time remaining estimation, scroll progress bar, and an empowering **"You're All Caught Up"** completion banner. When you finish, step away and build your day.
2. **Autonomous Midnight IST Refresh**: The portal autonomously updates every day at **12:00 AM IST (18:30 UTC)** with zero manual intervention via GitHub Actions.
3. **Zero Tracking & Privacy Respecting**: No third-party tracking cookies or ad networks. Reader preferences, streaks, and community lists stay in your browser's private `localStorage`.
4. **Real Article Imagery**: Displays genuine photos hotlinked from publisher feeds with image attribution and graceful CSS fallbacks.

---

## 🍱 Sections & Content Architecture

1. **🔴 Live Wire Breaking Ticker**:
   - Streaming horizontal marquee at the top of the publication delivering real-time headline telemetry.
2. **🌍 World Pulse — Politics & Geopolitics**:
   - 8 Global Regions: **India, USA, UK, Europe, Middle East, Russia-Ukraine, China & Asia-Pacific, Africa, Latin America**.
   - **Ongoing Matters Tracker**: Monitors active shifts in long-term geopolitical conflicts, trade talks, and summits with a clear *"What changed since yesterday"* card.
3. **🌟 Uplifting World Progress & Good News (New!)**:
   - Sourced from Good News Network and global progress registries: clean energy capacity milestones, cancer vaccine trials, reforestation recoveries, wildlife sanctuary expansions, and community solidarity.
4. **🏃 Sports & Athletics (Upgraded with Running & Track)**:
   - Dedicated coverage of **Athletics & Running** (sprinting, marathons, track & field, sub-10s splits, Diamond League, footwear kinetics) from Athletics Weekly.
   - Cricket (ESPNcricinfo), Premier League Football, ATP Tennis, live scores ticker, and the **Athletics Feat of the Day**.
5. **⚡ Tech & Science Frontiers**:
   - AI systems, quantum computing, aerospace missions (NASA), semiconductor hardware, and cybersecurity from The Verge, Ars Technica, and Science Daily.
6. **📱 Instagram & Social Trends**:
   - Platform updates, creator economy shifts, and viral moments sourced ethically from leading tech and digital culture news feeds—**without needing to open social media apps**.
7. **🌋 Disasters & Emergencies**:
   - **Live USGS Earthquake Telemetry**: Automatically queries the USGS GeoJSON feed for **Magnitude 5.0+** seismic events worldwide from the past 24 hours, displaying magnitude badges, depth, time in IST, and direct Google Maps coordinate links.
   - Meteorological advisories from the World Meteorological Organization (WMO).
8. **🦁 Wild Nature & Animal Intelligence Facts (New!)**:
   - Mind-bending biological marvels and animal cognitive discoveries:
     - 🐙 *Octopuses*: 3 hearts, blue blood, 9 brains (two-thirds of neurons reside in autonomous arms).
     - 🦅 *Crows*: Lifetime facial recognition and generational grudge transmission.
     - 🦐 *Mantis Shrimp*: Cavitation punch generating temperatures near the surface of the sun.
     - 🪼 *Immortal Jellyfish*: Cellular transdifferentiation rebooting the life cycle indefinitely.
     - 🐘 *Elephants*: Infrasonic ground tremor communication over 10+ kilometers.
9. **🧠 Mind Gym — Daily Cognitive Training Hub**:
   - **Adult engineering-grade mental workout** deterministically generated from a date-based seed (`YYYYMMDD` IST):
     - **🧩 Logic Grid**: Interactive deduction matrix with clues and clickable cells (Blank → ❌ → ✔️).
     - **🔢 Sudoku (Medium & Hard)**: 9x9 board with pencil notes, conflict detection, and hints.
     - **🎯 Number Cipher**: Countdown/KenKen arithmetic target challenge.
     - **⚡ Mental Math Sprint**: 60-second rapid-fire math scaling with accuracy.
     - **🧠 N-Back Memory Trainer**: Neuro-cognitive working memory test ($N=1$ to $4$).
     - **🧬 Pattern Master**: Algorithmic sequence rule-discovery engine.
     - **🔨 Word Forge (ICT Vocabulary)**: Anagram and word ladder solver with dedicated **Engineering / ICT Mode** (DSP, Nyquist, Mutex, Sharding, Semaphore, Bandwidth).
10. **🕉️ Dhyan — 5-Minute Hindu Meditation**:
    - **Bhagavad Gita Verse of the Day**: Chapter & verse in authentic Sanskrit Devanagari script, Roman transliteration, and English translation.
    - **Thought of the Day**: Wisdom drawn from Upanishads, Patanjali Yoga Sutras, and Vedanta.
    - **Daily Mantra**: Sacred chants (Gayatri, Mahamrityunjaya, Shanti Patha) with pronunciation and meaning.
    - **5-Minute Pranayama Sanctuary**: Fullscreen zen mode, 4-4-6 rhythmic breathing guide, and soothing **Web Audio API synthesized Om drone (136.1 Hz)** and singing bowl chime.
    - **Hindu Calendar Panchang**: Today's Tithi, Paksha, Nakshatra, and Vikram Samvat.

---

## 👥 Community Reader Circle & Sharing

- **👤 Reader Circle & Login**: Click "Sign In / Add" in the header to log in (1-click login as Krish Parikh or create your profile) and **add classmates or friends** by Name, Mobile, and Department (PDPU ICT Gandhinagar). Members are saved in your local circle.
- **🔗 Multi-Channel Share**: Click "Share" to open the interactive Share Sheet with 1-click URL copying, WhatsApp, X/Twitter, LinkedIn, and Telegram sharing.

---

## 👨‍💻 Creator & Author Profile

- **Name**: Krish Parikh
- **Qualification**: PDPU ICT, Gandhinagar (Pandit Deendayal Energy University, Information and Communication Technology)
- **Mobile**: [+91 93137 75724](tel:+919313775724)
- **WhatsApp**: [Chat on WhatsApp (+91 93137 75724)](https://wa.me/919313775724?text=Hi%20Krish,%20I'm%20using%20Daily%20Brief!)

---

## ⚙️ Automated Architecture

```
GitHub Actions Cron (18:30 UTC = 00:00 IST Midnight)
                       │
                       ▼
             scripts/fetch-all.mjs
   ┌───────────────────┴───────────────────┐
   ▼                                       ▼
Parallel RSS / USGS / APIs         Graceful Fallback Cache
   └───────────────────┬───────────────────┘
                       ▼
                data/today.json
         + data/archive/YYYY-MM-DD.json
                       │
                       ▼
          Heartbeat Keepalive Commit
                       │
                       ▼
        Deploy to GitHub Pages (Static)
```

- **Cron Schedule**: `.github/workflows/update-and-deploy.yml` triggers on `cron: '30 18 * * *'` (18:30 UTC = 12:00 AM IST Midnight).
- **Keepalive Heartbeat**: Commits a timestamp to `data/keepalive.txt` on every run, preventing GitHub from sleeping the 60-day cron schedule on inactive repositories.
- **Fail-Safe Stale Cache**: If any upstream RSS source goes down or times out, the ingestion script retains the previous day's cached data for that section and sets `isStale: true` rather than crashing the build.

---

## 🛠️ User Customization Guide

### 1. How to Add a New News Source
Open `scripts/fetch-all.mjs`. Each section specifies its RSS endpoints in clean arrays:
```javascript
const feeds = {
  india: ['https://www.thehindu.com/news/national/feeder/default.rss', 'The Hindu'],
  // Add your new source:
  myRegion: ['https://example.com/rss.xml', 'Publisher Name']
};
```

### 2. How to Edit Sports & Athletics Feeds
In `scripts/fetch-all.mjs`, navigate to `fetchSports()`:
- Customize Athletics Weekly feeds or add marathon/sprint RSS endpoints.
- Adjust keyword filters for cricket, football, tennis, or athletics.

### 3. How to Change the Daily Refresh Time
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
4. Click **"Run workflow"** on branch `main`. Fresh data will be fetched, committed, and deployed live to GitHub Pages within 45 seconds.
