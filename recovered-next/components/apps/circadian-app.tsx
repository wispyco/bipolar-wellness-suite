'use client'

import { useMemo, useState } from 'react'

type SleepEntry = {
  id: string
  date: string
  bedtime: string
  waketime: string
  quality: number
  nap: boolean
  napDuration: number
  interruptions: number
  notes: string | null
}

type SrmEntry = {
  id: string
  date: string
  bed: string
  contact: string
  work: string
  dinner: string
  sleep: string
}

type TabKey = 'sleep' | 'chart' | 'score' | 'srm' | 'tips'

type SleepDraft = {
  bedtime: string
  waketime: string
  quality: number
  nap: boolean | null
  napDuration: string
  interruptions: string
  notes: string
}

type SrmDraft = {
  bed: string
  contact: string
  work: string
  dinner: string
  sleep: string
}

const circadianTabs: Array<{ key: TabKey; label: string }> = [
  { key: 'sleep', label: 'Sleep Log' },
  { key: 'chart', label: 'Sleep Chart' },
  { key: 'score', label: 'Circadian Score' },
  { key: 'srm', label: 'Social Rhythm' },
  { key: 'tips', label: 'Sleep Tips' },
]

const sleepTimelineLabels = ['8 PM', '10 PM', '12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM']

const srmAnchors = [
  { key: 'bed', label: 'Got out of bed' },
  { key: 'contact', label: 'First contact' },
  { key: 'work', label: 'Started work' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'sleep', label: 'Went to bed' },
] as const

const sleepSeed: SleepEntry[] = [
  ['2026-03-19', '01:30', '09:00', 2, true, 60, 3, 'Racing thoughts kept me up. Hypomania building — couldn’t shut my mind off.'],
  ['2026-03-20', '02:45', '10:30', 1, false, 0, 4, 'Didn’t feel tired until 3am. Only four hours of sleep but felt wired.'],
  ['2026-03-21', '00:30', '07:00', 2, true, 45, 2, 'Tried to get to bed earlier but woke up multiple times.'],
  ['2026-03-22', '03:00', '11:00', 1, true, 90, 5, 'Worst night — stayed up working on a project.'],
  ['2026-03-23', '01:00', '08:30', 2, true, 30, 3, 'Still erratic. Long nap probably made nighttime sleep worse.'],
  ['2026-03-24', '00:15', '07:45', 3, true, 20, 2, 'Starting to stabilize. Took melatonin at 11pm.'],
  ['2026-03-25', '23:45', '07:15', 3, false, 0, 2, 'Set an alarm and stuck to it. No nap today.'],
  ['2026-03-26', '23:30', '07:00', 3, false, 0, 1, 'Therapist suggested strict 10pm wind-down.'],
  ['2026-03-27', '23:00', '07:00', 4, false, 0, 1, 'Good routine forming. Read before bed instead of screens.'],
  ['2026-03-28', '22:45', '06:45', 4, false, 0, 1, 'Sleep improving noticeably. Woke feeling refreshed.'],
  ['2026-03-29', '22:30', '07:00', 4, false, 0, 0, 'Consistent pattern now. Mood is more stable.'],
  ['2026-03-30', '22:30', '06:45', 5, false, 0, 0, 'Excellent sleep. Morning routine feels automatic.'],
  ['2026-03-31', '22:15', '07:00', 5, false, 0, 0, 'Second great night in a row.'],
  ['2026-04-01', '22:30', '07:00', 5, false, 0, 0, 'Feeling well-rested and stable.'],
].map(([date, bedtime, waketime, quality, nap, napDuration, interruptions, notes], index) => ({
  id: `sleep-${index + 1}`,
  date: date as string,
  bedtime: bedtime as string,
  waketime: waketime as string,
  quality: quality as number,
  nap: nap as boolean,
  napDuration: napDuration as number,
  interruptions: interruptions as number,
  notes: notes as string,
}))

