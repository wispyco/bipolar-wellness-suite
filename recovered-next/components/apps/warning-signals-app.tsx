'use client'

import { useMemo, useState } from 'react'

type TabKey = 'checkin' | 'trends' | 'signs' | 'actions'

type WarningSign = {
  id: string
  name: string
  custom: boolean
}

type HistoryEntry = {
  date: string
  mania: Record<string, number>
  depression: Record<string, number>
}

const warningTabs: Array<{ key: TabKey; label: string }> = [
  { key: 'checkin', label: 'Daily Check-in' },
  { key: 'trends', label: 'Trends' },
  { key: 'signs', label: 'My Warning Signs' },
  { key: 'actions', label: 'Action Plans' },
]

const seedManiaSigns: WarningSign[] = [
  { id: 'm1', name: 'Decreased need for sleep', custom: false },
  { id: 'm2', name: 'Increased energy or restlessness', custom: false },
  { id: 'm3', name: 'Racing thoughts', custom: false },
  { id: 'm4', name: 'Rapid or pressured speech', custom: false },
  { id: 'm5', name: 'Grandiose thinking or plans', custom: false },
  { id: 'm6', name: 'Increased spending or impulsive decisions', custom: false },
  { id: 'm7', name: 'Irritability or agitation', custom: false },
  { id: 'm8', name: 'Increased goal-directed activity', custom: false },
]

const seedDepressionSigns: WarningSign[] = [
  { id: 'd1', name: 'Withdrawal from social activities', custom: false },
  { id: 'd2', name: 'Persistent fatigue or low energy', custom: false },
  { id: 'd3', name: 'Difficulty concentrating', custom: false },
  { id: 'd4', name: 'Feelings of hopelessness', custom: false },
  { id: 'd5', name: 'Sleeping too much or insomnia', custom: false },
  { id: 'd6', name: 'Loss of interest in usual activities', custom: false },
  { id: 'd7', name: 'Changes in appetite', custom: false },
  { id: 'd8', name: 'Increased self-criticism', custom: false },
]

const sampleRatings = [
  { mania: [0, 0, 0, 0, 0, 0, 0, 0], depression: [0, 0, 1, 0, 0, 0, 0, 0] },
  { mania: [0, 0, 0, 0, 0, 0, 0, 0], depression: [0, 0, 0, 0, 0, 0, 0, 1] },
  { mania: [0, 0, 0, 0, 0, 0, 0, 0], depression: [0, 1, 0, 0, 0, 0, 0, 0] },
  { mania: [0, 0, 0, 0, 0, 0, 0, 0], depression: [0, 0, 0, 0, 1, 0, 0, 0] },
  { mania: [0, 1, 0, 0, 0, 0, 0, 0], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [1, 1, 1, 0, 0, 0, 0, 1], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [1, 2, 1, 1, 0, 0, 1, 1], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [2, 2, 2, 1, 1, 0, 1, 2], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [2, 2, 2, 2, 1, 1, 2, 2], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [3, 3, 2, 2, 2, 1, 2, 3], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [3, 3, 3, 2, 2, 2, 2, 3], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [2, 3, 3, 2, 2, 2, 3, 2], depression: [0, 0, 0, 0, 0, 0, 0, 0] },
  { mania: [2, 2, 1, 1, 1, 1, 1, 1], depression: [0, 0, 1, 0, 1, 0, 0, 0] },
  { mania: [1, 1, 1, 0, 0, 0, 1, 1], depression: [0, 1, 1, 0, 1, 1, 0, 0] },
]

