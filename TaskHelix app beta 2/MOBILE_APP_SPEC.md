# TaskHelix Mobile App (Beta 2) — Architecture & Design Blueprint

---

## 1. Executive Summary & Identity

* **Product Name:** TaskHelix Mobile OS (Beta 2)
* **Target User:** AI Automation Agency founder transitioning from night-shift gig driving ($20–$30/hr) to high-margin consulting retainer revenue ($5k–$10k/mo).
* **Core Psychological Barrier:** Chronic consumption of self-development/agency tutorials (Dr. K, Hormozi, Liam Ottley), over-planning paralysis, rejection freeze, and failure to execute daily outreach.
* **Core Product Thesis:** **Action precedes motivation.** The app acts as an unapologetic, zero-shame behavioral activation cockpit engineered strictly for mobile thumb-reachability and tactile feedback.

---

## 2. Shift Schedule & Circadian Reality (15:00 – 07:30)

```
┌───────────────┬─────────────────────────────────────────────────────────────┐
│ TIME (24H)    │ BLOCK NAME & OBJECTIVE                                      │
├───────────────┼─────────────────────────────────────────────────────────────┤
│ 15:00 - 15:20 │ Wake, Wim Hof 3-Round Breathing, Hydration & Light          │
│ 15:20 - 16:45 │ PROTECTED DEEP WORK 1: Outreach (Upwork / Cold Loom)        │
│ 16:45 - 17:45 │ Physical Training (Gym / Home Hypertrophy)                  │
│ 17:45 - 18:15 │ Transition, High-Protein Nutrition, Mental Reset            │
│ 18:15 - 19:30 │ DEEP WORK 2: Asset Build (n8n, Make, Airtable Systems)      │
│ 19:30 - 20:15 │ Pre-Drive Transition & Equipment Prep                      │
│ 20:15 - 01:15 │ Gig-Work Driving Block 1 (Income Anchor)                    │
│ 01:15 - 01:45 │ Mid-Shift Biological Break & Fuel                          │
│ 01:45 - 05:30 │ Gig-Work Driving Block 2 (Steady Driving)                   │
│ 05:30 - 06:15 │ Buffer & Shift Wrap                                         │
│ 06:15 - 07:00 │ Wind Down, Dim Red Light, Zero Blue Screen                 │
│ 07:00 - 07:30 │ Schedule Truth Audit & Daily Shutdown Log                   │
│ 07:30 - 15:00 │ Protected Sleep Block (7.5 Hours Complete Darkness)         │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 3. Mobile UI Architecture (Five Core Screens)

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE NAVIGATION DOCK                   │
├─────────────────────────────────────────────────────────────┤
│  ⚡ Cockpit   🕒 Audit   🗺️ Roadmap   🪜 Ladder   📊 Tracker │
└─────────────────────────────────────────────────────────────┘
```

### Screen 1: Active Execution Cockpit (`/cockpit`)
* **Hero Focus Vitrine:** Current shift block name, live countdown timer, and single high-priority action prompt.
* **Apple Activity Rings (Concentric SVG):**
  * Outer Green: Deep Work Executed (Target: 2.7 hrs).
  * Middle Blue: Schedule Adherence %.
  * Inner Orange: Avoidance Hours Logged.
* **Live 24h Shift Ribbon:** Horizontal gesture-scrollable timeline showing block statuses.
* **Built-in Physiological Audio Synthesizers:**
  * Wim Hof Guided Breathing (Official video player + offline visual breath orb).
  * 5-Min Pre-Work Meditation with harmonic interval chimes.
  * 2-Min Acute Procrastination Reset.
  * Continuous Pure Brown Noise Focus Audio Generator.

### Screen 2: Schedule Reality Audit (`/audit`)
* **Planned vs. Actual Engine:** 1-tap `[ ✅ Followed ]` vs `[ ⚠️ Deviated ]` for all 12 blocks.
* **10-Second Deviation Logging Drawer:**
  * What did you do instead? (YouTube, Twitter, Cleaning, Netflix, Over-researching, Nap, etc.).
  * Why / Emotional Driver? (Fear of rejection, Fatigue, Perfectionism, Boredom, Imposter anxiety).
* **Analytics Rollup:** Adherence score %, executed vs avoided hours bar, top avoidance trigger detection.

### Screen 3: 12-Week Transformation Roadmap (`/roadmap`)
* **Phase 1 (Weeks 1–4):** Foundations & Desensitization (5 Upwork proposals/week).
* **Phase 2 (Weeks 5–8):** Direct Outreach & Loom Audits (15 custom audits/week).
* **Phase 3 (Weeks 9–12):** Paid Retainers & Gig Shift Taper ($5k MRR).
* **Weekly Checklists:** Daily non-negotiables, weekly milestone deliverables, exposure challenge, and Sunday review.

### Screen 4: Systematic Exposure Ladder (`/ladder`)
* **10-Rung Desensitization Hierarchy:**
  1. Survive the 'No' (3 text-only proposals).
  2. Public Proof-of-Work (LinkedIn diagram).
  3. Cold Proactive Offering (20 free blueprints).
  4. Video Face-to-Camera Audit (10 Loom videos).
  5. The Pitch Rejection (Direct proposal rejection).
  6. Live Discovery Call (Simulated client call).
  7. The Live Price Objection ($2,500 pitch).
  8. Boundary Defense (Saying no to scope creep).
  9. Public Cold Call / DM (5 high-leverage DMs).
  10. Public Case Study Pitch (Closed client presentation).

### Screen 5: Behavioral Activation & Mood Delta Tracker (`/tracker`)
* **Action Logger:** Action description, duration (mins), mood before (1–5), mood after (1–5), resistance/victory notes.
* **Mood Delta Lift Engine:** Automatically highlights positive psychological lift (e.g. `+2 Lift`) to rewire dopamine association with action.

---

## 4. Mobile Design System Tokens (Apple Obsidian Showroom)

```css
:root {
  /* Surfaces */
  --color-pure-black: #000000;
  --color-carbon: #111111;
  --color-obsidian: #1d1d1f;
  --color-graphite: #333336;
  --color-smoke: #424245;
  --color-platinum: #86868b;
  --color-frost-white: #f5f5f7;

  /* Saturated Functional Accents */
  --color-apple-blue: #0071e3;
  --color-signal-orange: #f56900;
  --color-iris-violet: #8668ff;
  --color-reef-teal: #00a1b3;
  --color-emerald-active: #30d158;
  --color-crimson-alert: #ff453a;

  /* Strict Radii */
  --radius-cards: 28px;
  --radius-buttons: 36px;
  --radius-pill: 980px;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
  --tracking-tight: -0.035em;
}
```

---

## 5. Mobile Native Interaction Requirements

1. **Thumb-Zone Optimization:** All primary interaction buttons, drawer triggers, and navigation tabs are positioned in the bottom 40% of the viewport.
2. **Safe-Area Inset Handling:** `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` used for notch and home-indicator protection.
3. **Zero Layout Shift (CLS < 0.01):** Fixed aspect ratios on all widgets, video players, and activity rings.
4. **Haptic & Audio Feedback:** Web Audio harmonic tones on successful checkoffs, rung conquests, and timers.
5. **Local-First Offline Persistence:** Zero network dependency for core logging; local storage with JSON backup import/export.
