/**
 * WORLDLY AFFAIRS AT YOUR COMFORT - MIND GYM 2.0
 * 5 Modern, Brain-Based, Engaging Games:
 * 1. Wordle Daily (5-letter deduction)
 * 2. Memory Matrix (Spatial flash working memory)
 * 3. Speed Stroop (Cognitive inhibition & reaction speed)
 * 4. Math 24 / Target Merge (Arithmetic logic)
 * 5. Dual Focus Reflex (Executive function & rule-switching)
 */

export class MindGym {
  constructor() {
    this.currentMode = 'wordle';
    this.storageKey = 'worldly_mindGym_v2';
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
      completedModes: {},
      badges: ['Brain Explorer']
    };

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.lastDate === today) {
          state = parsed;
        } else {
          const last = new Date(parsed.lastDate);
          const diffDays = Math.round((new Date(today) - last) / (1000 * 3600 * 24));
          state.streak = diffDays === 1 ? (parsed.streak + 1) : 1;
          state.todayScore = 0;
          state.completedModes = {};
          state.personalBest = parsed.personalBest || 0;
          state.badges = parsed.badges || ['Brain Explorer'];
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
    if (modeName) {
      this.state.completedModes[modeName] = true;
    }

    if (this.state.streak >= 3 && !this.state.badges.includes('3-Day Focus')) {
      this.state.badges.push('3-Day Focus');
    }
    if (this.state.todayScore >= 500 && !this.state.badges.includes('Cognitive Master')) {
      this.state.badges.push('Cognitive Master');
    }

    this.saveState();
  }

  init() {
    this.bindNav();
    this.updateDashboardUI();
    this.loadGame(this.currentMode);
  }

  bindNav() {
    const tabs = document.querySelectorAll('.mg-mode-tab');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.currentMode = btn.dataset.mode;
        this.loadGame(this.currentMode);
      });
    });
  }

  updateDashboardUI() {
    const streakEl = document.getElementById('mg-streak-count');
    const scoreEl = document.getElementById('mg-today-score');
    const bestEl = document.getElementById('mg-personal-best');
    const badgesEl = document.getElementById('mg-badges-list');

    if (streakEl) streakEl.textContent = `${this.state.streak} ${this.state.streak === 1 ? 'day' : 'days'}`;
    if (scoreEl) scoreEl.textContent = `${this.state.todayScore} pts`;
    if (bestEl) bestEl.textContent = `${this.state.personalBest} pts`;
    if (badgesEl) {
      badgesEl.innerHTML = this.state.badges.map(b => `<span class="mg-badge-pill">🏅 ${b}</span>`).join('');
    }
  }

  loadGame(mode) {
    const arena = document.getElementById('mg-game-arena');
    if (!arena) return;

    if (mode === 'wordle') {
      new WordleGame(arena, this);
    } else if (mode === 'memory-matrix') {
      new MemoryMatrixGame(arena, this);
    } else if (mode === 'speed-stroop') {
      new SpeedStroopGame(arena, this);
    } else if (mode === 'math-24') {
      new Math24Game(arena, this);
    } else if (mode === 'dual-reflex') {
      new DualReflexGame(arena, this);
    }
  }
}

/* =========================================================================
   GAME 1: WORDLE DAILY (5-Letter Word Deduction)
   ========================================================================= */
