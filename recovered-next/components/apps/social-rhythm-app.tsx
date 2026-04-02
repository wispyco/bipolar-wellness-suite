'use client'

import { useMemo, useState } from 'react'

type TabKey = 'log' | 'timeline' | 'disruptions' | 'scheduler' | 'tips'

type Activity = {
  id: string
  name: string
  defaultTarget: string
}

type ActivityLog = Record<string, { time: string; who: 'alone' | 'others' }>

type HistoryEntry = {
  date: string
  activities: ActivityLog
}

type Disruption = {
  date: string
  activity: string
  what: string
  impact: number
  type: string
}

type ExtraActivity = {
  id: string
  name: string
  time: string
}

const socialRhythmTabs: Array<{ key: TabKey; label: string }> = [
  { key: 'log', label: 'Daily Log' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'disruptions', label: 'Disruptions' },
  { key: 'scheduler', label: 'Scheduler' },
  { key: 'tips', label: 'Rhythm Tips' },
]

const activities: Activity[] = [
  { id: 'wake', name: 'Got out of bed', defaultTarget: '07:00' },
  { id: 'contact', name: 'First contact with another person', defaultTarget: '08:00' },
  { id: 'work', name: 'Started work, school, or main activity', defaultTarget: '09:00' },
  { id: 'dinner', name: 'Had dinner', defaultTarget: '18:30' },
  { id: 'bed', name: 'Went to bed', defaultTarget: '22:30' },
]

const initialTargets = Object.fromEntries(activities.map((activity) => [activity.id, activity.defaultTarget])) as Record<string, string>

const sampleTimes = [
  { wake: '07:05', contact: '08:10', work: '09:00', dinner: '18:30', bed: '22:25' },
  { wake: '07:00', contact: '08:00', work: '09:05', dinner: '18:35', bed: '22:30' },
  { wake: '07:10', contact: '08:15', work: '09:00', dinner: '18:25', bed: '22:20' },
  { wake: '06:55', contact: '08:05', work: '09:10', dinner: '18:30', bed: '22:35' },
  { wake: '07:05', contact: '08:00', work: '09:00', dinner: '18:40', bed: '22:30' },
  { wake: '09:30', contact: '10:00', work: '11:00', dinner: '21:00', bed: '01:30' },
  { wake: '10:00', contact: '10:30', work: '12:00', dinner: '20:30', bed: '00:45' },
  { wake: '08:45', contact: '11:00', work: '13:00', dinner: '21:30', bed: '01:00' },
  { wake: '09:00', contact: '09:30', work: '11:30', dinner: '20:00', bed: '00:15' },
  { wake: '08:00', contact: '09:00', work: '10:00', dinner: '19:00', bed: '23:00' },
  { wake: '07:30', contact: '08:30', work: '09:30', dinner: '18:45', bed: '22:45' },
  { wake: '07:15', contact: '08:15', work: '09:15', dinner: '18:30', bed: '22:30' },
  { wake: '07:10', contact: '08:05', work: '09:05', dinner: '18:35', bed: '22:25' },
  { wake: '07:00', contact: '08:00', work: '09:00', dinner: '18:30', bed: '22:30' },
]

const whoOptions = ['alone', 'others', 'alone', 'others', 'alone', 'others', 'others', 'others', 'others', 'alone', 'alone', 'others', 'alone', 'others'] as const

const seedHistory: HistoryEntry[] = sampleTimes.map((times, index) => {
  const date = new Date('2026-03-19T00:00:00')
  date.setDate(date.getDate() + index)
  return {
    date: date.toISOString().slice(0, 10),
    activities: Object.fromEntries(
      activities.map((activity) => [
        activity.id,
        { time: times[activity.id as keyof typeof times], who: whoOptions[index] },
      ]),
    ) as ActivityLog,
  }
})

