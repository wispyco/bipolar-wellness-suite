'use client'

import { useMemo, useState } from 'react'

type MoodEntry = {
  id: string
  date: string
  mood: number
  sleepHours: number | null
  medication: 'yes' | 'no' | null
  energy: number | null
  irritability: number | null
  anxiety: number | null
  notes: string | null
}

type EntryDraft = {
  mood: number
  sleepHours: string
  medication: 'yes' | 'no' | null
  energy: number | null
  irritability: number | null
  anxiety: number | null
  notes: string
}

type TabKey = 'entry' | 'chart' | 'summary' | 'history'

const moodTrackerTabs: Array<{ key: TabKey; label: string }> = [
  { key: 'entry', label: 'Log Entry' },
  { key: 'chart', label: 'Life Chart' },
  { key: 'summary', label: 'Weekly Summary' },
  { key: 'history', label: 'History' },
]

const ratingFields = [
  { key: 'energy', label: 'Energy' },
  { key: 'irritability', label: 'Irritability' },
  { key: 'anxiety', label: 'Anxiety' },
] as const

const moodMeta: Record<string, { label: string; color: string }> = {
  '-4': { label: 'Severe Depression', color: '#1B4F72' },
  '-3': { label: 'Moderate Depression', color: '#2E86C1' },
  '-2': { label: 'Mild Depression', color: '#5DADE2' },
  '-1': { label: 'Slight Depression', color: '#85C1E9' },
  '0': { label: 'Baseline / Euthymia', color: '#5B8C5A' },
  '1': { label: 'Slight Hypomania', color: '#F0B429' },
  '2': { label: 'Mild Hypomania', color: '#E8912D' },
  '3': { label: 'Moderate Mania', color: '#D4776B' },
  '4': { label: 'Severe Mania', color: '#C0392B' },
}

const seedMoodEntries: MoodEntry[] = [
  ['2026-03-19', -2, 5.5, 'yes', 2, 3, 3, 'Feeling low energy, hard to get out of bed. Managed a short walk.'],
  ['2026-03-20', -2, 5, 'yes', 2, 3, 4, 'Mood slightly worse. Appetite decreased. Called mom.'],
  ['2026-03-21', -3, 4.5, 'yes', 1, 4, 4, 'Difficult day. Concentration poor. Missed a work deadline.'],
  ['2026-03-22', -3, 5, 'no', 1, 4, 4, 'Forgot medication. Sleep was fragmented, woke up at 3am.'],
  ['2026-03-23', -2, 6, 'yes', 2, 3, 3, 'Back on meds. Slight improvement in afternoon.'],
  ['2026-03-24', -3, 5.5, 'yes', 1, 4, 3, 'Still struggling. Therapist session helped identify rumination patterns.'],
  ['2026-03-25', -2, 6.5, 'yes', 2, 3, 3, 'Better day overall. Got some work done. Cooked dinner.'],
  ['2026-03-26', -2, 7, 'yes', 2, 2, 2, 'Mood lifting slightly. Sleep improving. Morning felt less heavy.'],
  ['2026-03-27', -1, 7, 'yes', 3, 2, 2, 'Noticeable improvement. Went for a 30-minute run.'],
  ['2026-03-28', -1, 7.5, 'yes', 3, 2, 2, 'Good day. Social outing with friends, felt almost normal.'],
  ['2026-03-29', -1, 7, 'yes', 3, 2, 2, 'Steady. Maintaining routine, sleep is back to 7+ hours.'],
  ['2026-03-30', 0, 7.5, 'yes', 3, 1, 2, 'Feeling stable. Productive at work. Grateful for the upturn.'],
  ['2026-03-31', 0, 8, 'yes', 4, 1, 1, 'Baseline! First day in two weeks that feels genuinely okay.'],
  ['2026-04-01', 0, 7.5, 'yes', 3, 1, 1, 'Another stable day. Keeping up with routine and exercise.'],
].map(([date, mood, sleepHours, medication, energy, irritability, anxiety, notes], index) => ({
  id: `mood-${index + 1}`,
  date: `${date}T09:00:00.000Z`,
  mood: mood as number,
  sleepHours: sleepHours as number,
  medication: medication as 'yes' | 'no',
  energy: energy as number,
  irritability: irritability as number,
  anxiety: anxiety as number,
  notes: notes as string,
}))

const defaultDraft: EntryDraft = {
  mood: 0,
  sleepHours: '',
  medication: null,
  energy: null,
  irritability: null,
  anxiety: null,
  notes: '',
}

function getMoodLabel(value: number) {
  return moodMeta[String(value)]?.label ?? 'Baseline / Euthymia'
}

