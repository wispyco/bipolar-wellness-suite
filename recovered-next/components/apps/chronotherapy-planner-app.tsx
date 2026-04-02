'use client'

import { useMemo, useState } from 'react'

type Protocol = {
  id: string
  title: string
  description: string
  defaultTime: string
  duration: string
  caution: string
}

type ExposureLog = {
  date: string
  protocolId: string
  time: string
  duration: number
  moodBefore: number
  moodAfter: number
}

const protocols: Protocol[] = [
  {
    id: 'bright-light',
    title: 'Bright Light Therapy',
    description: 'Morning light exposure to support circadian alignment and bipolar depression protocols.',
    defaultTime: '07:30',
    duration: '20–30 min',
    caution: 'Use clinician guidance if light triggers activation or agitation.',
  },
  {
    id: 'dark-therapy',
    title: 'Dark Therapy',
    description: 'Evening low-light / blue-light reduction to calm activation and protect sleep timing.',
    defaultTime: '20:30',
    duration: '2–3 hrs',
    caution: 'Most relevant during emerging hypomania/mania or sleep drift.',
  },
  {
    id: 'wake-therapy',
    title: 'Wake Therapy',
    description: 'Structured sleep deprivation approaches require close clinical oversight.',
    defaultTime: '05:30',
    duration: 'Protocol dependent',
    caution: 'Not for self-directed use without explicit medical guidance.',
  },
]

const seasonalAdjustments = [
  { season: 'Winter', note: 'Increase morning light consistency and avoid sleeping in.' },
  { season: 'Spring', note: 'Monitor for activation as daylight length increases.' },
  { season: 'Summer', note: 'Protect evening darkness despite longer days.' },
  { season: 'Fall', note: 'Rebuild stable wake time as daylight shifts earlier.' },
] as const

const seedLogs: ExposureLog[] = [
  { date: '2026-03-29', protocolId: 'bright-light', time: '07:35', duration: 25, moodBefore: 2, moodAfter: 3 },
  { date: '2026-03-30', protocolId: 'bright-light', time: '07:30', duration: 25, moodBefore: 2, moodAfter: 3 },
  { date: '2026-03-31', protocolId: 'dark-therapy', time: '20:45', duration: 120, moodBefore: 3, moodAfter: 2 },
  { date: '2026-04-01', protocolId: 'bright-light', time: '07:40', duration: 30, moodBefore: 3, moodAfter: 4 },
]

