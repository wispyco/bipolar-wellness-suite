'use client'

import Link from 'next/link'

const systemCards = [
  { title: 'Mood + Sleep', value: 'Stable', detail: 'Mood baseline with improved sleep regularity over the last week.' },
  { title: 'Medication', value: '86%', detail: 'Strong adherence with one recurring missed-evening pattern to review.' },
  { title: 'Warning Signals', value: 'Yellow', detail: 'Low-to-moderate activation signs remain worth watching.' },
  { title: 'QoL Snapshot', value: '3.0 / 5', detail: 'Strengths in identity and spirituality; growth areas in sleep and cognition.' },
]

const weeklyInsights = [
  'Sleep regularity improved alongside lower mood volatility — keep protecting wake time.',
  'Medication adherence is strongest in the morning and more vulnerable at night.',
  'Warning-sign intensity dropped after sleep and stimulation changes were tightened.',
  'Quality-of-life growth areas point toward energy conservation and cognitive support, not just symptom tracking.',
] as const

const destinationLinks = [
  { href: '/apps/01-mood-tracker', label: 'Mood Tracker' },
  { href: '/apps/02-circadian', label: 'Circadian Analyzer' },
  { href: '/apps/06-medication', label: 'Medication Tracker' },
  { href: '/apps/10-crisis-support-planner', label: 'Crisis Planner' },
] as const

export function CommandCenterApp() {
  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        {systemCards.map((card) => (
          <div key={card.title} className="native-card native-card--padded adherence-card">
            <span className="summary-card__label">{card.title}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Weekly cross-app insights</h2>
            <p>A lightweight command-center view that turns multiple tools into one coherent summary.</p>
          </div>
          <ul className="feature-list">
            {weeklyInsights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Jump back into a tool</h2>
            <p>Use the command center as a routing layer for the most actionable follow-up workflows.</p>
          </div>
          <div className="manage-list">
            {destinationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="library-module">
                <strong>{link.label}</strong>
                <p>Open the detailed workflow</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="native-card native-card--padded">
        <div className="native-section-heading">
          <h2>Weekly wellness report snapshot</h2>
          <p>This MVP report block shows the intended command-center output: trends, cross-correlations, and action cues.</p>
        </div>
        <div className="comparison-grid">
          <div className="mini-stat mini-stat--wide">
            <span>Primary strength</span>
            <strong>Routine protection is improving and appears to support symptom stability.</strong>
          </div>
          <div className="mini-stat mini-stat--wide">
            <span>Primary risk</span>
            <strong>Evening structure remains the most vulnerable point across sleep, meds, and activation.</strong>
          </div>
          <div className="mini-stat mini-stat--wide">
            <span>Next best action</span>
            <strong>Review the circadian and medication tools together and tighten the evening shutdown routine.</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
