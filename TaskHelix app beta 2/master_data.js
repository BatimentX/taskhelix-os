/**
 * TaskHelix Mobile App Beta 2 — Master Data Structure
 */

const TASKHELIX_DATA = {
  // 12 Shift Blocks mapped to 15:00 - 07:30 Circadian Cycle
  scheduleBlocks: [
    {
      id: "b1_wake",
      name: "Wake & Physiological Ignition",
      start: "15:00",
      end: "15:20",
      type: "routine",
      actionText: "Execute Wim Hof Breathing & Hydration",
      activities: "Hydration (500ml + electrolytes), 3 rounds Wim Hof breathing, sunlight/light therapy. No phone checking."
    },
    {
      id: "b2_outreach",
      name: "PROTECTED DEEP WORK BLOCK 1 (Outreach & Pipeline)",
      start: "15:20",
      end: "16:45",
      type: "revenue",
      actionText: "Send 2 Upwork Proposals / Loom Video Audits",
      activities: "Upwork scouting (max 15 mins), send 2 tailored proposals with 90-sec Loom audits, follow up on existing pipeline."
    },
    {
      id: "b3_workout",
      name: "Physical Training (Gym / Home)",
      start: "16:45",
      end: "17:45",
      type: "health",
      actionText: "Resistance Training / HIIT Session",
      activities: "Compound lifts or hypertrophy session. Clears cortisol and physical stagnation."
    },
    {
      id: "b4_nutrition",
      name: "Transition & Nutrition",
      start: "17:45",
      end: "18:15",
      type: "routine",
      actionText: "High-Protein Meal & Hydration",
      activities: "Cold shower, high-protein/low-glycemic meal, prepare work station."
    },
    {
      id: "b5_build",
      name: "DEEP WORK BLOCK 2 (Asset Build & Operations)",
      start: "18:15",
      end: "19:30",
      type: "build",
      actionText: "Build Agency n8n/Make Workflows & Demo Assets",
      activities: "Build Make.com/n8n workflows, client deliverables, or portfolio case studies. Zero social media."
    },
    {
      id: "b6_predrive",
      name: "Pre-Drive Transition & Buffer",
      start: "19:30",
      end: "20:15",
      type: "routine",
      actionText: "Gear Up, Vehicle Check, Mental Shift",
      activities: "Prep vehicle, pack healthy snacks/water, listen to agency mindset audio."
    },
    {
      id: "b7_gig1",
      name: "Gig-Work Driving Block 1 (Income Anchor)",
      start: "20:15",
      end: "01:15",
      type: "income",
      actionText: "Drive Steadily & Protect Energy",
      activities: "Execute driving block. Maintain calm, listen to client discovery podcasts or brown noise."
    },
    {
      id: "b8_midbreak",
      name: "Mid-Shift Biological Break & Fuel",
      start: "01:15",
      end: "01:45",
      type: "health",
      actionText: "Stretch, Hydrate & Snack",
      activities: "Exit vehicle, 5-minute walk/stretch, clean snack, hydration."
    },
    {
      id: "b9_gig2",
      name: "Gig-Work Driving Block 2 (Final Stretch)",
      start: "01:45",
      end: "05:30",
      type: "income",
      actionText: "Final Driving Stretch & Safe Navigation",
      activities: "Steady driving block. Focus on road safety and smooth pace."
    },
    {
      id: "b10_wrap",
      name: "Buffer / Shift Wrap-Up",
      start: "05:30",
      end: "06:15",
      type: "routine",
      actionText: "Vehicle Maintenance & Return Home",
      activities: "Gas up, clean car, drive home safely."
    },
    {
      id: "b11_winddown",
      name: "Wind-Down & Blue Light Elimination",
      start: "06:15",
      end: "07:00",
      type: "health",
      actionText: "Dim Lights, Melatonin / Magnesium, Read",
      activities: "Blue-blocking glasses, dim lighting, no screens, light reading/stretching."
    },
    {
      id: "b12_audit",
      name: "Schedule Truth Audit & Daily Shutdown",
      start: "07:00",
      end: "07:30",
      type: "routine",
      actionText: "Audit 12 Blocks & Log Mood Delta",
      activities: "Log shift blocks in TaskHelix OS, set top 2 targets for tomorrow, lock bedroom in complete darkness."
    }
  ],

  // 10-Rung Exposure Ladder
  exposureLadder: [
    { rung: 1, title: "Survive the 'No' (Baseline Outreach)", task: "Submit 3 Upwork Proposals Using a Text-Only Pitch with zero emotional attachment to outcome.", discomfortScore: "1/10" },
    { rung: 2, title: "Public Proof-of-Work", task: "Post a Public Workflow Breakdown & Architecture Diagram on LinkedIn.", discomfortScore: "2/10" },
    { rung: 3, title: "Cold Proactive Offering", task: "Send 20 Cold Emails offering a free Lead-Response Blueprint with no hard pitch.", discomfortScore: "3/10" },
    { rung: 4, title: "Video Face-to-Camera Audit", task: "Record and send 10 personalized Loom Video Audits to prospective clients.", discomfortScore: "4/10" },
    { rung: 5, title: "The Pitch Rejection", task: "Submit a high-ticket $3,000 fixed-price proposal and ask for direct feedback if rejected.", discomfortScore: "5/10" },
    { rung: 6, title: "Live Discovery Call Simulation", task: "Conduct a 20-minute live diagnostic call with a peer or prospective client without giving away free consulting.", discomfortScore: "6/10" },
    { rung: 7, title: "The Live Price Objection", task: "State a $2,500/month retainer price live on a call and maintain silence for 5 seconds.", discomfortScore: "7/10" },
    { rung: 8, title: "Boundary Defense", task: "Say NO to an out-of-scope client request or lowball budget.", discomfortScore: "8/10" },
    { rung: 9, title: "Public Cold Call / Direct Outreach", task: "Send 5 direct LinkedIn video DMs to agency owners pitching an automated ops pipeline.", discomfortScore: "9/10" },
    { rung: 10, title: "Public Case Study Pitch", task: "Present a complete client implementation case study live to an audience of 10+ business owners.", discomfortScore: "10/10" }
  ],

  // Avoidance Activity & Emotional Driver Taxonomies
  avoidanceActivities: [
    { id: "youtube", label: "YouTube / Agency Videos" },
    { id: "social", label: "Twitter / Reddit / Reels" },
    { id: "cleaning", label: "Cleaning / Chores / Organizing" },
    { id: "research", label: "Over-Researching / Tutorial Paralysis" },
    { id: "nap", label: "Sleeping In / Overslept" },
    { id: "gaming", label: "Gaming / Entertainment" },
    { id: "email", label: "Inbox Refreshing / Admin Busywork" },
    { id: "eating", label: "Comfort Eating / Grazing" }
  ],

  emotionalDrivers: [
    { id: "fear_rejection", label: "Fear of Rejection / Imposter Anxiety" },
    { id: "perfectionism", label: "Perfectionism (Not Ready to Pitch)" },
    { id: "fatigue", label: "Physical Fatigue / Low Sleep Quality" },
    { id: "boredom", label: "Boredom / Lack of Novelty" },
    { id: "overwhelm", label: "Cognitive Overwhelm / Don't Know Next Step" },
    { id: "shame", label: "Shame from Past Missed Sessions" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TASKHELIX_DATA;
}
