/**
 * TASKHELIX EXECUTION OS — MAIN APPLICATION LOGIC
 * Reimagined Apple Obsidian Vitrine Edition
 */

// State Management & LocalStorage Key
const STORAGE_KEY = 'TASKHELIX_OS_STATE_V1';

let appState = {
  activeTab: 'cockpit',
  activeWeek: 1,
  completedTasks: {}, // key: 'w1_d0', 'w1_w0', 'w1_exp', etc.
  completedLadders: {}, // key: rung index
  trackerLogs: [],
  scheduleAudits: {}, // { [dateStr]: { [blockId]: { status: 'followed'|'deviated', activity: '', driver: '', notes: '', timestamp: '' } } }
  metrics: {
    proposalsSent: 0,
    coldEmailsSent: 0,
    loomsRecorded: 0,
    deepWorkHours: 0,
    payingClients: 0,
    mrr: 0
  }
};

let currentAuditDateStr = getTodayDateString();
let selectedDeviationActivity = '';
let selectedDeviationDriver = '';

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// Initialize State
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = { ...appState, ...parsed };
      if (!appState.scheduleAudits) appState.scheduleAudits = {};
    }
  } catch (e) {
    console.error('Error loading state from localStorage', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Error saving state to localStorage', e);
  }
}

// --------------------------------------------------------------------------
// 0. iOS Notifications & Haptics Engine
// --------------------------------------------------------------------------
const Haptics = {
  vibrate(pattern = [15]) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  },
  success() { this.vibrate([15, 30, 20]); },
  error() { this.vibrate([20, 50, 20, 50, 20]); }
};

const IOSNotifications = {
  queue: [],
  isShowing: false,
  
  show(title, message, type = 'default') {
    this.queue.push({ title, message, type });
    if (!this.isShowing) this.processQueue();
  },

  processQueue() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }
    
    this.isShowing = true;
    const notification = this.queue.shift();
    const center = document.getElementById('ios-notification-center');
    if (!center) return;

    const el = document.createElement('div');
    el.className = 'ios-notification';
    
    let icon = '🔔';
    if (notification.type === 'success') icon = '✅';
    if (notification.type === 'error') icon = '⚠️';
    if (notification.type === 'timer') icon = '⏱️';

    el.innerHTML = `
      <div class="ios-notification-icon">${icon}</div>
      <div class="ios-notification-content">
        <div class="ios-notification-title">${notification.title}</div>
        <div class="ios-notification-message">${notification.message}</div>
      </div>
    `;

    center.appendChild(el);
    Haptics.success();

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('show');
      });
    });

    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => {
        el.remove();
        this.processQueue();
      }, 400); // Wait for transition
    }, 4000);
  }
};

// Legacy shim
function showToast(msg) {
  IOSNotifications.show('TaskHelix', msg);
}

// --------------------------------------------------------------------------
// 1. Web Audio API Synthesizer (Chimes + Pure Brown Noise Generator)
// --------------------------------------------------------------------------
const AudioFX = {
  ctx: null,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playBell(freq = 528, duration = 2.0) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  },

  playBreathTone(isInhale = true) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      const startFreq = isInhale ? 220 : 330;
      const endFreq = isInhale ? 330 : 220;
      
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(endFreq, this.ctx.currentTime + 1.4);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 1.4);
    } catch (e) {
      console.warn('Audio breath tone error', e);
    }
  },

  playBuzzer() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio buzzer error', e);
    }
  }
};

// Continuous Synthesized Brown Noise Focus Generator
const FocusAudio = {
  isPlaying: false,
  sourceNode: null,
  gainNode: null,
  volume: 0.5,

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  },

  start() {
    AudioFX.init();
    if (!AudioFX.ctx) return;

    try {
      const ctx = AudioFX.ctx;
      const bufferSize = 5 * ctx.sampleRate; // 5-second seamless loop buffer
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Leaky Integrator Brown Noise formula: y[n] = (lastOut + 0.02 * white) / 1.02
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.sourceNode = ctx.createBufferSource();
      this.sourceNode.buffer = noiseBuffer;
      this.sourceNode.loop = true;

      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);

      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);

      this.sourceNode.start();
      this.isPlaying = true;
      this.render();
      showToast('Brown Noise Active. Deep work state engaged.');
    } catch (e) {
      console.warn('Error starting brown noise', e);
    }
  },

  stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (e) {}
    }
    this.isPlaying = false;
    this.render();
    showToast('Focus Audio Stopped.');
  },

  setVolume(val) {
    this.volume = Number(val);
    if (this.gainNode && AudioFX.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.4, AudioFX.ctx.currentTime);
    }
  },

  render() {
    const btn = document.getElementById('focusAudioToggleBtn');
    const statusText = document.getElementById('focusAudioStatus');
    if (btn) {
      btn.textContent = this.isPlaying ? '⏹ Stop Noise' : '▶ Start Noise';
      btn.className = this.isPlaying ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
    }
    if (statusText) {
      statusText.textContent = this.isPlaying ? '● Playing' : 'Paused';
      statusText.style.color = this.isPlaying ? 'var(--color-emerald-active)' : 'var(--color-platinum)';
    }
  }
};

// --------------------------------------------------------------------------
// 2. Real-Time Chronometer & 24-Hour Shift Ribbon
// --------------------------------------------------------------------------
function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getBlockDurationMinutes(startStr, endStr) {
  const startMin = parseTimeToMinutes(startStr);
  const endMin = parseTimeToMinutes(endStr);
  if (startMin < endMin) {
    return endMin - startMin;
  } else {
    return (1440 - startMin) + endMin;
  }
}