const srmSeed: SrmEntry[] = [
  ['2026-03-26', '09:30', '10:00', '10:30', '20:00', '01:30'],
  ['2026-03-27', '10:45', '11:30', '12:00', '21:30', '02:45'],
  ['2026-03-28', '07:15', '08:00', '09:00', '18:00', '00:30'],
  ['2026-03-29', '07:30', '08:30', '09:00', '18:30', '23:00'],
  ['2026-03-30', '07:00', '08:15', '09:00', '18:30', '22:45'],
  ['2026-03-31', '07:00', '08:00', '09:00', '18:15', '22:30'],
  ['2026-04-01', '07:00', '08:30', '09:00', '18:30', '22:30'],
].map(([date, bed, contact, work, dinner, sleep], index) => ({
  id: `srm-${index + 1}`,
  date: date as string,
  bed: bed as string,
  contact: contact as string,
  work: work as string,
  dinner: dinner as string,
  sleep: sleep as string,
}))

const defaultSleepDraft: SleepDraft = {
  bedtime: '22:30',
  waketime: '07:00',
  quality: 3,
  nap: null,
  napDuration: '',
  interruptions: '0',
  notes: '',
}

const defaultSrmDraft: SrmDraft = {
  bed: '07:00',
  contact: '08:30',
  work: '09:00',
  dinner: '18:30',
  sleep: '22:30',
}

const tips = [
  {
    title: 'Before bed',
    items: [
      'Begin a wind-down routine 60–90 minutes before bed, especially when activation feels high.',
      'Reduce blue-light exposure after 9 PM using night mode, amber lighting, or blue-light blockers.',
      'Use calming routines to interrupt racing thoughts before they become a late-night loop.',
    ],
  },
  {
    title: 'Sleep environment',
    items: [
      'Keep the room cool, dark, and visually quiet to support melatonin release.',
      'Reserve the bed for sleep to strengthen the mental link between bed and rest.',
      'Turn clocks away to reduce clock-watching and insomnia-related anxiety.',
    ],
  },
  {
    title: 'During the day',
    items: [
      'Get bright light exposure within an hour of waking to anchor the circadian clock.',
      'Keep wake time consistent seven days a week — this matters more than an occasional late bedtime.',
      'Avoid late caffeine and long naps that flatten nighttime sleep drive.',
    ],
  },
  {
    title: 'Managing episodes',
    items: [
      'During mania or hypomania, reduce nighttime light and prioritize darkness earlier.',
      'During depression, protect wake time even if sleeping longer feels tempting.',
      'Treat sudden sleep changes as possible early warning signs and discuss them with your care team.',
    ],
  },
]

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function normalizeSleepTime(value: string) {
  const minutes = timeToMinutes(value)
  return minutes < 12 * 60 ? minutes + 24 * 60 : minutes
}

function getSleepDuration(bedtime: string, waketime: string) {
  const bed = timeToMinutes(bedtime)
  let wake = timeToMinutes(waketime)
  if (wake <= bed) wake += 24 * 60
  return (wake - bed) / 60
}

function qualityLabel(value: number) {
  return ['Unknown', 'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'][value] ?? 'Unknown'
}

function qualityColor(value: number) {
  if (value >= 5) return '#5B8C5A'
  if (value === 4) return '#7CB87A'
  if (value === 3) return '#E8A838'
  if (value === 2) return '#D4776B'
  return '#C0392B'
}

function formatTimeDisplay(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function formatDateShort(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatWeekday(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })
}

function getStdDev(values: number[]) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

