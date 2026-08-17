/**
 * ==========================================================================
 * TASKHELIX MOBILE APP (BETA 2) — CORE ENGINE & ARCHITECTURE
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. App State & Local Storage Engine
// --------------------------------------------------------------------------
const STORAGE_KEY = 'TASKHELIX_BETA2_STATE_V1';

const defaultState = {
  activeScreen: 'cockpit',
  activeAuditDate: getTodayDateString(),
  completedTasks: {},       // { [taskId]: boolean }
  completedLadders: {},     // { [rungNum]: boolean }
  trackerLogs: [],          // [ { id, timestamp, action, duration, moodBefore, moodAfter, delta, notes } ]
  scheduleAudits: {},       // { [dateStr]: { [blockId]: { status: 'followed'|'deviated', activity, driver, notes } } }
};

let AppState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.error('Failed to parse TaskHelix state, using defaults', e);
    return { ...defaultState };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
    updateTelemetryRings();
  } catch (e) {
    console.error('Failed to save TaskHelix state', e);
  }
}

function getTodayDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// --------------------------------------------------------------------------
// 2. Web Audio API Synthesizer (Harmonic Tones & Brown Noise)
// --------------------------------------------------------------------------
const AudioSynthesizer = {
  ctx: null,
  brownNoiseNode: null,
  gainNode: null,
  isPlaying: false,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playTone(freq = 440, duration = 0.4, type = 'sine') {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  playBellChime() {
    this.playTone(528, 1.2, 'sine'); // 528 Hz Harmonic Solfeggio
  },

  toggleBrownNoise() {
    this.init();
    if (this.isPlaying) {
      this.stopBrownNoise();
    } else {
      this.startBrownNoise();
    }
  },

  startBrownNoise() {
    this.init();
    const bufferSize = 4096;
    let lastOut = 0.0;
    
    // Generate Brown Noise with a ScriptProcessor / AudioBuffer
    const noiseNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    noiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    };

    this.gainNode = this.ctx.createGain();
    const vol = parseFloat(document.getElementById('sliderVolume')?.value || '0.5');
    this.gainNode.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);

    noiseNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.brownNoiseNode = noiseNode;
    this.isPlaying = true;

    const btn = document.getElementById('btnToggleBrownNoise');
    const badge = document.getElementById('audioPlayingBadge');
    if (btn) btn.textContent = '⏸ Pause Brown Noise';
    if (badge) badge.style.display = 'inline-block';
  },

  stopBrownNoise() {
    if (this.brownNoiseNode) {
      this.brownNoiseNode.disconnect();
      this.brownNoiseNode = null;
    }
    this.isPlaying = false;
    const btn = document.getElementById('btnToggleBrownNoise');
    const badge = document.getElementById('audioPlayingBadge');
    if (btn) btn.textContent = '▶ Play Brown Noise';
    if (badge) badge.style.display = 'none';
  },

  setVolume(val) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(parseFloat(val) * 0.3, this.ctx.currentTime);
    }
  }
};

// --------------------------------------------------------------------------
// 3. Screen Switching & Navigation Engine
// --------------------------------------------------------------------------
function switchScreen(screenId) {
  AppState.activeScreen = screenId;
  saveState();

  // Hide all screens
  document.querySelectorAll('.screen-view').forEach(el => el.classList.remove('active'));
  
  // Show target screen
  const targetScreen = document.getElementById(`screen_${screenId}`);
  if (targetScreen) targetScreen.classList.add('active');

  // Update navigation dock active pills
  document.querySelectorAll('.dock-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeDockBtn = document.getElementById(`dockTab${screenId.charAt(0).toUpperCase() + screenId.slice(1)}`);
  if (activeDockBtn) activeDockBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// --------------------------------------------------------------------------
// 4. Chronometer & Circadian Block Calculator
// --------------------------------------------------------------------------
function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getCurrentShiftBlock(now = new Date()) {
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const currentSecs = now.getSeconds();
  
  const blocks = TASKHELIX_DATA.scheduleBlocks;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const startM = parseTimeToMinutes(block.start);
    const endM = parseTimeToMinutes(block.end);
    
    let isCurrent = false;
    let durationM = 0;
    let elapsedM = 0;
    
    if (startM < endM) {
      // Standard daytime/evening block
      if (currentMins >= startM && currentMins < endM) {
        isCurrent = true;
        durationM = endM - startM;
        elapsedM = currentMins - startM;
      }
    } else {
      // Midnight crossing block (e.g. 20:15 - 01:15)
      if (currentMins >= startM || currentMins < endM) {
        isCurrent = true;
        durationM = (1440 - startM) + endM;
        elapsedM = currentMins >= startM ? (currentMins - startM) : ((1440 - startM) + currentMins);
      }
    }

    if (isCurrent) {
      const remainingSecondsTotal = (durationM * 60) - (elapsedM * 60 + currentSecs);
      const remainingMinutes = Math.max(0, Math.floor(remainingSecondsTotal / 60));
      const remainingSeconds = Math.max(0, remainingSecondsTotal % 60);
      const progress = Math.min(100, Math.max(0, ((elapsedM * 60 + currentSecs) / (durationM * 60)) * 100));

      return { block, remainingMinutes, remainingSeconds, progress };
    }
  }

  // Fallback to Sleep Block if not within active schedule
  return {
    block: {
      id: "b_sleep",
      name: "Protected Sleep Window",
      start: "07:30",
      end: "15:00",
      type: "routine",
      actionText: "7.5 Hours Complete Darkness & Recovery",
      activities: "Complete bedroom blackout. Down-regulate nervous system for tomorrow's arena execution."
    },
    remainingMinutes: 0,
    remainingSeconds: 0,
    progress: 100
  };
}

let lastActiveBlockId = null;

function updateLiveChronometer() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  
  const liveClockEl = document.getElementById('liveClockDisplay');
  if (liveClockEl && liveClockEl.textContent !== timeStr) {
    liveClockEl.textContent = timeStr;
  }

  const currentInfo = getCurrentShiftBlock(now);

  // Update Hero Block Details
  const titleEl = document.getElementById('heroBlockTitle');
  const badgeEl = document.getElementById('heroShiftTypeBadge');
  const timeRangeEl = document.getElementById('heroTimeRange');
  const countdownEl = document.getElementById('heroCountdownDigits');
  const progressEl = document.getElementById('heroProgressBar');
  const actionEl = document.getElementById('heroActionInstruction');

  if (titleEl && titleEl.textContent !== currentInfo.block.name) {
    titleEl.textContent = currentInfo.block.name;
  }
  if (timeRangeEl) {
    timeRangeEl.textContent = `${currentInfo.block.start} – ${currentInfo.block.end}`;
  }
  if (badgeEl) {
    badgeEl.textContent = currentInfo.block.type.toUpperCase();
  }
  if (actionEl && actionEl.textContent !== currentInfo.block.actionText) {
    actionEl.textContent = currentInfo.block.actionText;
  }
  if (countdownEl) {
    const remM = String(currentInfo.remainingMinutes).padStart(2, '0');
    const remS = String(currentInfo.remainingSeconds).padStart(2, '0');
    countdownEl.textContent = `${remM}:${remS}`;
  }
  if (progressEl) {
    progressEl.style.width = `${currentInfo.progress}%`;
  }

  // Update Shift Ribbon only if active block changed
  if (lastActiveBlockId !== currentInfo.block.id) {
    lastActiveBlockId = currentInfo.block.id;
    renderShiftRibbon(currentInfo.block.id);
  }
}

// --------------------------------------------------------------------------
// 5. Apple Activity Rings Telemetry Engine
// --------------------------------------------------------------------------
function updateTelemetryRings() {
  const dateStr = AppState.activeAuditDate || getTodayDateString();
  const dayAudits = AppState.scheduleAudits[dateStr] || {};
  
  let deepWorkMinutes = 0;
  let avoidanceMinutes = 0;
  let totalAuditedBlocks = 0;
  let followedBlocks = 0;

  TASKHELIX_DATA.scheduleBlocks.forEach(block => {
    const audit = dayAudits[block.id];
    const duration = getBlockDurationMinutes(block);

    if (audit) {
      totalAuditedBlocks++;
      if (audit.status === 'followed') {
        followedBlocks++;
        if (block.type === 'revenue' || block.type === 'build') {
          deepWorkMinutes += duration;
        }
      } else if (audit.status === 'deviated') {
        if (block.type === 'revenue' || block.type === 'build') {
          avoidanceMinutes += duration;
        }
      }
    }
  });

  const deepWorkHours = (deepWorkMinutes / 60).toFixed(1);
  const avoidanceHours = (avoidanceMinutes / 60).toFixed(1);
  const targetHours = 2.7;
  const adherencePercent = totalAuditedBlocks > 0 ? Math.round((followedBlocks / totalAuditedBlocks) * 100) : 0;

  // Ring 1: Outer Green (Deep Work: Target 2.7h -> circumference ~314.16)
  const deepWorkCircumference = 314.16;
  const deepWorkRatio = Math.min(1, deepWorkMinutes / (targetHours * 60));
  const deepWorkOffset = deepWorkCircumference * (1 - deepWorkRatio);
  const ringDeepWork = document.getElementById('ringDeepWork');
  if (ringDeepWork) ringDeepWork.style.strokeDashoffset = deepWorkOffset;

  // Ring 2: Middle Blue (Adherence %: circumference ~238.76)
  const adherenceCircumference = 238.76;
  const adherenceRatio = adherencePercent / 100;
  const adherenceOffset = adherenceCircumference * (1 - adherenceRatio);
  const ringAdherence = document.getElementById('ringAdherence');
  if (ringAdherence) ringAdherence.style.strokeDashoffset = adherenceOffset;

  // Ring 3: Inner Orange (Avoidance Hours: max 3h scale -> circumference ~163.36)
  const avoidanceCircumference = 163.36;
  const avoidanceRatio = Math.min(1, avoidanceMinutes / 180);
  const avoidanceOffset = avoidanceCircumference * (1 - avoidanceRatio);
  const ringAvoidance = document.getElementById('ringAvoidance');
  if (ringAvoidance) ringAvoidance.style.strokeDashoffset = avoidanceOffset;

  // Legend Labels
  const legendDeep = document.getElementById('legendDeepWorkVal');
  const legendAdh = document.getElementById('legendAdherenceVal');
  const legendAvoid = document.getElementById('legendAvoidanceVal');

  if (legendDeep) legendDeep.textContent = `${deepWorkHours}h / ${targetHours}h`;
  if (legendAdh) legendAdh.textContent = `${adherencePercent}%`;
  if (legendAvoid) legendAvoid.textContent = `${avoidanceHours}h`;

  // Audit Screen Rollup
  const auditBadge = document.getElementById('auditAdherenceBadge');
  const auditDeep = document.getElementById('auditDeepWorkTotal');
  const auditAvoid = document.getElementById('auditAvoidanceTotal');

  if (auditBadge) auditBadge.textContent = `${adherencePercent}% Followed`;
  if (auditDeep) auditDeep.textContent = `${deepWorkHours} hrs`;
  if (auditAvoid) auditAvoid.textContent = `${avoidanceHours} hrs`;
}

function getBlockDurationMinutes(block) {
  const startM = parseTimeToMinutes(block.start);
  const endM = parseTimeToMinutes(block.end);
  return startM < endM ? (endM - startM) : ((1440 - startM) + endM);
}

// --------------------------------------------------------------------------
// 6. 24-Hour Shift Ribbon Renderer
// --------------------------------------------------------------------------
function renderShiftRibbon(currentBlockId) {
  const ribbonEl = document.getElementById('shiftRibbonList');
  if (!ribbonEl) return;

  const dateStr = AppState.activeAuditDate || getTodayDateString();
  const dayAudits = AppState.scheduleAudits[dateStr] || {};

  ribbonEl.innerHTML = TASKHELIX_DATA.scheduleBlocks.map(block => {
    const isActive = block.id === currentBlockId;
    const audit = dayAudits[block.id];
    let statusClass = '';
    if (audit?.status === 'followed') statusClass = 'style="background-color:var(--color-emerald-active); box-shadow:0 0 6px var(--color-emerald-active);"';
    if (audit?.status === 'deviated') statusClass = 'style="background-color:var(--color-signal-orange); box-shadow:0 0 6px var(--color-signal-orange);"';

    return `
      <div class="ribbon-capsule ${isActive ? 'active' : ''}" onclick="switchScreen('audit'); scrollToAuditBlock('${block.id}');">
        <div class="ribbon-time">${block.start}</div>
        <div class="ribbon-name">${block.name}</div>
        <div class="ribbon-status-dot" ${statusClass}></div>
      </div>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 7. Wim Hof Breathing Engine (Video & Visual Orb)
// --------------------------------------------------------------------------
function switchBreathingTab(mode) {
  const viewVideo = document.getElementById('viewBreathingVideo');
  const viewOrb = document.getElementById('viewBreathingOrb');
  const btnVideo = document.getElementById('btnSegVideo');
  const btnOrb = document.getElementById('btnSegOrb');

  if (mode === 'video') {
    if (viewVideo) viewVideo.style.display = 'block';
    if (viewOrb) viewOrb.style.display = 'none';
    if (btnVideo) btnVideo.classList.add('active');
    if (btnOrb) btnOrb.classList.remove('active');
  } else {
    if (viewVideo) viewVideo.style.display = 'none';
    if (viewOrb) viewOrb.style.display = 'block';
    if (btnVideo) btnVideo.classList.remove('active');
    if (btnOrb) btnOrb.classList.add('active');
  }
}

const WimHofEngine = {
  round: 1,
  maxRounds: 3,
  breathCount: 0,
  maxBreaths: 30,
  state: 'idle',
  timerId: null,
  retentionSeconds: 0,

  start() {
    if (this.state !== 'idle') return;
    AudioSynthesizer.init();
    this.round = 1;
    this.startBreathing();
  },

  startBreathing() {
    this.state = 'breathing';
    this.breathCount = 0;
    const orb = document.getElementById('breathOrbElement');
    const orbText = document.getElementById('breathOrbText');
    const status = document.getElementById('breathOrbStatus');
    const btn = document.getElementById('btnStartWimHofOrb');

    if (btn) btn.style.display = 'none';
    if (status) status.textContent = `Round ${this.round} of ${this.maxRounds}: Inhale / Exhale Pacing`;

    let isInhale = true;
    this.timerId = setInterval(() => {
      if (this.state !== 'breathing') return;

      if (isInhale) {
        this.breathCount++;
        if (orb) orb.className = 'breath-orb inhale';
        if (orbText) orbText.textContent = `IN (${this.breathCount})`;
        AudioSynthesizer.playTone(330, 0.35, 'sine');
      } else {
        if (orb) orb.className = 'breath-orb exhale';
        if (orbText) orbText.textContent = `OUT (${this.breathCount})`;
        AudioSynthesizer.playTone(220, 0.35, 'sine');

        if (this.breathCount >= this.maxBreaths) {
          clearInterval(this.timerId);
          this.startRetention();
          return;
        }
      }
      isInhale = !isInhale;
    }, 1600);
  },

  startRetention() {
    this.state = 'retention';
    this.retentionSeconds = 0;
    const orb = document.getElementById('breathOrbElement');
    const orbText = document.getElementById('breathOrbText');
    const status = document.getElementById('breathOrbStatus');

    if (orb) orb.className = 'breath-orb hold';
    if (status) status.textContent = `Round ${this.round}: Breath Hold (Retention)`;
    AudioSynthesizer.playBellChime();

    this.timerId = setInterval(() => {
      this.retentionSeconds++;
      const m = String(Math.floor(this.retentionSeconds / 60)).padStart(2, '0');
      const s = String(this.retentionSeconds % 60).padStart(2, '0');
      if (orbText) orbText.textContent = `${m}:${s}`;
    }, 1000);

    const btn = document.getElementById('btnStartWimHofOrb');
    if (btn) {
      btn.style.display = 'inline-flex';
      btn.textContent = 'Take Recovery Breath (15s)';
      btn.onclick = () => this.startRecovery();
    }
  },

  startRecovery() {
    clearInterval(this.timerId);
    this.state = 'recovery';
    let recoveryRemaining = 15;
    const orb = document.getElementById('breathOrbElement');
    const orbText = document.getElementById('breathOrbText');
    const status = document.getElementById('breathOrbStatus');
    const btn = document.getElementById('btnStartWimHofOrb');

    if (btn) btn.style.display = 'none';
    if (orb) orb.className = 'breath-orb inhale';
    if (status) status.textContent = `Round ${this.round}: Recovery Inhale Hold (15s)`;
    AudioSynthesizer.playTone(440, 0.6, 'sine');

    this.timerId = setInterval(() => {
      recoveryRemaining--;
      if (orbText) orbText.textContent = `HOLD (${recoveryRemaining}s)`;

      if (recoveryRemaining <= 0) {
        clearInterval(this.timerId);
        AudioSynthesizer.playBellChime();
        if (this.round < this.maxRounds) {
          this.round++;
          this.startBreathing();
        } else {
          this.finish();
        }
      }
    }, 1000);
  },

  finish() {
    this.reset();
    const status = document.getElementById('breathOrbStatus');
    if (status) status.textContent = '🎉 3 Rounds Completed! Mind primed for Deep Work.';
    AudioSynthesizer.playBellChime();
  },

  reset() {
    clearInterval(this.timerId);
    this.state = 'idle';
    this.round = 1;
    this.breathCount = 0;
    this.retentionSeconds = 0;

    const orb = document.getElementById('breathOrbElement');
    const orbText = document.getElementById('breathOrbText');
    const status = document.getElementById('breathOrbStatus');
    const btn = document.getElementById('btnStartWimHofOrb');

    if (orb) orb.className = 'breath-orb';
    if (orbText) orbText.textContent = 'Ready';
    if (status) status.textContent = 'Ready for 3 Rounds';
    if (btn) {
      btn.style.display = 'inline-flex';
      btn.textContent = 'Start 3 Rounds';
      btn.onclick = () => this.start();
    }
  }
};

// --------------------------------------------------------------------------
// 8. Schedule Reality Audit & Deviation Drawer Engine
// --------------------------------------------------------------------------
let targetAuditBlockId = null;
let selectedAvoidanceActivity = null;
let selectedEmotionalDriver = null;

function renderAuditBlocks() {
  const container = document.getElementById('auditBlockCardsList');
  if (!container) return;

  const dateStr = AppState.activeAuditDate || getTodayDateString();
  const dayAudits = AppState.scheduleAudits[dateStr] || {};

  container.innerHTML = TASKHELIX_DATA.scheduleBlocks.map(block => {
    const audit = dayAudits[block.id];
    const isFollowed = audit?.status === 'followed';
    const isDeviated = audit?.status === 'deviated';

    return `
      <div class="audit-block-item ${isFollowed ? 'followed' : ''} ${isDeviated ? 'deviated' : ''}" id="auditCard_${block.id}">
        <div class="card-top-row" style="margin-bottom:0.35rem;">
          <strong style="font-size:0.86rem; color:var(--text-white);">${block.name}</strong>
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-platinum);">${block.start} - ${block.end}</span>
        </div>
        <p style="font-size:0.78rem; color:var(--text-platinum); margin-bottom:0.55rem;">${block.actionText}</p>

        ${audit ? `
          <div style="font-size:0.75rem; background:rgba(255,255,255,0.04); padding:0.45rem; border-radius:10px; margin-bottom:0.5rem;">
            ${isFollowed ? `<span style="color:var(--color-emerald-active); font-weight:700;">✅ Followed as Planned</span>` : `
              <span style="color:var(--color-signal-orange); font-weight:700;">⚠️ Deviated:</span> ${audit.activity || 'Distraction'} 
              <span style="color:var(--text-platinum);">(${audit.driver || 'Emotional Avoidance'})</span>
              ${audit.notes ? `<div style="color:var(--text-platinum); margin-top:2px;">"${audit.notes}"</div>` : ''}
            `}
          </div>
        ` : ''}

        <div class="audit-action-grid">
          <button class="btn-mobile btn-apple-primary btn-apple-sm" onclick="auditSpecificBlock('${block.id}', true)">
            ✅ Followed
          </button>
          <button class="btn-mobile btn-apple-secondary btn-apple-sm" onclick="openDeviationSheetForBlock('${block.id}')">
            ⚠️ Deviated
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function changeAuditDate(offset) {
  const current = new Date(AppState.activeAuditDate || getTodayDateString());
  current.setDate(current.getDate() + offset);
  AppState.activeAuditDate = getTodayDateString(current);
  
  const label = document.getElementById('auditDateLabel');
  if (label) {
    label.textContent = AppState.activeAuditDate === getTodayDateString() ? 'Today' : AppState.activeAuditDate;
  }
  
  renderAuditBlocks();
  updateTelemetryRings();
}

function auditCurrentBlock(isFollowed) {
  const current = getCurrentShiftBlock();
  auditSpecificBlock(current.block.id, isFollowed);
}

function auditSpecificBlock(blockId, isFollowed) {
  const dateStr = AppState.activeAuditDate || getTodayDateString();
  if (!AppState.scheduleAudits[dateStr]) AppState.scheduleAudits[dateStr] = {};

  AppState.scheduleAudits[dateStr][blockId] = {
    status: isFollowed ? 'followed' : 'deviated',
    timestamp: new Date().toISOString()
  };

  saveState();
  renderAuditBlocks();
  renderShiftRibbon(lastActiveBlockId);
  AudioSynthesizer.playTone(520, 0.25, 'sine');
}

function openDeviationSheetForCurrent() {
  const current = getCurrentShiftBlock();
  openDeviationSheetForBlock(current.block.id);
}

function openDeviationSheetForBlock(blockId) {
  targetAuditBlockId = blockId;
  selectedAvoidanceActivity = null;
  selectedEmotionalDriver = null;

  const block = TASKHELIX_DATA.scheduleBlocks.find(b => b.id === blockId);
  const title = document.getElementById('deviationModalTitle');
  if (title && block) title.textContent = `Audit: ${block.name}`;

  // Populate Activity Pills
  const actContainer = document.getElementById('deviationActivityPills');
  if (actContainer) {
    actContainer.innerHTML = TASKHELIX_DATA.avoidanceActivities.map(act => `
      <button type="button" class="badge-pill" style="cursor:pointer; background:var(--bg-complication); border:1px solid var(--border-subtle); color:var(--text-platinum);" onclick="selectAvoidancePill(this, '${act.label}')">
        ${act.label}
      </button>
    `).join('');
  }

  // Populate Driver Pills
  const driverContainer = document.getElementById('deviationDriverPills');
  if (driverContainer) {
    driverContainer.innerHTML = TASKHELIX_DATA.emotionalDrivers.map(drv => `
      <button type="button" class="badge-pill" style="cursor:pointer; background:var(--bg-complication); border:1px solid var(--border-subtle); color:var(--text-platinum);" onclick="selectDriverPill(this, '${drv.label}')">
        ${drv.label}
      </button>
    `).join('');
  }

  document.getElementById('inputDeviationNotes').value = '';
  document.getElementById('deviationSheetBackdrop').classList.add('open');
  document.getElementById('deviationSheet').classList.add('open');
}

function selectAvoidancePill(btn, label) {
  selectedAvoidanceActivity = label;
  document.querySelectorAll('#deviationActivityPills .badge-pill').forEach(b => {
    b.style.borderColor = 'var(--border-subtle)';
    b.style.color = 'var(--text-platinum)';
  });
  btn.style.borderColor = 'var(--color-signal-orange)';
  btn.style.color = 'var(--color-signal-orange)';
}

function selectDriverPill(btn, label) {
  selectedEmotionalDriver = label;
  document.querySelectorAll('#deviationDriverPills .badge-pill').forEach(b => {
    b.style.borderColor = 'var(--border-subtle)';
    b.style.color = 'var(--text-platinum)';
  });
  btn.style.borderColor = 'var(--color-iris-violet)';
  btn.style.color = 'var(--color-iris-violet)';
}

function closeDeviationSheet() {
  document.getElementById('deviationSheetBackdrop').classList.remove('open');
  document.getElementById('deviationSheet').classList.remove('open');
}

function saveDeviationLog() {
  if (!targetAuditBlockId) return;
  const dateStr = AppState.activeAuditDate || getTodayDateString();
  if (!AppState.scheduleAudits[dateStr]) AppState.scheduleAudits[dateStr] = {};

  const notes = document.getElementById('inputDeviationNotes').value.trim();

  AppState.scheduleAudits[dateStr][targetAuditBlockId] = {
    status: 'deviated',
    activity: selectedAvoidanceActivity || 'Uncategorized Avoidance',
    driver: selectedEmotionalDriver || 'Unspecified Resistance',
    notes: notes,
    timestamp: new Date().toISOString()
  };

  saveState();
  closeDeviationSheet();
  renderAuditBlocks();
  renderShiftRibbon(lastActiveBlockId);
}

function scrollToAuditBlock(blockId) {
  setTimeout(() => {
    const el = document.getElementById(`auditCard_${blockId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// --------------------------------------------------------------------------
// 9. 12-Week Roadmap & Exposure Ladder Renderers
// --------------------------------------------------------------------------
function renderRoadmap() {
  const container = document.getElementById('roadmapWeeksStream');
  if (!container) return;

  container.innerHTML = TASKHELIX_DATA.weeks.map(w => `
    <div class="mobile-card">
      <div class="card-top-row">
        <div>
          <span class="badge-pill violet">Phase ${w.phase}: Week ${w.week}</span>
          <h3 style="font-size:0.95rem; font-weight:800; color:var(--text-white); margin-top:0.25rem;">${w.title}</h3>
        </div>
      </div>

      <p style="font-size:0.8rem; color:var(--text-platinum); margin-bottom:0.75rem;">${w.objective}</p>

      <!-- Daily Non-Negotiables -->
      <div style="margin-bottom:0.75rem;">
        <strong style="font-size:0.72rem; text-transform:uppercase; color:var(--color-emerald-active); display:block; margin-bottom:0.35rem;">Daily Non-Negotiables</strong>
        ${w.dailyActions.map((act, i) => {
          const taskId = `w${w.week}_daily_${i}`;
          const isDone = !!AppState.completedTasks[taskId];
          return `
            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; margin-bottom:0.35rem; cursor:pointer;">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTask('${taskId}')" style="accent-color:var(--color-emerald-active);">
              <span style="${isDone ? 'text-decoration:line-through; color:var(--text-platinum);' : 'color:var(--text-frost);'}">${act}</span>
            </label>
          `;
        }).join('')}
      </div>

      <!-- Weekly Deliverables -->
      <div>
        <strong style="font-size:0.72rem; text-transform:uppercase; color:var(--color-apple-blue); display:block; margin-bottom:0.35rem;">Weekly Milestones</strong>
        ${w.weeklyActions.map((act, i) => {
          const taskId = `w${w.week}_weekly_${i}`;
          const isDone = !!AppState.completedTasks[taskId];
          return `
            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; margin-bottom:0.35rem; cursor:pointer;">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTask('${taskId}')" style="accent-color:var(--color-apple-blue);">
              <span style="${isDone ? 'text-decoration:line-through; color:var(--text-platinum);' : 'color:var(--text-frost);'}">${act}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function toggleTask(taskId) {
  AppState.completedTasks[taskId] = !AppState.completedTasks[taskId];
  saveState();
  renderRoadmap();
  AudioSynthesizer.playTone(600, 0.15, 'sine');
}

function renderExposureLadder() {
  const container = document.getElementById('exposureRungsStream');
  if (!container) return;

  container.innerHTML = TASKHELIX_DATA.exposureLadder.map(r => {
    const isDone = !!AppState.completedLadders[r.rung];
    return `
      <div class="ladder-rung-card ${isDone ? 'completed' : ''}">
        <div class="ladder-top-row">
          <span class="ladder-rung-num">RUNG #${r.rung}</span>
          <span class="ladder-discomfort-tag">Discomfort: ${r.discomfortScore}</span>
        </div>
        <strong style="font-size:0.88rem; color:var(--text-white);">${r.title}</strong>
        <p style="font-size:0.78rem; color:var(--text-platinum);">${r.task}</p>
        <button class="btn-mobile ${isDone ? 'btn-apple-secondary' : 'btn-apple-primary'} btn-apple-sm" style="margin-top:0.35rem;" onclick="toggleLadderRung(${r.rung})">
          ${isDone ? '✅ Conquered' : 'Mark Done (+1 Rung)'}
        </button>
      </div>
    `;
  }).join('');
}

function toggleLadderRung(rungNum) {
  AppState.completedLadders[rungNum] = !AppState.completedLadders[rungNum];
  saveState();
  renderExposureLadder();
  AudioSynthesizer.playTone(700, 0.2, 'sine');
}

// --------------------------------------------------------------------------
// 10. Behavioral Activation Tracker & Mood Delta Engine
// --------------------------------------------------------------------------
function submitTrackerLog(e) {
  e.preventDefault();
  const action = document.getElementById('inputTrackerAction').value.trim();
  const duration = parseInt(document.getElementById('inputTrackerDuration').value, 10) || 25;
  const moodBefore = parseInt(document.getElementById('inputMoodBefore').value, 10) || 2;
  const moodAfter = parseInt(document.getElementById('inputMoodAfter').value, 10) || 4;
  const notes = document.getElementById('inputTrackerNotes').value.trim();

  const delta = moodAfter - moodBefore;

  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    action,
    duration,
    moodBefore,
    moodAfter,
    delta,
    notes
  };

  AppState.trackerLogs.unshift(newLog);
  saveState();
  renderTrackerLogs();

  // Reset form
  document.getElementById('inputTrackerAction').value = '';
  document.getElementById('inputTrackerNotes').value = '';
  AudioSynthesizer.playBellChime();
}

function renderTrackerLogs() {
  const container = document.getElementById('trackerLogsHistoryStream');
  if (!container) return;

  if (AppState.trackerLogs.length === 0) {
    container.innerHTML = `
      <div class="mobile-card" style="text-align:center; padding:1.5rem 1rem; color:var(--text-platinum); font-size:0.8rem;">
        No actions logged yet. Execute an outreach action and measure your mood lift.
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.trackerLogs.map(log => {
    const deltaSign = log.delta > 0 ? `+${log.delta}` : `${log.delta}`;
    return `
      <div class="mobile-card" style="margin-bottom:0.65rem;">
        <div class="card-top-row" style="margin-bottom:0.25rem;">
          <strong style="font-size:0.86rem; color:var(--text-white);">${log.action}</strong>
          <span class="badge-pill ${log.delta >= 0 ? 'emerald' : 'orange'}">${deltaSign} Lift</span>
        </div>
        <div style="font-size:0.75rem; color:var(--text-platinum); margin-bottom:0.35rem;">
          ${log.duration} mins • Before: ${log.moodBefore}/5 ➔ After: ${log.moodAfter}/5
        </div>
        ${log.notes ? `<div style="font-size:0.75rem; color:var(--text-frost); background:var(--bg-complication); padding:0.45rem; border-radius:8px;">"${log.notes}"</div>` : ''}
        <button class="btn-mobile btn-apple-secondary btn-apple-sm" style="margin-top:0.5rem; color:var(--color-crimson-alert);" onclick="deleteTrackerLog(${log.id})">
          Delete Entry
        </button>
      </div>
    `;
  }).join('');
}

function deleteTrackerLog(id) {
  AppState.trackerLogs = AppState.trackerLogs.filter(l => l.id !== id);
  saveState();
  renderTrackerLogs();
}

// --------------------------------------------------------------------------
// 11. Script Vault & Copy Engine
// --------------------------------------------------------------------------
function renderScriptVault() {
  const container = document.getElementById('scriptVaultStream');
  if (!container) return;

  container.innerHTML = TASKHELIX_DATA.scripts.map(s => `
    <div class="mobile-card">
      <div class="card-top-row">
        <div>
          <span class="badge-pill orange">${s.category}</span>
          <h3 style="font-size:0.92rem; font-weight:800; color:var(--text-white); margin-top:0.25rem;">${s.title}</h3>
        </div>
      </div>
      <pre style="background:var(--bg-complication); padding:0.75rem; border-radius:12px; font-family:var(--font-mono); font-size:0.74rem; color:var(--text-frost); white-space:pre-wrap; line-height:1.4; border:1px solid var(--border-subtle);">${s.text}</pre>
      <button class="btn-mobile btn-apple-primary btn-apple-sm" style="margin-top:0.65rem;" onclick="copyScriptText(this, ${JSON.stringify(s.text)})">
        📋 Copy Script
      </button>
    </div>
  `).join('');
}

function copyScriptText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const oldText = btn.textContent;
    btn.textContent = '✅ Copied!';
    AudioSynthesizer.playTone(800, 0.15, 'sine');
    setTimeout(() => { btn.textContent = oldText; }, 2000);
  });
}

// --------------------------------------------------------------------------
// 12. Emergency Freeze Reset & Data Sheets
// --------------------------------------------------------------------------
const EmergencyTimer = {
  seconds: 120,
  timerId: null,
  isRunning: false,

  toggle() {
    AudioSynthesizer.init();
    if (this.isRunning) {
      clearInterval(this.timerId);
      this.isRunning = false;
      document.getElementById('btnEmergencyAction').textContent = 'Resume 2-Min Reset';
    } else {
      this.isRunning = true;
      document.getElementById('btnEmergencyAction').textContent = 'Pause Reset';
      this.timerId = setInterval(() => {
        this.seconds--;
        const m = String(Math.floor(this.seconds / 60)).padStart(2, '0');
        const s = String(this.seconds % 60).padStart(2, '0');
        document.getElementById('emergencyDigits').textContent = `${m}:${s}`;

        if (this.seconds <= 0) {
          clearInterval(this.timerId);
          this.isRunning = false;
          AudioSynthesizer.playBellChime();
          alert('🚨 2-Minute Reset Complete! Write 1 sentence on Upwork right now.');
          this.reset();
        }
      }, 1000);
    }
  },

  reset() {
    clearInterval(this.timerId);
    this.isRunning = false;
    this.seconds = 120;
    document.getElementById('emergencyDigits').textContent = '02:00';
    document.getElementById('btnEmergencyAction').textContent = 'Start 2-Min Reset';
  }
};

function openEmergencySheet() {
  document.getElementById('emergencySheetBackdrop').classList.add('open');
  document.getElementById('emergencySheet').classList.add('open');
}

function closeEmergencySheet() {
  document.getElementById('emergencySheetBackdrop').classList.remove('open');
  document.getElementById('emergencySheet').classList.remove('open');
}

function openDataSheet() {
  document.getElementById('dataSheetBackdrop').classList.add('open');
  document.getElementById('dataSheet').classList.add('open');
}

function closeDataSheet() {
  document.getElementById('dataSheetBackdrop').classList.remove('open');
  document.getElementById('dataSheet').classList.remove('open');
}

function exportDataBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `taskhelix_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importDataBackup(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      AppState = { ...defaultState, ...imported };
      saveState();
      location.reload();
    } catch (err) {
      alert('Invalid backup JSON file.');
    }
  };
  reader.readAsText(file);
}

function resetAllDataConfirm() {
  if (confirm('⚠️ Are you sure you want to reset all TaskHelix data on this device? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// --------------------------------------------------------------------------
// 13. App Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderRoadmap();
  renderExposureLadder();
  renderTrackerLogs();
  renderScriptVault();
  renderAuditBlocks();
  updateLiveChronometer();
  updateTelemetryRings();
  
  if (AppState.activeScreen) {
    switchScreen(AppState.activeScreen);
  }

  // Update chronometer every second
  setInterval(updateLiveChronometer, 1000);
});