const seedDisruptions: Disruption[] = [
  {
    date: '2026-03-24',
    activity: 'wake',
    what: 'Flew to Vancouver for a conference. Jet lag and excitement made it hard to maintain routine.',
    impact: 4,
    type: 'travel',
  },
  {
    date: '2026-03-25',
    activity: 'bed',
    what: 'Conference dinner ran late, which pushed bedtime past 1 AM.',
    impact: 3,
    type: 'social',
  },
  {
    date: '2026-03-26',
    activity: 'work',
    what: 'No structured workday during travel, so the usual anchor disappeared.',
    impact: 2,
    type: 'work',
  },
]

const seedExtraActivities: ExtraActivity[] = [
  { id: 'ex1', name: 'Take medication', time: '08:00' },
  { id: 'ex2', name: 'Exercise', time: '17:00' },
]

const rhythmTips = [
  'Anchor your day with five core activities and aim to keep them within 30 minutes of target.',
  'Protect wake time first — it is the strongest circadian anchor.',
  'Treat bedtime as part of treatment, not a suggestion.',
  'When disruption happens, focus on rapid recovery instead of perfect prevention.',
  'Use meal times and first contact as social zeitgebers, not just chores.',
] as const

function formatTime12(value: string) {
  if (!value) return '--'
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function timeToMinutes(value: string) {
  if (!value) return null
  const [hours, minutes] = value.split(':').map(Number)
  let total = hours * 60 + minutes
  if (total < 300) total += 1440
  return total
}

function calcRegularity(entries: HistoryEntry[]) {
  if (entries.length < 2) return 0

  return activities.reduce((totalScore, activity) => {
    const times = entries.map((entry) => timeToMinutes(entry.activities[activity.id]?.time)).filter((value): value is number => value !== null)
    if (times.length < 2) return totalScore

    const mean = times.reduce((sum, value) => sum + value, 0) / times.length
    const variance = times.reduce((sum, value) => sum + (value - mean) ** 2, 0) / times.length
    const stdDev = Math.sqrt(variance)
    const score = Math.max(0, 1 - stdDev / 120)
    return totalScore + score
  }, 0)
}

function formatShortDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function SocialRhythmApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('log')
  const [targets, setTargets] = useState<Record<string, string>>(initialTargets)
  const [todayLog, setTodayLog] = useState<ActivityLog>(() =>
    Object.fromEntries(activities.map((activity) => [activity.id, { time: '', who: 'alone' as const }])) as ActivityLog,
  )
  const [history, setHistory] = useState<HistoryEntry[]>(seedHistory)
  const [disruptions, setDisruptions] = useState<Disruption[]>(seedDisruptions)
  const [extraActivities, setExtraActivities] = useState<ExtraActivity[]>(seedExtraActivities)
  const [newDisruption, setNewDisruption] = useState<Disruption>({
    date: new Date().toISOString().slice(0, 10),
    activity: 'wake',
    what: '',
    impact: 3,
    type: 'social',
  })
  const [newExtraActivity, setNewExtraActivity] = useState({ name: '', time: '' })
  const [toast, setToast] = useState<string | null>(null)

  const regularityIndex = useMemo(() => calcRegularity(history.slice(-7)), [history])
  const regularityLabel =
    regularityIndex >= 4.5
      ? 'Excellent rhythm consistency'
      : regularityIndex >= 4
        ? 'Good consistency'
        : regularityIndex >= 3
          ? 'Moderate consistency'
          : regularityIndex >= 2
            ? 'Low consistency'
            : 'Very low consistency'

  const timelineData = useMemo(
    () =>
      history.slice(-14).map((entry, index, array) => ({
        ...entry,
        score: calcRegularity(array.slice(Math.max(0, index - 6), index + 1)),
      })),
    [history],
  )

  const saveTodayLog = () => {
    const today = new Date().toISOString().slice(0, 10)
    const nextEntry = {
      date: today,
      activities: JSON.parse(JSON.stringify(todayLog)) as ActivityLog,
    }

    setHistory((current) => {
      const existingIndex = current.findIndex((entry) => entry.date === today)
      if (existingIndex >= 0) {
        const copy = [...current]
        copy[existingIndex] = nextEntry
        return copy
      }
      return [...current, nextEntry]
    })

    setToast('Log saved')
    window.setTimeout(() => setToast(null), 2400)
    setActiveTab('timeline')
  }

  const addDisruption = () => {
    if (!newDisruption.what.trim()) return
    setDisruptions((current) => [...current, { ...newDisruption, what: newDisruption.what.trim() }])
    setNewDisruption((current) => ({ ...current, what: '' }))
  }

  const addExtraActivity = () => {
    if (!newExtraActivity.name.trim() || !newExtraActivity.time) return
    setExtraActivities((current) => [
      ...current,
      { id: `extra-${Date.now()}`, name: newExtraActivity.name.trim(), time: newExtraActivity.time },
    ])
    setNewExtraActivity({ name: '', time: '' })
  }

  return (
    <div className="native-app-shell">
      <div className="score-banner-native">
        <div className="score-ring score-ring--small">
          <div className="score-ring__inner">
            <strong>{regularityIndex.toFixed(1)}</strong>
            <span>out of 5</span>
          </div>
        </div>
        <div>
          <h2>Weekly Rhythm Regularity Index</h2>
          <p>{regularityLabel}. Target: 4.0+ out of 5.0.</p>
        </div>
      </div>

      <div className="native-tabs" role="tablist" aria-label="Social rhythm sections">
        {socialRhythmTabs.map(({ key, label }) => (
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

      {activeTab === 'log' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Social Rhythm Metric (SRM-5)</h2>
              <p>Record the time of each anchor activity and whether you were alone or with others.</p>
            </div>
            <div className="manage-list">
              {activities.map((activity) => (
                <div key={activity.id} className="manage-item manage-item--tall">
                  <div>
                    <strong>{activity.name}</strong>
                    <p>Target: {formatTime12(targets[activity.id])}</p>
                  </div>
                  <div className="signal-item__ratings">
                    <input
                      className="text-input"
                      type="time"
                      value={todayLog[activity.id]?.time ?? ''}
                      onChange={(event) =>
                        setTodayLog((current) => ({
                          ...current,
                          [activity.id]: { ...current[activity.id], time: event.target.value },
                        }))
                      }
                    />
                    <button
                      type="button"
                      className={`choice-chip ${todayLog[activity.id]?.who === 'alone' ? 'choice-chip--active' : ''}`}
                      onClick={() =>
                        setTodayLog((current) => ({
                          ...current,
                          [activity.id]: { ...current[activity.id], who: 'alone' },
                        }))
                      }
                    >
                      Alone
                    </button>
                    <button
                      type="button"
                      className={`choice-chip ${todayLog[activity.id]?.who === 'others' ? 'choice-chip--active' : ''}`}
                      onClick={() =>
                        setTodayLog((current) => ({
                          ...current,
                          [activity.id]: { ...current[activity.id], who: 'others' },
                        }))
                      }
                    >
                      Others
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={saveTodayLog}>
                Save today&apos;s log
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'timeline' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Rhythm consistency over time</h2>
              <p>Each activity shows the recorded time over the last 14 days. Tighter clustering means more stable routines.</p>
            </div>
            <div className="timeline-table-wrapper">
              <table className="timeline-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    {timelineData.map((entry) => (
                      <th key={entry.date}>{formatShortDate(entry.date)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.name}</td>
                      {timelineData.map((entry) => (
                        <td key={`${entry.date}-${activity.id}`}>{formatTime12(entry.activities[activity.id]?.time)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Daily regularity score</h2>
            </div>
            <div className="analysis-bars">
              {timelineData.map((entry) => (
                <div key={entry.date} className="analysis-bars__row">
                  <div>
                    <strong>{formatShortDate(entry.date)}</strong>
                    <p>{entry.score.toFixed(1)} / 5</p>
                  </div>
                  <div className="analysis-bars__track">
                    <div className="analysis-bars__fill" style={{ width: `${(entry.score / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'disruptions' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Log a disruption</h2>
              <p>Capture what pulled your routine off target so you can recognize patterns and plan recovery.</p>
            </div>
            <div className="native-form-grid native-form-grid--two">
              <label className="field-block">
                <span className="form-label">Date</span>
                <input className="text-input" type="date" value={newDisruption.date} onChange={(event) => setNewDisruption((current) => ({ ...current, date: event.target.value }))} />
              </label>
              <label className="field-block">
                <span className="form-label">Activity affected</span>
                <select className="text-input" value={newDisruption.activity} onChange={(event) => setNewDisruption((current) => ({ ...current, activity: event.target.value }))}>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block field-block--full">
                <span className="form-label">What happened?</span>
                <textarea className="text-area" rows={3} value={newDisruption.what} onChange={(event) => setNewDisruption((current) => ({ ...current, what: event.target.value }))} placeholder="Describe the disruption…" />
              </label>
              <label className="field-block">
                <span className="form-label">Impact on mood (1–5)</span>
                <select className="text-input" value={newDisruption.impact} onChange={(event) => setNewDisruption((current) => ({ ...current, impact: Number(event.target.value) }))}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span className="form-label">Disruption type</span>
                <select className="text-input" value={newDisruption.type} onChange={(event) => setNewDisruption((current) => ({ ...current, type: event.target.value }))}>
                  {['social', 'travel', 'work', 'health', 'conflict', 'other'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={addDisruption}>
                Log disruption
              </button>
            </div>
          </div>

          <div className="manage-list">
            {disruptions
              .slice()
              .reverse()
              .map((disruption) => (
                <div key={`${disruption.date}-${disruption.what}`} className="manage-item manage-item--tall">
                  <div>
                    <strong>{activities.find((activity) => activity.id === disruption.activity)?.name ?? disruption.activity}</strong>
                    <p>{formatShortDate(disruption.date)} · {disruption.type}</p>
                  </div>
                  <div className="manage-item__stack">
                    <span className="tag">Impact {disruption.impact}/5</span>
                    <p>{disruption.what}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'scheduler' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Ideal routine scheduler</h2>
              <p>Set target times for each anchor activity so your daily logs can be compared to a steady rhythm.</p>
            </div>
            <div className="manage-list">
              {activities.map((activity) => (
                <label key={activity.id} className="manage-item">
                  <span>{activity.name}</span>
                  <input
                    className="text-input text-input--compact"
                    type="time"
                    value={targets[activity.id]}
                    onChange={(event) => setTargets((current) => ({ ...current, [activity.id]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Additional recurring activities</h2>
            </div>
            <div className="native-form-grid native-form-grid--two">
              <label className="field-block">
                <span className="form-label">Activity name</span>
                <input className="text-input" value={newExtraActivity.name} onChange={(event) => setNewExtraActivity((current) => ({ ...current, name: event.target.value }))} placeholder="Exercise, medication, therapy…" />
              </label>
              <label className="field-block">
                <span className="form-label">Time</span>
                <input className="text-input" type="time" value={newExtraActivity.time} onChange={(event) => setNewExtraActivity((current) => ({ ...current, time: event.target.value }))} />
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={addExtraActivity}>
                Add recurring activity
              </button>
            </div>
            <div className="manage-list">
              {extraActivities.map((activity) => (
                <div key={activity.id} className="manage-item">
                  <span>{activity.name}</span>
                  <div className="manage-item__actions">
                    <span className="tag">{formatTime12(activity.time)}</span>
                    <button type="button" className="secondary-link secondary-link--small" onClick={() => setExtraActivities((current) => current.filter((item) => item.id !== activity.id))}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'tips' ? (
        <section className="native-panel native-panel--stacked">
          {rhythmTips.map((tip) => (
            <div key={tip} className="native-card native-card--padded">
              <p>{tip}</p>
            </div>
          ))}
        </section>
      ) : null}

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