class WordleGame {
  constructor(container, hub) {
    this.container = container;
    this.hub = hub;
    const words = ['FOCUS', 'CLIMB', 'BRAIN', 'SMART', 'PRIME', 'PEACE', 'LIGHT', 'OCEAN', 'SOLAR', 'LOGIC', 'EARTH', 'QUEST', 'POWER', 'FRESH'];
    const day = new Date().getDate();
    this.targetWord = words[day % words.length];
    this.maxGuesses = 6;
    this.guesses = [];
    this.currentGuess = '';
    this.gameOver = false;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-wrapper wordle-wrapper">
        <div class="game-header-bar">
          <div>
            <h3 style="margin:0; font-size:1.15rem;">🟩 Wordle Daily</h3>
            <p style="margin:0.2rem 0 0; font-size:0.8rem; color:var(--text-muted);">Guess the secret 5-letter word in 6 attempts</p>
          </div>
          <button class="btn-game-action" id="wordle-hint-btn">💡 Hint</button>
        </div>

        <div class="wordle-grid" id="wordle-grid">
          ${this.renderGridHTML()}
        </div>

        <div id="wordle-message" class="game-status-msg">Type letters or use virtual keyboard</div>

        <div class="wordle-keyboard" id="wordle-keyboard">
          <div class="kb-row">
            ${'QWERTYUIOP'.split('').map(k => `<button class="kb-key" data-key="${k}">${k}</button>`).join('')}
          </div>
          <div class="kb-row">
            ${'ASDFGHJKL'.split('').map(k => `<button class="kb-key" data-key="${k}">${k}</button>`).join('')}
          </div>
          <div class="kb-row">
            <button class="kb-key kb-action" data-key="ENTER">ENTER</button>
            ${'ZXCVBNM'.split('').map(k => `<button class="kb-key" data-key="${k}">${k}</button>`).join('')}
            <button class="kb-key kb-action" data-key="BACKSPACE">⌫</button>
          </div>
        </div>
      </div>
    `;
  }

  renderGridHTML() {
    let rowsHtml = '';
    for (let r = 0; r < this.maxGuesses; r++) {
      const isCurrentRow = r === this.guesses.length;
      const guess = this.guesses[r] || (isCurrentRow ? this.currentGuess : '');
      rowsHtml += `<div class="wordle-row">`;
      for (let c = 0; c < 5; c++) {
        const char = guess[c] || '';
        let tileClass = 'wordle-tile';
        if (r < this.guesses.length) {
          const targetChar = this.targetWord[c];
          if (char === targetChar) {
            tileClass += ' tile-correct';
          } else if (this.targetWord.includes(char)) {
            tileClass += ' tile-present';
          } else {
            tileClass += ' tile-absent';
          }
        } else if (char) {
          tileClass += ' tile-active';
        }
        rowsHtml += `<div class="${tileClass}">${char}</div>`;
      }
      rowsHtml += `</div>`;
    }
    return rowsHtml;
  }

  bindEvents() {
    this.keyHandler = (e) => {
      if (this.gameOver) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER') this.handleEnter();
      else if (key === 'BACKSPACE') this.handleBackspace();
      else if (/^[A-Z]$/.test(key)) this.handleChar(key);
    };

    window.addEventListener('keydown', this.keyHandler);

    this.container.querySelectorAll('.kb-key').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.gameOver) return;
        const key = btn.dataset.key;
        if (key === 'ENTER') this.handleEnter();
        else if (key === 'BACKSPACE') this.handleBackspace();
        else this.handleChar(key);
      });
    });

    const hintBtn = this.container.querySelector('#wordle-hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        const msg = this.container.querySelector('#wordle-message');
        if (msg) msg.textContent = `💡 Hint: First letter is "${this.targetWord[0]}" and contains vowel "${this.targetWord.match(/[AEIOU]/)?.[0] || 'E'}"`;
      });
    }
  }

  handleChar(char) {
    if (this.currentGuess.length < 5) {
      this.currentGuess += char;
      this.updateGrid();
    }
  }

  handleBackspace() {
    if (this.currentGuess.length > 0) {
      this.currentGuess = this.currentGuess.slice(0, -1);
      this.updateGrid();
    }
  }

  handleEnter() {
    const msg = this.container.querySelector('#wordle-message');
    if (this.currentGuess.length !== 5) {
      if (msg) msg.textContent = '⚠️ Word must be 5 letters!';
      return;
    }

    this.guesses.push(this.currentGuess);
    const win = this.currentGuess === this.targetWord;
    this.currentGuess = '';
    this.updateGrid();

    if (win) {
      this.gameOver = true;
      const pts = (this.maxGuesses - this.guesses.length + 1) * 50;
      this.hub.addScore(pts, 'wordle');
      if (msg) msg.innerHTML = `🎉 <strong>Brilliant!</strong> Solved in ${this.guesses.length} attempts (+${pts} pts)!`;
      window.removeEventListener('keydown', this.keyHandler);
    } else if (this.guesses.length >= this.maxGuesses) {
      this.gameOver = true;
      if (msg) msg.innerHTML = `Game Over! The word was <strong>${this.targetWord}</strong>. Better luck tomorrow!`;
      window.removeEventListener('keydown', this.keyHandler);
    } else {
      if (msg) msg.textContent = `${this.maxGuesses - this.guesses.length} attempts remaining`;
    }
  }

  updateGrid() {
    const grid = this.container.querySelector('#wordle-grid');
    if (grid) grid.innerHTML = this.renderGridHTML();
  }
}

/* =========================================================================
   GAME 2: MEMORY MATRIX (Spatial Working Memory Flash)
   ========================================================================= */
class MemoryMatrixGame {
  constructor(container, hub) {
    this.container = container;
    this.hub = hub;
    this.level = 1;
    this.gridSize = 4; // 4x4
    this.targetCount = 4;
    this.targets = new Set();
    this.selected = new Set();
    this.isMemorizing = false;
    this.render();
    this.startRound();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-wrapper matrix-wrapper">
        <div class="game-header-bar">
          <div>
            <h3 style="margin:0; font-size:1.15rem;">🧩 Memory Matrix</h3>
            <p style="margin:0.2rem 0 0; font-size:0.8rem; color:var(--text-muted);">Memorize the lit tiles before they turn blank</p>
          </div>
          <div style="font-size:0.85rem; font-weight:700; color:var(--sp-accent);" id="matrix-lvl-display">Level 1 • 4 Tiles</div>
        </div>

        <div id="matrix-message" class="game-status-msg">Memorize the pattern...</div>
        <div class="matrix-grid-box" id="matrix-grid-box"></div>
        <div style="margin-top:1rem; text-align:center;">
          <button class="btn-dhyan-primary" id="matrix-restart-btn" style="padding:0.4rem 1.2rem; font-size:0.82rem;">Restart Test</button>
        </div>
      </div>
    `;

    this.container.querySelector('#matrix-restart-btn').addEventListener('click', () => {
      this.level = 1;
      this.gridSize = 4;
      this.targetCount = 4;
      this.startRound();
    });
  }

