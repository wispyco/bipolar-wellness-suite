export type SuiteApp = {
  id: string
  slug: string
  title: string
  shortTitle: string
  tag: string
  status: 'Native page' | 'Embedded prototype' | 'Blueprint page'
  summary: string
  subtitle: string
  foundation: string
  research: string
  prototypePath?: string
  focusAreas: string[]
  outcomes: string[]
  nextPhase: string[]
}

export const suiteApps: SuiteApp[] = [
  {
    id: '01',
    slug: '01-mood-tracker',
    title: 'Mood Spectrum Tracker',
    shortTitle: 'Mood Tracker',
    tag: 'Life Chart Method',
    status: 'Native page',
    summary:
      'Daily mood charting using the Life Chart Method with granular hypomania and depression tracking.',
    subtitle:
      'Track mood, sleep, medication, anxiety, and energy in one longitudinal bipolar wellness view.',
    foundation:
      'Based on the NIMH Life Chart Method for prospective mood monitoring across the bipolar illness course.',
    research: 'Life Chart Method (NIMH)',
    prototypePath: '/apps/01-mood-tracker/index.html',
    focusAreas: [
      'Daily log entry with 9-point mood scale',
      'Sleep, medication, irritability, anxiety, and energy capture',
      'Life Chart visualization with mood zones',
      'Weekly summary and recent history review',
    ],
    outcomes: [
      'Spot early shifts toward depression or mania',
      'Support clinical conversations with structured tracking',
      'See longitudinal patterns instead of isolated bad days',
    ],
    nextPhase: [
      'Convert the legacy prototype into native React state and chart components',
      'Add optional correlations across sleep, medication, and routine stability',
    ],
  },
  {
    id: '02',
    slug: '02-circadian',
    title: 'Circadian Rhythm Analyzer',
    shortTitle: 'Circadian Analyzer',
    tag: 'Chronobiology',
    status: 'Native page',
    summary:
      'Track sleep/wake patterns and their impact on mood cycles using chronobiological principles.',
    subtitle:
      'Review sleep windows, circadian consistency, and social rhythm anchors in one place.',
    foundation:
      'Grounded in Social Rhythm Therapy and chronobiology research showing the protective effect of stable sleep timing.',
    research: 'Social Rhythm Therapy',
    prototypePath: '/apps/02-circadian/index.html',
    focusAreas: [
      'Sleep log for bedtime, wake time, quality, and naps',
      'Sleep architecture chart across 14 days',
      'Circadian score for timing consistency',
      'Social Rhythm Metric (SRM-5) anchors and bipolar-specific sleep tips',
    ],
    outcomes: [
      'Understand whether routine instability may be driving mood volatility',
      'See stabilization trends over time',
      'Translate sleep hygiene into measurable routines',
    ],
    nextPhase: [
      'Rebuild charts and SRM workflows as native client components',
      'Link mood-tracker summaries to sleep disruption signals',
    ],
  },
  {
    id: '03',
    slug: '03-cbt-journal',
    title: 'Cognitive Patterns Journal',
    shortTitle: 'CBT Journal',
    tag: 'CBT',
    status: 'Native page',
    summary:
      'CBT thought records for cognitive restructuring — identify and reframe distorted thinking patterns.',
    subtitle:
      'Capture situations, automatic thoughts, emotions, distortions, and healthier reframes.',
    foundation:
      'Built from CBT for bipolar disorder research emphasizing cognitive restructuring and relapse prevention.',
    research: 'CBT for bipolar disorder',
    prototypePath: '/apps/03-cbt-journal/index.html',
    focusAreas: [
      'Thought record form for situation, thought, emotion, and reframe',
      '15 common cognitive distortions and guided prompts',
      'Pattern analysis charts for distortions and intensity',
      'Reframe helper and distortion reference guide',
    ],
    outcomes: [
      'Slow down cognitive spirals before they intensify',
      'Turn repetitive thinking into visible patterns',
      'Build a reusable reframe practice',
    ],
    nextPhase: [
      'Turn the prototype into native React forms and charts',
      'Connect reframe patterns to mood and warning-sign workflows',
    ],
  },
  {
    id: '04',
    slug: '04-warning-signals',
    title: 'Early Warning Signal Detector',
    shortTitle: 'Warning Signals',
    tag: 'Prodromal Detection',
    status: 'Native page',
    summary: 'Monitor prodromal symptoms to catch episodes early — personalized warning sign tracking.',
    subtitle:
      'Rate warning signs daily and surface green/yellow/orange/red alert states before a full episode develops.',
    foundation:
      'Based on prodromal symptom monitoring research and early intervention planning for bipolar episodes.',
    research: 'Prodromal monitoring',
    prototypePath: '/apps/04-warning-signals/index.html',
    focusAreas: [
      'Personalized warning-sign checklist with mania and depression categories',
      'Daily severity scoring from 0 to 3',
      'Risk trends and split charts',
      'Action-plan recommendations by alert level',
    ],
    outcomes: [
      'Catch changes early enough to intervene',
      'Reduce ambiguity around “am I starting to slip?”',
      'Keep a shared language for support and care planning',
    ],
    nextPhase: [
      'Native React conversion for the alert engine and charts',
      'Cross-link warning scores with mood, sleep, and medication adherence',
    ],
  },
  {
    id: '05',
    slug: '05-social-rhythm',
    title: 'Social Rhythm Stabilizer',
    shortTitle: 'Social Rhythm',
    tag: 'IPSRT',
    status: 'Native page',
    summary:
      'IPSRT-based daily routine scheduling to stabilize biological rhythms through consistent social timing.',
    subtitle:
      'Track the five core social rhythm anchors, disruptions, and routine regularity from day to day.',
    foundation:
      'Based on Interpersonal and Social Rhythm Therapy (IPSRT) and the role of routine regularity in bipolar stability.',
    research: 'IPSRT',
    prototypePath: '/apps/05-social-rhythm/index.html',
    focusAreas: [
      'Social Rhythm Metric (SRM-5) daily logging',
      'Rhythm regularity scoring and visual timeline',
      'Disruption logging and scheduler tools',
      'Tips for maintaining steady daily anchors',
    ],
    outcomes: [
      'Spot the cost of irregular routines quickly',
      'Protect routines that lower relapse risk',
      'Build practical consistency around social timing',
    ],
    nextPhase: [
      'Replace the prototype with reusable timeline and score components',
      'Tie disruptions back to mood and sleep patterns',
    ],
  },
  {
    id: '06',
    slug: '06-medication',
    title: 'Medication Adherence Tracker',
    shortTitle: 'Medication Tracker',
    tag: 'Adherence',
    status: 'Native page',
    summary: 'Adherence logging with side effect monitoring and medication schedule management.',
    subtitle:
      'Review daily adherence, side effects, effectiveness, and missed-dose patterns in one medication workflow.',
    foundation:
      'Grounded in medication adherence research showing that consistent use is one of the strongest predictors of stability.',
    research: 'Medication adherence research',
    prototypePath: '/apps/06-medication/index.html',
    focusAreas: [
      'Medication list manager and daily check-off workflow',
      'Weekly adherence and streak summaries',
      'Side-effect tracking with severity trends',
      'Effectiveness ratings over time',
    ],
    outcomes: [
      'Make adherence visible without judgment',
      'Track whether side effects are driving drop-off',
      'Support better conversations about tolerability and effectiveness',
    ],
    nextPhase: [
      'Native React medication and chart modules',
      'Integrate adherence trends with mood and routine changes',
    ],
  },
  {
    id: '07',
    slug: '07-quality-of-life',
    title: 'Quality of Life Dashboard',
    shortTitle: 'Quality of Life',
    tag: 'QoL.BD',
    status: 'Native page',
    summary: '12-domain QoL self-assessment based on the validated QoL.BD instrument.',
    subtitle:
      'Assess the broader impact of bipolar health across sleep, identity, relationships, work, and daily life.',
    foundation:
      'Designed around the QoL.BD framework, which measures quality of life across domains highly relevant to bipolar disorder.',
    research: 'QoL.BD framework',
    focusAreas: [
      '12-domain assessment with Likert responses',
      'Radar-style comparison across domains',
      'Strength and growth-area identification',
      'Action suggestions for low-scoring areas',
    ],
    outcomes: [
      'Look beyond symptom control toward lived quality of life',
      'Identify where functioning is improving or stuck',
      'Create a more balanced recovery conversation',
    ],
    nextPhase: [
      'Add scored assessments and a radar visualization',
      'Track weekly deltas and suggested action plans by domain',
    ],
  },
  {
    id: '08',
    slug: '08-psychoeducation-library',
    title: 'Psychoeducation Library',
    shortTitle: 'Psychoeducation',
    tag: 'Psychoeducation',
    status: 'Native page',
    summary: 'Evidence-based learning modules on bipolar disorder — understanding, managing, thriving.',
    subtitle:
      'A modular learning library covering bipolar types, medications, therapy, triggers, sleep, stress, and support systems.',
    foundation:
      'Based on CANMAT/ISBD psychoeducation recommendations that improve self-management and relapse prevention.',
    research: 'CANMAT/ISBD psychoeducation',
    focusAreas: [
      'Interactive learning modules with reading time and difficulty',
      'Quizzes and knowledge checks',
      'Research citations and key takeaways',
      'Bookmarks and progress tracking',
    ],
    outcomes: [
      'Turn guidance into understandable, reusable learning',
      'Build confidence in treatment and self-management choices',
      'Support shared understanding with family and care teams',
    ],
    nextPhase: [
      'Build module cards, progress tracking, and quizzes',
      'Add citation-backed content for each topic area',
    ],
  },
  {
    id: '09',
    slug: '09-chronotherapy-planner',
    title: 'Chronotherapy Planner',
    shortTitle: 'Chronotherapy',
    tag: 'Chronotherapy',
    status: 'Native page',
    summary: 'Bright light therapy and sleep phase scheduling based on chronotherapy protocols.',
    subtitle:
      'Plan light exposure, dark therapy, wake therapy, and seasonal adjustments with safety-first guidance.',
    foundation:
      'Inspired by ISBD chronotherapy recommendations for bipolar depression and circadian phase support.',
    research: 'ISBD chronotherapy recommendations',
    focusAreas: [
      'Bright light therapy scheduling',
      'Dark therapy and blue-light management planning',
      'Wake therapy safety guidance',
      'Seasonal adjustment and light-exposure logging',
    ],
    outcomes: [
      'Help structure circadian interventions safely',
      'Translate evidence into clear scheduling decisions',
      'Prepare for future integration with sleep data',
    ],
    nextPhase: [
      'Add planners and logging workflows for each chronotherapy modality',
      'Integrate recommendations with circadian analyzer data',
    ],
  },
  {
    id: '10',
    slug: '10-crisis-support-planner',
    title: 'Crisis & Support Planner',
    shortTitle: 'Crisis & Support',
    tag: 'Safety Planning',
    status: 'Native page',
    summary: 'Safety planning and support network organization — Stanley-Brown Safety Planning.',
    subtitle:
      'Build a personal safety plan, organize support contacts, and keep crisis resources easy to reach.',
    foundation:
      'Grounded in the Stanley & Brown Safety Planning model and bipolar crisis-intervention best practices.',
    research: 'Stanley & Brown safety planning',
    focusAreas: [
      'Six-step personal safety plan builder',
      'Support-network mapping',
      'Wellness plan guidance for depression and mania',
      'Emergency resources and communication templates',
    ],
    outcomes: [
      'Make crisis preparation concrete before it is needed',
      'Reduce friction when reaching out for support',
      'Keep coping strategies visible and actionable',
    ],
    nextPhase: [
      'Add editable safety-plan steps and printable summaries',
      'Create support-network and emergency-contact tools',
    ],
  },
  {
    id: '11',
    slug: '11-functional-remediation',
    title: 'Functional Remediation',
    shortTitle: 'Functional Remediation',
    tag: 'Neurocognitive',
    status: 'Native page',
    summary: 'Cognitive training and occupational goal-setting based on neurocognitive rehabilitation.',
    subtitle:
      'Support functioning between episodes through cognitive exercises, goals, and accommodation planning.',
    foundation:
      'Based on functional remediation research addressing persistent neurocognitive and occupational impairments in bipolar disorder.',
    research: 'Functional remediation',
    focusAreas: [
      'Attention, memory, and executive-function exercises',
      'Occupational goal tracking',
      'Daily functioning self-assessment',
      'Work and school accommodation planning',
    ],
    outcomes: [
      'Focus on functioning, not only symptoms',
      'Practice compensatory strategies for cognitive drag',
      'Make workplace and school supports easier to plan',
    ],
    nextPhase: [
      'Add lightweight cognitive exercises and progress tracking',
      'Build accommodation planning and goal workflows',
    ],
  },
  {
    id: '12',
    slug: '12-command-center',
    title: 'Command Center',
    shortTitle: 'Command Center',
    tag: 'Integration',
    status: 'Native page',
    summary: 'Unified dashboard integrating all tools — your complete bipolar wellness overview.',
    subtitle:
      'See cross-tool signals, weekly summaries, and the long-range picture of routines, symptoms, and supports.',
    foundation:
      'Acts as the suite-level synthesis layer for the other eleven tools, surfacing trends and cross-correlations.',
    research: 'Integrated self-management dashboard',
    focusAreas: [
      'Overview dashboard of key metrics from every tool',
      'Unified timeline and cross-correlation insights',
      'Weekly wellness report generation',
      'Exports and navigation hub shortcuts',
    ],
    outcomes: [
      'Turn scattered self-management data into a coherent story',
      'Spot relationships between sleep, mood, meds, and routines',
      'Provide a clinician-friendly high-level summary',
    ],
    nextPhase: [
      'Add synthesized metrics once native app modules are complete',
      'Build report generation and export flows',
    ],
  },
]

export const suiteFoundations = [
  {
    title: 'Life Chart Method',
    body:
      'Developed at NIMH by Dr. Robert Post, the Life Chart Method supports granular longitudinal tracking of mood states, sleep, medications, and life events.',
  },
  {
    title: 'Evidence-Based Therapies',
    body:
      'The suite is informed by CBT, IPSRT, psychoeducation, chronotherapy, safety planning, and functional remediation research.',
  },
  {
    title: 'Self-Management Science',
    body:
      'Each tool turns research-backed bipolar self-management strategies into concrete daily workflows and reflective check-ins.',
  },
] as const

export const interactiveAppCount = suiteApps.filter((app) => app.prototypePath).length

export function getAppBySlug(slug: string) {
  return suiteApps.find((app) => app.slug === slug)
}