const actionPlans = [
  {
    level: 'green',
    title: 'Green Zone: Stable',
    range: 'Score 0–8',
    desc: 'No significant warning signs. Continue your maintenance routine.',
    steps: [
      'Continue regular sleep schedule',
      'Take medications as prescribed',
      'Maintain daily structure and social rhythm',
      'Keep regular therapy and monitoring routines',
    ],
  },
  {
    level: 'yellow',
    title: 'Yellow Zone: Early Warning',
    range: 'Score 9–18',
    desc: 'Some warning signs are emerging. Increase self-care and vigilance.',
    steps: [
      'Increase monitoring to twice daily',
      'Protect 8 hours of sleep and reduce stimulation',
      'Use CBT tools for racing or negative thoughts',
      'Contact a therapist or support person to review the shift',
    ],
  },
  {
    level: 'orange',
    title: 'Orange Zone: Escalating',
    range: 'Score 19–30',
    desc: 'Multiple warning signs are active. Professional support is recommended.',
    steps: [
      'Contact your psychiatrist or therapist today',
      'Reduce commitments and postpone major decisions',
      'Ask a trusted person to check in daily',
      'Increase structure and avoid alcohol or substances',
    ],
  },
  {
    level: 'red',
    title: 'Red Zone: Crisis Level',
    range: 'Score 31+',
    desc: 'Severe warning signs indicate a possible episode. Immediate intervention is needed.',
    steps: [
      'Contact your care team or crisis line immediately',
      'Call or text 988 if you are in danger',
      'Activate your safety plan and ask someone to stay with you',
      'Go to the emergency room if needed',
    ],
  },
] as const

function buildHistory(maniaSigns: WarningSign[], depressionSigns: WarningSign[]): HistoryEntry[] {
  return sampleRatings.map((rating, index) => {
    const date = new Date('2026-03-19T00:00:00')
    date.setDate(date.getDate() + index)
    const mania = Object.fromEntries(maniaSigns.map((sign, signIndex) => [sign.id, rating.mania[signIndex] ?? 0]))
    const depression = Object.fromEntries(depressionSigns.map((sign, signIndex) => [sign.id, rating.depression[signIndex] ?? 0]))
    return {
      date: date.toISOString().slice(0, 10),
      mania,
      depression,
    }
  })
}

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatShortDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getLevel(score: number) {
  if (score <= 8) return 'green'
  if (score <= 18) return 'yellow'
  if (score <= 30) return 'orange'
  return 'red'
}

function getScoreTotals(entry: HistoryEntry) {
  const mania = Object.values(entry.mania).reduce((sum, value) => sum + value, 0)
  const depression = Object.values(entry.depression).reduce((sum, value) => sum + value, 0)
  return { maniaTotal: mania, depressionTotal: depression, total: mania + depression }
}