  startRound() {
    this.selected.clear();
    this.targets.clear();
    const totalTiles = this.gridSize * this.gridSize;

    // Pick random target indices
    while (this.targets.size < this.targetCount) {
      const idx = Math.floor(Math.random() * totalTiles);
      this.targets.add(idx);
    }

    const gridBox = this.container.querySelector('#matrix-grid-box');
    const msg = this.container.querySelector('#matrix-message');
    const lvlDisplay = this.container.querySelector('#matrix-lvl-display');
    if (lvlDisplay) lvlDisplay.textContent = `Level ${this.level} • ${this.targetCount} Tiles`;

    // Render grid with lit tiles
    gridBox.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    let html = '';
    for (let i = 0; i < totalTiles; i++) {
      const isTarget = this.targets.has(i);
      html += `<div class="matrix-tile ${isTarget ? 'tile-flash' : ''}" data-idx="${i}"></div>`;
    }
    gridBox.innerHTML = html;

    if (msg) msg.textContent = '👀 Memorizing... (2 seconds)';
    this.isMemorizing = true;

    setTimeout(() => {
      // Hide lit tiles
      gridBox.querySelectorAll('.matrix-tile').forEach(t => t.classList.remove('tile-flash'));
      if (msg) msg.textContent = '👉 Tap all the tiles you remember!';
      this.isMemorizing = false;
      this.bindTileClicks();
    }, 2000);
  }

  bindTileClicks() {
    const tiles = this.container.querySelectorAll('.matrix-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        if (this.isMemorizing) return;
        const idx = parseInt(tile.dataset.idx, 10);
        if (this.selected.has(idx)) return;

        this.selected.add(idx);
        const msg = this.container.querySelector('#matrix-message');

        if (this.targets.has(idx)) {
          tile.classList.add('tile-correct');
          // Check win
          if (this.selected.size === this.targets.size) {
            const pts = this.targetCount * 25;
            this.hub.addScore(pts, 'memory-matrix');
            if (msg) msg.innerHTML = `🎉 <strong>Perfect Recall!</strong> (+${pts} pts)`;
            setTimeout(() => {
              this.level++;
              if (this.level % 2 === 0 && this.targetCount < 8) this.targetCount++;
              if (this.level >= 4) this.gridSize = 5;
              this.startRound();
            }, 1200);
          }
        } else {
          tile.classList.add('tile-wrong');
          if (msg) msg.innerHTML = `❌ <strong>Missed!</strong> Try Level ${this.level} again.`;
          setTimeout(() => this.startRound(), 1500);
        }
      });
    });
  }
}

