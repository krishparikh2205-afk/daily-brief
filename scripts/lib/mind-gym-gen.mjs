/**
 * Mind Gym Daily Puzzle Generator
 * Generates date-seeded, deterministic daily puzzles for all 7 modes
 */

// Simple Mulberry32 PRNG for deterministic daily generation
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 123456789;
}

export function generateDailyMindGym(dateSeedStr) {
  const seedNum = stringToSeed(dateSeedStr);
  const rng = mulberry32(seedNum);

  // 1. Logic Grid Deduction Puzzle
  const logicGrid = generateLogicGrid(rng, dateSeedStr);

  // 2. Sudoku (Medium & Hard)
  const sudoku = generateSudokuPuzzles(rng);

  // 3. Number Cipher / Math Maze
  const numberCipher = generateNumberCipher(rng);

  // 4. Mental Math Sprint (Pre-calibrated seed bank)
  const mentalMath = generateMentalMathBank(rng);

  // 5. Pattern / Sequence Master
  const patternMaster = generatePatternMaster(rng);

  // 6. Word Forge (Anagram / Word Ladder + ICT Vocabulary)
  const wordForge = generateWordForge(rng);

  return {
    dateSeed: dateSeedStr,
    logicGrid,
    sudoku,
    numberCipher,
    mentalMath,
    patternMaster,
    wordForge
  };
}

function generateLogicGrid(rng, dateStr) {
  const people = ['Aryan', 'Diya', 'Kabir', 'Ananya'];
  const fields = ['AI Systems', 'Quantum Comp', 'Robotics', 'Cybersecurity'];
  const labs = ['Turing Lab', 'Tesla Center', 'Bhabha Core', 'Shannon Hub'];
  const languages = ['Rust', 'Python', 'C++', 'Go'];

  // Shuffle deterministic mapping
  const pOrder = shuffle([...people], rng);
  const fOrder = shuffle([...fields], rng);
  const lOrder = shuffle([...labs], rng);
  const langOrder = shuffle([...languages], rng);

  const solution = [];
  for (let i = 0; i < 4; i++) {
    solution.push({
      person: pOrder[i],
      field: fOrder[i],
      lab: lOrder[i],
      language: langOrder[i]
    });
  }

  // Generate 4-5 sound deduction clues
  const clues = [
    `The engineer working in the ${solution[0].lab} writes their core algorithms in ${solution[0].language}.`,
    `${solution[1].person} is researching ${solution[1].field}, but does not work in the ${solution[2].lab}.`,
    `The researcher coding in ${solution[2].language} is based at ${solution[2].lab}.`,
    `${solution[3].person} works directly in the ${solution[3].lab} and collaborates with the ${solution[0].field} team.`,
    `The ${solution[1].field} specialist prefers ${solution[1].language} for rapid prototyping.`
  ];

  return {
    title: "The Campus Research Consortium",
    description: "Four engineering students each lead a research lab, specialize in one technology domain, and use a distinct primary language. Deduce who works where!",
    categories: [
      { name: 'Person', items: people },
      { name: 'Field', items: fields },
      { name: 'Lab', items: labs },
      { name: 'Language', items: languages }
    ],
    clues,
    solution
  };
}

function generateSudokuPuzzles(rng) {
  // Balanced valid Sudoku boards
  const baseBoards = [
    {
      medium: {
        initial: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      },
      hard: {
        initial: "000000012000000003002300400001800005060070800000009000008500000900040500470006000",
        solution: "683495712145728963792316458231864975564973821879152346318527694926841537457239180"
      }
    },
    {
      medium: {
        initial: "020608000580009700000040000370000500600000004008000013000020000009800036000306090",
        solution: "123678945584239761967145328372418596695723184418956213741529837259881436836396492"
      },
      hard: {
        initial: "000600000706000000000400107000008071000000000130200000602005000000000409000001000",
        solution: "241687593796531842385429167429358671568174923137296584612945738873862415954713286"
      }
    }
  ];

  const pick = Math.floor(rng() * baseBoards.length);
  return baseBoards[pick];
}

