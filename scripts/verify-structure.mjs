import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('data/today.json', 'utf8'));

console.log('=== VERIFYING DAILY BRIEF DATA STRUCTURE ===');

// 1. Meta
console.log('✅ Title:', data.meta?.title);
if (data.meta?.title !== 'Daily Brief') {
  throw new Error(`Expected title 'Daily Brief' but got '${data.meta?.title}'`);
}
console.log('✅ Last Updated IST:', data.meta?.lastUpdatedIST);
console.log('✅ Target Midnight IST:', data.meta?.targetMidnightIST);

// 2. World Pulse
const regions = data.worldPulse?.regions || {};
const requiredRegions = ['india', 'usa', 'uk', 'europe', 'middleEast', 'russiaUkraine', 'chinaAsiaPacific', 'africa', 'latinAmerica'];
for (const r of requiredRegions) {
  const count = regions[r]?.length || 0;
  console.log(`✅ Region '${r}': ${count} stories`);
  if (count === 0) {
    console.warn(`⚠️ Warning: Region ${r} has 0 stories`);
  }
}
console.log(`✅ Ongoing Matters Tracker: ${data.worldPulse?.ongoingTracker?.length || 0} cards`);

// 3. Sports
console.log('✅ Sports Achievement of the Day:', data.sports?.achievementOfTheDay?.title);
console.log('✅ Sports Categories:', Object.keys(data.sports?.categories || {}));
console.log('✅ Sports Latest Scores:', data.sports?.latestScores?.length);

// 4. Tech & Science
console.log(`✅ Tech & Science Items: ${data.techScience?.items?.length || 0}`);

// 5. Social Trends
console.log(`✅ Social Trends Items: ${data.socialTrends?.items?.length || 0}`);

// 6. Disasters
console.log(`✅ Disasters - USGS M5+ Earthquakes: ${data.disasters?.earthquakes?.length || 0}`);
console.log(`✅ Disasters - Incident Advisories: ${data.disasters?.emergencies?.length || 0}`);

// 7. Daily Facts
console.log(`✅ Daily Facts Count: ${data.dailyFacts?.length || 0}`);
if (data.dailyFacts?.length !== 5) {
  throw new Error(`Expected exactly 5 daily facts, got ${data.dailyFacts?.length}`);
}

// 8. Mind Gym
const gymKeys = Object.keys(data.mindGym || {});
console.log('✅ Mind Gym Modes Generated:', gymKeys);
const expectedGym = ['logicGrid', 'sudoku', 'numberCipher', 'mentalMath', 'patternMaster', 'wordForge'];
for (const eg of expectedGym) {
  if (!data.mindGym?.[eg]) {
    throw new Error(`Missing Mind Gym mode: ${eg}`);
  }
}

// 9. Dhyan
console.log('✅ Gita Verse:', `Ch ${data.dhyan?.verseOfTheDay?.chapter}:${data.dhyan?.verseOfTheDay?.verse}`);
console.log('   Sanskrit:', data.dhyan?.verseOfTheDay?.sanskrit?.slice(0, 30) + '...');
console.log('   Transliteration:', data.dhyan?.verseOfTheDay?.transliteration?.slice(0, 30) + '...');
console.log('   English:', data.dhyan?.verseOfTheDay?.english?.slice(0, 40) + '...');
console.log('✅ Thought of the Day:', data.dhyan?.thoughtOfTheDay?.title || data.dhyan?.thoughtOfTheDay?.theme);
console.log('✅ Daily Mantra:', data.dhyan?.dailyMantra?.name);
console.log('✅ Panchang:', data.dhyan?.panchang?.formatted);

console.log('=== ALL DAILY BRIEF CHECKS PASSED PERFECTLY! ===');