export function ChronotherapyPlannerApp() {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('bright-light')
  const [logs, setLogs] = useState<ExposureLog[]>(seedLogs)
  const [draft, setDraft] = useState<ExposureLog>({
    date: new Date().toISOString().slice(0, 10),
    protocolId: 'bright-light',
    time: '07:30',
    duration: 25,
    moodBefore: 2,
    moodAfter: 3,
  })
  const [toast, setToast] = useState<string | null>(null)

  const selectedProtocol = protocols.find((protocol) => protocol.id === selectedProtocolId) ?? protocols[0]
  const filteredLogs = useMemo(
    () => logs.filter((log) => log.protocolId === selectedProtocolId).slice().reverse(),
    [logs, selectedProtocolId],
  )

  const averageShift = useMemo(() => {
    const relevant = logs.filter((log) => log.protocolId === selectedProtocolId)
    if (relevant.length === 0) return 0
    return relevant.reduce((sum, log) => sum + (log.moodAfter - log.moodBefore), 0) / relevant.length
  }, [logs, selectedProtocolId])

  const saveLog = () => {
    setLogs((current) => [...current, { ...draft }])
    setToast('Exposure log saved')
    window.setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Selected protocol</span>
          <strong>{selectedProtocol.title}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Average mood shift</span>
          <strong>{averageShift >= 0 ? '+' : ''}{averageShift.toFixed(1)}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Logged sessions</span>
          <strong>{filteredLogs.length}</strong>
        </div>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Protocol planner</h2>
            <p>Choose a chronotherapy approach and review timing, duration, and safety notes.</p>
          </div>
          <div className="manage-list">
            {protocols.map((protocol) => (
              <button
                key={protocol.id}
                type="button"
                className={`library-module ${selectedProtocolId === protocol.id ? 'library-module--active' : ''}`}
                onClick={() => {
                  setSelectedProtocolId(protocol.id)
                  setDraft((current) => ({ ...current, protocolId: protocol.id, time: protocol.defaultTime }))
                }}
              >
                <div>
                  <strong>{protocol.title}</strong>
                  <p>{protocol.description}</p>
                </div>
                <div className="manage-item__actions">
                  <span className="tag">{protocol.defaultTime}</span>
                  <span className="tag">{protocol.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>{selectedProtocol.title}</h2>
            <p>{selectedProtocol.description}</p>
          </div>
          <div className="comparison-grid comparison-grid--single">
            <div className="mini-stat mini-stat--wide">
              <span>Recommended start time</span>
              <strong>{selectedProtocol.defaultTime}</strong>
            </div>
            <div className="mini-stat mini-stat--wide">
              <span>Typical duration</span>
              <strong>{selectedProtocol.duration}</strong>
            </div>
            <div className="mini-stat mini-stat--wide">
              <span>Safety guidance</span>
              <strong>{selectedProtocol.caution}</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="native-card native-card--padded">
        <div className="native-section-heading">
          <h2>Light / chronotherapy log</h2>
          <p>Track when you used the intervention, how long you used it, and whether mood shifted.</p>
        </div>
        <div className="native-form-grid native-form-grid--two">
          <label className="field-block">
            <span className="form-label">Date</span>
            <input className="text-input" type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} />
          </label>
          <label className="field-block">
            <span className="form-label">Protocol</span>
            <select className="text-input" value={draft.protocolId} onChange={(event) => setDraft((current) => ({ ...current, protocolId: event.target.value }))}>
              {protocols.map((protocol) => (
                <option key={protocol.id} value={protocol.id}>
                  {protocol.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field-block">
            <span className="form-label">Time</span>
            <input className="text-input" type="time" value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))} />
          </label>
          <label className="field-block">
            <span className="form-label">Duration (minutes)</span>
            <input className="text-input" type="number" min="5" step="5" value={draft.duration} onChange={(event) => setDraft((current) => ({ ...current, duration: Number(event.target.value) }))} />
          </label>
          <label className="field-block">
            <span className="form-label">Mood before</span>
            <input className="slider-input" type="range" min={1} max={5} value={draft.moodBefore} onChange={(event) => setDraft((current) => ({ ...current, moodBefore: Number(event.target.value) }))} />
            <div className="tag">{draft.moodBefore}/5</div>
          </label>
          <label className="field-block">
            <span className="form-label">Mood after</span>
            <input className="slider-input" type="range" min={1} max={5} value={draft.moodAfter} onChange={(event) => setDraft((current) => ({ ...current, moodAfter: Number(event.target.value) }))} />
            <div className="tag">{draft.moodAfter}/5</div>
          </label>
        </div>
        <div className="button-row">
          <button type="button" className="primary-link" onClick={saveLog}>
            Save session
          </button>
        </div>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Recent sessions</h2>
          </div>
          <div className="manage-list">
            {filteredLogs.map((log) => (
              <div key={`${log.date}-${log.time}-${log.protocolId}`} className="manage-item manage-item--tall">
                <div>
                  <strong>{new Date(`${log.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
                  <p>{log.time} · {log.duration} min</p>
                </div>
                <div className="manage-item__stack">
                  <span className="tag">Mood {log.moodBefore} → {log.moodAfter}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Seasonal adjustments</h2>
          </div>
          <ul className="feature-list">
            {seasonalAdjustments.map((entry) => (
              <li key={entry.season}>
                <strong>{entry.season}:</strong> {entry.note}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