function getCurrentShiftBlock(currentTime = new Date()) {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  
  for (const block of TASKHELIX_DATA.scheduleBlocks) {
    const startMin = parseTimeToMinutes(block.start);
    const endMin = parseTimeToMinutes(block.end);
    
    let isInside = false;
    let totalBlockMinutes = 0;
    let minutesPassed = 0;

    if (startMin < endMin) {
      if (currentMinutes >= startMin && currentMinutes < endMin) {
        isInside = true;
        totalBlockMinutes = endMin - startMin;
        minutesPassed = currentMinutes - startMin;
      }
    } else {
      if (currentMinutes >= startMin || currentMinutes < endMin) {
        isInside = true;
        totalBlockMinutes = (1440 - startMin) + endMin;
        if (currentMinutes >= startMin) {
          minutesPassed = currentMinutes - startMin;
        } else {
          minutesPassed = (1440 - startMin) + currentMinutes;
        }
      }
    }

    if (isInside) {
      const remainingMinutes = totalBlockMinutes - minutesPassed - 1;
      const remainingSeconds = 60 - seconds;
      return {
        block,
        progress: Math.min(100, Math.round(((minutesPassed * 60 + seconds) / (totalBlockMinutes * 60)) * 100)),
        remainingMinutes,
        remainingSeconds: remainingSeconds === 60 ? 0 : remainingSeconds
      };
    }
  }

  return {
    block: TASKHELIX_DATA.scheduleBlocks[0],
    progress: 0,
    remainingMinutes: 0,
    remainingSeconds: 0
  };
}

let lastRenderedBlockId = null;

function updateChronometer() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  
  const liveClockEl = document.getElementById('liveClock');
  if (liveClockEl && liveClockEl.textContent !== timeStr) {
    liveClockEl.textContent = timeStr;
  }

  const currentInfo = getCurrentShiftBlock(now);
  const activeBlockNameEl = document.getElementById('activeBlockName');
  
  if (activeBlockNameEl && activeBlockNameEl.textContent !== currentInfo.block.name) {
    activeBlockNameEl.textContent = currentInfo.block.name;
  }

  const heroBlockTag = document.getElementById('heroBlockTag');
  const heroCountdown = document.getElementById('heroCountdown');
  const heroInstruction = document.getElementById('heroInstruction');
  const heroDescription = document.getElementById('heroDescription');
  const heroProgressBar = document.getElementById('heroProgressBar');

  if (heroBlockTag && heroBlockTag.textContent !== currentInfo.block.name) {
    heroBlockTag.textContent = currentInfo.block.name;
  }
  if (heroCountdown) {
    const remM = String(currentInfo.remainingMinutes).padStart(2, '0');
    const remS = String(currentInfo.remainingSeconds).padStart(2, '0');
    heroCountdown.textContent = `${remM}:${remS} remaining`;
  }
  if (heroInstruction && heroInstruction.textContent !== currentInfo.block.actionText) {
    heroInstruction.textContent = currentInfo.block.actionText;
  }
  if (heroDescription && heroDescription.textContent !== currentInfo.block.activities) {
    heroDescription.textContent = currentInfo.block.activities;
  }
  if (heroProgressBar) {
    heroProgressBar.style.width = `${currentInfo.progress}%`;
  }

  if (lastRenderedBlockId !== currentInfo.block.id) {
    lastRenderedBlockId = currentInfo.block.id;
    renderShiftRibbon(currentInfo.block.id);
  }
}

