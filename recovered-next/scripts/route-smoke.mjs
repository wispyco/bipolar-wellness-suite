const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000'

const checks = [
  {
    path: '/',
    includes: ['One Next.js home for all 12 bipolar wellness tools.', 'Browse the full suite'],
  },
  {
    path: '/apps/01-mood-tracker',
    includes: ['Native Next.js implementation', "Log today&#x27;s entry", 'Open legacy prototype for comparison'],
  },
  {
    path: '/apps/02-circadian',
    includes: ['Native Next.js implementation', "Log last night&#x27;s sleep", 'Social Rhythm'],
  },
  {
    path: '/apps/03-cbt-journal',
    includes: ['Native Next.js implementation', 'Thought Record', 'Reframe Helper'],
  },
  {
    path: '/apps/04-warning-signals',
    includes: ['Native Next.js implementation', 'Today&#x27;s Check-in', 'Risk score'],
  },
  {
    path: '/apps/05-social-rhythm',
    includes: ['Native Next.js implementation', 'Social Rhythm Metric', 'Weekly Rhythm Regularity Index'],
  },
  {
    path: '/apps/06-medication',
    includes: ['Native Next.js implementation', 'Today&#x27;s medications', 'Weekly adherence'],
  },
  {
    path: '/apps/07-quality-of-life',
    includes: ['Native Next.js implementation', '12-domain self-assessment', 'Overall QoL average'],
  },
  {
    path: '/apps/08-psychoeducation-library',
    includes: ['Native Next.js implementation', 'Learning modules', 'Knowledge check'],
  },
  {
    path: '/apps/09-chronotherapy-planner',
    includes: ['Native Next.js implementation', 'Protocol planner', 'Light / chronotherapy log'],
  },
  {
    path: '/apps/10-crisis-support-planner',
    includes: ['Native Next.js implementation', 'Personal safety plan', 'Support network'],
  },
  {
    path: '/apps/11-functional-remediation',
    includes: ['Native Next.js implementation', 'Cognitive exercises', 'Accommodation ideas'],
  },
  {
    path: '/apps/12-command-center',
    includes: ['Native Next.js implementation', 'Weekly cross-app insights', 'Weekly wellness report snapshot'],
  },
]

async function verifyRoute({ path, includes }) {
  const response = await fetch(`${baseUrl}${path}`)

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`)
  }

  const html = await response.text()
  const missing = includes.filter((snippet) => !html.includes(snippet))

  if (missing.length > 0) {
    throw new Error(`${path} missing expected content: ${missing.join(', ')}`)
  }

  console.log(`PASS ${path}`)
}

await Promise.all(checks.map(verifyRoute))