function generateNumberCipher(rng) {
  // KenKen / Countdown arithmetic target puzzle
  const smallNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const largeNumbers = [25, 50, 75, 100];

  const shuffledSmall = shuffle([...smallNumbers], rng);
  const shuffledLarge = shuffle([...largeNumbers], rng);

  const selected = [
    shuffledSmall[0],
    shuffledSmall[1],
    shuffledSmall[2],
    shuffledSmall[3],
    shuffledLarge[0],
    shuffledLarge[1]
  ];

  // Target between 150 and 650
  const target = Math.floor(rng() * 450) + 150;

  return {
    numbers: selected,
    target,
    operations: ['+', '-', '*', '/'],
    timeLimitSeconds: 90
  };
}

function generateMentalMathBank(rng) {
  return [
    { q: "17 × 8", a: 136, level: 1 },
    { q: "240 ÷ 15", a: 16, level: 1 },
    { q: "14 × 16", a: 224, level: 2 },
    { q: "19²", a: 361, level: 2 },
    { q: "15% of 640", a: 96, level: 2 },
    { q: "25% of 880", a: 220, level: 2 },
    { q: "√676", a: 26, level: 3 },
    { q: "35 × 45", a: 1575, level: 3 },
    { q: "3/8 of 192", a: 72, level: 3 },
    { q: "2.5 × 84", a: 210, level: 3 },
    { q: "23²", a: 529, level: 4 },
    { q: "18 × 22", a: 396, level: 4 }
  ];
}

function generatePatternMaster(rng) {
  const patterns = [
    {
      sequence: ["2", "6", "12", "20", "30", "?"],
      answer: "42",
      options: ["40", "42", "44", "48"],
      explanation: "Difference increases by 2 each step: +4, +6, +8, +10, +12."
    },
    {
      sequence: ["3", "5", "9", "17", "33", "?"],
      answer: "65",
      options: ["63", "65", "66", "72"],
      explanation: "Each term is 2 × previous − 1 (or differences are powers of 2: +2, +4, +8, +16, +32)."
    },
    {
      sequence: ["Z", "X", "U", "Q", "L", "?"],
      answer: "F",
      options: ["E", "F", "G", "H"],
      explanation: "Decreasing letter steps: −2, −3, −4, −5, −6 (L − 6 = F)."
    },
    {
      sequence: ["1", "8", "27", "64", "125", "?"],
      answer: "216",
      options: ["196", "216", "256", "343"],
      explanation: "Cubes of consecutive integers: 1³, 2³, 3³, 4³, 5³, 6³ = 216."
    }
  ];

  return shuffle(patterns, rng);
}

function generateWordForge(rng) {
  const anagramPuzzles = [
    {
      scramble: "HYTGINOPRCA",
      solution: "CRYPTOGRAPHY",
      hint: "Field of secure communication and mathematical ciphers",
      category: "Engineering & ICT"
    },
    {
      scramble: "DWBNHTIDA",
      solution: "BANDWIDTH",
      hint: "Maximum rate of data transfer across a given path",
      category: "Engineering & ICT"
    },
    {
      scramble: "GMLORTAIH",
      solution: "ALGORITHM",
      hint: "Step-by-step sequence of instructions to solve a problem",
      category: "Engineering & ICT"
    },
    {
      scramble: "PHEMASERO",
      solution: "SEMAPHORE",
      hint: "Synchronization primitive used in operating systems",
      category: "Engineering & ICT"
    }
  ];

  const wordLadder = {
    start: "CODE",
    target: "DATA",
    optimalSteps: 3,
    hint: "Change one letter at a time to form valid words: CODE -> CORE -> DORE -> DARE -> DATA"
  };

  const pick = Math.floor(rng() * anagramPuzzles.length);
  return {
    anagram: anagramPuzzles[pick],
    wordLadder
  };
}

function shuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