export function CircadianApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('sleep')
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>(sleepSeed)
  const [srmEntries, setSrmEntries] = useState<SrmEntry[]>(srmSeed)
  const [sleepDraft, setSleepDraft] = useState<SleepDraft>(defaultSleepDraft)
  const [srmDraft, setSrmDraft] = useState<SrmDraft>(defaultSrmDraft)
  const [toast, setToast] = useState<string | null>(null)

  const sortedSleepEntries = useMemo(
    () => [...sleepEntries].sort((left, right) => left.date.localeCompare(right.date)),
    [sleepEntries],
  )

  const lastFourteen = useMemo(() => sortedSleepEntries.slice(-14), [sortedSleepEntries])
  const lastSevenSrm = useMemo(() => srmEntries.slice(-7), [srmEntries])

  const circadianScore = useMemo(() => {
    const bedMinutes = lastFourteen.map((entry) => normalizeSleepTime(entry.bedtime))
    const wakeMinutes = lastFourteen.map((entry) => timeToMinutes(entry.waketime))
    const durations = lastFourteen.map((entry) => getSleepDuration(entry.bedtime, entry.waketime))
    const componentScore = (std: number, maxStd: number) => Math.max(0, Math.min(100, Math.round((1 - std / maxStd) * 100)))
    const bedScore = componentScore(getStdDev(bedMinutes), 180)
    const wakeScore = componentScore(getStdDev(wakeMinutes), 180)
    const durationScore = componentScore(getStdDev(durations), 3)
    const overall = Math.round((bedScore + wakeScore + durationScore) / 3)
    return {
      overall,
      bedScore,
      wakeScore,
      durationScore,
      bedStd: getStdDev(bedMinutes),
      wakeStd: getStdDev(wakeMinutes),
      durationStd: getStdDev(durations) * 60,
    }
  }, [lastFourteen])

  const srmRegularity = useMemo(() => {
    if (lastSevenSrm.length < 3) return 0
    const anchors: Array<keyof Pick<SrmEntry, 'bed' | 'contact' | 'work' | 'dinner' | 'sleep'>> = ['bed', 'contact', 'work', 'dinner', 'sleep']
    let totalStd = 0
    for (const anchor of anchors) {
      const values = lastSevenSrm.map((entry) => {
        const minutes = timeToMinutes(entry[anchor])
        return anchor === 'sleep' && minutes < 12 * 60 ? minutes + 24 * 60 : minutes
      })
      totalStd += getStdDev(values)
    }
    return Number(Math.max(0, Math.min(10, (1 - totalStd / anchors.length / 180) * 10)).toFixed(1))
  }, [lastSevenSrm])

  const saveSleepLog = () => {
    const nextEntry: SleepEntry = {
      id: `sleep-custom-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      bedtime: sleepDraft.bedtime,
      waketime: sleepDraft.waketime,
      quality: sleepDraft.quality,
      nap: Boolean(sleepDraft.nap),
      napDuration: sleepDraft.nap ? Number(sleepDraft.napDuration || 0) : 0,
      interruptions: Number(sleepDraft.interruptions || 0),
      notes: sleepDraft.notes.trim() || null,
    }
    setSleepEntries((current) => [...current, nextEntry])
    setSleepDraft(defaultSleepDraft)
    setActiveTab('score')
    setToast('Sleep log saved successfully')
    window.setTimeout(() => setToast(null), 2400)
  }

  const saveSrmEntry = () => {
    const nextEntry: SrmEntry = {
      id: `srm-custom-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...srmDraft,
    }
    setSrmEntries((current) => [...current, nextEntry])
    setToast('Rhythm entry saved')
    window.setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="native-app-shell">
      <div className="native-tabs" role="tablist" aria-label="Circadian sections">
        {circadianTabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={`native-tab ${activeTab === key ? 'native-tab--active' : ''}`}
            onClick={() => setActiveTab(key as TabKey)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'sleep' ? (
        <section className="native-panel native-panel--form">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Log last night&apos;s sleep</h2>
              <p>Capture bedtime, wake time, sleep quality, naps, interruptions, and notes.</p>
            </div>
            <div className="native-form-grid native-form-grid--two">
              <label className="field-block">
                <span className="form-label">Bedtime</span>
                <input className="text-input" type="time" value={sleepDraft.bedtime} onChange={(event) => setSleepDraft((current) => ({ ...current, bedtime: event.target.value }))} />
              </label>
              <label className="field-block">
                <span className="form-label">Wake time</span>
                <input className="text-input" type="time" value={sleepDraft.waketime} onChange={(event) => setSleepDraft((current) => ({ ...current, waketime: event.target.value }))} />
              </label>
            </div>

            <div className="field-block">
              <span className="form-label">Sleep quality</span>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`star-chip ${sleepDraft.quality >= value ? 'star-chip--active' : ''}`}
                    onClick={() => setSleepDraft((current) => ({ ...current, quality: value }))}
                  >
                    ★
                  </button>
                ))}
                <span className="tag">{qualityLabel(sleepDraft.quality)}</span>
              </div>
            </div>

            <div className="native-form-grid native-form-grid--two">
              <div className="field-block">
                <span className="form-label">Did you nap?</span>
                <div className="choice-row">
                  {[
                    [true, 'Yes'],
                    [false, 'No'],
                  ].map(([value, label]) => (
                    <button
                      key={String(value)}
                      type="button"
                      className={`choice-chip ${sleepDraft.nap === value ? 'choice-chip--active' : ''}`}
                      onClick={() => setSleepDraft((current) => ({ ...current, nap: value as boolean }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="field-block">
                <span className="form-label">Nap duration (minutes)</span>
                <input
                  className="text-input"
                  type="number"
                  min="0"
                  max="300"
                  step="5"
                  value={sleepDraft.napDuration}
                  onChange={(event) => setSleepDraft((current) => ({ ...current, napDuration: event.target.value }))}
                  disabled={!sleepDraft.nap}
                />
              </label>
              <label className="field-block">
                <span className="form-label">Night interruptions</span>
                <input className="text-input" type="number" min="0" max="20" step="1" value={sleepDraft.interruptions} onChange={(event) => setSleepDraft((current) => ({ ...current, interruptions: event.target.value }))} />
              </label>
              <div className="native-card native-card--soft sleep-insight-card">
                <span className="summary-card__label">Estimated duration</span>
                <strong>{getSleepDuration(sleepDraft.bedtime, sleepDraft.waketime).toFixed(1)} hrs</strong>
                <p>Computed from bedtime and wake time.</p>
              </div>
            </div>

            <label className="field-block">
              <span className="form-label">Notes</span>
              <textarea className="text-area" rows={4} value={sleepDraft.notes} onChange={(event) => setSleepDraft((current) => ({ ...current, notes: event.target.value }))} placeholder="What affected your sleep last night?" />
            </label>

            <div className="button-row">
              <button type="button" className="primary-link" onClick={saveSleepLog}>
                Save sleep log
              </button>
              <button type="button" className="secondary-link" onClick={() => setSleepDraft(defaultSleepDraft)}>
                Clear
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'chart' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Sleep architecture — 14 days</h2>
              <p>Bars show sleep windows between 8 PM and noon the following day. Dashed shading marks the 10 PM–6 AM target.</p>
            </div>
            <div className="sleep-timeline">
              <div className="sleep-timeline__axis">
                {sleepTimelineLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              {lastFourteen.map((entry) => {
                const start = ((normalizeSleepTime(entry.bedtime) - 20 * 60) / (16 * 60)) * 100
                const end = ((normalizeSleepTime(entry.waketime) - 20 * 60) / (16 * 60)) * 100
                return (
                  <div key={entry.id} className="sleep-timeline__row">
                    <div className="sleep-timeline__label">
                      <strong>{formatDateShort(entry.date)}</strong>
                      <span>{qualityLabel(entry.quality)}</span>
                    </div>
                    <div className="sleep-timeline__track">
                      <div className="sleep-timeline__target" />
                      <div
                        className="sleep-timeline__bar"
                        style={{ left: `${start}%`, width: `${Math.max(end - start, 6)}%`, backgroundColor: qualityColor(entry.quality) }}
                      >
                        <span>{formatTimeDisplay(entry.bedtime)} → {formatTimeDisplay(entry.waketime)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'score' ? (
        <section className="native-panel native-score-layout">
          <div className="native-card native-card--padded native-score-card">
            <div
              className="score-ring"
              style={{
                background: `conic-gradient(${circadianScore.overall >= 80 ? '#34d399' : circadianScore.overall >= 60 ? '#6d4ce8' : circadianScore.overall >= 40 ? '#f59e0b' : '#d97706'} ${circadianScore.overall}%, rgba(255,255,255,0.08) 0)`,
              }}
            >
              <div className="score-ring__inner">
                <strong>{circadianScore.overall}</strong>
                <span>Circadian score</span>
              </div>
            </div>
            <p className="native-score-card__copy">
              {circadianScore.overall >= 80
                ? 'Excellent circadian consistency. Your sleep-wake rhythm is well regulated.'
                : circadianScore.overall >= 60
                  ? 'Good consistency. Minor timing drift remains, but the pattern is stable.'
                  : circadianScore.overall >= 40
                    ? 'Moderate variability. Tightening bedtime and wake-time regularity would help.'
                    : 'High irregularity detected. Sleep timing is still volatile and may destabilize mood.'}
            </p>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Score breakdown</h2>
              <p>Lower timing variability produces a higher score.</p>
            </div>
            {[
              ['Bedtime consistency', circadianScore.bedScore, `${Math.round(circadianScore.bedStd)} min std dev`],
              ['Wake time consistency', circadianScore.wakeScore, `${Math.round(circadianScore.wakeStd)} min std dev`],
              ['Duration consistency', circadianScore.durationScore, `${Math.round(circadianScore.durationStd)} min std dev`],
            ].map(([label, score, detail]) => (
              <div key={label} className="breakdown-row">
                <div>
                  <strong>{label}</strong>
                  <p>{detail}</p>
                </div>
                <div className="breakdown-row__bar">
                  <div className="breakdown-row__fill" style={{ width: `${score}%` }} />
                </div>
                <span>{score}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'srm' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-score-layout">
            <div className="native-card native-card--padded">
              <span className="summary-card__label">SRM regularity</span>
              <strong>{srmRegularity.toFixed(1)} / 10</strong>
              <p>
                {srmRegularity >= 7
                  ? 'Highly regular daily rhythm.'
                  : srmRegularity >= 5
                    ? 'Moderately regular rhythm with room to tighten anchors.'
                    : 'Irregular rhythm detected — social timing is still unstable.'}
              </p>
            </div>
            <div className="native-card native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>Today&apos;s anchors</h2>
              </div>
              <div className="srm-form-grid">
                {srmAnchors.map(({ key, label }) => (
                  <div className="srm-form-row" key={key}>
                    <span>{label}</span>
                    <input
                      className="text-input"
                      type="time"
                      value={srmDraft[key as keyof SrmDraft] as string}
                      onChange={(event) => setSrmDraft((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="button-row">
                <button type="button" className="primary-link" onClick={saveSrmEntry}>
                  Save rhythm entry
                </button>
              </div>
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Social Rhythm Metric timeline</h2>
              <p>Recent anchor timing across the last seven days.</p>
            </div>
            <div className="timeline-table-wrapper">
              <table className="timeline-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    {lastSevenSrm.map((entry) => (
                      <th key={entry.id}>{formatWeekday(entry.date)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {srmAnchors.map(({ key, label }) => (
                    <tr key={key}>
                      <td>{label}</td>
                      {lastSevenSrm.map((entry) => (
                        <td key={`${entry.id}-${key}`}>{formatTimeDisplay(entry[key as keyof SrmEntry] as string)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'tips' ? (
        <section className="native-panel native-panel--stacked">
          {tips.map((category) => (
            <div key={category.title} className="native-card native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>{category.title}</h2>
              </div>
              <ul className="feature-list">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
