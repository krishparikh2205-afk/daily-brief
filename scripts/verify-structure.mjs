import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('data/today.json', 'utf8'));

console.log('✅ Meta:', data.meta);
console.log('✅ English News Count:', data.newsByLanguage?.english?.length);
if (data.newsByLanguage?.english?.length) {
  console.log('   Sample English:', data.newsByLanguage.english[0].title);
}
console.log('✅ Hindi News Count:', data.newsByLanguage?.hindi?.length);
if (data.newsByLanguage?.hindi?.length) {
  console.log('   Sample Hindi:', data.newsByLanguage.hindi[0].title);
}
console.log('✅ Gujarati News Count:', data.newsByLanguage?.gujarati?.length);
if (data.newsByLanguage?.gujarati?.length) {
  console.log('   Sample Gujarati:', data.newsByLanguage.gujarati[0].title);
}
console.log('✅ UN News Count:', data.unNews?.length);
if (data.unNews?.length) {
  console.log('   Sample UN:', data.unNews[0].title);
}
console.log('✅ Good News Count:', data.goodNews?.length);
console.log('✅ Sports Athletics Count:', data.sports?.athletics?.length);
console.log('✅ Daily Facts (Animals) Count:', data.dailyFacts?.length);
console.log('✅ Languages Available:', Object.keys(data.languages || {}));
console.log('✅ Gita in Hindi Title:', data.dhyan?.verseOfTheDay?.hindiTitle);
console.log('✅ Gita in Hindi Meaning:', data.dhyan?.verseOfTheDay?.hindiMeaning?.slice(0, 80));
console.log('✅ Om Namah Shivaya Mantra:', data.dhyan?.omNamahShivaya?.name, `(Repetitions: ${data.dhyan?.omNamahShivaya?.targetCount})`);

// Check PDPU ICT is not present anywhere in meta
const metaStr = JSON.stringify(data.meta);
if (metaStr.includes('PDPU') || metaStr.includes('pdpu')) {
  console.error('❌ ERROR: PDPU ICT found in meta!');
} else {
  console.log('✅ VERIFIED: PDPU ICT completely removed from metadata.');
}
