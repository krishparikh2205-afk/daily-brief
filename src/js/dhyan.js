/**
 * WORLDLY AFFAIRS AT YOUR COMFORT - DHYAN & HINDI GITA
 * 1. Bhagavad Gita in Clear Simple Hindi (सरल हिंदी अर्थ और जीवन संदेश)
 * 2. 18x "Om Namah Shivaya" Audio Meditation Player (Guaranteed to work in all browsers)
 * 3. 18-Bead Japa Mala Visual Tracker & Breathing Ring
 */

export class DhyanSession {
  constructor() {
    this.totalChants = 18;
    this.currentChant = 0;
    this.isPlaying = false;
    this.audioContext = null;
    this.volume = 0.8;
    this.droneGain = null;
    this.droneOscs = [];
    this.chantTimeout = null;
    this.init();
  }

  init() {
    this.bindControls();
    this.renderBeads();
  }

  renderBeads() {
    const container = document.getElementById('japa-beads-container');
    if (!container) return;

    let html = '';
    for (let i = 1; i <= this.totalChants; i++) {
      html += `<div class="japa-bead" id="bead-${i}" title="Chant ${i} of 18">${i}</div>`;
    }
    container.innerHTML = html;
  }

  bindControls() {
    const startBtn = document.getElementById('om-start-btn');
    const pauseBtn = document.getElementById('om-pause-btn');
    const resetBtn = document.getElementById('om-reset-btn');
    const volSlider = document.getElementById('om-volume-slider');

    if (startBtn) {
      startBtn.addEventListener('click', () => this.start18xChanting());
    }
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.pause());
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        this.volume = parseFloat(e.target.value);
        if (this.droneGain && this.audioContext) {
          this.droneGain.gain.setValueAtTime(this.volume * 0.15, this.audioContext.currentTime);
        }
      });
    }
  }

  initAudio() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Play crystal singing bowl chime at 528 Hz (Solfeggio frequency of transformation & calm)
   */
  playBowlChime() {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;

    const freqs = [136.1, 272.2, 528, 1056]; // Cosmic Om & Bell harmonics
    freqs.forEach((freq, idx) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const peak = (0.2 / (idx + 1)) * this.volume;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  }

  /**
   * Start soft Om drone background
   */
  startOmDrone() {
    if (!this.audioContext || this.droneOscs.length > 0) return;
    const now = this.audioContext.currentTime;

    this.droneGain = this.audioContext.createGain();
    this.droneGain.gain.setValueAtTime(0.001, now);
    this.droneGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 2);
    this.droneGain.connect(this.audioContext.destination);

    // Warm chord: 136.1Hz (Om), 204.1Hz (Fifth), 272.2Hz (Octave)
    [136.1, 204.1, 272.2].forEach(f => {
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      osc.connect(this.droneGain);
      osc.start(now);
      this.droneOscs.push(osc);
    });
  }

  stopOmDrone() {
    if (this.droneGain && this.audioContext) {
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, this.audioContext.currentTime + 1);
        setTimeout(() => {
          this.droneOscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch (e) {}
          });
          this.droneOscs = [];
        }, 1100);
      } catch (e) {
        this.droneOscs = [];
      }
    }
  }

  /**
   * Speak sacred chant "ॐ नमः शिवाय" with natural vocal intonation
   */
  speakChant() {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('ॐ नमः शिवाय');
    utterance.lang = 'hi-IN';
    utterance.rate = 0.72; // slow, reverent meditative pacing
    utterance.pitch = 0.85; // deep, calming resonance
    utterance.volume = this.volume;

    // Pick Hindi or natural Indian English voice if present
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hiVoice) utterance.voice = hiVoice;

    window.speechSynthesis.speak(utterance);
  }

  start18xChanting() {
    this.initAudio();
    this.isPlaying = true;

    const startBtn = document.getElementById('om-start-btn');
    const pauseBtn = document.getElementById('om-pause-btn');
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-flex';

    this.startOmDrone();
    this.playNextChant();
  }

  playNextChant() {
    if (!this.isPlaying) return;

    if (this.currentChant >= this.totalChants) {
      this.complete18x();
      return;
    }

    this.currentChant++;
    this.updateChantUI();

    // 1. Play crystal bell chime
    this.playBowlChime();

    // 2. Play sacred verbal chant after chime onset
    setTimeout(() => {
      if (this.isPlaying) this.speakChant();
    }, 400);

    // 3. Cycle to next chant after 5.5 seconds (calm breath interval)
    this.chantTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.playNextChant();
      }
    }, 5500);
  }

  updateChantUI() {
    const statusText = document.getElementById('om-chant-status');
    const breathPrompt = document.getElementById('om-breath-prompt');
    const breathRing = document.getElementById('om-breathing-ring');

    if (statusText) {
      statusText.innerHTML = `Chant <strong>${this.currentChant}</strong> of ${this.totalChants} • <span style="color:var(--dh-gold);">ॐ नमः शिवाय</span>`;
    }

    // Light up active and completed beads
    for (let i = 1; i <= this.totalChants; i++) {
      const bead = document.getElementById(`bead-${i}`);
      if (bead) {
        if (i < this.currentChant) {
          bead.className = 'japa-bead bead-completed';
        } else if (i === this.currentChant) {
          bead.className = 'japa-bead bead-active';
        } else {
          bead.className = 'japa-bead';
        }
      }
    }

    // Breath synchronization animation
    if (breathRing && breathPrompt) {
      breathRing.classList.remove('breath-exhale');
      breathRing.classList.add('breath-inhale');
      breathPrompt.textContent = 'श्वास अंदर लें... (Deep Inhale)';

      setTimeout(() => {
        if (this.isPlaying) {
          breathRing.classList.remove('breath-inhale');
          breathRing.classList.add('breath-exhale');
          breathPrompt.textContent = 'ॐ नमः शिवाय... (Chant & Exhale)';
        }
      }, 2500);
    }
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.chantTimeout);
    window.speechSynthesis.cancel();
    this.stopOmDrone();

    const startBtn = document.getElementById('om-start-btn');
    const pauseBtn = document.getElementById('om-pause-btn');
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Resume Chanting';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';

    const breathPrompt = document.getElementById('om-breath-prompt');
    if (breathPrompt) breathPrompt.textContent = 'Paused. Click resume when ready.';
  }

  reset() {
    this.pause();
    this.currentChant = 0;
    this.renderBeads();

    const statusText = document.getElementById('om-chant-status');
    const breathPrompt = document.getElementById('om-breath-prompt');
    const startBtn = document.getElementById('om-start-btn');

    if (statusText) statusText.textContent = 'Ready for 18x Chanting (18 बार महामंत्र जप)';
    if (breathPrompt) breathPrompt.textContent = 'आँखें बंद करें, रीढ़ सीधी रखें और प्रारंभ करें';
    if (startBtn) {
      startBtn.textContent = '▶️ Start 18x Om Namah Shivaya';
      startBtn.style.display = 'inline-flex';
    }
  }

  complete18x() {
    this.isPlaying = false;
    this.stopOmDrone();
    this.playBowlChime();

    const statusText = document.getElementById('om-chant-status');
    const breathPrompt = document.getElementById('om-breath-prompt');
    const startBtn = document.getElementById('om-start-btn');
    const pauseBtn = document.getElementById('om-pause-btn');

    if (statusText) {
      statusText.innerHTML = `🎉 <strong>18 Chants Completed!</strong> ॐ शान्तिः शान्तिः शान्तिः`;
    }
    if (breathPrompt) {
      breathPrompt.innerHTML = `पूर्ण शांति एवं एकाग्रता प्राप्त हुई। आपका दिन शुभ और शक्तिशाली हो! 🪷`;
    }
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Restart 18x Chanting';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
  }
}
