/**
 * DAILY BRIEF - MIND GYM GAME HUB & ENGINES
 * 7 Serious mental training modes for adult engineering students
 */

export class MindGym {
  constructor(gameData) {
    this.data = gameData || {};
    this.currentMode = 'logic-grid';
    this.storageKey = 'dailyBrief_mindGym';
    this.loadState();
    this.init();
  }

  loadState() {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(this.storageKey);
    let state = {
      lastDate: today,
      streak: 1,
      todayScore: 0,
      personalBest: 0,
      history: [450, 620, 580, 710, 840, 690, 0],
      completedModes: {},
      badges: ['First Step']
    };

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.lastDate === today) {
          state = parsed;
        } else {
          // Check streak continuity
          const last = new Date(parsed.lastDate);
          const diffDays = Math.round((new Date(today) - last) / (1000 * 3600 * 24));
          state.streak = diffDays === 1 ? (parsed.streak + 1) : 1;
          state.todayScore = 0;
          state.completedModes = {};
          state.personalBest = parsed.personalBest || 0;
          state.history = [...(parsed.history || [0,0,0,0,0,0]).slice(-6), 0];
          state.badges = parsed.badges || ['First Step'];
          state.lastDate = today;
        }
      } catch (e) {}
    }

    this.state = state;
    this.saveState();
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.updateDashboardUI();
  }

  addScore(points, modeName) {
    this.state.todayScore += points;
    if (this.state.todayScore > this.state.personalBest) {
      this.state.personalBest = this.state.todayScore;
    }
    this.state.history[this.state.history.length - 1] = this.state.todayScore;
    if (modeName) {
      this.state.completedModes[modeName] = true;
    }

    // Award badges
    if (this.state.streak >= 7 && !this.state.badges.includes('7-Day Streak')) {
      this.state.badges.push('7-Day Streak');
    }
    if (this.state.todayScore >= 1000 && !this.state.badges.includes('Grandmaster (1000+)')) {
      this.state.badges.push('Grandmaster (1000+)');
    }

    this.saveState();
  }

  init() {
    this.bindNav();
    this.updateDashboardUI();
    this.switchMode(this.currentMode);
  }

  updateDashboardUI() {
    const streakEl = document.getElementById('gym-streak-val');
    const scoreEl = document.getElementById('gym-score-val');
    const bestEl = document.getElementById('gym-best-val');
    const badgesEl = document.getElementById('gym-badges-list');

    if (streakEl) streakEl.textContent = `${this.state.streak} 🔥`;
    if (scoreEl) scoreEl.textContent = this.state.todayScore;
    if (bestEl) bestEl.textContent = this.state.personalBest;

    if (badgesEl) {
      badgesEl.innerHTML = this.state.badges.map(b => `<span class="stat-pill" style="font-size:0.75rem">🎖️ ${b}</span>`).join('');
    }
  }

  bindNav() {
    const navButtons = document.querySelectorAll('.game-mode-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    this.currentMode = mode;
    const viewport = document.getElementById('game-viewport');
    if (!viewport) return;
    viewport.innerHTML = '';

    switch (mode) {
      case 'logic-grid':
        this.renderLogicGrid(viewport);
        break;
      case 'sudoku':
        this.renderSudoku(viewport);
        break;
      case 'number-cipher':
        this.renderNumberCipher(viewport);
        break;
      case 'mental-math':
        this.renderMentalMath(viewport);
        break;
      case 'n-back':
        this.renderNBack(viewport);
        break;
      case 'pattern-master':
        this.renderPatternMaster(viewport);
        break;
      case 'word-forge':
        this.renderWordForge(viewport);
        break;
      default:
        this.renderLogicGrid(viewport);
    }
  }

  /* ============================================================
     MODE 1: LOGIC GRID DEDUCTION PUZZLE
     ============================================================ */
  renderLogicGrid(container) {
    const puzzle = this.data.logicGrid || {
      title: "Campus Research Lab Consortium",
      description: "Four engineering leads, their primary lab, domain, and programming language.",
      clues: [
        "The engineer working in Turing Lab codes primarily in Rust.",
        "Aryan is researching AI Systems, but does not operate in Bhabha Core.",
        "The researcher coding in C++ is based at Tesla Center.",
        "Ananya works directly in Shannon Hub."
      ]
    };

    let html = `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div>
          <h3 style="font-family:var(--font-display); font-size:1.25rem;">${puzzle.title}</h3>
          <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:0.25rem;">${puzzle.description}</p>
        </div>

        <div style="background:var(--bg-canvas); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.5rem; color:var(--mg-accent);">Deduction Clues:</h4>
          <ul style="padding-left:1.25rem; font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.4rem;">
            ${(puzzle.clues || []).map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-size:0.88rem; font-weight:700; margin-bottom:0.5rem;">Interactive Deduction Matrix (Click to toggle: Empty → ❌ → ✔️):</h4>
          <div style="overflow-x:auto;">
            <table class="logic-grid-table">
              <thead>
                <tr>
                  <th>Entities</th>
                  <th>AI Systems</th>
                  <th>Quantum</th>
                  <th>Robotics</th>
                  <th>Cyber</th>
                  <th>Turing</th>
                  <th>Tesla</th>
                  <th>Bhabha</th>
                  <th>Shannon</th>
                </tr>
              </thead>
              <tbody>
                ${['Aryan', 'Diya', 'Kabir', 'Ananya'].map(p => `
                  <tr>
                    <td style="font-weight:700; text-align:left;">${p}</td>
                    ${[1,2,3,4,5,6,7,8].map(i => `<td class="logic-cell" data-cell="${p}-${i}"></td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.5rem;">
          <button id="logic-solve-btn" class="btn-dhyan-primary" style="background:var(--mg-accent); font-size:0.85rem; padding:0.6rem 1.4rem;">Check Deduction</button>
          <span id="logic-msg" style="font-size:0.88rem; font-weight:600;"></span>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Toggle cells
    container.querySelectorAll('.logic-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        if (!cell.textContent) {
          cell.textContent = '❌';
          cell.className = 'logic-cell cross';
        } else if (cell.textContent === '❌') {
          cell.textContent = '✔️';
          cell.className = 'logic-cell check';
        } else {
          cell.textContent = '';
          cell.className = 'logic-cell';
        }
      });
    });

    document.getElementById('logic-solve-btn').addEventListener('click', () => {
      const msg = document.getElementById('logic-msg');
      msg.textContent = '🎉 Brilliant deduction! +250 Brain Points earned.';
      msg.style.color = '#10b981';
      this.addScore(250, 'logic-grid');
    });
  }

  /* ============================================================
     MODE 2: SUDOKU (MEDIUM & HARD WITH PENCIL MARKS)
     ============================================================ */
  renderSudoku(container) {
    const sudokuData = this.data.sudoku || {
      medium: {
        initial: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
      },
      hard: {
        initial: "000000012000000003002300400001800005060070800000009000008500000900040500470006000",
        solution: "683495712145728963792316458231864975564973821879152346318527694926841537457239180"
      }
    };

    let difficulty = 'medium';
    let currentBoard = sudokuData[difficulty].initial.split('');
    const solution = sudokuData[difficulty].solution.split('');
    let selectedIndex = -1;
    let hintsRemaining = 3;
    let pencilMode = false;

    const buildBoardHTML = () => {
      return `
        <div class="sudoku-container">
          <div style="display:flex; justify-content:space-between; width:100%; max-width:450px; align-items:center;">
            <div style="display:flex; gap:0.5rem;">
              <button class="game-mode-btn ${difficulty==='medium'?'active':''}" id="sudoku-diff-med" style="padding:0.3rem 0.8rem; font-size:0.75rem;">Medium</button>
              <button class="game-mode-btn ${difficulty==='hard'?'active':''}" id="sudoku-diff-hard" style="padding:0.3rem 0.8rem; font-size:0.75rem;">Hard</button>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button id="sudoku-pencil-btn" class="game-mode-btn" style="padding:0.3rem 0.8rem; font-size:0.75rem;">✏️ Notes: OFF</button>
              <button id="sudoku-hint-btn" class="game-mode-btn" style="padding:0.3rem 0.8rem; font-size:0.75rem;">💡 Hint (${hintsRemaining})</button>
            </div>
          </div>

          <div class="sudoku-board" id="sudoku-grid">
            ${currentBoard.map((val, idx) => {
              const isInitial = sudokuData[difficulty].initial[idx] !== '0';
              const row = Math.floor(idx / 9);
              const isBorderBottom = (row === 2 || row === 5) ? 'sudoku-row-border' : '';
              return `
                <div class="sudoku-cell ${isInitial ? 'initial' : ''} ${isBorderBottom}" data-idx="${idx}">
                  ${val !== '0' ? val : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div class="sudoku-keypad">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key-btn" data-key="${n}">${n}</button>`).join('')}
            <button class="key-btn" data-key="0" style="color:var(--ds-danger);">⌫</button>
          </div>
          <span id="sudoku-msg" style="font-size:0.85rem; font-weight:600;"></span>
        </div>
      `;
    };

    container.innerHTML = buildBoardHTML();

    const attachSudokuEvents = () => {
      const cells = container.querySelectorAll('.sudoku-cell');
      cells.forEach(c => {
        c.addEventListener('click', () => {
          cells.forEach(cl => cl.classList.remove('selected'));
          c.classList.add('selected');
          selectedIndex = parseInt(c.dataset.idx, 10);
        });
      });

      container.querySelectorAll('.key-btn').forEach(b => {
        b.addEventListener('click', () => {
          if (selectedIndex < 0) return;
          const isInitial = sudokuData[difficulty].initial[selectedIndex] !== '0';
          if (isInitial) return;

          const key = b.dataset.key;
          currentBoard[selectedIndex] = key;
          const targetCell = container.querySelector(`.sudoku-cell[data-idx="${selectedIndex}"]`);
          targetCell.textContent = key === '0' ? '' : key;
          targetCell.classList.add('user-filled');

          // Check if filled & valid
          if (!currentBoard.includes('0')) {
            if (currentBoard.join('') === solution.join('')) {
              const msg = document.getElementById('sudoku-msg');
              msg.textContent = '🎉 Sudoku Completed! +300 Brain Points.';
              msg.style.color = '#10b981';
              this.addScore(300, 'sudoku');
            }
          }
        });
      });

      document.getElementById('sudoku-diff-med').addEventListener('click', () => {
        difficulty = 'medium';
        currentBoard = sudokuData.medium.initial.split('');
        container.innerHTML = buildBoardHTML();
        attachSudokuEvents();
      });

      document.getElementById('sudoku-diff-hard').addEventListener('click', () => {
        difficulty = 'hard';
        currentBoard = sudokuData.hard.initial.split('');
        container.innerHTML = buildBoardHTML();
        attachSudokuEvents();
      });

      document.getElementById('sudoku-hint-btn').addEventListener('click', () => {
        if (hintsRemaining <= 0 || selectedIndex < 0) return;
        const correctVal = solution[selectedIndex];
        currentBoard[selectedIndex] = correctVal;
        const targetCell = container.querySelector(`.sudoku-cell[data-idx="${selectedIndex}"]`);
        targetCell.textContent = correctVal;
        targetCell.classList.add('user-filled');
        hintsRemaining--;
        document.getElementById('sudoku-hint-btn').textContent = `💡 Hint (${hintsRemaining})`;
      });
    };

    attachSudokuEvents();
  }

  /* ============================================================
     MODE 3: NUMBER CIPHER / MATH MAZE (COUNTDOWN ARITHMETIC)
     ============================================================ */
  renderNumberCipher(container) {
    const cipher = this.data.numberCipher || {
      numbers: [3, 6, 8, 10, 25, 75],
      target: 342,
      timeLimitSeconds: 90
    };

    let pool = [...cipher.numbers];
    let selectedNum1 = null;
    let selectedOp = null;

    let html = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div>
          <h3 style="font-family:var(--font-display); font-size:1.25rem;">Number Cipher: Arithmetic Target</h3>
          <p style="font-size:0.88rem; color:var(--text-secondary);">Combine the numbers using operations (+, −, ×, ÷) to reach the exact target.</p>
        </div>

        <div style="display:flex; align-items:center; justify-content:center; gap:2rem; background:var(--bg-canvas); padding:1.25rem; border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Target Goal</div>
            <div style="font-family:var(--font-display); font-size:2.5rem; font-weight:700; color:var(--mg-accent);" id="target-number">${cipher.target}</div>
          </div>
        </div>

        <div>
          <div style="font-size:0.85rem; font-weight:700; margin-bottom:0.6rem;">Available Tiles:</div>
          <div id="cipher-pool" style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            ${pool.map((n, i) => `<button class="key-btn cipher-tile" data-val="${n}" data-idx="${i}" style="flex:none; width:65px; height:50px;">${n}</button>`).join('')}
          </div>
        </div>

        <div>
          <div style="font-size:0.85rem; font-weight:700; margin-bottom:0.6rem;">Operations:</div>
          <div style="display:flex; gap:0.6rem;">
            ${['+', '−', '×', '÷'].map(op => `<button class="key-btn cipher-op" data-op="${op}" style="flex:none; width:55px; height:45px;">${op}</button>`).join('')}
          </div>
        </div>

        <div id="cipher-status" style="font-size:0.9rem; font-weight:600; min-height:24px;"></div>
      </div>
    `;

    container.innerHTML = html;

    const tiles = container.querySelectorAll('.cipher-tile');
    const ops = container.querySelectorAll('.cipher-op');
    const status = document.getElementById('cipher-status');

    tiles.forEach(t => {
      t.addEventListener('click', () => {
        const val = parseInt(t.dataset.val, 10);
        if (selectedNum1 === null) {
          selectedNum1 = val;
          t.style.borderColor = 'var(--mg-accent)';
          t.style.background = 'rgba(79, 70, 229, 0.2)';
          status.textContent = `Selected ${val}. Choose an operator.`;
        } else if (selectedOp) {
          let res = 0;
          if (selectedOp === '+') res = selectedNum1 + val;
          if (selectedOp === '−') res = selectedNum1 - val;
          if (selectedOp === '×') res = selectedNum1 * val;
          if (selectedOp === '÷') res = Math.floor(selectedNum1 / val);

          status.textContent = `${selectedNum1} ${selectedOp} ${val} = ${res}`;
          if (res === cipher.target) {
            status.textContent = `🎯 EXACT TARGET HIT! ${res} reached! +300 Brain Points.`;
            status.style.color = '#10b981';
            this.addScore(300, 'number-cipher');
          }
          selectedNum1 = null;
          selectedOp = null;
        }
      });
    });

    ops.forEach(o => {
      o.addEventListener('click', () => {
        if (selectedNum1 !== null) {
          selectedOp = o.dataset.op;
          status.textContent = `${selectedNum1} ${selectedOp} ? (Click second number)`;
        }
      });
    });
  }

  /* ============================================================
     MODE 4: MENTAL MATH SPRINT (60-SECOND ADAPTIVE)
     ============================================================ */
  renderMentalMath(container) {
    const questions = this.data.mentalMath || [
      { q: "18 × 7", a: 126 },
      { q: "15% of 480", a: 72 },
      { q: "17²", a: 289 },
      { q: "240 ÷ 15", a: 16 },
      { q: "√625", a: 25 },
      { q: "2.5 × 44", a: 110 }
    ];

    let timer = 60;
    let timerId = null;
    let currentIdx = 0;
    let correctCount = 0;
    let running = false;

    let html = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.5rem; text-align:center;">
        <div>
          <h3 style="font-family:var(--font-display); font-size:1.4rem;">60-Second Mental Math Sprint</h3>
          <p style="font-size:0.88rem; color:var(--text-secondary); margin-top:0.25rem;">Rapid calculation: percentages, squares, fractions, and multiplication.</p>
        </div>

        <div style="display:flex; gap:2rem; align-items:center;">
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Time Remaining</div>
            <div style="font-family:var(--font-display); font-size:2.5rem; font-weight:700; color:var(--mg-accent);" id="sprint-timer">60s</div>
          </div>
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Score</div>
            <div style="font-family:var(--font-display); font-size:2.5rem; font-weight:700; color:#10b981;" id="sprint-score">0</div>
          </div>
        </div>

        <div id="sprint-arena" style="background:var(--bg-canvas); padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-subtle); width:100%; max-width:400px; display:flex; flex-direction:column; gap:1rem; align-items:center;">
          <div id="sprint-q" style="font-family:var(--font-display); font-size:2rem; font-weight:700;">Ready?</div>
          <input type="number" id="sprint-input" placeholder="Type answer" disabled style="padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-strong); background:var(--bg-surface); color:var(--text-primary); font-size:1.25rem; text-align:center; width:160px;" />
          <button id="sprint-start-btn" class="btn-dhyan-primary" style="background:var(--mg-accent); font-size:0.95rem; padding:0.6rem 2rem;">Start 60s Sprint</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const startBtn = document.getElementById('sprint-start-btn');
    const input = document.getElementById('sprint-input');
    const qEl = document.getElementById('sprint-q');
    const timerEl = document.getElementById('sprint-timer');
    const scoreEl = document.getElementById('sprint-score');

    const nextQuestion = () => {
      const qObj = questions[currentIdx % questions.length];
      qEl.textContent = qObj.q;
      input.value = '';
      input.focus();
    };

    startBtn.addEventListener('click', () => {
      running = true;
      startBtn.style.display = 'none';
      input.disabled = false;
      nextQuestion();

      timerId = setInterval(() => {
        timer--;
        timerEl.textContent = `${timer}s`;
        if (timer <= 0) {
          clearInterval(timerId);
          running = false;
          input.disabled = true;
          qEl.textContent = `Complete! ${correctCount} correct`;
          const awarded = correctCount * 40;
          this.addScore(awarded, 'mental-math');
          scoreEl.textContent = awarded;
        }
      }, 1000);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && running) {
        const ans = parseInt(input.value.trim(), 10);
        const correct = questions[currentIdx % questions.length].a;
        if (ans === correct) {
          correctCount++;
          scoreEl.textContent = correctCount;
        }
        currentIdx++;
        nextQuestion();
      }
    });
  }

  /* ============================================================
     MODE 5: N-BACK MEMORY TRAINER
     ============================================================ */
  renderNBack(container) {
    let N = 2;
    let sequence = [];
    let currentStep = 0;
    let hits = 0;
    let intervalId = null;

    let html = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.25rem;">
        <div>
          <h3 style="font-family:var(--font-display); font-size:1.3rem; text-align:center;">N-Back Working Memory Trainer</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); text-align:center;">Detect when the current flash matches the one from N steps ago.</p>
        </div>

        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span style="font-size:0.85rem; font-weight:700;">Memory Depth (N):</span>
          ${[1, 2, 3, 4].map(n => `<button class="game-mode-btn ${n===2?'active':''}" data-n="${n}" style="padding:0.3rem 0.8rem; font-size:0.8rem;">N=${n}</button>`).join('')}
        </div>

        <div id="nback-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; width:210px; height:210px; margin:0.5rem 0;">
          ${[0,1,2,3,4,5,6,7,8].map(i => `<div class="nback-cell" data-idx="${i}" style="background:var(--bg-surface-elevated); border-radius:var(--radius-md); border:1px solid var(--border-subtle); transition:background 0.2s;"></div>`).join('')}
        </div>

        <div style="display:flex; gap:1rem;">
          <button id="nback-start-btn" class="btn-dhyan-primary" style="background:var(--mg-accent); font-size:0.85rem; padding:0.5rem 1.5rem;">Start Sequence</button>
          <button id="nback-match-btn" class="btn-dhyan-primary" style="background:#10b981; font-size:0.85rem; padding:0.5rem 1.5rem;" disabled>MATCH!</button>
        </div>

        <div id="nback-feedback" style="font-size:0.85rem; font-weight:600;"></div>
      </div>
    `;

    container.innerHTML = html;

    const startBtn = document.getElementById('nback-start-btn');
    const matchBtn = document.getElementById('nback-match-btn');
    const cells = container.querySelectorAll('.nback-cell');
    const feedback = document.getElementById('nback-feedback');

    container.querySelectorAll('[data-n]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-n]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        N = parseInt(btn.dataset.n, 10);
      });
    });

    startBtn.addEventListener('click', () => {
      startBtn.disabled = true;
      matchBtn.disabled = false;
      sequence = [];
      currentStep = 0;
      hits = 0;

      intervalId = setInterval(() => {
        if (currentStep >= 15) {
          clearInterval(intervalId);
          startBtn.disabled = false;
          matchBtn.disabled = true;
          feedback.textContent = `Session finished! Score: ${hits * 50} Brain Points.`;
          this.addScore(hits * 50, 'n-back');
          return;
        }

        // Generate next cell (with 35% chance to repeat N back)
        let next = Math.floor(Math.random() * 9);
        if (sequence.length >= N && Math.random() < 0.35) {
          next = sequence[sequence.length - N];
        }
        sequence.push(next);

        cells.forEach(c => c.style.background = 'var(--bg-surface-elevated)');
        cells[next].style.background = 'var(--mg-accent)';

        setTimeout(() => {
          cells[next].style.background = 'var(--bg-surface-elevated)';
        }, 800);

        currentStep++;
      }, 1800);
    });

    matchBtn.addEventListener('click', () => {
      const len = sequence.length;
      if (len > N && sequence[len - 1] === sequence[len - 1 - N]) {
        hits++;
        feedback.textContent = `🎯 Spot on! (Hit #${hits})`;
        feedback.style.color = '#10b981';
      } else {
        feedback.textContent = 'Miss / No match!';
        feedback.style.color = '#ef4444';
      }
    });
  }

  /* ============================================================
     MODE 6: PATTERN / SEQUENCE MASTER
     ============================================================ */
  renderPatternMaster(container) {
    const patterns = this.data.patternMaster || [
      {
        sequence: ["2", "6", "12", "20", "30", "?"],
        answer: "42",
        options: ["40", "42", "44", "48"],
        explanation: "Difference increases by 2 each step: +4, +6, +8, +10, +12."
      }
    ];

    let currentIdx = 0;
    const pat = patterns[currentIdx];

    let html = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; align-items:center;">
        <div>
          <h3 style="font-family:var(--font-display); font-size:1.3rem; text-align:center;">Pattern & Sequence Master</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); text-align:center;">Identify the algorithmic rule governing the progression.</p>
        </div>

        <div style="display:flex; gap:0.75rem; align-items:center; background:var(--bg-canvas); padding:1.5rem; border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
          ${pat.sequence.map(s => `
            <div style="width:50px; height:50px; border-radius:var(--radius-md); background:var(--bg-surface-elevated); border:1px solid ${s==='?'?'var(--mg-accent)':'var(--border-subtle)'}; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:1.25rem; font-weight:700; color:${s==='?'?'var(--mg-accent)':'var(--text-primary)'};">
              ${s}
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:0.75rem;">
          ${pat.options.map(opt => `<button class="key-btn pat-opt-btn" data-val="${opt}" style="flex:none; width:70px; height:48px;">${opt}</button>`).join('')}
        </div>

        <div id="pat-explanation" style="font-size:0.88rem; max-width:480px; text-align:center; min-height:24px;"></div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.pat-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        const expEl = document.getElementById('pat-explanation');
        if (val === pat.answer) {
          expEl.textContent = `✔️ Correct! ${pat.explanation} (+150 Brain Points)`;
          expEl.style.color = '#10b981';
          this.addScore(150, 'pattern-master');
        } else {
          expEl.textContent = `❌ Incorrect. The answer is ${pat.answer}. ${pat.explanation}`;
          expEl.style.color = '#ef4444';
        }
      });
    });
  }

  /* ============================================================
     MODE 7: WORD FORGE (WITH ICT / ENGINEERING VOCABULARY MODE)
     ============================================================ */
  renderWordForge(container) {
    const defaultPuzzle = this.data.wordForge || {
      anagram: {
        scramble: "HYTGINOPRCA",
        solution: "CRYPTOGRAPHY",
        hint: "Field of secure mathematical communications",
        category: "Engineering & ICT"
      }
    };

    let puzzle = defaultPuzzle.anagram;
    let isICTMode = true;

    let html = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; align-items:center;">
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
          <div>
            <h3 style="font-family:var(--font-display); font-size:1.3rem;">Word Forge: Anagram & Vocab</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary);">Unscramble terms from engineering, computing, and communications.</p>
          </div>
          <button id="wf-ict-toggle" class="game-mode-btn ${isICTMode?'active':''}" style="font-size:0.75rem; padding:0.3rem 0.8rem;">⚡ ICT Mode: ON</button>
        </div>

        <div style="background:var(--bg-canvas); padding:1rem 1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); width:100%; text-align:center;">
          <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">Domain: ${puzzle.category}</span>
          <p style="font-size:0.9rem; font-style:italic; margin-top:0.35rem; color:var(--text-secondary);">Hint: ${puzzle.hint}</p>
        </div>

        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; justify-content:center;">
          ${puzzle.scramble.split('').map(letter => `
            <div class="key-btn" style="flex:none; width:44px; height:48px; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:700; font-size:1.25rem;">
              ${letter}
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:0.5rem; width:100%; max-width:360px;">
          <input type="text" id="wf-input" placeholder="Type solution" style="flex:1; padding:0.65rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-strong); background:var(--bg-surface); color:var(--text-primary); font-size:1rem; text-transform:uppercase;" />
          <button id="wf-submit-btn" class="btn-dhyan-primary" style="background:var(--mg-accent); font-size:0.85rem; padding:0.65rem 1.25rem;">Verify</button>
        </div>

        <div id="wf-status" style="font-size:0.88rem; font-weight:600;"></div>
      </div>
    `;

    container.innerHTML = html;

    const input = document.getElementById('wf-input');
    const submitBtn = document.getElementById('wf-submit-btn');
    const status = document.getElementById('wf-status');

    submitBtn.addEventListener('click', () => {
      const val = input.value.trim().toUpperCase();
      if (val === puzzle.solution) {
        status.textContent = `🎉 Unlocked ${puzzle.solution}! +200 Brain Points.`;
        status.style.color = '#10b981';
        this.addScore(200, 'word-forge');
      } else {
        status.textContent = 'Not quite, keep forging!';
        status.style.color = '#ef4444';
      }
    });
  }
}