function getMoodColor(value: number) {
  return moodMeta[String(value)]?.color ?? '#5B8C5A'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function getStdDev(values: number[]) {
  if (values.length === 0) return 0
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function getWeeklySparklinePoints(entries: MoodEntry[]) {
  return entries
    .map((entry, index) => {
      const x = entries.length === 1 ? 120 : (index / (entries.length - 1)) * 100
      const y = ((4 - entry.mood) / 8) * 100
      return `${x},${y}`
    })
    .join(' ')
}

function getLineChartPoints(entries: MoodEntry[]) {
  return entries
    .map((entry, index) => {
      const x = entries.length === 1 ? 40 : 40 + (index / (entries.length - 1)) * 680
      const y = 20 + ((4 - entry.mood) / 8) * 240
      return `${x},${y}`
    })
    .join(' ')
}

export function MoodTrackerApp() {
  const lastEntryId = seedMoodEntries[seedMoodEntries.length - 1]?.id ?? ''
  const [activeTab, setActiveTab] = useState<TabKey>('entry')
  const [entries, setEntries] = useState<MoodEntry[]>(seedMoodEntries)
  const [draft, setDraft] = useState<EntryDraft>(defaultDraft)
  const [selectedEntryId, setSelectedEntryId] = useState<string>(lastEntryId)
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(lastEntryId)
  const [toast, setToast] = useState<string | null>(null)

  const sortedEntries = useMemo(
    () => [...entries].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime()),
    [entries],
  )

  const lastSevenEntries = useMemo(() => sortedEntries.slice(-7), [sortedEntries])

  const selectedEntry = useMemo(
    () => sortedEntries.find((entry) => entry.id === selectedEntryId) ?? sortedEntries[sortedEntries.length - 1],
    [selectedEntryId, sortedEntries],
  )

  const weeklyStats = useMemo(() => {
    const moods = lastSevenEntries.map((entry) => entry.mood)
    const avgMood = moods.reduce((sum, value) => sum + value, 0) / moods.length
    const sleepEntries = lastSevenEntries.filter((entry) => entry.sleepHours !== null)
    const avgSleep = sleepEntries.length
      ? sleepEntries.reduce((sum, entry) => sum + (entry.sleepHours ?? 0), 0) / sleepEntries.length
      : null
    const medEntries = lastSevenEntries.filter((entry) => entry.medication)
    const adherence = medEntries.length
      ? Math.round((medEntries.filter((entry) => entry.medication === 'yes').length / medEntries.length) * 100)
      : null
    const stability = getStdDev(moods)
    return { avgMood, avgSleep, adherence, stability }
  }, [lastSevenEntries])

  const moodPrefix = draft.mood > 0 ? '+' : ''

  const submitEntry = () => {
    const nextEntry: MoodEntry = {
      id: `custom-${Date.now()}`,
      date: new Date().toISOString(),
      mood: draft.mood,
      sleepHours: draft.sleepHours ? Number(draft.sleepHours) : null,
      medication: draft.medication,
      energy: draft.energy,
      irritability: draft.irritability,
      anxiety: draft.anxiety,
      notes: draft.notes.trim() || null,
    }

    setEntries((current) => [...current, nextEntry])
    setSelectedEntryId(nextEntry.id)
    setExpandedHistoryId(nextEntry.id)
    setDraft(defaultDraft)
    setActiveTab('summary')
    setToast('Entry saved successfully')
    window.setTimeout(() => setToast(null), 2400)
  }

  const moodChartPoints = getLineChartPoints(sortedEntries)
  const sparklinePoints = getWeeklySparklinePoints(lastSevenEntries)

  return (
    <div className="native-app-shell">
      <div className="native-tabs" role="tablist" aria-label="Mood tracker sections">
        {moodTrackerTabs.map(({ key, label }) => (
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

      {activeTab === 'entry' ? (
        <section className="native-panel native-panel--form">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Log today&apos;s entry</h2>
              <p>Capture the day&apos;s mood, sleep, medication, energy, irritability, anxiety, and notes.</p>
            </div>

            <div className="form-section">
              <label className="form-label" htmlFor="mood-slider">
                Mood level
                <span className="form-help">-4 severe depression to +4 severe mania</span>
              </label>
              <input
                id="mood-slider"
                type="range"
                min={-4}
                max={4}
                step={1}
                value={draft.mood}
                onChange={(event) => setDraft((current) => ({ ...current, mood: Number(event.target.value) }))}
                className="slider-input"
              />
              <div className="slider-scale">
                {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((value) => (
                  <span key={value}>{value > 0 ? `+${value}` : value}</span>
                ))}
              </div>
              <div className="mood-pill" style={{ borderColor: getMoodColor(draft.mood), color: getMoodColor(draft.mood) }}>
                <strong>{`${moodPrefix}${draft.mood}`}</strong>
                <span>{getMoodLabel(draft.mood)}</span>
              </div>
            </div>

            <div className="native-form-grid">
              <label className="field-block">
                <span className="form-label">Hours of sleep</span>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={draft.sleepHours}
                  onChange={(event) => setDraft((current) => ({ ...current, sleepHours: event.target.value }))}
                  className="text-input"
                  placeholder="7.5"
                />
              </label>

              <div className="field-block">
                <span className="form-label">Medication taken</span>
                <div className="choice-row">
                  {[
                    ['yes', 'Yes'],
                    ['no', 'No'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`choice-chip ${draft.medication === value ? 'choice-chip--active' : ''}`}
                      onClick={() => setDraft((current) => ({ ...current, medication: value as 'yes' | 'no' }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {ratingFields.map(({ key, label }) => (
                <div className="field-block" key={key}>
                  <span className="form-label">{label}</span>
                  <div className="rating-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`rating-chip ${draft[key as keyof EntryDraft] === value ? 'rating-chip--active' : ''}`}
                        onClick={() => setDraft((current) => ({ ...current, [key]: value }))}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <label className="field-block">
              <span className="form-label">Notes</span>
              <textarea
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                className="text-area"
                rows={4}
                placeholder="How are you feeling today? Any notable events, triggers, or observations?"
              />
            </label>

            <div className="button-row">
              <button type="button" className="primary-link" onClick={submitEntry}>
                Save entry
              </button>
              <button type="button" className="secondary-link" onClick={() => setDraft(defaultDraft)}>
                Clear
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'chart' ? (
        <section className="native-panel native-chart-layout">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Life Chart</h2>
              <p>Click a point to inspect the day&apos;s mood, sleep, and supporting metrics.</p>
            </div>
            <svg viewBox="0 0 760 300" className="mood-chart" role="img" aria-label="Mood chart over time">
              <rect x="40" y="20" width="680" height="120" fill="rgba(46,134,193,0.08)" rx="18" />
              <rect x="40" y="140" width="680" height="60" fill="rgba(91,140,90,0.08)" rx="18" />
              <rect x="40" y="200" width="680" height="60" fill="rgba(212,119,107,0.08)" rx="18" />
              {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((value) => {
                const y = 20 + ((4 - value) / 8) * 240
                return (
                  <g key={value}>
                    <line x1="40" x2="720" y1={y} y2={y} className={`mood-chart__grid ${value === 0 ? 'mood-chart__grid--baseline' : ''}`} />
                    <text x="10" y={y + 4} className="mood-chart__axis">
                      {value > 0 ? `+${value}` : value}
                    </text>
                  </g>
                )
              })}
              <polyline points={moodChartPoints} className="mood-chart__line" />
              {sortedEntries.map((entry, index) => {
                const x = sortedEntries.length === 1 ? 40 : 40 + (index / (sortedEntries.length - 1)) * 680
                const y = 20 + ((4 - entry.mood) / 8) * 240
                return (
                  <g key={entry.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r={selectedEntry?.id === entry.id ? 7 : 5}
                      fill={getMoodColor(entry.mood)}
                      stroke="white"
                      strokeWidth="2"
                      onClick={() => setSelectedEntryId(entry.id)}
                    />
                    <text x={x} y="285" textAnchor="middle" className="mood-chart__label">
                      {formatDateShort(entry.date)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {selectedEntry ? (
            <div className="native-card native-card--padded">
              <div className="detail-card__topline">
                <span className="tag">{formatDate(selectedEntry.date)}</span>
                <span className="tag">{formatTime(selectedEntry.date)}</span>
              </div>
              <div className="detail-card__mood">
                <div className="detail-card__indicator" style={{ backgroundColor: getMoodColor(selectedEntry.mood) }}>
                  {selectedEntry.mood > 0 ? `+${selectedEntry.mood}` : selectedEntry.mood}
                </div>
                <div>
                  <strong>{getMoodLabel(selectedEntry.mood)}</strong>
                  <p>{selectedEntry.notes ?? 'No note recorded for this day.'}</p>
                </div>
              </div>
              <div className="detail-stats-grid">
                {[
                  ['Sleep', selectedEntry.sleepHours ? `${selectedEntry.sleepHours} hrs` : '—'],
                  ['Medication', selectedEntry.medication === 'yes' ? 'Taken' : selectedEntry.medication === 'no' ? 'Missed' : '—'],
                  ['Energy', selectedEntry.energy ? `${selectedEntry.energy} / 5` : '—'],
                  ['Irritability', selectedEntry.irritability ? `${selectedEntry.irritability} / 5` : '—'],
                  ['Anxiety', selectedEntry.anxiety ? `${selectedEntry.anxiety} / 5` : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="mini-stat">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === 'summary' ? (
        <section className="native-panel native-panel--stacked">
          <div className="summary-grid">
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Average mood</span>
              <strong style={{ color: getMoodColor(Math.round(weeklyStats.avgMood)) }}>
                {weeklyStats.avgMood >= 0 ? '+' : ''}
                {weeklyStats.avgMood.toFixed(1)}
              </strong>
              <p>{getMoodLabel(Math.round(weeklyStats.avgMood))}</p>
            </div>
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Average sleep</span>
              <strong>{weeklyStats.avgSleep ? `${weeklyStats.avgSleep.toFixed(1)} hrs` : '—'}</strong>
              <p>{lastSevenEntries.filter((entry) => entry.sleepHours !== null).length} entries logged</p>
            </div>
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Medication adherence</span>
              <strong>{weeklyStats.adherence !== null ? `${weeklyStats.adherence}%` : '—'}</strong>
              <p>{weeklyStats.adherence !== null ? 'Days with medication tracked this week' : 'Not tracked'}</p>
            </div>
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Mood stability</span>
              <strong>{weeklyStats.stability.toFixed(2)}</strong>
              <p>
                {weeklyStats.stability > 2
                  ? 'High variability'
                  : weeklyStats.stability > 1
                    ? 'Moderate variability'
                    : 'Stable week'}
              </p>
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>This week&apos;s mood trend</h2>
              <p>A compact view of your last seven entries.</p>
            </div>
            <svg viewBox="0 0 100 100" className="sparkline-chart" role="img" aria-label="Weekly mood trend sparkline">
              <line x1="0" y1="50" x2="100" y2="50" className="sparkline-chart__baseline" />
              <polyline points={sparklinePoints} className="sparkline-chart__line" />
              {lastSevenEntries.map((entry, index) => {
                const x = lastSevenEntries.length === 1 ? 50 : (index / (lastSevenEntries.length - 1)) * 100
                const y = ((4 - entry.mood) / 8) * 100
                return <circle key={entry.id} cx={x} cy={y} r="2.2" fill={getMoodColor(entry.mood)} />
              })}
            </svg>
          </div>
        </section>
      ) : null}

      {activeTab === 'history' ? (
        <section className="native-panel native-panel--stacked">
          {sortedEntries
            .slice()
            .reverse()
            .map((entry) => {
              const isExpanded = expandedHistoryId === entry.id
              return (
                <article key={entry.id} className="native-card native-card--padded history-card">
                  <button
                    type="button"
                    className="history-card__summary"
                    onClick={() => setExpandedHistoryId(isExpanded ? null : entry.id)}
                  >
                    <div className="history-card__left">
                      <span className="history-dot" style={{ backgroundColor: getMoodColor(entry.mood) }} />
                      <div>
                        <strong>{formatDate(entry.date)}</strong>
                        <p>{getMoodLabel(entry.mood)}</p>
                      </div>
                    </div>
                    <div className="history-card__right">
                      <strong style={{ color: getMoodColor(entry.mood) }}>{entry.mood > 0 ? `+${entry.mood}` : entry.mood}</strong>
                      <span>{isExpanded ? 'Hide' : 'Show'}</span>
                    </div>
                  </button>
                  {isExpanded ? (
                    <div className="history-card__details">
                      <div className="detail-stats-grid">
                        {[
                          ['Sleep', entry.sleepHours ? `${entry.sleepHours} hours` : '—'],
                          ['Medication', entry.medication === 'yes' ? 'Taken' : entry.medication === 'no' ? 'Missed' : '—'],
                          ['Energy', entry.energy ? `${entry.energy} / 5` : '—'],
                          ['Irritability', entry.irritability ? `${entry.irritability} / 5` : '—'],
                          ['Anxiety', entry.anxiety ? `${entry.anxiety} / 5` : '—'],
                          ['Time', formatTime(entry.date)],
                        ].map(([label, value]) => (
                          <div key={label} className="mini-stat">
                            <span>{label}</span>
                            <strong>{value}</strong>
                          </div>
                        ))}
                      </div>
                      {entry.notes ? <p className="history-card__note">“{entry.notes}”</p> : null}
                    </div>
                  ) : null}
                </article>
              )
            })}
        </section>
      ) : null}

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