export function WarningSignalsApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('checkin')
  const [maniaSigns, setManiaSigns] = useState<WarningSign[]>(seedManiaSigns)
  const [depressionSigns, setDepressionSigns] = useState<WarningSign[]>(seedDepressionSigns)
  const [history, setHistory] = useState<HistoryEntry[]>(() => buildHistory(seedManiaSigns, seedDepressionSigns))
  const [newSignName, setNewSignName] = useState('')
  const [newSignType, setNewSignType] = useState<'mania' | 'depression'>('mania')
  const [toast, setToast] = useState<string | null>(null)

  const latestEntry = history[history.length - 1]
  const [currentRatings, setCurrentRatings] = useState<HistoryEntry['mania'] & { depression?: never }>(() => ({ ...latestEntry.mania }))
  const [currentDepressionRatings, setCurrentDepressionRatings] = useState<HistoryEntry['depression']>(() => ({ ...latestEntry.depression }))

  const currentScore = useMemo(() => {
    const mania = Object.values(currentRatings).reduce((sum, value) => sum + value, 0)
    const depression = Object.values(currentDepressionRatings).reduce((sum, value) => sum + value, 0)
    const total = mania + depression
    return { mania, depression, total, level: getLevel(total) }
  }, [currentDepressionRatings, currentRatings])

  const trendRows = useMemo(
    () =>
      history.map((entry) => {
        const totals = getScoreTotals(entry)
        return { ...entry, ...totals, level: getLevel(totals.total) }
      }),
    [history],
  )

  const customSignsCount = maniaSigns.filter((sign) => sign.custom).length + depressionSigns.filter((sign) => sign.custom).length

  const addCustomSign = () => {
    const trimmed = newSignName.trim()
    if (!trimmed) return

    const nextSign = { id: `custom-${Date.now()}`, name: trimmed, custom: true }

    if (newSignType === 'mania') {
      setManiaSigns((current) => [...current, nextSign])
      setCurrentRatings((current) => ({ ...current, [nextSign.id]: 0 }))
      setHistory((current) => current.map((entry) => ({ ...entry, mania: { ...entry.mania, [nextSign.id]: 0 } })))
    } else {
      setDepressionSigns((current) => [...current, nextSign])
      setCurrentDepressionRatings((current) => ({ ...current, [nextSign.id]: 0 }))
      setHistory((current) => current.map((entry) => ({ ...entry, depression: { ...entry.depression, [nextSign.id]: 0 } })))
    }

    setNewSignName('')
  }

  const removeCustomSign = (type: 'mania' | 'depression', id: string) => {
    if (type === 'mania') {
      setManiaSigns((current) => current.filter((sign) => sign.id !== id))
      setCurrentRatings((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
      setHistory((current) => current.map((entry) => {
        const next = { ...entry.mania }
        delete next[id]
        return { ...entry, mania: next }
      }))
    } else {
      setDepressionSigns((current) => current.filter((sign) => sign.id !== id))
      setCurrentDepressionRatings((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
      setHistory((current) => current.map((entry) => {
        const next = { ...entry.depression }
        delete next[id]
        return { ...entry, depression: next }
      }))
    }
  }

  const saveCheckin = () => {
    const today = new Date().toISOString().slice(0, 10)
    const nextEntry: HistoryEntry = {
      date: today,
      mania: { ...currentRatings },
      depression: { ...currentDepressionRatings },
    }

    setHistory((current) => {
      const index = current.findIndex((entry) => entry.date === today)
      if (index >= 0) {
        const copy = [...current]
        copy[index] = nextEntry
        return copy
      }
      return [...current, nextEntry]
    })

    setToast('Check-in saved')
    window.setTimeout(() => setToast(null), 2400)
    setActiveTab('trends')
  }

  return (
    <div className="native-app-shell">
      <div className={`warning-banner warning-banner--${currentScore.level}`}>
        <div>
          <span className="summary-card__label">Current status</span>
          <strong>
            {currentScore.level === 'green'
              ? 'Stable'
              : currentScore.level === 'yellow'
                ? 'Early Warning'
                : currentScore.level === 'orange'
                  ? 'Escalating'
                  : 'Crisis Level'}
          </strong>
          <p>
            {currentScore.level === 'green'
              ? 'No significant warning signs detected.'
              : currentScore.level === 'yellow'
                ? 'Some warning signs are emerging.'
                : currentScore.level === 'orange'
                  ? 'Multiple warning signs are active.'
                  : 'Immediate professional support is recommended.'}
          </p>
        </div>
        <div className="warning-banner__score">
          <span>{currentScore.total}</span>
          <small>Risk score</small>
        </div>
      </div>

      <div className="native-tabs" role="tablist" aria-label="Warning signal sections">
        {warningTabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={`native-tab ${activeTab === key ? 'native-tab--active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'checkin' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Today&apos;s Check-in</h2>
              <p>Rate each warning sign from 0 (absent) to 3 (severe). Today: {formatDate(new Date().toISOString().slice(0, 10))}</p>
            </div>
            <div className="warning-grid">
              <section className="native-card native-card--soft native-card--padded">
                <div className="native-section-heading native-section-heading--compact">
                  <h2>Mania Warning Signs</h2>
                </div>
                <div className="signal-list">
                  {maniaSigns.map((sign) => (
                    <div key={sign.id} className="signal-item">
                      <span>{sign.name}</span>
                      <div className="signal-item__ratings">
                        {[0, 1, 2, 3].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`signal-rating ${currentRatings[sign.id] === value ? `signal-rating--${value}` : ''}`}
                            onClick={() => setCurrentRatings((current) => ({ ...current, [sign.id]: value }))}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="native-card native-card--soft native-card--padded">
                <div className="native-section-heading native-section-heading--compact">
                  <h2>Depression Warning Signs</h2>
                </div>
                <div className="signal-list">
                  {depressionSigns.map((sign) => (
                    <div key={sign.id} className="signal-item">
                      <span>{sign.name}</span>
                      <div className="signal-item__ratings">
                        {[0, 1, 2, 3].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`signal-rating ${currentDepressionRatings[sign.id] === value ? `signal-rating--${value}` : ''}`}
                            onClick={() => setCurrentDepressionRatings((current) => ({ ...current, [sign.id]: value }))}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={saveCheckin}>
                Save today&apos;s check-in
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'trends' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Risk score trend</h2>
              <p>Combined warning sign totals across the last 14 days.</p>
            </div>
            <div className="analysis-bars">
              {trendRows.map((entry) => (
                <div key={entry.date} className="analysis-bars__row">
                  <div>
                    <strong>{formatShortDate(entry.date)}</strong>
                    <p>{entry.maniaTotal} mania · {entry.depressionTotal} depression</p>
                  </div>
                  <div className="analysis-bars__track">
                    <div className={`analysis-bars__fill analysis-bars__fill--${entry.level}`} style={{ width: `${Math.min((entry.total / 32) * 100, 100)}%` }} />
                  </div>
                  <span>{entry.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Sign heatmap</h2>
            </div>
            <div className="timeline-table-wrapper">
              <table className="timeline-table">
                <thead>
                  <tr>
                    <th>Sign</th>
                    {trendRows.map((entry) => (
                      <th key={entry.date}>{formatShortDate(entry.date)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...maniaSigns.map((sign) => ({ ...sign, type: 'mania' as const })), ...depressionSigns.map((sign) => ({ ...sign, type: 'depression' as const }))].map((sign) => (
                    <tr key={sign.id}>
                      <td>{sign.name}</td>
                      {trendRows.map((entry) => {
                        const value = sign.type === 'mania' ? entry.mania[sign.id] ?? 0 : entry.depression[sign.id] ?? 0
                        return (
                          <td key={`${entry.date}-${sign.id}`}>
                            <span className={`heat-chip heat-chip--${value}`}>{value}</span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'signs' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Customize warning signs</h2>
              <p>Add your own personalized early warning signs. Current custom signs: {customSignsCount}</p>
            </div>
            <div className="native-form-grid native-form-grid--two">
              <label className="field-block">
                <span className="form-label">New warning sign</span>
                <input className="text-input" value={newSignName} onChange={(event) => setNewSignName(event.target.value)} placeholder="Enter a new warning sign…" />
              </label>
              <label className="field-block">
                <span className="form-label">Category</span>
                <select className="text-input" value={newSignType} onChange={(event) => setNewSignType(event.target.value as 'mania' | 'depression')}>
                  <option value="mania">Mania</option>
                  <option value="depression">Depression</option>
                </select>
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={addCustomSign}>
                Add sign
              </button>
            </div>
          </div>

          <div className="warning-grid">
            <section className="native-card native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>Mania signs</h2>
              </div>
              <div className="manage-list">
                {maniaSigns.map((sign) => (
                  <div key={sign.id} className="manage-item">
                    <span>{sign.name}</span>
                    <div className="manage-item__actions">
                      <span className="tag">{sign.custom ? 'Custom' : 'Default'}</span>
                      {sign.custom ? (
                        <button type="button" className="secondary-link secondary-link--small" onClick={() => removeCustomSign('mania', sign.id)}>
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="native-card native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>Depression signs</h2>
              </div>
              <div className="manage-list">
                {depressionSigns.map((sign) => (
                  <div key={sign.id} className="manage-item">
                    <span>{sign.name}</span>
                    <div className="manage-item__actions">
                      <span className="tag">{sign.custom ? 'Custom' : 'Default'}</span>
                      {sign.custom ? (
                        <button type="button" className="secondary-link secondary-link--small" onClick={() => removeCustomSign('depression', sign.id)}>
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      ) : null}

      {activeTab === 'actions' ? (
        <section className="native-panel native-panel--stacked">
          {actionPlans.map((plan) => (
            <article key={plan.level} className={`native-card native-card--padded action-plan-card action-plan-card--${plan.level} ${currentScore.level === plan.level ? 'action-plan-card--current' : ''}`}>
              <div className="action-plan-card__header">
                <div>
                  <h2>{plan.title}</h2>
                  <p>{plan.desc}</p>
                </div>
                <span className="tag">{plan.range}</span>
              </div>
              <ul className="feature-list">
                {plan.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      ) : null}

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
