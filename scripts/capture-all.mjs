import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOCAL_SCREENSHOTS = path.join(ROOT_DIR, 'screenshots');
const ARTIFACT_SCREENSHOTS = 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\32b7ad83-83f3-4a56-9839-89e0ee50c33e\\screenshots';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('[SCREENSHOTS] Launching Chrome via puppeteer-core...');
  await fs.mkdir(LOCAL_SCREENSHOTS, { recursive: true });
  await fs.mkdir(ARTIFACT_SCREENSHOTS, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Collect console logs
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err.message));

  // 1. Desktop Viewport (1440 x 900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log('[SCREENSHOTS] Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Wait for dynamic elements
  await page.waitForSelector('#world-pulse-grid .bento-card', { timeout: 8000 });
  await new Promise(r => setTimeout(r, 1500));

  console.log(`[SCREENSHOTS] Console log count: ${consoleLogs.length}`);

  async function takeSnapshot(selector, filenameBase) {
    const el = selector ? await page.$(selector) : page;
    const localPath = path.join(LOCAL_SCREENSHOTS, `${filenameBase}.png`);
    const artPath = path.join(ARTIFACT_SCREENSHOTS, `${filenameBase}.png`);
    
    if (el) {
      if (selector) {
        await el.scrollIntoView();
        await new Promise(r => setTimeout(r, 400));
        await el.screenshot({ path: localPath });
      } else {
        await page.screenshot({ path: localPath, fullPage: true });
      }
      await fs.copyFile(localPath, artPath);
      console.log(`[SAVED] ${filenameBase}.png`);
    } else {
      console.warn(`[WARN] Element ${selector} not found`);
    }
  }

  // 1. Full Desktop Overview
  await takeSnapshot(null, '01-desktop-full-overview');

  // 2. Header & World Pulse
  await takeSnapshot('#world-pulse', '02-section-world-pulse');

  // 3. Sports & Achievements
  await takeSnapshot('#sports', '03-section-sports');

  // 4. Tech & Science
  await takeSnapshot('#tech-science', '04-section-tech-science');

  // 5. Social Trends
  await takeSnapshot('#social-trends', '05-section-social-trends');

  // 6. Disasters & Emergencies
  await takeSnapshot('#disasters', '06-section-disasters');

  // 7. Daily Facts
  await takeSnapshot('#daily-facts', '07-section-daily-facts');

  // 8. Mind Gym Hub
  await takeSnapshot('#mind-gym', '08-section-mind-gym');

  // Test switching Mind Gym to Sudoku
  const sudokuBtn = await page.$('button[data-mode="sudoku"]');
  if (sudokuBtn) {
    await sudokuBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await takeSnapshot('#mind-gym', '08b-section-mind-gym-sudoku');
  }

  // 9. Dhyan Section
  await takeSnapshot('#dhyan', '09-section-dhyan-meditation');

  // 10. Mobile Viewport (390 x 844 iPhone 14 style)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#world-pulse-grid .bento-card', { timeout: 8000 });
  await new Promise(r => setTimeout(r, 1200));

  await takeSnapshot(null, '10-mobile-full-overview');
  await takeSnapshot('#world-pulse', '11-mobile-world-pulse');
  await takeSnapshot('#mind-gym', '12-mobile-mind-gym');
  await takeSnapshot('#dhyan', '13-mobile-dhyan');

  await browser.close();
  console.log('[SCREENSHOTS] All snapshots captured and archived successfully!');
}

main().catch(err => {
  console.error('[ERROR] Screenshot generation failed:', err);
  process.exit(1);
});
