/**
 * DAILY BRIEF - DHYAN (HINDU 5-MINUTE MEDITATION ENGINE)
 * Authentic pranayama timer, Web Audio Om drone / singing bowl, and mindfulness guidance
 */

export class DhyanSession {
  constructor() {
    this.totalSeconds = 300; // 5 minutes
    this.remainingSeconds = 300;
    this.isRunning = false;
    this.timerInterval = null;
    this.audioContext = null;
    this.isMuted = true;
    this.droneOscillators = [];
    this.breathPhase = 'inhale'; // inhale (4s), hold (4s), exhale (6s)
    this.breathCycleTimer = null;
    
    this.init();
  }

  init() {
    this.bindControls();
  }

  bindControls() {
    const startBtn = document.getElementById('dhyan-start-btn');
    const pauseBtn = document.getElementById('dhyan-pause-btn');
    const resetBtn = document.getElementById('dhyan-reset-btn');
    const soundToggle = document.getElementById('dhyan-sound-toggle');
    const fullscreenBtn = document.getElementById('dhyan-fullscreen-btn');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        soundToggle.textContent = this.isMuted ? '🔇 Sound: Muted' : '🔔 Sound: OM Resonance';
        soundToggle.classList.toggle('active', !this.isMuted);
        if (this.isRunning) {
          if (this.isMuted) this.stopAudio();
          else this.startAudio();
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const box = document.getElementById('meditation-player-box');
        if (!document.fullscreenElement) {
          box.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const startBtn = document.getElementById('dhyan-start-btn');
    const pauseBtn = document.getElementById('dhyan-pause-btn');
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-flex';

    if (!this.isMuted) {
      this.startAudio();
    }

    this.startBreathingCycle();

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.remainingSeconds <= 0) {
        this.completeSession();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    clearTimeout(this.breathCycleTimer);
    this.stopAudio();

    const startBtn = document.getElementById('dhyan-start-btn');
    const pauseBtn = document.getElementById('dhyan-pause-btn');
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Resume Meditation';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breath-prompt-text');
    if (circle) circle.className = 'breathing-circle';
    if (text) text.textContent = 'Paused';
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    this.updateTimerDisplay();

    const startBtn = document.getElementById('dhyan-start-btn');
    if (startBtn) startBtn.textContent = 'Begin 5-Min Dhyan';

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breath-prompt-text');
    if (circle) circle.className = 'breathing-circle';
    if (text) text.textContent = 'Ready';
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const el = document.getElementById('meditation-timer-display');
    if (el) el.textContent = str;
  }

  startBreathingCycle() {
    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breath-prompt-text');
    if (!circle || !text) return;

    // 4-4-6 Pranayama Breathing Rhythm
    const stepInhale = () => {
      if (!this.isRunning) return;
      circle.className = 'breathing-circle inhale';
      text.textContent = 'Breathe In... (4s)';
      this.playBellChime(432); // gentle harmonic chime
      this.breathCycleTimer = setTimeout(stepHold, 4000);
    };

    const stepHold = () => {
      if (!this.isRunning) return;
      circle.className = 'breathing-circle hold';
      text.textContent = 'Hold Stillness... (4s)';
      this.breathCycleTimer = setTimeout(stepExhale, 4000);
    };

    const stepExhale = () => {
      if (!this.isRunning) return;
      circle.className = 'breathing-circle exhale';
      text.textContent = 'Release & Surrender... (6s)';
      this.playBellChime(324);
      this.breathCycleTimer = setTimeout(stepInhale, 6000);
    };

    stepInhale();
  }

  /* Web Audio API Native Synthesis for Sacred Om Resonance (136.1 Hz) */
  initAudio() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  startAudio() {
    try {
      this.initAudio();
      this.stopAudio();

      const ctx = this.audioContext;
      const baseFreq = 136.1; // Cosmic Om frequency (C#)

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      this.masterGain = masterGain;

      // Primary Om Fundamental
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      // Fifth Harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.value = 0.35;
      osc2.connect(gain2);
      gain2.connect(masterGain);

      // Octave Harmonic
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);
      const gain3 = ctx.createGain();
      gain3.gain.value = 0.2;
      osc3.connect(gain3);
      gain3.connect(masterGain);

      osc1.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      this.droneOscillators = [osc1, osc2, osc3];
    } catch (e) {
      console.warn('Audio init error:', e);
    }
  }

  stopAudio() {
    try {
      if (this.masterGain && this.audioContext) {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.5);
      }
      setTimeout(() => {
        this.droneOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        this.droneOscillators = [];
      }, 500);
    } catch (e) {}
  }

  playBellChime(freq = 432) {
    if (this.isMuted) return;
    try {
      this.initAudio();
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch (e) {}
  }

  completeSession() {
    this.pause();
    const box = document.getElementById('meditation-player-box');
    if (box) {
      box.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1.25rem; text-align:center; padding:2rem;">
          <div style="font-size:3rem;">🙏</div>
          <h3 style="font-family:var(--font-sanskrit); font-size:2rem; color:#fef08a;">ॐ शान्तिः शान्तिः शान्तिः</h3>
          <p style="font-size:1.1rem; color:var(--text-primary); max-width:500px;">
            Your 5-minute Dhyan is complete. Carry this unshakeable stillness into your studies and work today.
          </p>
          <button id="dhyan-restart-btn" class="btn-dhyan-primary" style="margin-top:1rem;">Practice Again</button>
        </div>
      `;
      document.getElementById('dhyan-restart-btn')?.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
}
