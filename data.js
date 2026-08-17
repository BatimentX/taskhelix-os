// TaskHelix Master Data Configuration
const TASKHELIX_DATA = {
  agencyName: "TaskHelix",

  avoidanceActivities: [
    { id: "youtube_research", label: "YouTube / Research Trap" },
    { id: "social_media", label: "Social Media / Reddit / X" },
    { id: "gaming", label: "Video Games" },
    { id: "fake_work", label: "Over-Tweaking Tech / Fake Work" },
    { id: "sleep_fatigue", label: "Sleep / Nap / Exhaustion" },
    { id: "chores", label: "Chores / Household / Distraction" },
    { id: "other", label: "Other Activity" }
  ],

  emotionalDrivers: [
    { id: "fear_rejection", label: "Fear of Rejection / Exposure" },
    { id: "perfectionism", label: "Perfectionism Freeze / Not Ready" },
    { id: "boredom_adhd", label: "ADHD Under-Stimulation / Boredom" },
    { id: "gig_fatigue", label: "Physical Exhaustion from Gig Shifts" },
    { id: "dopamine_craving", label: "Craving Easy Dopamine" },
    { id: "emergency", label: "Legitimate Obligation / Emergency" }
  ],

  scheduleBlocks: [
    {
      id: "wake_ignition",
      name: "Wake & Physiological Ignition",
      start: "15:00",
      end: "15:20",
      type: "routine",
      color: "emerald",
      activities: "Hydration (500ml + electrolytes), 3 rounds Wim Hof breathing, sunlight/light therapy. No phone checking.",
      actionText: "Execute Wim Hof & hydrate immediately"
    },
    {
      id: "deep_work_1",
      name: "PROTECTED DEEP WORK BLOCK 1 (Outreach & Pipeline)",
      start: "15:20",
      end: "16:45",
      type: "revenue",
      color: "emerald",
      activities: "NON-NEGOTIABLE: Upwork proposal scouting & sending (2-3 bids), Cold email prospect enrichment & sending (10 touches). Zero tutorial watching.",
      actionText: "Send 2 Upwork Proposals + 5 Cold Emails"
    },
    {
      id: "gym_training",
      name: "Physical Training (Gym / Home)",
      start: "16:45",
      end: "17:45",
      type: "health",
      color: "amber",
      activities: "Heavy compound lifting (Gym Tue-Thu) or High-intensity kettlebell/bodyweight (Home Fri-Mon). Physical reset.",
      actionText: "Complete workout sprint & push physical limits"
    },
    {
      id: "recovery_nutrition",
      name: "Transition & Nutrition",
      start: "17:45",
      end: "18:15",
      type: "routine",
      color: "blue",
      activities: "Shower, high-protein meal, 5-minute prefrontal reset meditation.",
      actionText: "Shower, eat protein, complete 5-min meditation"
    },
    {
      id: "deep_work_2",
      name: "DEEP WORK BLOCK 2 (Asset Building & Delivery)",
      start: "18:15",
      end: "19:30",
      type: "build",
      color: "emerald",
      activities: "Build/tweak standard workflow templates in n8n/Make, record Loom demo videos, update CRM & error handling.",
      actionText: "Build/test n8n blueprints or record Loom demo"
    },
    {
      id: "commute_brenda",
      name: "Drive Brenda to Work",
      start: "19:35",
      end: "20:00",
      type: "transit",
      color: "purple",
      activities: "Commute transition. Listen to silence or neutral ambient sounds.",
      actionText: "Safe driving & mental transition"
    },
    {
      id: "gig_shift_1",
      name: "Gig-Work Block 1",
      start: "20:15",
      end: "01:15",
      type: "gig",
      color: "indigo",
      activities: "Drive rideshare/delivery. RULE: No business podcasts or video content. Listen to music or fiction audiobooks.",
      actionText: "Steady gig-work execution"
    },
    {
      id: "gig_break",
      name: "Mid-Shift Break & Mental Decompression",
      start: "01:15",
      end: "01:45",
      type: "routine",
      color: "blue",
      activities: "Clean nutrition, 10-minute walk or eye-rest in car. Hydrate.",
      actionText: "Decompress eyes and hydrate"
    },
    {
      id: "gig_shift_2",
      name: "Gig-Work Block 2",
      start: "01:45",
      end: "05:30",
      type: "gig",
      color: "indigo",
      activities: "Execute gig work steadily. Focus on road safety and smooth driving.",
      actionText: "Final gig-work driving block"
    },
    {
      id: "pickup_return",
      name: "Pickup & Commute Home",
      start: "05:30",
      end: "07:00",
      type: "transit",
      color: "purple",
      activities: "Move toward pickup location, drive home safely.",
      actionText: "Pickup Brenda & commute home"
    },
    {
      id: "shutdown_tracker",
      name: "Shutdown Ritual & Tracker Log",
      start: "07:00",
      end: "07:30",
      type: "routine",
      color: "emerald",
      activities: "Log Behavioral Tracker data, plan next day's 2 Upwork targets, pack gym gear, close all screens.",
      actionText: "Log day's actions & write 2 tomorrow targets"
    },
    {
      id: "sleep_window",
      name: "Sleep Window (7.5 Hours)",
      start: "07:30",
      end: "15:00",
      type: "sleep",
      color: "slate",
      activities: "Blackout curtains, eye mask, earplugs, room cooled to 19°C. Total digital blackout.",
      actionText: "Restorative deep sleep"
    }
  ],

  exposureLadder: [
    {
      rung: 1,
      title: "Survive the 'No' (Baseline Outreach)",
      task: "Submit 3 Upwork Proposals Using a Text-Only Pitch with zero emotional attachment to outcome.",
      discomfortScore: "1/10",
      category: "Rejection"
    },
    {
      rung: 2,
      title: "Public Proof-of-Work",
      task: "Post a Public Workflow Breakdown & Architecture Diagram on LinkedIn.",
      discomfortScore: "2/10",
      category: "Visibility"
    },
    {
      rung: 3,
      title: "Cold Proactive Offering",
      task: "Send 20 Cold Emails offering a free Lead-Response Blueprint with no hard pitch.",
      discomfortScore: "3/10",
      category: "Rejection"
    },
    {
      rung: 4,
      title: "Video Face-to-Camera Audit",
      task: "Submit 5 Upwork proposals with a personalized 60-second Loom screen audit attached.",
      discomfortScore: "4/10",
      category: "Visibility"
    },
    {
      rung: 5,
      title: "Direct B2B Outreach",
      task: "Direct message 15 agency owners on LinkedIn offering a custom 60-second process audit.",
      discomfortScore: "5/10",
      category: "Outreach"
    },
    {
      rung: 6,
      title: "In-Person Exposure",
      task: "Walk into a local business (trades/clinic), speak to the manager, and ask what software takes most time.",
      discomfortScore: "6/10",
      category: "Social"
    },
    {
      rung: 7,
      title: "Live Discovery Call",
      task: "Conduct a 20-Minute live Zoom discovery call with an inbound prospect without apologizing for experience.",
      discomfortScore: "7/10",
      category: "Sales"
    },
    {
      rung: 8,
      title: "The $1,500 Quote",
      task: "Quote $1,500 Setup + $350/mo Retainer on a live sales call without hesitating or discounting.",
      discomfortScore: "8/10",
      category: "Pricing"
    },
    {
      rung: 9,
      title: "Boundary Enforcement",
      task: "Tell a demanding client: 'That is out of scope. That will require an add-on fee of $500.'",
      discomfortScore: "9/10",
      category: "Boundaries"
    },
    {
      rung: 10,
      title: "High-Ticket Closing",
      task: "Pitch a $3,000 Custom System on a live Zoom call and close the deal without preemptive price cuts.",
      discomfortScore: "10/10",
      category: "Mastery"
    }
  ],

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
        "Install Website Blocker for YouTube/X on laptop",
        "Optimize Upwork profile title: 'AI Automation Specialist | n8n & Make Workflow Architect'",
        "Record baseline cognitive fatigue during gig shifts"
      ],
      exposureChallenge: "Submit 5 Upwork proposals expecting 0 replies (desensitization trial).",
      successMetrics: "5 proposals submitted; 5/5 deep work sessions executed; 0 daytime YouTube hours.",
      reviewProcess: "Check tracker log: Did you delay outreach to tweak your profile? If yes, note the emotion."
    },
    {
      week: 2,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "Core Asset #1 (Speed-to-Lead AI System)",
      objective: "Build and document a rock-solid, reusable Lead Qualification & Booking Engine in n8n/Make.",
      dailyActions: [
        "Submit 2 tailored Upwork proposals per day with custom 60-sec Loom audits",
        "Build Speed-to-Lead blueprint (Webhook -> GPT-4o-mini parsing -> Twilio/Sendgrid -> Cal.com)",
        "Log mood before/after every proposal block"
      ],
      weeklyActions: [
        "Record crisp 90-second Loom demonstration of live webhook triggering",
        "Write 1-page Notion PDF blueprint sheet for Asset #1",
        "Set up standard proposal response snippet bank"
      ],
      exposureChallenge: "Send 10 cold emails to local real estate or home service agencies offering the Loom demo.",
      successMetrics: "Asset #1 complete; 10 Upwork proposals sent; 10 cold emails dispatched.",
      reviewProcess: "Upwork proposal view rate check: If < 20%, rewrite the first 2 hook lines."
    },
    {
      week: 3,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "Core Asset #2 (AI Document & Invoice Processor)",
      objective: "Build second high-utility B2B workflow and scale daily outreach.",
      dailyActions: [
        "Submit 2 Upwork proposals + 5 personalized cold emails daily",
        "Build AI Invoice/Receipt Parser (Email trigger -> GPT-4 Vision -> Airtable/QuickBooks -> Slack)",
        "Maintain zero daytime video consumption"
      ],
      weeklyActions: [
        "Package Asset #1 and #2 into clean Notion 'Client Solutions' portfolio",
        "Create standard error handling and auto-retry nodes",
        "Review open rates on cold email campaign"
      ],
      exposureChallenge: "Walk into 3 local businesses (trade/clinic/repair) and ask who manages their software.",
      successMetrics: "Asset #2 operational; 10 Upwork bids; 25 cold emails; 3 in-person exposures.",
      reviewProcess: "Log emotional resistance during local exposures. Note: Did anything catastrophic occur?"
    },
    {
      week: 4,
      phase: 1,
      phaseTitle: "Foundations & Desensitization",
      title: "The 50-Touch Milestone & First Discovery",
      objective: "Reach 50 cumulative outreach exposures and secure first discovery conversation.",
      dailyActions: [
        "Daily Outreach: 2 Upwork bids + 5 cold emails without hesitation",
        "Test resilience of Asset #1 and #2 under edge case JSON inputs",
        "Record 1 Loom audit daily for highest-budget Upwork listing"
      ],
      weeklyActions: [
        "Audit conversion ratio: Proposals -> Views -> Replies -> Calls",
        "Clean up CRM / Lead Tracker spreadsheet",
        "Phase 1 retrospective review"
      ],
      exposureChallenge: "Quote a minimum price of $500 to any prospect who responds (no $50 gigs).",
      successMetrics: "50 cumulative outreach touches reached; 1-2 prospect conversations active.",
      reviewProcess: "Evaluate total rejection tolerance. Notice how the feeling of dread has reduced."
    },
    {
      week: 5,
      phase: 2,
      phaseTitle: "Pilot Client Acquisition & Delivery",
      title: "The 'Free Pilot for Video Testimonial' Campaign",
      objective: "Secure 1 pilot client for Speed-to-Lead system in exchange for a video testimonial.",
      dailyActions: [
        "Pitch warm leads: 'Deploy Speed-to-Lead free; if it saves 5+ hrs, give a 60-sec video review'",
        "Submit 2 Upwork proposals daily to keep pipeline warm",
        "Prepare client onboarding checklist"
      ],
      weeklyActions: [
        "Secure signed/written scope for Pilot #1",
        "Set up secure Airtable credential collection form",
        "Verify all API keys before delivery sprint"
      ],
      exposureChallenge: "Conduct your first live Zoom discovery call without apologizing for experience.",
      successMetrics: "1 pilot client secured with agreed scope; 10 Upwork bids sent.",
      reviewProcess: "Did you over-promise custom features? If yes, strip scope back to template boundaries."
    },
    {
      week: 6,
      phase: 2,
      phaseTitle: "Pilot Client Acquisition & Delivery",
      title: "Delivery Sprint & System Deployment",
      objective: "Deploy, test, and hand over Pilot #1 system within 72 hours.",
      dailyActions: [
        "Execute client onboarding and live end-to-end testing of pilot workflow",
        "Maintain pipeline: 2 Upwork proposals/day (never stop outreach during delivery)",
        "Create 2-minute Loom tutorial for client's staff"
      ],
      weeklyActions: [
        "Deliver workflow to client with zero breaking errors",
        "Record client handover walkthrough Loom",
        "Request testimonial video"
      ],
      exposureChallenge: "Ask the pilot client directly on a live call for their video testimonial upon testing.",
      successMetrics: "Pilot system live and working; 60-sec video or written testimonial collected.",
      reviewProcess: "Measure delivery friction. Where did the client get confused? Update template docs."
    },
    {
      week: 7,
      phase: 2,
      phaseTitle: "Pilot Client Acquisition & Delivery",
      title: "Case Study Packaging & Price Elevation",
      objective: "Convert Pilot #1 into a high-converting Case Study and elevate price floor to $750-$1,000.",
      dailyActions: [
        "Send 10 cold emails/day featuring the case study: 'How we automated lead response in 48h'",
        "Submit 2 high-tier Upwork proposals ($1k+ budget posts)",
        "Follow up with all previous warm leads with the new testimonial"
      ],
      weeklyActions: [
        "Publish Case Study breakdown on LinkedIn with architecture screenshots",
        "Package PDF one-pager featuring client metrics and quote",
        "Set up Stripe payment links for $750 and $1,000 deposits"
      ],
      exposureChallenge: "Pitch a prospective client a $1,000 setup fee without flinching or discounting.",
      successMetrics: "Case study published; 10 Upwork proposals; 40 cold emails; 1 paying client closed ($750-$1k).",
      reviewProcess: "Monitor internal anxiety when quoting 4 figures. Notice how repetition builds calm."
    },
    {
      week: 8,
      phase: 2,
      phaseTitle: "Pilot Client Acquisition & Delivery",
      title: "Retainer Architecture & Systematic Follow-Ups",
      objective: "Sign Paying Client #2 and attach a recurring monthly maintenance retainer ($250-$400/mo).",
      dailyActions: [
        "Standard outreach block + re-engaging past leads with case study proof",
        "Deliver workflow for Paying Client #1 within 4 days",
        "Build standard maintenance SOP (API health checks, token usage reports)"
      ],
      weeklyActions: [
        "Pitch maintenance retainer to Client #1: 'For $300/mo, I monitor webhooks 24/7'",
        "Review effective hourly rate on agency vs gig work",
        "Mid-point 12-week comprehensive audit"
      ],
      exposureChallenge: "Pitch a recurring monthly retainer to an existing client without hesitation.",
      successMetrics: "$1,500+ total revenue booked; 1 recurring retainer contract signed.",
      reviewProcess: "Compare agency income to gig-work income. Calculate runway."
    },
    {
      week: 9,
      phase: 3,
      phaseTitle: "Commercial Scaling & Retainer Engine",
      title: "Inbound Engine & High-Ticket Bidding",
      objective: "Scale Upwork proposal conversion and increase average deal size to $1,500.",
      dailyActions: [
        "Scout Upwork for specialized enterprise niches (Hubspot, Stripe, custom webhooks)",
        "Submit 2 high-tier proposals daily with dynamic modular copy",
        "Post 2 LinkedIn technical breakdowns per week"
      ],
      weeklyActions: [
        "Refine LinkedIn profile into direct inbound funnel pointing to Calendly",
        "Update proposal generator snippets for fast custom bidding",
        "Optimize delivery templates for 50% faster deployment"
      ],
      exposureChallenge: "Decline a low-ball prospect offering < $400 for a complex build.",
      successMetrics: "10 Upwork bids; 2 discovery calls booked; $1,500 contract proposed.",
      reviewProcess: "Evaluate proposal speed: Should take < 20 mins including Loom audit."
    },
    {
      week: 10,
      phase: 3,
      phaseTitle: "Commercial Scaling & Retainer Engine",
      title: "Multi-Channel Execution & Client #3",
      objective: "Close Paying Client #3 ($1,500 setup + $350/mo retainer).",
      dailyActions: [
        "2 Upwork bids + 10 Cold Emails + 2 LinkedIn DMs daily",
        "Execute client delivery within standard 4-day SLA",
        "Monitor active client webhooks and error logs"
      ],
      weeklyActions: [
        "Systematize client onboarding form (Airtable key collection)",
        "Audit time spent on delivery vs outreach",
        "Schedule monthly check-ins with retainer clients"
      ],
      exposureChallenge: "Follow up 4 times with prospects who went cold after a discovery call.",
      successMetrics: "Client #3 closed; cumulative agency revenue surpasses $3,000.",
      reviewProcess: "Check delivery hours. Ensure client work is not leaking into sleep or gig-work blocks."
    },
    {
      week: 11,
      phase: 3,
      phaseTitle: "Commercial Scaling & Retainer Engine",
      title: "Retainer Optimization & Capacity Management",
      objective: "Close Paying Client #4 and solidify recurring monthly cash flow ($1,000+ MRR).",
      dailyActions: [
        "Pipeline management: follow-ups, contract closing, proposal delivery",
        "Refactor existing template codebases into standardized modular components",
        "Log all daily metrics in tracker"
      ],
      weeklyActions: [
        "Calculate effective hourly rate across all projects",
        "Draft subcontractor job description for future n8n node builders",
        "Prepare Month 4-6 roadmap"
      ],
      exposureChallenge: "Ask all active clients for referrals: 'Who else needs lead automation?'",
      successMetrics: "4 total paying clients closed; Monthly recurring revenue (MRR) >= $900.",
      reviewProcess: "Review operational stress. Are systems running without breaking?"
    },
    {
      week: 12,
      phase: 3,
      phaseTitle: "Commercial Scaling & Retainer Engine",
      title: "Master Operational Audit & Gig-Work Transition",
      objective: "Audit total 12-week metrics, lock in client retainers, and reduce 1 gig-work night shift.",
      dailyActions: [
        "Maintenance outreach (1 Upwork bid + 5 emails/day)",
        "Finalize client documentation and SOP vaults",
        "Execute daily Wim Hof and shutdown reviews cleanly"
      ],
      weeklyActions: [
        "Complete full financial audit: Cash Collected, Active Retainers, Pipeline Value",
        "Execute first reduction of gig-work driving hours",
        "Finalize 6-month scale roadmap"
      ],
      exposureChallenge: "Reduce gig-work driving by 1 full shift per week to reclaim energy for scaling.",
      successMetrics: "3-5 Total Paying Clients; $3,500-$5,500 total cash collected; $900-$1,500 MRR.",
      reviewProcess: "Full retrospective. Celebrate earned confidence through consistent action."
    }
  ],

  scripts: [
    {
      id: "upwork_hook_1",
      category: "Upwork Proposal Hooks",
      title: "Speed-to-Lead / Instant Qualification Hook",
      text: `Hi [Name],\n\nI reviewed your requirements for [specific tool, e.g. n8n lead router]. Most setups fail because webhook payloads drop during peak traffic when API rate limits hit.\n\nI built an exact live blueprint in [n8n/Make] that handles [specific issue] with automatic exponential retries and instant notification.\n\nHere is a 45-second Loom showing the live architecture running in staging: [Loom Link]\n\nAre you available for a brief 10-minute technical sync today or tomorrow?`
    },
    {
      id: "upwork_hook_2",
      category: "Upwork Proposal Hooks",
      title: "Diagnostic Question Hook (High Response Rate)",
      text: `Hi [Name],\n\nQuick diagnostic question before you hire anyone: Does your CRM API endpoint support batch updates, or will we need a rate-limiting queuing node in [n8n/Make] to prevent duplicate rows?\n\nI specialize specifically in [n8n/Make] workflow architecture and CRM sync. I can have this deployed and tested in your environment within 48 hours.\n\nLet me know if you'd like me to review your webhook structure.`
    },
    {
      id: "consultant_reality",
      category: "Consultant Boundary Scripts",
      title: "The 'I Don't Know Yet' Exposure Script",
      text: `That is an excellent technical question. Let me verify the exact API rate limits and integration endpoints for your specific setup and provide the exact recommendation by 2:00 PM.`
    },
    {
      id: "scope_enforcement",
      category: "Consultant Boundary Scripts",
      title: "Scope Creep Defense Script",
      text: `That feature is a great addition, but it falls outside the original blueprint scope we agreed upon. I can build that as an Add-On module for $450, or we can deploy Phase 1 first and schedule Phase 2 next week. Which do you prefer?`
    },
    {
      id: "retainer_pitch",
      category: "Sales & Retainers",
      title: "Monthly Maintenance Retainer Pitch",
      text: `Now that your system is live and converting leads, third-party APIs (Stripe, Twilio, OpenAI) occasionally update their schemas or hit temporary outages. For $300/mo, I monitor all error logs 24/7, maintain webhook health, and include 2 hours of monthly logic adjustments so you never miss a lead.`
    },
    {
      id: "testimonial_ask",
      category: "Sales & Retainers",
      title: "Post-Delivery Video Testimonial Script",
      text: `I'm thrilled that the workflow is already saving your team [X] hours this week! Since we completed delivery ahead of schedule, could you record a quick 45-second video on Loom sharing what problem we solved and how fast the turnaround was? It helps our small agency immensely.`
    }
  ],

  obstacles: [
    {
      id: "shame_imposter",
      trigger: "Intense shame / feeling like a fraud ('Who am I to charge for this?')",
      trap: "Believing you must be a world-renowned software engineer before helping an SMB connect an API.",
      action: "Say aloud: 'I am not selling credentials; I am selling an automated webhook that moves data.' Open Upwork and submit 1 proposal immediately."
    },
    {
      id: "perfectionism_freeze",
      trigger: "Paralyzed by perfectionism on a template build or proposal copy",
      trap: "Endlessly tweaking node colors or rewriting sentences to avoid clicking Send.",
      action: "Enforce the 80% Rule. Set a 10-minute timer. When it beeps, submit whatever is on screen regardless of perceived flaws."
    },
    {
      id: "boredom_adhd",
      trigger: "Boredom or under-stimulation ('Let me check AI news on Twitter')",
      trap: "Looking for novel stimulation to escape repetitive proposal sending or testing.",
      action: "Put on brown noise audio. Switch to strict 20-minute Pomodoro sprints with zero browser tab changes."
    },
    {
      id: "rejection_sting",
      trigger: "Received a rejection, rude reply, or 0 views on 5 proposals",
      trap: "Catastrophizing: 'The market is saturated, this business model doesn't work.'",
      action: "Log the rejection point in the Exposure Tracker. Goal is to collect 50 rejections. Rejection = data, not personal defect."
    },
    {
      id: "influencer_comparison",
      trigger: "Caught in a comparison loop watching an AI agency influencer",
      trap: "Comparing your Day 15 to their Year 4; feeling hopelessly behind.",
      action: "Slam laptop shut for 60 seconds. Say aloud: 'Their business is selling hype courses; my business is solving local operational bottlenecks.'"
    },
    {
      id: "binge_relapse",
      trigger: "Relapsed into a 2-hour YouTube / video binge",
      trap: "All-or-nothing thinking: 'The day is ruined anyway, I might as well keep watching.'",
      action: "Zero-Shame Reset. Drink 300ml cold water, do 15 air squats, and execute ONE single 15-minute outreach block before leaving for gig work."
    },
    {
      id: "overwhelm_bug",
      trigger: "Overwhelmed by a client bug or broken webhook",
      trap: "Panic: 'I broke their business, I'm going to get sued or humiliated.'",
      action: "Deactivate the live node. Replicate payload in local mock environment. Test 1 node at a time. If stuck > 45m, post on n8n forum."
    }
  ]
};