function renderShiftRibbon(currentBlockId) {
  const track = document.getElementById('shiftRibbonTrack');
  if (!track) return;

  const dayAudit = appState.scheduleAudits[currentAuditDateStr] || {};

  track.innerHTML = TASKHELIX_DATA.scheduleBlocks.map(b => {
    const isCurrent = b.id === currentBlockId;
    const record = dayAudit[b.id];
    const isFollowed = record?.status === 'followed';
    const isDeviated = record?.status === 'deviated';

    let tagColor = 'var(--color-platinum)';
    let tagText = 'Pending';
    if (isFollowed) {
      tagColor = 'var(--color-emerald-active)';
      tagText = 'Followed';
    } else if (isDeviated) {
      tagColor = 'var(--color-signal-orange)';
      tagText = 'Deviated';
    } else if (isCurrent) {
      tagColor = 'var(--color-halo-blue)';
      tagText = 'In Progress';
    }

    return `
      <div class="ribbon-block-capsule ${isCurrent ? 'active-current' : ''}" onclick="switchTab('schedule'); openDeviationModal('${b.id}')">
        <div class="ribbon-block-time">${b.start} - ${b.end}</div>
        <div class="ribbon-block-title">${b.name}</div>
        <span class="ribbon-block-tag" style="color:${tagColor};">${tagText}</span>
      </div>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 3. Apple Activity Rings Engine (Concentric SVG Gauges)
// --------------------------------------------------------------------------
function updateActivityRings(metrics, totalLoggedMinutes) {
  // Outer Ring: Deep Work (Circumference = 2 * PI * 44 = 276.46)
  const ringDeepWork = document.getElementById('ringDeepWork');
  const legendDeepWork = document.getElementById('legendDeepWork');
  const plannedDeepWorkMin = 160;
  const executedDeepWorkMin = metrics.executedDeepWorkMin || totalLoggedMinutes || 0;
  const deepWorkPct = Math.min(1, executedDeepWorkMin / plannedDeepWorkMin);
  const deepWorkOffset = 276.46 * (1 - deepWorkPct);

  if (ringDeepWork) ringDeepWork.style.strokeDashoffset = deepWorkOffset;
  if (legendDeepWork) legendDeepWork.textContent = `${(executedDeepWorkMin / 60).toFixed(1)}h / 2.7h`;

  // Middle Ring: Adherence % (Circumference = 2 * PI * 32 = 201.06)
  const ringAdherence = document.getElementById('ringAdherence');
  const legendAdherence = document.getElementById('legendAdherence');
  const adherencePct = metrics.auditedCount > 0 ? metrics.adherencePercent / 100 : 0;
  const adherenceOffset = 201.06 * (1 - adherencePct);

  if (ringAdherence) ringAdherence.style.strokeDashoffset = adherenceOffset;
  if (legendAdherence) legendAdherence.textContent = metrics.auditedCount > 0 ? `${metrics.adherencePercent}%` : '--%';

  // Inner Ring: Avoidance Hours (Circumference = 2 * PI * 20 = 125.66)
  const ringAvoidance = document.getElementById('ringAvoidance');
  const legendAvoidance = document.getElementById('legendAvoidance');
  const avoidedDeepWorkMin = metrics.avoidedDeepWorkMin || 0;
  const avoidancePct = Math.min(1, avoidedDeepWorkMin / plannedDeepWorkMin);
  const avoidanceOffset = 125.66 * (1 - avoidancePct);

  if (ringAvoidance) ringAvoidance.style.strokeDashoffset = avoidanceOffset;
  if (legendAvoidance) legendAvoidance.textContent = `${(avoidedDeepWorkMin / 60).toFixed(1)}h`;
}

// --------------------------------------------------------------------------
// 4. Wim Hof Breathing (Video & Visual Orb Modes) & Timers Engine
// --------------------------------------------------------------------------
function setBreathingMode(mode) {
  const videoView = document.getElementById('breathingVideoView');
  const orbView = document.getElementById('breathingOrbView');
  const btnVideo = document.getElementById('btnBreathingModeVideo');
  const btnOrb = document.getElementById('btnBreathingModeOrb');

  if (mode === 'video') {
    if (videoView) videoView.style.display = 'block';
    if (orbView) orbView.style.display = 'none';
    if (btnVideo) btnVideo.classList.add('active');
    if (btnOrb) btnOrb.classList.remove('active');
  } else {
    if (videoView) videoView.style.display = 'none';
    if (orbView) orbView.style.display = 'block';
    if (btnVideo) btnVideo.classList.remove('active');
    if (btnOrb) btnOrb.classList.add('active');
  }
}

const Timers = {
  wimHof: {
    round: 1,
    maxRounds: 3,
    breathCount: 0,
    maxBreaths: 30,
    state: 'idle',
    timerId: null,
    retentionSeconds: 0,
    recoverySeconds: 15,

    start() {
      if (this.state !== 'idle') return;
      AudioFX.init();
      this.round = 1;
      this.breathCount = 0;
      this.startBreathing();
    },

    startBreathing() {
      this.state = 'breathing';
      this.breathCount = 0;
      this.render();
      
      const pacerCircle = document.getElementById('wimHofCircle');
      const pacerText = document.getElementById('wimHofCircleText');
      const statusText = document.getElementById('wimHofStatus');

      if (statusText) statusText.textContent = `Round ${this.round} of ${this.maxRounds}: Inhale / Exhale`;

      let isInhale = true;
      this.timerId = setInterval(() => {
        if (this.state !== 'breathing') return;

        if (isInhale) {
          this.breathCount++;
          if (pacerCircle) {
            pacerCircle.className = 'pacer-circle inhale';
            if (pacerText) pacerText.textContent = `IN (${this.breathCount})`;
          }
          AudioFX.playBreathTone(true);
        } else {
          if (pacerCircle) {
            pacerCircle.className = 'pacer-circle exhale';
            if (pacerText) pacerText.textContent = `OUT (${this.breathCount})`;
          }
          AudioFX.playBreathTone(false);

          if (this.breathCount >= this.maxBreaths) {
            clearInterval(this.timerId);
            this.startRetention();
            return;
          }
        }
        isInhale = !isInhale;
      }, 1500);
    },

    startRetention() {
      this.state = 'retention';
      this.retentionSeconds = 0;
      AudioFX.playBell(440, 1.5);
      
      const pacerCircle = document.getElementById('wimHofCircle');
      const pacerText = document.getElementById('wimHofCircleText');
      const statusText = document.getElementById('wimHofStatus');

      if (pacerCircle) pacerCircle.className = 'pacer-circle hold';
      if (statusText) statusText.textContent = `Round ${this.round}: Retention Hold`;

      this.timerId = setInterval(() => {
        this.retentionSeconds++;
        const mins = Math.floor(this.retentionSeconds / 60);
        const secs = this.retentionSeconds % 60;
        if (pacerText) {
          pacerText.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
        }
      }, 1000);

      const actionBtn = document.getElementById('wimHofActionBtn');
      if (actionBtn) {
        actionBtn.textContent = 'Inhale & Hold (15s)';
        actionBtn.className = 'btn btn-primary btn-sm';
      }
    },

    finishRetention() {
      clearInterval(this.timerId);
      this.startRecovery();
    },

    startRecovery() {
      this.state = 'recovery';
      this.recoverySeconds = 15;
      AudioFX.playBell(528, 1.5);

      const pacerCircle = document.getElementById('wimHofCircle');
      const pacerText = document.getElementById('wimHofCircleText');
      const statusText = document.getElementById('wimHofStatus');

      if (pacerCircle) pacerCircle.className = 'pacer-circle inhale';
      if (statusText) statusText.textContent = `Round ${this.round}: Recovery Breath (Hold 15s)`;
      if (pacerText) pacerText.textContent = '15s';

      this.timerId = setInterval(() => {
        this.recoverySeconds--;
        if (pacerText) pacerText.textContent = `${this.recoverySeconds}s`;

        if (this.recoverySeconds <= 0) {
          clearInterval(this.timerId);
          if (this.round < this.maxRounds) {
            this.round++;
            this.startBreathing();
          } else {
            this.finishAll();
          }
        }
      }, 1000);
    },

    finishAll() {
      this.state = 'idle';
      AudioFX.playBell(528, 3.0);
      IOSNotifications.show('Wim Hof Complete', 'Physiological ignition active.', 'success');
      
      const pacerCircle = document.getElementById('wimHofCircle');
      const pacerText = document.getElementById('wimHofCircleText');
      const statusText = document.getElementById('wimHofStatus');
      const actionBtn = document.getElementById('wimHofActionBtn');

      if (pacerCircle) pacerCircle.className = 'pacer-circle';
      if (pacerText) pacerText.textContent = 'Ready';
      if (statusText) statusText.textContent = '3 Rounds Complete';
      if (actionBtn) {
        actionBtn.textContent = 'Start (3 Rounds)';
        actionBtn.className = 'btn btn-secondary btn-sm';
      }
    },

    reset() {
      clearInterval(this.timerId);
      this.state = 'idle';
      this.round = 1;
      this.breathCount = 0;
      this.render();
    },

    render() {
      const pacerCircle = document.getElementById('wimHofCircle');
      const pacerText = document.getElementById('wimHofCircleText');
      const statusText = document.getElementById('wimHofStatus');
      const actionBtn = document.getElementById('wimHofActionBtn');

      if (pacerCircle) pacerCircle.className = 'pacer-circle';
      if (pacerText) pacerText.textContent = 'Ready';
      if (statusText) statusText.textContent = 'Ready for 3 Rounds';
      if (actionBtn) {
        actionBtn.textContent = 'Start Wim Hof (3 Rounds)';
        actionBtn.className = 'btn btn-secondary btn-sm';
      }
    }
  },

  meditation: {
    totalSeconds: 300,
    remainingSeconds: 300,
    timerId: null,
    isRunning: false,

    toggle() {
      AudioFX.init();
      if (this.isRunning) {
        this.pause();
      } else {
        this.start();
      }
    },

    start() {
      this.isRunning = true;
      AudioFX.playBell(528, 2.0);
      const btn = document.getElementById('meditationToggleBtn');
      if (btn) {
        btn.textContent = 'Pause';
        btn.className = 'btn btn-secondary btn-sm';
      }

      this.timerId = setInterval(() => {
        this.remainingSeconds--;
        this.render();

        if (this.remainingSeconds === 150) {
          AudioFX.playBell(440, 1.5);
        }

        if (this.remainingSeconds <= 0) {
          this.finish();
        }
      }, 1000);
    },

    pause() {
      this.isRunning = false;
      clearInterval(this.timerId);
      const btn = document.getElementById('meditationToggleBtn');
      if (btn) {
        btn.textContent = 'Resume';
        btn.className = 'btn btn-primary btn-sm';
      }
    },

    reset() {
      this.pause();
      this.remainingSeconds = 300;
      this.render();
      const btn = document.getElementById('meditationToggleBtn');
      if (btn) btn.textContent = 'Start 5m Meditation';
    },

    finish() {
      this.pause();
      AudioFX.playBell(528, 4.0);
      showToast('Meditation Completed! Focus locked.');
      this.remainingSeconds = 300;
      this.render();
      const btn = document.getElementById('meditationToggleBtn');
      if (btn) btn.textContent = 'Start 5m Meditation';
    },

    render() {
      const display = document.getElementById('meditationDigits');
      if (display) {
        const m = Math.floor(this.remainingSeconds / 60);
        const s = this.remainingSeconds % 60;
        display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }
  },

  freezeReset: {
    totalSeconds: 120,
    remainingSeconds: 120,
    timerId: null,
    isRunning: false,

    start() {
      AudioFX.init();
      AudioFX.playBuzzer();
      this.remainingSeconds = 120;
      this.isRunning = true;

      const btn = document.getElementById('freezeResetBtn');
      if (btn) btn.textContent = 'Reset Active (Move Body!)';

      clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.remainingSeconds--;
        this.render();

        if (this.remainingSeconds <= 0) {
          this.finish();
        }
      }, 1000);
    },

    finish() {
      clearInterval(this.timerId);
      this.isRunning = false;
      AudioFX.playBell(528, 2.5);
      showToast('2-Minute Reset Finished. Execute ONLY 1 micro-sentence.');
      this.remainingSeconds = 120;
      this.render();
      const btn = document.getElementById('freezeResetBtn');
      if (btn) btn.textContent = 'Start 2-Min Reset';
    },

    render() {
      const display = document.getElementById('freezeDigits');
      if (display) {
        const m = Math.floor(this.remainingSeconds / 60);
        const s = this.remainingSeconds % 60;
        display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }
  }
};

// --------------------------------------------------------------------------
// 5. SCHEDULE REALITY AUDIT (PLANNED VS ACTUAL ENGINE)
// --------------------------------------------------------------------------
function changeAuditDate(deltaDays) {
  const [y, m, d] = currentAuditDateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + deltaDays);
  
  const newY = dateObj.getFullYear();
  const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
  const newD = String(dateObj.getDate()).padStart(2, '0');
  currentAuditDateStr = `${newY}-${newM}-${newD}`;
  
  renderScheduleAudit();
  updateTopMetrics();
}

function setAuditDateToday() {
  currentAuditDateStr = getTodayDateString();
  renderScheduleAudit();
  updateTopMetrics();
}

function setBlockFollowed(blockId) {
  if (!appState.scheduleAudits[currentAuditDateStr]) {
    appState.scheduleAudits[currentAuditDateStr] = {};
  }
  
  appState.scheduleAudits[currentAuditDateStr][blockId] = {
    status: 'followed',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  };

  AudioFX.playBell(528, 1.2);
  saveState();
  renderScheduleAudit();
  updateTopMetrics();
  showToast('Block marked as Followed. Consistency logged!');
}

function openDeviationModal(blockId) {
  const block = TASKHELIX_DATA.scheduleBlocks.find(b => b.id === blockId);
  if (!block) return;

  const blockInput = document.getElementById('deviationBlockId');
  if (blockInput) blockInput.value = blockId;

  const existing = appState.scheduleAudits[currentAuditDateStr]?.[blockId];
  selectedDeviationActivity = existing?.activity || '';
  selectedDeviationDriver = existing?.driver || '';

  const notesInput = document.getElementById('deviationNotesInput');
  if (notesInput) notesInput.value = existing?.notes || '';

  renderDeviationChips();

  const modal = document.getElementById('deviationModal');
  if (modal) modal.classList.add('open');
}

function closeDeviationModal() {
  const modal = document.getElementById('deviationModal');
  if (modal) modal.classList.remove('open');
}

function renderDeviationChips() {
  const actContainer = document.getElementById('deviationActivityChips');
  const driverContainer = document.getElementById('deviationDriverChips');

  if (actContainer) {
    actContainer.innerHTML = TASKHELIX_DATA.avoidanceActivities.map(act => {
      const isSel = selectedDeviationActivity === act.label ? 'selected' : '';
      return `
        <button type="button" class="chip-btn ${isSel}" onclick="selectDeviationChip('activity', '${act.label}')">
          ${act.label}
        </button>
      `;
    }).join('');
  }

  if (driverContainer) {
    driverContainer.innerHTML = TASKHELIX_DATA.emotionalDrivers.map(dr => {
      const isSel = selectedDeviationDriver === dr.label ? 'selected' : '';
      return `
        <button type="button" class="chip-btn ${isSel}" onclick="selectDeviationChip('driver', '${dr.label}')">
          ${dr.label}
        </button>
      `;
    }).join('');
  }
}

function selectDeviationChip(type, value) {
  if (type === 'activity') {
    selectedDeviationActivity = value;
  } else if (type === 'driver') {
    selectedDeviationDriver = value;
  }
  renderDeviationChips();
}

function saveDeviationLog() {
  const blockId = document.getElementById('deviationBlockId')?.value;
  if (!blockId) return;

  if (!selectedDeviationActivity) {
    showToast('Please select what you were doing instead.');
    return;
  }

  if (!selectedDeviationDriver) {
    showToast('Please select the underlying emotional driver / why.');
    return;
  }

  const notesInput = document.getElementById('deviationNotesInput');
  const notes = notesInput ? notesInput.value.trim() : '';

  if (!appState.scheduleAudits[currentAuditDateStr]) {
    appState.scheduleAudits[currentAuditDateStr] = {};
  }

  appState.scheduleAudits[currentAuditDateStr][blockId] = {
    status: 'deviated',
    activity: selectedDeviationActivity,
    driver: selectedDeviationDriver,
    notes,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  };

  saveState();
  closeDeviationModal();
  renderScheduleAudit();
  updateTopMetrics();
  showToast('Deviation logged. Zero shame — self-awareness captured.');
}

function resetBlockAudit(blockId) {
  if (appState.scheduleAudits[currentAuditDateStr]?.[blockId]) {
    delete appState.scheduleAudits[currentAuditDateStr][blockId];
    saveState();
    renderScheduleAudit();
    updateTopMetrics();
    showToast('Block status reset to pending.');
  }
}

function calculateDailyAuditMetrics(dateStr) {
  const dayAudit = appState.scheduleAudits[dateStr] || {};
  let totalBlocks = TASKHELIX_DATA.scheduleBlocks.length;
  let followedCount = 0;
  let deviatedCount = 0;

  let plannedDeepWorkMin = 85 + 75;
  let executedDeepWorkMin = 0;
  let avoidedDeepWorkMin = 0;

  const driversTally = {};

  TASKHELIX_DATA.scheduleBlocks.forEach(b => {
    const record = dayAudit[b.id];
    const durationMin = getBlockDurationMinutes(b.start, b.end);

    if (record) {
      if (record.status === 'followed') {
        followedCount++;
        if (b.type === 'revenue' || b.type === 'build') {
          executedDeepWorkMin += durationMin;
        }
      } else if (record.status === 'deviated') {
        deviatedCount++;
        if (b.type === 'revenue' || b.type === 'build') {
          avoidedDeepWorkMin += durationMin;
        }
        if (record.driver) {
          driversTally[record.driver] = (driversTally[record.driver] || 0) + 1;
        }
      }
    }
  });

  const auditedCount = followedCount + deviatedCount;
  const adherencePercent = auditedCount > 0 ? Math.round((followedCount / auditedCount) * 100) : 0;

  let topDriver = 'None Logged (Clean Data)';
  let maxCount = 0;
  for (const [driver, count] of Object.entries(driversTally)) {
    if (count > maxCount) {
      maxCount = count;
      topDriver = driver;
    }
  }

  return {
    totalBlocks,
    auditedCount,
    followedCount,
    deviatedCount,
    adherencePercent,
    plannedDeepWorkMin,
    executedDeepWorkMin,
    avoidedDeepWorkMin,
    topDriver
  };
}

function renderScheduleAudit() {
  const dateDisplay = document.getElementById('auditDateDisplay');
  if (dateDisplay) {
    dateDisplay.textContent = formatDateDisplay(currentAuditDateStr);
  }

  const metrics = calculateDailyAuditMetrics(currentAuditDateStr);
  
  const scoreBadge = document.getElementById('auditAdherenceScoreBadge');
  if (scoreBadge) {
    scoreBadge.textContent = metrics.auditedCount > 0 ? `Adherence: ${metrics.adherencePercent}% (${metrics.followedCount}/${metrics.auditedCount} blocks)` : 'Adherence: Unaudited';
    scoreBadge.style.color = metrics.adherencePercent >= 80 ? 'var(--color-emerald-active)' : metrics.adherencePercent >= 50 ? 'var(--color-signal-orange)' : 'var(--color-platinum)';
  }

  const deepWorkText = document.getElementById('auditDeepWorkSummaryText');
  if (deepWorkText) {
    const plannedH = (metrics.plannedDeepWorkMin / 60).toFixed(1);
    const execH = (metrics.executedDeepWorkMin / 60).toFixed(1);
    const avoidH = (metrics.avoidedDeepWorkMin / 60).toFixed(1);
    deepWorkText.textContent = `Planned ${plannedH}h | Executed ${execH}h | Avoided ${avoidH}h`;
  }

  const barExec = document.getElementById('auditBarExecuted');
  const barAvoid = document.getElementById('auditBarAvoided');
  const barPending = document.getElementById('auditBarPending');

  if (barExec && barAvoid && barPending) {
    const execPercent = Math.min(100, Math.round((metrics.executedDeepWorkMin / metrics.plannedDeepWorkMin) * 100));
    const avoidPercent = Math.min(100 - execPercent, Math.round((metrics.avoidedDeepWorkMin / metrics.plannedDeepWorkMin) * 100));
    const pendingPercent = Math.max(0, 100 - execPercent - avoidPercent);

    barExec.style.width = `${execPercent}%`;
    barAvoid.style.width = `${avoidPercent}%`;
    barPending.style.width = `${pendingPercent}%`;
  }

  const topTriggerText = document.getElementById('auditTopTriggerText');
  if (topTriggerText) {
    topTriggerText.textContent = metrics.topDriver;
  }

  const container = document.getElementById('scheduleAuditListContainer');
  if (!container) return;

  const dayAudit = appState.scheduleAudits[currentAuditDateStr] || {};

  container.innerHTML = TASKHELIX_DATA.scheduleBlocks.map(block => {
    const record = dayAudit[block.id];
    const isFollowed = record?.status === 'followed';
    const isDeviated = record?.status === 'deviated';

    let statusTag = '<span class="audit-status-tag tag-pending">Pending</span>';
    let rowClass = '';

    if (isFollowed) {
      statusTag = '<span class="audit-status-tag tag-followed">✓ Followed</span>';
      rowClass = 'status-followed';
    } else if (isDeviated) {
      statusTag = '<span class="audit-status-tag tag-deviated">⚠️ Deviated</span>';
      rowClass = 'status-deviated';
    }

    let deviationDetailHtml = '';
    if (isDeviated) {
      deviationDetailHtml = `
        <div class="deviation-record-box">
          <strong>Did Instead:</strong> ${record.activity} &nbsp;|&nbsp; 
          <strong>Why:</strong> ${record.driver}
          ${record.notes ? `<br><em>Notes:</em> ${record.notes}` : ''}
        </div>
      `;
    }

    return `
      <div class="audit-block-row ${rowClass}">
        <div class="audit-block-info">
          <div class="audit-time-col">
            <div class="audit-time-range mono">${block.start} - ${block.end}</div>
            ${statusTag}
          </div>
          <div class="audit-text-col">
            <h4>${block.name}</h4>
            <p>${block.activities}</p>
            ${deviationDetailHtml}
          </div>
        </div>

        <div class="audit-actions-col">
          <button class="btn btn-sm ${isFollowed ? 'btn-primary' : 'btn-secondary'}" onclick="setBlockFollowed('${block.id}')" title="Mark as followed">
            ${isFollowed ? '✓ Done' : 'Followed'}
          </button>
          <button class="btn btn-sm btn-secondary" onclick="openDeviationModal('${block.id}')" title="Log deviation">
            ${isDeviated ? 'Edit' : 'Deviated'}
          </button>
          ${(isFollowed || isDeviated) ? `
            <button class="btn btn-sm btn-secondary" onclick="resetBlockAudit('${block.id}')" title="Reset">
              ↺
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 6. Renderers: 12-Week Roadmap & Exposure Ladder
// --------------------------------------------------------------------------
function renderRoadmap() {
  const container = document.getElementById('roadmapContainer');
  if (!container) return;

  container.innerHTML = '';

  TASKHELIX_DATA.weeks.forEach(w => {
    const isWeekExpanded = w.week === appState.activeWeek;
    const weekCard = document.createElement('div');
    weekCard.className = `week-card ${isWeekExpanded ? 'expanded active-week' : ''}`;
    weekCard.id = `week_card_${w.week}`;

    const header = document.createElement('div');
    header.className = 'week-header';
    header.onclick = () => toggleWeekCard(w.week);

    header.innerHTML = `
      <div class="week-title-wrap">
        <span class="week-num-badge mono">W${w.week}</span>
        <div>
          <div class="week-title-text">${w.title}</div>
          <div class="week-phase-pill">Phase ${w.phase}: ${w.phaseTitle}</div>
        </div>
      </div>
      <div class="week-header-right">
        <span class="discomfort-tag mono">
          Goal: ${w.successMetrics.split(';')[0]}
        </span>
        <span class="mono" style="font-size:0.8rem; color:var(--color-platinum);">${isWeekExpanded ? '▲' : '▼'}</span>
      </div>
    `;

    const body = document.createElement('div');
    body.className = 'week-body';

    let dailyCheckboxes = w.dailyActions.map((action, idx) => {
      const key = `w${w.week}_d${idx}`;
      const checked = appState.completedTasks[key] ? 'checked' : '';
      const textDone = checked ? 'done' : '';
      return `
        <div class="check-item">
          <div class="custom-checkbox ${checked}" onclick="toggleTask('${key}')">
            ${checked ? '✓' : ''}
          </div>
          <span class="check-text ${textDone}">${action}</span>
        </div>
      `;
    }).join('');

    let weeklyCheckboxes = w.weeklyActions.map((action, idx) => {
      const key = `w${w.week}_w${idx}`;
      const checked = appState.completedTasks[key] ? 'checked' : '';
      const textDone = checked ? 'done' : '';
      return `
        <div class="check-item">
          <div class="custom-checkbox ${checked}" onclick="toggleTask('${key}')">
            ${checked ? '✓' : ''}
          </div>
          <span class="check-text ${textDone}"><strong>[Weekly Priority]</strong> ${action}</span>
        </div>
      `;
    }).join('');

    const expKey = `w${w.week}_exp`;
    const expChecked = appState.completedTasks[expKey] ? 'checked' : '';
    const expDone = expChecked ? 'done' : '';

    body.innerHTML = `
      <div style="margin-bottom: 1.1rem;">
        <span class="category-eyebrow emerald">Primary Objective</span>
        <p style="color:var(--color-frost-white); font-size:0.95rem;">${w.objective}</p>
      </div>

      <div class="grid-2" style="margin-bottom: 1.1rem;">
        <div class="card" style="background:var(--color-carbon);">
          <h4 style="margin-bottom: 0.5rem; color:var(--color-frost-white);">Daily Non-Negotiables</h4>
          ${dailyCheckboxes}
        </div>
        <div class="card" style="background:var(--color-carbon);">
          <h4 style="margin-bottom: 0.5rem; color:var(--color-frost-white);">Weekly Milestone Deliverables</h4>
          ${weeklyCheckboxes}
        </div>
      </div>

      <div class="card" style="background:rgba(245, 105, 0, 0.05); border-color: rgba(245, 105, 0, 0.25); margin-bottom: 1.1rem;">
        <span class="category-eyebrow" style="color:var(--color-signal-orange);">Weekly Exposure Challenge</span>
        <div class="check-item" style="border:none;">
          <div class="custom-checkbox ${expChecked}" onclick="toggleTask('${expKey}')">
            ${expChecked ? '✓' : ''}
          </div>
          <span class="check-text ${expDone}"><strong style="color:var(--color-frost-white);">${w.exposureChallenge}</strong></span>
        </div>
      </div>

      <div class="grid-2">
        <div style="font-size:0.825rem; color:var(--color-platinum);">
          <strong style="color:var(--color-frost-white);">Success Criteria:</strong> ${w.successMetrics}
        </div>
        <div style="font-size:0.825rem; color:var(--color-platinum);">
          <strong style="color:var(--color-frost-white);">Sunday Review Process:</strong> ${w.reviewProcess}
        </div>
      </div>
    `;

    weekCard.appendChild(header);
    weekCard.appendChild(body);
    container.appendChild(weekCard);
  });
}

function toggleWeekCard(weekNum) {
  appState.activeWeek = appState.activeWeek === weekNum ? null : weekNum;
  saveState();
  renderRoadmap();
}

function toggleTask(taskKey) {
  appState.completedTasks[taskKey] = !appState.completedTasks[taskKey];
  saveState();
  renderRoadmap();
  updateTopMetrics();
}

function renderExposureLadder() {
  const container = document.getElementById('exposureLadderContainer');
  if (!container) return;

  container.innerHTML = '';

  TASKHELIX_DATA.exposureLadder.forEach(item => {
    const isCompleted = appState.completedLadders[item.rung];
    const el = document.createElement('div');
    el.className = `ladder-item ${isCompleted ? 'completed' : ''}`;
    
    el.innerHTML = `
      <div class="ladder-left">
        <div class="ladder-num mono">#${item.rung}</div>
        <div class="ladder-content">
          <h4>${item.title}</h4>
          <p>${item.task}</p>
        </div>
      </div>
      <div class="ladder-item-actions">
        <span class="discomfort-tag mono">Discomfort: ${item.discomfortScore}</span>
        <button class="btn btn-sm ${isCompleted ? 'btn-primary' : 'btn-secondary'}" onclick="toggleLadder(${item.rung})">
          ${isCompleted ? '✓ Conquered' : 'Mark Done'}
        </button>
      </div>
    `;
    container.appendChild(el);
  });
}

function toggleLadder(rungNum) {
  appState.completedLadders[rungNum] = !appState.completedLadders[rungNum];
  if (appState.completedLadders[rungNum]) {
    AudioFX.playBell(528, 2.0);
    showToast(`Rung #${rungNum} Conquered! Exposure tolerance expanding.`);
  }
  saveState();
  renderExposureLadder();
  updateTopMetrics();
}

// --------------------------------------------------------------------------
// 7. Script Vault & SOPs
// --------------------------------------------------------------------------
function renderScriptVault() {
  const container = document.getElementById('scriptVaultContainer');
  if (!container) return;

  container.innerHTML = '';

  TASKHELIX_DATA.scripts.forEach(s => {
    const el = document.createElement('div');
    el.className = 'script-card';

    el.innerHTML = `
      <div class="script-header">
        <div>
          <h4 style="color:var(--color-frost-white); font-size:1rem;">${s.title}</h4>
          <span style="font-size:0.75rem; color:var(--color-platinum); text-transform:uppercase; font-weight:700;">${s.category}</span>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="copyScriptText('${s.id}')">
          📋 Copy Script
        </button>
      </div>
      <div class="script-text" id="script_text_${s.id}">${s.text}</div>
    `;
    container.appendChild(el);
  });
}

function copyScriptText(scriptId) {
  const scriptObj = TASKHELIX_DATA.scripts.find(s => s.id === scriptId);
  if (scriptObj) {
    navigator.clipboard.writeText(scriptObj.text).then(() => {
      showToast('Script copied to clipboard!');
    }).catch(err => {
      console.warn('Clipboard write error', err);
    });
  }
}

// --------------------------------------------------------------------------
// 8. Emergency Obstacle Drawer
// --------------------------------------------------------------------------
function renderObstacleDrawer() {
  const container = document.getElementById('obstacleList');
  if (!container) return;

  container.innerHTML = '';

  TASKHELIX_DATA.obstacles.forEach(o => {
    const el = document.createElement('div');
    el.className = 'obstacle-card';

    el.innerHTML = `
      <h4>IF: ${o.trigger}</h4>
      <div class="obstacle-trap"><strong>The Trap:</strong> ${o.trap}</div>
      <div class="obstacle-action">THEN IMMEDIATELY: ${o.action}</div>
    `;
    container.appendChild(el);
  });
}

function openEmergencyModal() {
  const modal = document.getElementById('emergencyModal');
  if (modal) modal.classList.add('open');
}

function closeEmergencyModal() {
  const modal = document.getElementById('emergencyModal');
  if (modal) modal.classList.remove('open');
}

// --------------------------------------------------------------------------
// 9. Behavioral Activation Tracker
// --------------------------------------------------------------------------
function initTrackerForm() {
  const moodBeforeInput = document.getElementById('moodBefore');
  const moodAfterInput = document.getElementById('moodAfter');
  const moodBeforeVal = document.getElementById('moodBeforeVal');
  const moodAfterVal = document.getElementById('moodAfterVal');

  if (moodBeforeInput && moodBeforeVal) {
    moodBeforeInput.oninput = (e) => moodBeforeVal.textContent = e.target.value;
  }
  if (moodAfterInput && moodAfterVal) {
    moodAfterInput.oninput = (e) => moodAfterVal.textContent = e.target.value;
  }
}

function logBehaviorAction(e) {
  e.preventDefault();

  const actionInput = document.getElementById('trackerAction');
  const durationInput = document.getElementById('trackerDuration');
  const moodBeforeInput = document.getElementById('moodBefore');
  const moodAfterInput = document.getElementById('moodAfter');
  const notesInput = document.getElementById('trackerNotes');

  if (!actionInput || !actionInput.value.trim()) {
    showToast('Please enter an action description.');
    return;
  }

  const logEntry = {
    id: Date.now(),
    date: getTodayDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    action: actionInput.value.trim(),
    duration: Number(durationInput.value) || 25,
    moodBefore: Number(moodBeforeInput.value) || 2,
    moodAfter: Number(moodAfterInput.value) || 4,
    notes: notesInput ? notesInput.value.trim() : ''
  };

  appState.trackerLogs.unshift(logEntry);
  saveState();
  renderTrackerTable();
  updateTopMetrics();

  actionInput.value = '';
  if (notesInput) notesInput.value = '';
  showToast('Action Logged! Action cures anxiety.');
}

function deleteLogEntry(id) {
  appState.trackerLogs = appState.trackerLogs.filter(item => item.id !== id);
  saveState();
  renderTrackerTable();
  updateTopMetrics();
}

function renderTrackerTable() {
  const tbody = document.getElementById('trackerTableBody');
  if (!tbody) return;

  if (appState.trackerLogs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:var(--color-platinum); padding: 2rem;">
          No behavioral actions logged yet. Execute an outreach block and log your first entry above.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = appState.trackerLogs.map(item => {
    const delta = item.moodAfter - item.moodBefore;
    const deltaClass = delta > 0 ? 'positive' : delta === 0 ? 'neutral' : '';
    const deltaSign = delta > 0 ? `+${delta}` : `${delta}`;

    return `
      <tr>
        <td class="mono" style="color:var(--color-platinum);">${item.date} ${item.time}</td>
        <td><strong style="color:var(--color-frost-white);">${item.action}</strong></td>
        <td class="mono">${item.duration}m</td>
        <td class="mono">${item.moodBefore}/5</td>
        <td class="mono">${item.moodAfter}/5</td>
        <td>
          <span class="delta-badge ${deltaClass} mono">
            ${deltaSign} Lift
          </span>
        </td>
        <td style="color:var(--color-platinum); font-size:0.8rem;">
          ${item.notes || '-'}
          <button class="btn btn-sm" aria-label="Delete behavioral action entry" style="color:var(--color-crimson-alert); margin-left:0.5rem;" onclick="deleteLogEntry(${item.id})">×</button>
        </td>
      </tr>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 10. Metrics & Telemetry Calculation
// --------------------------------------------------------------------------
function updateTopMetrics() {
  const totalLadders = Object.values(appState.completedLadders).filter(Boolean).length;
  const totalLoggedMinutes = appState.trackerLogs.reduce((acc, cur) => acc + (cur.duration || 0), 0);

  const todayMetrics = calculateDailyAuditMetrics(getTodayDateString());

  const statLoggedHours = document.getElementById('statDeepWorkHours');
  const statTodayAdherence = document.getElementById('statTodayAdherence');
  const statAvoidanceHours = document.getElementById('statAvoidanceHours');
  const statLaddersConquered = document.getElementById('statLaddersConquered');

  if (statLoggedHours) statLoggedHours.textContent = `${((todayMetrics.executedDeepWorkMin || totalLoggedMinutes) / 60).toFixed(1)} hrs`;
  if (statTodayAdherence) {
    statTodayAdherence.textContent = todayMetrics.auditedCount > 0 ? `${todayMetrics.adherencePercent}%` : '--%';
  }
  if (statAvoidanceHours) {
    statAvoidanceHours.textContent = `${(todayMetrics.avoidedDeepWorkMin / 60).toFixed(1)} hrs`;
  }
  if (statLaddersConquered) statLaddersConquered.textContent = `${totalLadders} / 10`;

  updateActivityRings(todayMetrics, totalLoggedMinutes);
}

// --------------------------------------------------------------------------
// 11. Notifications & Haptics
// --------------------------------------------------------------------------
// (Haptics and IOSNotifications are already defined at the top of the file)

function showToast(message) {
  IOSNotifications.show('TaskHelix', message);
}

function switchTab(tabId) {
  Haptics.vibrate([10]);
  const tabs = ['cockpit', 'telemetry', 'tracker', 'vault'];
  
  // Clean up tabId in case legacy tags are requested
  if (tabId === 'schedule') tabId = 'telemetry';
  if (tabId === 'roadmap' || tabId === 'exposure' || tabId === 'scripts') tabId = 'vault';

  if (!tabs.includes(tabId)) return;

  appState.activeTab = tabId;
  saveState();

  tabs.forEach(id => {
    const content = document.getElementById('tab_' + id);
    if (content) {
      if (id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    }
  });

  // Update nav highlights
  document.querySelectorAll('.mobile-nav-item, .tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId || 
        (tabId === 'telemetry' && btn.getAttribute('data-tab') === 'schedule') ||
        (tabId === 'vault' && ['roadmap', 'exposure', 'scripts'].includes(btn.getAttribute('data-tab')))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (tabId === 'telemetry') {
    renderScheduleAudit();
  }
  
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// --------------------------------------------------------------------------
// 12. Data Backup & Restore
// --------------------------------------------------------------------------
function exportBackupData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `TaskHelix_Backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Backup JSON exported successfully.');
}

function importBackupData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      appState = { ...appState, ...imported };
      if (!appState.scheduleAudits) appState.scheduleAudits = {};
      saveState();
      renderRoadmap();
      renderExposureLadder();
      renderTrackerTable();
      renderScheduleAudit();
      updateTopMetrics();
      showToast('Backup successfully restored!');
    } catch (err) {
      alert('Invalid backup JSON file.');
    }
  };
  reader.readAsText(file);
}

// --------------------------------------------------------------------------
// 13. App Lifecycle Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('TaskHelix Service Worker registered.');
    }).catch(err => {
      console.warn('Service worker registration failed', err);
    });
  }

  loadState();

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  initTrackerForm();
  renderRoadmap();
  renderExposureLadder();
  renderScriptVault();
  renderObstacleDrawer();
  renderTrackerTable();
  renderScheduleAudit();
  updateTopMetrics();

  updateChronometer();
  setInterval(updateChronometer, 1000);

  if (appState.activeTab) {
    switchTab(appState.activeTab);
  }

  const wimHofActionBtn = document.getElementById('wimHofActionBtn');
  if (wimHofActionBtn) {
    wimHofActionBtn.onclick = () => {
      if (Timers.wimHof.state === 'idle') {
        Timers.wimHof.start();
      } else if (Timers.wimHof.state === 'retention') {
        Timers.wimHof.finishRetention();
      } else {
        Timers.wimHof.reset();
      }
    };
  }

  const meditationToggleBtn = document.getElementById('meditationToggleBtn');
  if (meditationToggleBtn) {
    meditationToggleBtn.onclick = () => Timers.meditation.toggle();
  }

  const freezeResetBtn = document.getElementById('freezeResetBtn');
  if (freezeResetBtn) {
    freezeResetBtn.onclick = () => Timers.freezeReset.start();
  }

  const focusAudioBtn = document.getElementById('focusAudioToggleBtn');
  if (focusAudioBtn) {
    focusAudioBtn.onclick = () => FocusAudio.toggle();
  }

  const focusAudioVol = document.getElementById('focusAudioVolume');
  if (focusAudioVol) {
    focusAudioVol.oninput = (e) => FocusAudio.setVolume(e.target.value);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEmergencyModal();
      closeDeviationModal();
    }
  });
});