/* =========================================================================
   GAME 3: SPEED STROOP (Cognitive Inhibition & Reflex Challenge)
   ========================================================================= */
class SpeedStroopGame {
  constructor(container, hub) {
    this.container = container;
    this.hub = hub;
    this.colors = [
      { name: 'RED', hex: '#ef4444' },
      { name: 'BLUE', hex: '#3b82f6' },
      { name: 'GREEN', hex: '#22c55e' },
      { name: 'YELLOW', hex: '#eab308' },
      { name: 'PURPLE', hex: '#a855f7' }
    ];
    this.score = 0;
    this.timeLeft = 30;
    this.timer = null;
    this.currentStimulus = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-wrapper stroop-wrapper">
        <div class="game-header-bar">
          <div>
            <h3 style="margin:0; font-size:1.15rem;">⚡ Speed Stroop Reflex</h3>
            <p style="margin:0.2rem 0 0; font-size:0.8rem; color:var(--text-muted);">Tap the INK COLOR of the word, ignore what it reads!</p>
          </div>
          <div style="font-size:0.9rem; font-weight:800; color:var(--sp-accent);" id="stroop-timer">⏱️ 30s</div>
        </div>

        <div class="stroop-arena" id="stroop-arena">
          <div id="stroop-prompt-box">
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">Click 'Start Sprint' to test reaction speed & inhibition</p>
            <button class="btn-dhyan-primary" id="stroop-start-btn" style="padding:0.75rem 2rem; font-size:0.95rem;">Start 30s Sprint</button>
          </div>
        </div>

        <div class="stroop-btn-grid" id="stroop-btn-grid" style="display:none;">
          ${this.colors.map(c => `<button class="stroop-color-btn" data-color="${c.name}" style="border-bottom:3px solid ${c.hex};">${c.name}</button>`).join('')}
        </div>
      </div>
    `;

    this.container.querySelector('#stroop-start-btn').addEventListener('click', () => this.startSprint());
  }

  startSprint() {
    this.score = 0;
    this.timeLeft = 30;
    const btnGrid = this.container.querySelector('#stroop-btn-grid');
    if (btnGrid) btnGrid.style.display = 'grid';

    this.nextRound();

    this.timer = setInterval(() => {
      this.timeLeft--;
      const timerEl = this.container.querySelector('#stroop-timer');
      if (timerEl) timerEl.textContent = `⏱️ ${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.endSprint();
      }
    }, 1000);

    btnGrid.querySelectorAll('.stroop-color-btn').forEach(b => {
      b.onclick = () => {
        const chosen = b.dataset.color;
        if (chosen === this.currentStimulus.ink.name) {
          this.score += 20;
          this.nextRound();
        } else {
          this.score = Math.max(0, this.score - 10);
          this.nextRound();
        }
      };
    });
  }

  nextRound() {
    const textItem = this.colors[Math.floor(Math.random() * this.colors.length)];
    // Pick different ink
    let inkItem = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.currentStimulus = { text: textItem, ink: inkItem };

    const arena = this.container.querySelector('#stroop-arena');
    if (arena) {
      arena.innerHTML = `
        <div class="stroop-word" style="color:${inkItem.hex}; font-size:3.5rem; font-weight:900; letter-spacing:0.08em; text-transform:uppercase;">
          ${textItem.name}
        </div>
        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.5rem;">Score: <strong>${this.score} pts</strong></div>
      `;
    }
  }

  endSprint() {
    const arena = this.container.querySelector('#stroop-arena');
    const btnGrid = this.container.querySelector('#stroop-btn-grid');
    if (btnGrid) btnGrid.style.display = 'none';

    this.hub.addScore(this.score, 'speed-stroop');
    if (arena) {
      arena.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:2.5rem;">🏆</div>
          <h4 style="font-size:1.3rem; margin:0.35rem 0;">Sprint Finished!</h4>
          <p style="font-size:1rem; color:var(--sp-accent); font-weight:700;">Final Score: ${this.score} pts</p>
          <button class="btn-dhyan-primary" id="stroop-retry-btn" style="margin-top:0.75rem; padding:0.5rem 1.5rem;">Try Again</button>
        </div>
      `;
      this.container.querySelector('#stroop-retry-btn').addEventListener('click', () => this.startSprint());
    }
  }
}

/* =========================================================================
   GAME 4: MATH 24 / TARGET MERGE (Mental Arithmetic Engine)
   ========================================================================= */
class Math24Game {
  constructor(container, hub) {
    this.container = container;
    this.hub = hub;
    const puzzles = [
      { numbers: [3, 8, 4, 2], target: 24, solution: '(8 - 2) * (4 / 1) or (3 * 8)' },
      { numbers: [6, 4, 3, 2], target: 24, solution: '(6 - 2) * (3 + 3)' },
      { numbers: [5, 5, 5, 1], target: 24, solution: '(5 - (1 / 5)) * 5 = 24' },
      { numbers: [7, 3, 3, 1], target: 24, solution: '(7 + 1) * (3 * 3)' }
    ];
    this.puzzle = puzzles[new Date().getDate() % puzzles.length];
    this.currentExpression = '';
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-wrapper math-wrapper">
        <div class="game-header-bar">
          <div>
            <h3 style="margin:0; font-size:1.15rem;">🎯 Math 24: Target Hit</h3>
            <p style="margin:0.2rem 0 0; font-size:0.8rem; color:var(--text-muted);">Combine the 4 numbers with +, -, ×, ÷ to reach target <strong>${this.puzzle.target}</strong></p>
          </div>
          <div style="font-size:1rem; font-weight:800; color:var(--fc-accent);">Target: ${this.puzzle.target}</div>
        </div>

        <div class="math-expr-display" id="math-display">Click numbers and operators below</div>

        <div class="math-controls-container">
          <div class="math-num-row">
            ${this.puzzle.numbers.map((n, i) => `<button class="btn-math-num" data-val="${n}">${n}</button>`).join('')}
          </div>
          <div class="math-op-row">
            ${['+', '-', '*', '/'].map(op => `<button class="btn-math-op" data-op="${op}">${op === '*' ? '×' : (op === '/' ? '÷' : op)}</button>`).join('')}
            <button class="btn-math-action" id="math-clear">Clear</button>
            <button class="btn-math-action" id="math-check" style="background:var(--sp-accent); color:#fff;">Check</button>
          </div>
        </div>

        <div id="math-result-msg" class="game-status-msg"></div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const display = this.container.querySelector('#math-display');
    const msg = this.container.querySelector('#math-result-msg');

    this.container.querySelectorAll('.btn-math-num').forEach(b => {
      b.addEventListener('click', () => {
        this.currentExpression += b.dataset.val + ' ';
        display.textContent = this.currentExpression;
        b.disabled = true;
      });
    });

    this.container.querySelectorAll('.btn-math-op').forEach(b => {
      b.addEventListener('click', () => {
        this.currentExpression += b.dataset.op + ' ';
        display.textContent = this.currentExpression;
      });
    });

    this.container.querySelector('#math-clear').addEventListener('click', () => {
      this.currentExpression = '';
      display.textContent = 'Cleared';
      msg.textContent = '';
      this.container.querySelectorAll('.btn-math-num').forEach(b => b.disabled = false);
    });

    this.container.querySelector('#math-check').addEventListener('click', () => {
      try {
        // Safe evaluation
        const clean = this.currentExpression.replace(/[^0-9+\-*/().]/g, '');
        const val = Function(`'use strict'; return (${clean})`)();
        if (Math.abs(val - this.puzzle.target) < 0.001) {
          msg.innerHTML = `🎉 <strong>Target Hit (${val})!</strong> Solved successfully (+100 pts)`;
          this.hub.addScore(100, 'math-24');
        } else {
          msg.innerHTML = `Result is <strong>${val}</strong> (Target is ${this.puzzle.target}). Keep trying!`;
        }
      } catch (e) {
        msg.textContent = '⚠️ Invalid math expression. Try again.';
      }
    });
  }
}

/* =========================================================================
   GAME 5: DUAL FOCUS REFLEX (Rule Switching & Cognitive Flexibility)
   ========================================================================= */
class DualReflexGame {
  constructor(container, hub) {
    this.container = container;
    this.hub = hub;
    this.round = 1;
    this.score = 0;
    this.rule = 'SHAPE'; // SHAPE or COLOR
    this.render();
    this.startRound();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-wrapper reflex-wrapper">
        <div class="game-header-bar">
          <div>
            <h3 style="margin:0; font-size:1.15rem;">🧠 Dual Focus Rule Switcher</h3>
            <p style="margin:0.2rem 0 0; font-size:0.8rem; color:var(--text-muted);">Match the stimulus to the active rule! Rule changes dynamically.</p>
          </div>
          <div style="font-size:0.85rem; font-weight:800; color:var(--sp-accent);" id="reflex-score">Score: 0 pts</div>
        </div>

        <div class="reflex-rule-banner" id="reflex-rule-banner">ACTIVE RULE: MATCH BY SHAPE</div>

        <div class="reflex-arena" id="reflex-arena"></div>

        <div class="reflex-choice-row" id="reflex-choices"></div>

        <div id="reflex-msg" class="game-status-msg" style="margin-top:0.75rem;"></div>
      </div>
    `;
  }

  startRound() {
    if (this.round > 10) {
      const arena = this.container.querySelector('#reflex-arena');
      const banner = this.container.querySelector('#reflex-rule-banner');
      const choices = this.container.querySelector('#reflex-choices');
      const msg = this.container.querySelector('#reflex-msg');

      banner.textContent = 'SESSION COMPLETED!';
      arena.innerHTML = `<div style="font-size:2.5rem; text-align:center;">🏆<br><span style="font-size:1.1rem;">Agility Score: ${this.score} pts</span></div>`;
      choices.innerHTML = `<button class="btn-dhyan-primary" id="reflex-restart" style="margin:0 auto; padding:0.5rem 1.5rem;">Play Again</button>`;
      msg.textContent = 'Excellent cognitive flexibility!';
      this.hub.addScore(this.score, 'dual-reflex');
      this.container.querySelector('#reflex-restart').addEventListener('click', () => {
        this.round = 1;
        this.score = 0;
        this.startRound();
      });
      return;
    }

    // Switch rule every 3 rounds
    this.rule = (this.round % 4 === 1 || this.round % 4 === 2) ? 'SHAPE' : 'COLOR';
    const banner = this.container.querySelector('#reflex-rule-banner');
    if (banner) {
      banner.textContent = `ACTIVE RULE: MATCH BY ${this.rule}`;
      banner.style.background = this.rule === 'SHAPE' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(234, 179, 8, 0.15)';
      banner.style.color = this.rule === 'SHAPE' ? '#60a5fa' : '#facc15';
    }

    const shapes = ['▲ Triangle', '● Circle', '■ Square'];
    const colors = ['#ef4444', '#3b82f6', '#22c55e'];

    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];

    const arena = this.container.querySelector('#reflex-arena');
    if (arena) {
      arena.innerHTML = `
        <div style="font-size:2.5rem; color:${targetColor}; font-weight:900;">
          ${targetShape}
        </div>
      `;
    }

    // Generate 2 choices: 1 correct, 1 distractor
    let correctChoice, distractorChoice;
    if (this.rule === 'SHAPE') {
      correctChoice = { shape: targetShape, color: colors.find(c => c !== targetColor) };
      distractorChoice = { shape: shapes.find(s => s !== targetShape), color: targetColor };
    } else {
      correctChoice = { shape: shapes.find(s => s !== targetShape), color: targetColor };
      distractorChoice = { shape: targetShape, color: colors.find(c => c !== targetColor) };
    }

    const options = Math.random() > 0.5 ? [correctChoice, distractorChoice] : [distractorChoice, correctChoice];

    const choices = this.container.querySelector('#reflex-choices');
    choices.innerHTML = options.map(opt => `
      <button class="btn-reflex-choice" data-iscorrect="${opt === correctChoice}" style="color:${opt.color}; border-color:${opt.color};">
        ${opt.shape}
      </button>
    `).join('');

    choices.querySelectorAll('.btn-reflex-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.iscorrect === 'true';
        const msg = this.container.querySelector('#reflex-msg');
        if (isCorrect) {
          this.score += 20;
          if (msg) msg.textContent = '✅ Correct!';
        } else {
          if (msg) msg.textContent = '❌ Wrong rule application!';
        }
        const scoreEl = this.container.querySelector('#reflex-score');
        if (scoreEl) scoreEl.textContent = `Score: ${this.score} pts`;
        this.round++;
        setTimeout(() => this.startRound(), 600);
      });
    });
  }
}
