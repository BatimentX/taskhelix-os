/**
 * TASKHELIX MOBILE APP (BETA 2) — MASTER DATA STRUCTURE
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
      activities: "Hydration (500ml + electrolytes), 3 rounds Wim Hof breathing, light exposure. No phone checking."
    },
    {
      id: "b2_outreach",
      name: "PROTECTED DEEP WORK BLOCK 1 (Outreach & Pipeline)",
      start: "15:20",
      end: "16:45",
      type: "revenue",
      actionText: "Send 2 Upwork Proposals / Loom Video Audits",
      activities: "Scout Upwork (max 15 mins), send 2 tailored proposals with 90-sec Loom audits, follow up on pipeline."
    },
    {
      id: "b3_workout",
      name: "Physical Training (Gym / Home)",
      start: "16:45",
      end: "17:45",
      type: "health",
      actionText: "Resistance Training / HIIT Session",
      activities: "Compound lifts or hypertrophy session. Clears physical tension and resets dopamine."
    },
    {
      id: "b4_nutrition",
      name: "Transition & Nutrition",
      start: "17:45",
      end: "18:15",
      type: "routine",
      actionText: "High-Protein Meal & Hydration",
      activities: "Cold/cool shower, high-protein meal, set up work station."
    },
    {
      id: "b5_build",
      name: "DEEP WORK BLOCK 2 (Asset Build & Operations)",
      start: "18:15",
      end: "19:30",
      type: "build",
      actionText: "Build Agency n8n/Make Workflows & Demo Assets",
      activities: "Build Make.com/n8n workflows, client templates, or portfolio case studies. Zero social media."
    },
    {
      id: "b6_predrive",
      name: "Pre-Drive Transition & Buffer",
      start: "19:30",
      end: "20:15",
      type: "routine",
      actionText: "Gear Up, Vehicle Check, Mental Shift",
      activities: "Pack healthy snacks/water, prep phone mounts, transition focus to driving block."
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
      actionText: "Stretch, Hydrate & Clean Fuel",
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
      activities: "Gas up, clean vehicle interior, drive home safely."
    },
    {
      id: "b11_winddown",
      name: "Wind-Down & Blue Light Elimination",
      start: "06:15",
      end: "07:00",
      type: "health",
      actionText: "Dim Lights, Melatonin / Magnesium, Read",
      activities: "Blue-blocking glasses, dim lighting, no screens, light stretching."
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

  // 12-Week Transformation Plan
  weeks: [
    {
      week: 1,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "Environment Hardening & Rejection Baseline",
      objective: "Eliminate cognitive distractions, lock in the 15:00-07:30 rhythm, and complete first 5 Upwork exposures.",
      dailyActions: [
        "15:05: 3 Rounds Wim Hof + 500ml water (No phone checking)",
        "15:20: Upwork scouting & submit 1 proposal daily",
        "18:15: Configure local n8n / Make environment & test webhook ping",
        "07:00: Log Behavioral Tracker & write 2 targets for tomorrow"
      ],
      weeklyActions: [
        "Install Website Blocker on desktop (Block YouTube/Twitter during 15:00-19:30)",
        "Build Signature Offer #1: Speed-to-Lead AI WhatsApp Responder in Make",
        "Submit 5 total Upwork proposals with text-only direct hook",
        "Complete Rung 1 & 2 on Exposure Ladder"
      ],
      exposureChallenge: "Submit 1 proposal to a job where you feel only 70% qualified.",
      successMetrics: "5 proposals submitted; 100% adherence to 15:00 wake time; Offer #1 built.",
      reviewProcess: "Sunday 15:00: Calculate weekly adherence score and review top avoidance trigger."
    },
    {
      week: 2,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "The Video Audit Engine (Loom Desensitization)",
      objective: "Transition from text-only proposals to custom 90-second Loom video teardowns.",
      dailyActions: [
        "15:20: Record 1 custom 60-90s Loom video audit for an Upwork job post",
        "16:15: Submit proposal with embedded Loom link",
        "18:15: Build Offer #2: Automated Invoice Parsing & Google Sheets/Airtable Sync",
        "07:00: Daily Schedule Reality Audit"
      ],
      weeklyActions: [
        "Record and send 5 personalized Loom audits",
        "Refine Loom 3-part script: (Observation -> Micro-Demo -> Low-Friction Offer)",
        "Complete Rung 3 & 4 on Exposure Ladder",
        "Map out 10 prospective local businesses for pilot outreach"
      ],
      exposureChallenge: "Record 1 Loom video in ONE TAKE with zero editing, stutter allowed.",
      successMetrics: "5 Loom proposals sent; 100% one-take recording; Offer #2 built.",
      reviewProcess: "Sunday: Review Loom view counts and watch time analytics."
    },
    {
      week: 3,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "Cold Email Infrastructure & Diagnostic Hook",
      objective: "Set up secondary outreach channel (Cold Email) and test offer resonance.",
      dailyActions: [
        "15:20: Send 3 tailored Upwork proposals with Loom",
        "18:15: Prospect 10 local HVAC/Real Estate companies with manual email verification",
        "19:00: Draft 5 personalized cold emails offering free workflow architecture diagram",
        "07:00: Daily Shutdown & Mood Tracker"
      ],
      weeklyActions: [
        "Submit 10 Upwork proposals",
        "Send 25 personalized cold emails offering a Free Diagnostic Blueprint",
        "Test webhook alert notification on phone for inbound client leads",
        "Complete Rung 5 on Exposure Ladder"
      ],
      exposureChallenge: "Directly ask an Upwork rejector: 'What was the #1 missing element?'",
      successMetrics: "10 proposals + 25 cold emails sent; 1 discovery call booked.",
      reviewProcess: "Sunday: Assess reply rate and adjust email subject line hook."
    },
    {
      week: 4,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "First Client Close & Discovery Call Mastery",
      objective: "Conduct first live discovery calls and close Pilot Client #1 ($500-$750 setup).",
      dailyActions: [
        "15:20: Daily pipeline follow-up & 2 new Loom proposals",
        "18:15: Rehearse 5 Diagnostic Discovery Questions (Never pitch on min 1)",
        "19:00: Template customization & documentation staging",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Conduct minimum 2 live or recorded simulated discovery calls",
        "Close Pilot Client #1 at $500-$750 setup",
        "Deploy Offer #1 or #2 template in < 48 hours for client",
        "Complete Rung 6 on Exposure Ladder"
      ],
      exposureChallenge: "Say $750 setup price out loud on call and pause for 5 seconds.",
      successMetrics: "Pilot Client #1 closed; $500+ collected cash.",
      reviewProcess: "Phase 1 Graduation Review: Celebrate surviving the arena."
    },
    {
      week: 5,
      phase: 2,
      phaseTitle: "Direct Outreach & Authority",
      title: "Case Study Extraction & Retainer Pitching",
      objective: "Extract testimonial from Pilot Client #1 and pitch $300/mo ongoing maintenance.",
      dailyActions: [
        "15:20: Send 3 Loom proposals on Upwork daily",
        "18:15: Draft 1-page visual case study diagram from Client #1",
        "19:00: Follow up with Client #1 on monthly error-monitoring retainer",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Secure written or video testimonial from Client #1",
        "Sign Client #1 to $300/mo monitoring retainer",
        "Send 15 Loom proposals using Client #1 case study as proof",
        "Complete Rung 7 on Exposure Ladder"
      ],
      exposureChallenge: "Pitch $300/mo ongoing retainer to Client #1 before project handoff.",
      successMetrics: "1st Retainer signed; 15 proposals submitted; Case study asset completed.",
      reviewProcess: "Sunday: Review retainer contract terms and webhook monitoring alerts."
    },
    {
      week: 6,
      phase: 2,
      phaseTitle: "Direct Outreach & Authority",
      title: "Outreach Scaling & Local B2B Campaign",
      objective: "Scale daily outreach volume to 3 channels (Upwork, Cold Email, LinkedIn DMs).",
      dailyActions: [
        "15:20: Upwork outreach (2 proposals with Loom)",
        "16:00: LinkedIn DM outreach (3 personalized video DMs to agency founders)",
        "18:15: Cold Email batch (10 hyper-targeted emails)",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Send 10 Upwork proposals + 15 LinkedIn DMs + 40 Cold Emails",
        "Close Client #2 at $1,000 setup + $300/mo retainer",
        "Deploy client automation within 72 hours",
        "Complete Rung 8 on Exposure Ladder"
      ],
      exposureChallenge: "Send 3 direct video DMs on LinkedIn showing face to agency owners.",
      successMetrics: "Client #2 closed ($1,000); $600/mo active MRR; 65 total touchpoints.",
      reviewProcess: "Sunday: Compare response rates across Upwork vs LinkedIn vs Email."
    },
    {
      week: 7,
      phase: 2,
      phaseTitle: "Direct Outreach & Authority",
      title: "Systematizing Delivery & Reducing Build Time",
      objective: "Package agency templates so new client onboarding takes < 3 hours.",
      dailyActions: [
        "15:20: Outreach Block (2 Upwork + 3 LinkedIn DMs)",
        "18:15: Standardize webhook error-handling and Airtable schemas",
        "19:00: Client follow-ups and active delivery",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Build modular client onboarding intake form (Tally / Typeform + Make)",
        "Submit 12 Upwork proposals",
        "Conduct 3 discovery calls",
        "Complete Rung 9 on Exposure Ladder"
      ],
      exposureChallenge: "Reject a prospective client whose requirements fall outside core offers.",
      successMetrics: "Standardized onboarding deployed; 3 discovery calls booked.",
      reviewProcess: "Sunday: Review delivery speed and client communication logs."
    },
    {
      week: 8,
      phase: 2,
      phaseTitle: "Direct Outreach & Authority",
      title: "The $1,500 Offer Milestone",
      objective: "Close Client #3 at standard full agency pricing ($1,500 setup + $400/mo retainer).",
      dailyActions: [
        "15:20: High-conviction outreach with Client #1 and #2 case studies",
        "18:15: Pipeline nurture and proposal customization",
        "19:00: Deliverable staging & live testing",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Close Client #3 at $1,500 setup + $400/mo retainer",
        "Total monthly revenue reaches $3,000+ collected cash",
        "Taper 1 gig driving shift (reduce weekly driving from 50h to 42h)",
        "Complete Rung 10 on Exposure Ladder"
      ],
      exposureChallenge: "Quote $1,500 setup + $400/mo retainer with zero discount.",
      successMetrics: "Client #3 closed; $1,000/mo recurring MRR locked.",
      reviewProcess: "Phase 2 Graduation Review: Validate transition math."
    },
    {
      week: 9,
      phase: 3,
      phaseTitle: "Retainers & Shift Tapering",
      title: "Shift Tapering & Deep Work Expansion",
      objective: "Convert recovered driving hours into Protected Deep Work blocks.",
      dailyActions: [
        "15:20: Outreach & Proposal Block (2 proposals daily)",
        "17:45: Deep Work Extension: High-ticket outbound campaigns",
        "18:45: Operations & Delivery management",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Reallocate 8 gig hours into 8 protected agency building hours",
        "Launch outbound campaign to 100 targeted B2B automation leads",
        "Maintain 100% uptime on 3 active client retainer systems"
      ],
      exposureChallenge: "Publish a detailed case study breakdown publicly on LinkedIn/YouTube.",
      successMetrics: "Gig driving reduced to 40h/week; Deep work expanded to 20h/week.",
      reviewProcess: "Sunday: Monitor sleep quality and energy levels."
    },
    {
      week: 10,
      phase: 3,
      phaseTitle: "Retainers & Shift Tapering",
      title: "Closing Client #4 ($2,000 Package)",
      objective: "Close Client #4 with multi-step CRM + AI qualification workflow.",
      dailyActions: [
        "15:20: High-conviction proposal submissions",
        "17:30: Discovery call conducting and pipeline review",
        "18:30: Client delivery and automated monitoring check",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Close Client #4 at $2,000 setup + $500/mo retainer",
        "Reach $1,500/mo baseline MRR across all retainers",
        "Implement automated uptime monitoring via BetterStack/UptimeRobot"
      ],
      exposureChallenge: "Handle a live price objection without dropping price.",
      successMetrics: "Client #4 closed; $1,500/mo MRR secured.",
      reviewProcess: "Sunday: Calculate agency margin and effective hourly rate."
    },
    {
      week: 11,
      phase: 3,
      phaseTitle: "Retainers & Shift Tapering",
      title: "Client #5 & Tapering Gig Driving to 20 Hours",
      objective: "Close Client #5 and reduce gig-work driving to part-time safety net.",
      dailyActions: [
        "15:20: Outreach, partner referrals, and inbound processing",
        "17:30: High-leverage client delivery",
        "19:00: System optimization and SOP documentation",
        "07:00: Daily Reality Audit"
      ],
      weeklyActions: [
        "Close Client #5 ($2,000 setup + $500/mo retainer)",
        "Reduce gig driving schedule to 20 hours/week (Friday/Saturday only)",
        "Total agency cash collected exceeds $6,000"
      ],
      exposureChallenge: "Inform gig platform / schedule manager of reduced availability.",
      successMetrics: "5 active clients; $2,000/mo MRR; gig work halved.",
      reviewProcess: "Sunday: Review cash reserves (3-month emergency fund)."
    },
    {
      week: 12,
      phase: 3,
      phaseTitle: "Retainers & Shift Tapering",
      title: "The Sovereign Operator Milestone ($5k MRR)",
      objective: "Complete 12-week transformation, stabilize $5,000/mo revenue, and finalize gig transition.",
      dailyActions: [
        "15:20: High-leverage outreach and strategic partnership calls",
        "17:30: Advanced AI client delivery and optimization",
        "19:00: Review agency operations and automated pipelines",
        "07:00: Master 12-Week Reflection & Audit"
      ],
      weeklyActions: [
        "Conduct quarterly business review for all 5 clients",
        "Finalize total independence from night-shift gig driving",
        "Establish 6-month roadmap: Scale TaskHelix to $15k/mo"
      ],
      exposureChallenge: "Declare full transition to agency operator.",
      successMetrics: "5 Retainer Clients; $2,000-$3,000/mo MRR; 12 weeks of consecutive audit data.",
      reviewProcess: "Graduation Sunday: 12-Week Master Operating System Review."
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

  // Production Script Vault & SOPs
  scripts: [
    {
      id: "upwork_loom_hook",
      title: "Upwork 3-Part High-Conversion Hook",
      category: "Upwork Outreach",
      text: `Hey [Client Name],\n\nI saw you're looking to automate [Specific Process, e.g., lead qualification in Airtable]. Most people over-complicate this with custom code, but you can solve this cleanly in Make/n8n in under 48 hours.\n\nI recorded a quick 60-second video demonstrating how the webhook triggers and filters invalid records before syncing to your CRM:\n\n[Loom Video Link]\n\nQuick question: Are you currently receiving these leads via webhook, or are they coming from a web form?\n\nBest,\n[Your Name] // TaskHelix`
    },
    {
      id: "cold_email_diagnostic",
      title: "Cold Email Free Diagnostic Blueprint",
      category: "Cold Outbound",
      text: `Subject: Quick question regarding [Company Name]'s lead response time\n\nHi [First Name],\n\nI noticed your team is running active campaigns for [Service/Product], but noticed response times on inbound inquiries can average 20+ minutes during peak hours.\n\nI built a visual workflow diagram showing how to route new leads into WhatsApp/SMS in under 45 seconds with instant calendar booking:\n\n[Link to Visual Diagram / 60s Loom]\n\nNo pitch or sales call expected — happy to send over the diagram if you'd find it useful for your ops team.\n\nBest,\n[Your Name]\nTaskHelix Automation`
    },
    {
      id: "discovery_diagnostic_sop",
      title: "5-Step Diagnostic Discovery Framework",
      category: "Sales Calls",
      text: `1. SITUATION: "Walk me through what happens today from the second a lead enters your system to when they get contacted."\n2. FRICTION: "Where does this process break down most often? (Missed follow-ups, manual copy-pasting, delayed routing?)"\n3. IMPACT: "How many leads or hours of manual work is that costing your team every week?"\n4. DESIRED OUTCOME: "If this ran 100% on autopilot with zero human touch, what does success look like in 30 days?"\n5. LOW-FRICTION CLOSE: "We can deploy a pilot version of this in 72 hours. Let's start with the lead router; once you see it working, we can discuss the full system."`
    },
    {
      id: "boundary_price_anchor",
      title: "Price Objection & Boundary Defense",
      category: "Closing & Retainers",
      text: `Client: "That's more expensive than we budgeted."\n\nYou: "I completely understand. The reason our setup is $1,500 with a $300 monthly monitoring retainer is that we guarantee sub-60-second execution and include automated error-recovery so your team never loses a lead.\n\nIf we cut the price, we'd have to remove the error-monitoring safeguards, and with lead follow-up, a single dropped webhook costs more than the entire retainer.\n\nWould you prefer to start with the core lead router first at $750, or deploy the complete system?"`
    }
  ],

  // Emergency Obstacle Interventions
  obstacles: [
    {
      trigger: "Acute Cognitive Freezing / Procrastination",
      trap: "Opening YouTube, Reddit, or cleaning the room to escape discomfort.",
      action: "Execute 2-Min Procrastination Reset. Stand up, 10 air squats, open Upwork, write ONLY 1 sentence."
    },
    {
      trigger: "Perfectionistic Paralysis (Offer not good enough)",
      trap: "Spending 4 hours tweaking n8n nodes instead of sending outreach.",
      action: "Apply Law of Good Enough: An 80% template shipped beats 100% in staging. Send the pitch now."
    },
    {
      trigger: "Rejection / Ignored Outreach Shame",
      trap: "Taking the silence personally and stopping daily outreach for 3 days.",
      action: "Log as Exposure Conquest (+1 Rung). Silence is market data, not personal identity. Send the next proposal."
    },
    {
      trigger: "Night-Shift Fatigue / Oversleeping Past 15:00",
      trap: "Thinking the day is ruined and skipping outreach entirely.",
      action: "Compress Deep Work 1 into an emergency 25-minute sprint: 1 proposal sent is an infinite win over 0."
    }
  ],

  // Avoidance Taxonomies
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
