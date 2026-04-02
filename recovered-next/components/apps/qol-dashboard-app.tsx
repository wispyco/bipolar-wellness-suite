'use client'

import { useMemo, useState } from 'react'

type Domain = {
  id: string
  name: string
  prompt: string
  action: string
}

const domains: Domain[] = [
  { id: 'physical', name: 'Physical Health', prompt: 'How supported does your body feel this week?', action: 'Protect hydration, movement, and medical follow-through.' },
  { id: 'sleep', name: 'Sleep', prompt: 'How restorative and regular has sleep felt?', action: 'Stabilize wake time and review bedtime drift.' },
  { id: 'mood', name: 'Mood', prompt: 'How manageable and steady has mood felt?', action: 'Notice patterns and review early warning signs.' },
  { id: 'cognition', name: 'Cognition', prompt: 'How clear and usable has your thinking felt?', action: 'Reduce overload and build cognitive supports.' },
  { id: 'leisure', name: 'Leisure', prompt: 'How much room has there been for enjoyment?', action: 'Schedule at least one low-friction restorative activity.' },
  { id: 'social', name: 'Social', prompt: 'How connected have you felt with other people?', action: 'Choose one safe connection point this week.' },
  { id: 'spirituality', name: 'Spirituality', prompt: 'How grounded or aligned have you felt?', action: 'Return to values, meaning, or grounding rituals.' },
  { id: 'finance', name: 'Finance', prompt: 'How manageable have financial demands felt?', action: 'Simplify one financial stressor or ask for support.' },
  { id: 'household', name: 'Household', prompt: 'How manageable have daily life tasks felt?', action: 'Reduce friction with one tiny system or reset.' },
  { id: 'selfesteem', name: 'Self-esteem', prompt: 'How much self-respect and self-trust have you felt?', action: 'Name one effort that deserves credit.' },
  { id: 'independence', name: 'Independence', prompt: 'How capable and autonomous have you felt?', action: 'Pick one area where a small reclaim of agency is possible.' },
  { id: 'identity', name: 'Identity', prompt: 'How connected have you felt to who you are beyond symptoms?', action: 'Reinforce roles, values, and interests beyond illness management.' },
]

const initialScores = {
  physical: 3,
  sleep: 2,
  mood: 3,
  cognition: 2,
  leisure: 2,
  social: 3,
  spirituality: 4,
  finance: 2,
  household: 3,
  selfesteem: 2,
  independence: 3,
  identity: 4,
} as Record<string, number>

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function QualityOfLifeApp() {
  const [scores, setScores] = useState<Record<string, number>>(initialScores)

  const orderedDomains = useMemo(
    () =>
      domains
        .map((domain) => ({ ...domain, score: scores[domain.id] }))
        .sort((left, right) => right.score - left.score),
    [scores],
  )

  const overallAverage = average(domains.map((domain) => scores[domain.id]))
  const strengths = orderedDomains.slice(0, 3)
  const growthAreas = [...orderedDomains].reverse().slice(0, 3)

  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Overall QoL average</span>
          <strong>{overallAverage.toFixed(1)} / 5</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Strongest domain</span>
          <strong>{strengths[0]?.name ?? '—'}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Primary growth area</span>
          <strong>{growthAreas[0]?.name ?? '—'}</strong>
        </div>
      </div>

      <div className="native-card native-card--padded">
        <div className="native-section-heading">
          <h2>12-domain self-assessment</h2>
          <p>Rate each domain from 1 (struggling) to 5 (strong). This is a weekly self-check inspired by the QoL.BD framework.</p>
        </div>
        <div className="domain-grid">
          {domains.map((domain) => (
            <div key={domain.id} className="native-card native-card--soft native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>{domain.name}</h2>
                <p>{domain.prompt}</p>
              </div>
              <input
                className="slider-input"
                type="range"
                min={1}
                max={5}
                step={1}
                value={scores[domain.id]}
                onChange={(event) => setScores((current) => ({ ...current, [domain.id]: Number(event.target.value) }))}
              />
              <div className="score-row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span key={value} className={scores[domain.id] === value ? 'score-row__active' : ''}>
                    {value}
                  </span>
                ))}
              </div>
              <div className="tag">{scores[domain.id]}/5</div>
            </div>
          ))}
        </div>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Strengths to protect</h2>
            <p>Your highest current scores.</p>
          </div>
          <div className="analysis-bars">
            {strengths.map((domain) => (
              <div key={domain.id} className="analysis-bars__row">
                <div>
                  <strong>{domain.name}</strong>
                  <p>{domain.action}</p>
                </div>
                <div className="analysis-bars__track">
                  <div className="analysis-bars__fill analysis-bars__fill--green" style={{ width: `${(domain.score / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Growth areas</h2>
            <p>Lower-scoring domains with practical next actions.</p>
          </div>
          <div className="analysis-bars">
            {growthAreas.map((domain) => (
              <div key={domain.id} className="analysis-bars__row">
                <div>
                  <strong>{domain.name}</strong>
                  <p>{domain.action}</p>
                </div>
                <div className="analysis-bars__track">
                  <div className="analysis-bars__fill analysis-bars__fill--orange" style={{ width: `${(domain.score / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
