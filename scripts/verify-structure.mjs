import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('data/today.json', 'utf8'));

console.log('--- goodNews[0] keys:', Object.keys(data.goodNews?.items?.[0] || {}));
console.log('--- goodNews[0]:', data.goodNews?.items?.[0]);

console.log('--- sports keys:', Object.keys(data.sports || {}));
console.log('--- sports.categories.athletics:', data.sports?.categories?.athletics);

console.log('--- dailyFacts keys:', Object.keys(data.dailyFacts || {}));
console.log('--- dailyFacts sample:', JSON.stringify(data.dailyFacts).slice(0, 300));

console.log('--- dhyan keys:', Object.keys(data.dhyan || {}));
console.log('--- dhyan content:', JSON.stringify(data.dhyan).slice(0, 300));
