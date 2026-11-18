# Daily Brief 🌅

> **The 10-minute morning lens for engineering students and creators.**  
> Curated high-signal world geopolitics, peak athletic achievements, frontier science, digital culture, earthquake telemetry, daily facts, serious cognitive mental training, and 5-minute Hindu mindfulness—designed to eliminate phone addiction and social media doomscrolling.

**Live Website**: [https://krishparikh2205-afk.github.io/daily-brief/](https://krishparikh2205-afk.github.io/daily-brief/)  
**Source Repository**: [https://github.com/krishparikh2205-afk/daily-brief](https://github.com/krishparikh2205-afk/daily-brief)

---

## 🌟 Key Features

1. **Automated Serverless Architecture**:
   - Deployed on **GitHub Pages** with zero backend server costs.
   - Refreshes automatically every day at **12:00 AM IST (18:30 UTC)** via GitHub Actions.
   - Built-in **keepalive mechanism** prevents GitHub from pausing cron jobs after 60 days of inactivity.
   - If any RSS source fails, the system preserves yesterday's section and flags it with an `isStale` badge rather than breaking the UI.

2. **2026 Bento Grid Design**:
   - Distinct color themes per section (Deep Blue, Emerald, Electric Purple, Rose, Amber, Gold).
   - Glassmorphism backdrop blur with high-contrast accessibility.
   - Real news images with lazy loading, aspect ratio lock, and source credits (`Image: <source>`).
   - Sticky frosted navigation bar with scrollspy active pills.
   - Live ticking countdown to next midnight IST (`Next update in HH:MM:SS`).
   - Dark mode & Light mode toggle (persisted in `localStorage`).
   - **10-Minute Reading Mode**: Sticky reading progress bar, estimated time remaining, and a mindful *"You're all caught up"* completion screen.

3. **8 Distinct Content Sections**:
   - **World Pulse**: Regional grouping across India, USA, UK, Europe, Middle East, Russia-Ukraine, China & Asia-Pacific, Africa, and Latin America + *Ongoing Matters Tracker*.
   - **Sports & Achievements**: Cricket, Football, Tennis, Athletics, and an *Achievement of the Day* highlight.
   - **Tech & Science**: AI, Space, Quantum, Cybersecurity, and Hardware breakthroughs.
   - **Instagram & Social Trends**: High-signal social media shifts and creator economy updates from reputable tech/culture feeds (no invasive scraping).
   - **Disasters & Emergencies**: Real-time USGS magnitude 5.0+ earthquake GeoJSON feed with interactive map links + calm weather advisories.
   - **Daily Facts**: Exactly 5 new, deduplicated facts per day (Science, Space, History, Human Body, Geography).
   - **Mind Gym**: 7 serious engineering brain games (Logic Grid, Sudoku, Number Cipher, 60s Math Sprint, N-Back, Pattern Master, Word Forge with ICT vocabulary).
   - **Dhyan**: Authentic Hindu 5-minute meditation (rotating Bhagavad Gita verses in Devanagari, Upanishadic reflections, daily mantras, Hindu Panchang, and a 4-4-6 pranayama timer with native Web Audio Om sound).

---

## 🛠️ How to Customize

### 1. Adding or Modifying News Feeds
Open `scripts/fetch-all.mjs`. In the respective section functions (`fetchWorldPulse`, `fetchSports`, `fetchTechScience`, etc.), add or replace any feed URL:

```javascript
// Example: Add a new regional source in fetchWorldPulse()
const feeds = {
  india: ['https://www.thehindu.com/news/national/feeder/default.rss', 'The Hindu'],
  // Add your custom feed here:
  myRegion: ['https://example.com/rss/feed.xml', 'My Source Name']
};
```

### 2. Changing the Scheduled Refresh Time
Open `.github/workflows/update-and-deploy.yml`. Adjust the cron schedule (in UTC):

```yaml
on:
  schedule:
    # 12:00 AM IST = 18:30 UTC ('30 18 * * *')
    # For example, to run at 6:00 AM IST (00:30 UTC), use:
    - cron: '30 0 * * *'
```

### 3. Triggering a Manual Refresh
You can trigger an immediate data update and redeploy at any time:
1. Go to your repository on GitHub: `https://github.com/krishparikh2205-afk/daily-brief/actions`
2. Click **"Daily Update & Deploy to GitHub Pages"** in the left sidebar.
3. Click the **"Run workflow"** button and select the `main` branch.

Alternatively, using the GitHub CLI:
```bash
gh workflow run update-and-deploy.yml
```

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/krishparikh2205-afk/daily-brief.git
   cd daily-brief
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Fetch fresh data locally**:
   ```bash
   npm run fetch-data
   ```

4. **Launch local preview server**:
   ```bash
   npm run serve
   # Opens at http://localhost:3000
   ```

5. **Run automated browser verification & screenshots**:
   ```bash
   node scripts/capture-all.mjs
   ```

---

## 📜 License & Acknowledgements
- MIT License.
- Keyless news feeds from BBC, The Hindu, DW, Al Jazeera, Cricinfo, The Verge, Ars Technica, and TechCrunch.
- Real-time seismic telemetry provided by the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/).
- Historical events sourced from [Wikipedia REST API](https://api.wikimedia.org/).
- Sacred verses from the [Bhagavad Gita](https://vedabase.io/) under public educational domain.
