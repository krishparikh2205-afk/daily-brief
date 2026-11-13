/**
 * Hindu Panchang & Calendar Context Engine
 * Calculates Tithi, Paksha, Nakshatra, and Vikram Samvat mathematically
 */

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima' // or Amavasya in Krishna Paksha
];

const MASAS = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
  'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
];

export function calculatePanchang(date = new Date()) {
  const d = new Date(date);
  
  // Approximate lunar age calculation
  // Base reference new moon: Jan 11, 2024 at 11:57 UTC
  const baseNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const synodicMonth = 29.53058867 * 24 * 3600 * 1000; // ~29.53 days
  
  const diffTime = d.getTime() - baseNewMoon;
  const cyclePhase = ((diffTime % synodicMonth) + synodicMonth) % synodicMonth;
  const lunarAgeDays = cyclePhase / (24 * 3600 * 1000);
  
  // 30 tithis per synodic cycle (~0.984 days per tithi)
  const tithiIndex = Math.floor((lunarAgeDays / 29.53058867) * 30) % 30;
  
  const isShukla = tithiIndex < 15;
  const paksha = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';
  
  let tithiName;
  if (tithiIndex === 14) {
    tithiName = 'Purnima (Full Moon)';
  } else if (tithiIndex === 29) {
    tithiName = 'Amavasya (New Moon)';
  } else {
    const rawTithi = TITHIS[tithiIndex % 15];
    tithiName = `${rawTithi}`;
  }
  
  // Approximate Nakshatra (~27.32 days sidereal cycle)
  const siderealMonth = 27.321661 * 24 * 3600 * 1000;
  const nakshatraPhase = ((diffTime % siderealMonth) + siderealMonth) % siderealMonth;
  const nakshatraIndex = Math.floor((nakshatraPhase / siderealMonth) * 27) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  
  // Vikram Samvat calculation
  const gregorianYear = d.getFullYear();
  // Vikram Samvat begins around Chaitra (March/April). In November, it is gregorianYear + 57
  const vikramSamvat = gregorianYear + 57;
  
  // Hindu Month (approximate solar/lunar mapping)
  // Month 0 (Chaitra) starts around mid-March
  const monthIndex = d.getMonth(); // 0 = Jan -> Pausha/Magha, 10 = Nov -> Kartika
  const masaMapping = [
    'Pausha / Magha', 'Magha / Phalguna', 'Phalguna / Chaitra',
    'Chaitra / Vaishakha', 'Vaishakha / Jyeshtha', 'Jyeshtha / Ashadha',
    'Ashadha / Shravana', 'Shravana / Bhadrapada', 'Bhadrapada / Ashvina',
    'Ashvina / Kartika', 'Kartika / Margashirsha', 'Margashirsha / Pausha'
  ];
  const masa = masaMapping[monthIndex] || 'Kartika';

  return {
    tithi: `${paksha} ${tithiName}`,
    paksha,
    nakshatra,
    masa,
    vikramSamvat: `Vikram Samvat ${vikramSamvat}`,
    dailyThoughtDate: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}
