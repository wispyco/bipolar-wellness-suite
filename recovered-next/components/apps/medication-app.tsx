'use client'

import { useMemo, useState } from 'react'

type TabKey = 'today' | 'medications' | 'adherence' | 'sideeffects' | 'effectiveness'

type Medication = {
  id: string
  name: string
  dose: string
  frequency: 'once-morning' | 'once-evening' | 'twice' | 'three' | 'as-needed'
  time: string
  color: string
}

type SideEffect = {
  date: string
  medId: string
  type: string
  severity: number
  notes: string
}

type EffectivenessEntry = {
  week: string
  ratings: Record<string, number>
}

type AdherenceEntry = {
  date: string
  doses: Record<string, boolean[]>
}

type TodayTaken = Record<string, boolean[]>

const medicationTabs: Array<{ key: TabKey; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'medications', label: 'My Medications' },
  { key: 'adherence', label: 'Adherence' },
  { key: 'sideeffects', label: 'Side Effects' },
  { key: 'effectiveness', label: 'Effectiveness' },
]

const medColors = ['#3B5998', '#7C6DAF', '#E8A838', '#5B8C5A', '#D4776B']

const seedMedications: Medication[] = [
  { id: 'med1', name: 'Lithium', dose: '300mg', frequency: 'twice', time: '08:00', color: medColors[0] },
  { id: 'med2', name: 'Lamotrigine', dose: '200mg', frequency: 'once-evening', time: '21:00', color: medColors[1] },
  { id: 'med3', name: 'Quetiapine', dose: '100mg', frequency: 'once-evening', time: '22:00', color: medColors[2] },
]

const sampleAdherence = [
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [false] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, false], med2: [true], med3: [true] },
  { med1: [true, true], med2: [false], med3: [true] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [false, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [true] },
  { med1: [true, true], med2: [true], med3: [false] },
  { med1: [true, true], med2: [true], med3: [true] },
]

const seedAdherenceHistory: AdherenceEntry[] = sampleAdherence.map((doses, index) => {
  const date = new Date('2026-03-19T00:00:00')
  date.setDate(date.getDate() + index)
  return { date: date.toISOString().slice(0, 10), doses }
})

const seedSideEffects: SideEffect[] = [
  { date: '2026-03-20', medId: 'med1', type: 'tremor', severity: 2, notes: 'Mild hand tremor in the morning' },
  { date: '2026-03-22', medId: 'med3', type: 'drowsiness', severity: 3, notes: 'Felt groggy until 10am' },
  { date: '2026-03-27', medId: 'med1', type: 'tremor', severity: 3, notes: 'Tremor worse today, spilled coffee' },
  { date: '2026-03-28', medId: 'med3', type: 'drowsiness', severity: 4, notes: 'Could not function until noon' },
  { date: '2026-04-01', medId: 'med3', type: 'drowsiness', severity: 3, notes: 'Morning grogginess, improving by afternoon' },
]

const seedEffectivenessHistory: EffectivenessEntry[] = [
  { week: 'Mar 17', ratings: { med1: 4, med2: 3, med3: 3 } },
  { week: 'Mar 24', ratings: { med1: 4, med2: 4, med3: 2 } },
]

function doseCount(frequency: Medication['frequency']) {
  if (frequency === 'twice') return 2
  if (frequency === 'three') return 3
  return 1
}

function frequencyLabel(frequency: Medication['frequency']) {
  return {
    'once-morning': 'Once daily (morning)',
    'once-evening': 'Once daily (evening)',
    twice: 'Twice daily',
    three: 'Three times daily',
    'as-needed': 'As needed',
  }[frequency]
}

function formatTime12(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function formatShortDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function MedicationApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')
  const [medications, setMedications] = useState<Medication[]>(seedMedications)
  const [adherenceHistory] = useState<AdherenceEntry[]>(seedAdherenceHistory)
  const [todayTaken, setTodayTaken] = useState<TodayTaken>(() =>
    Object.fromEntries(seedMedications.map((med) => [med.id, new Array(doseCount(med.frequency)).fill(false)])),
  )
  const [sideEffects, setSideEffects] = useState<SideEffect[]>(seedSideEffects)
  const [effectivenessHistory, setEffectivenessHistory] = useState<EffectivenessEntry[]>(seedEffectivenessHistory)
  const [currentEffectiveness, setCurrentEffectiveness] = useState<Record<string, number>>(
    Object.fromEntries(seedMedications.map((med) => [med.id, 3])),
  )
  const [newMedication, setNewMedication] = useState({
    name: '',
    dose: '',
    frequency: 'once-morning' as Medication['frequency'],
    time: '08:00',
  })
  const [newSideEffect, setNewSideEffect] = useState({
    medId: seedMedications[0]?.id ?? '',
    type: 'drowsiness',
    severity: 3,
    notes: '',
  })
  const [toast, setToast] = useState<string | null>(null)

  const adherenceSummary = useMemo(() => {
    const last7 = adherenceHistory.slice(-7)
    let total = 0
    let taken = 0
    let missed = 0

    last7.forEach((day) => {
      Object.values(day.doses).forEach((doses) => {
        doses.forEach((dose) => {
          total += 1
          if (dose) taken += 1
          else missed += 1
        })
      })
    })

    const pct = total ? Math.round((taken / total) * 100) : 0
    let streak = 0
    for (let index = adherenceHistory.length - 1; index >= 0; index -= 1) {
      const allTaken = Object.values(adherenceHistory[index].doses).every((doses) => doses.every(Boolean))
      if (allTaken) streak += 1
      else break
    }

    return { pct, streak, missed }
  }, [adherenceHistory])

  const adherenceByMedication = useMemo(
    () =>
      medications.map((medication) => {
        let total = 0
        let taken = 0
        adherenceHistory.slice(-14).forEach((day) => {
          const doses = day.doses[medication.id]
          doses?.forEach((dose) => {
            total += 1
            if (dose) taken += 1
          })
        })
        return {
          id: medication.id,
          name: medication.name,
          color: medication.color,
          pct: total ? Math.round((taken / total) * 100) : 0,
        }
      }),
    [adherenceHistory, medications],
  )

  const missedPatterns = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const missedByDay = new Array(7).fill(0)
    adherenceHistory.forEach((entry) => {
      const day = new Date(`${entry.date}T00:00:00`).getDay()
      Object.values(entry.doses).forEach((doses) => doses.forEach((dose) => { if (!dose) missedByDay[day] += 1 }))
    })
    const maxMissed = Math.max(...missedByDay, 1)
    return days.map((label, index) => ({ label, missed: missedByDay[index], width: (missedByDay[index] / maxMissed) * 100 }))
  }, [adherenceHistory])

  const saveSideEffect = () => {
    setSideEffects((current) => [
      ...current,
      {
        date: new Date().toISOString().slice(0, 10),
        medId: newSideEffect.medId,
        type: newSideEffect.type,
        severity: newSideEffect.severity,
        notes: newSideEffect.notes.trim(),
      },
    ])
    setNewSideEffect((current) => ({ ...current, notes: '' }))
    setToast('Saved')
    window.setTimeout(() => setToast(null), 2400)
  }

  const addMedication = () => {
    if (!newMedication.name.trim()) return

    const medication: Medication = {
      id: `med-${Date.now()}`,
      name: newMedication.name.trim(),
      dose: newMedication.dose.trim(),
      frequency: newMedication.frequency,
      time: newMedication.time,
      color: medColors[medications.length % medColors.length],
    }

    setMedications((current) => [...current, medication])
    setTodayTaken((current) => ({ ...current, [medication.id]: new Array(doseCount(medication.frequency)).fill(false) }))
    setCurrentEffectiveness((current) => ({ ...current, [medication.id]: 3 }))
    setNewMedication({ name: '', dose: '', frequency: 'once-morning', time: '08:00' })
  }

  const saveEffectiveness = () => {
    setEffectivenessHistory((current) => [
      ...current,
      {
        week: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ratings: { ...currentEffectiveness },
      },
    ])
    setToast('Saved')
    window.setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Weekly adherence</span>
          <strong>{adherenceSummary.pct}%</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Day streak</span>
          <strong>{adherenceSummary.streak}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Missed this week</span>
          <strong>{adherenceSummary.missed}</strong>
        </div>
      </div>

      <div className="native-tabs" role="tablist" aria-label="Medication sections">
        {medicationTabs.map(({ key, label }) => (
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

      {activeTab === 'today' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Today&apos;s medications</h2>
              <p>Check off each dose as you take it.</p>
            </div>
            <div className="manage-list">
              {medications.flatMap((medication) =>
                todayTaken[medication.id].map((taken, index) => (
                  <div key={`${medication.id}-${index}`} className={`manage-item ${taken ? 'manage-item--done' : ''}`}>
                    <div>
                      <strong>{medication.name} {medication.dose}</strong>
                      <p>
                        {doseCount(medication.frequency) > 1 ? `Dose ${index + 1}` : frequencyLabel(medication.frequency)} · {formatTime12(medication.time)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`choice-chip ${taken ? 'choice-chip--active' : ''}`}
                      onClick={() =>
                        setTodayTaken((current) => ({
                          ...current,
                          [medication.id]: current[medication.id].map((dose, doseIndex) => (doseIndex === index ? !dose : dose)),
                        }))
                      }
                    >
                      {taken ? 'Taken' : 'Mark taken'}
                    </button>
                  </div>
                )),
              )}
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Log a side effect</h2>
            </div>
            <div className="native-form-grid native-form-grid--two">
              <label className="field-block">
                <span className="form-label">Medication</span>
                <select className="text-input" value={newSideEffect.medId} onChange={(event) => setNewSideEffect((current) => ({ ...current, medId: event.target.value }))}>
                  {medications.map((medication) => (
                    <option key={medication.id} value={medication.id}>
                      {medication.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span className="form-label">Side effect</span>
                <select className="text-input" value={newSideEffect.type} onChange={(event) => setNewSideEffect((current) => ({ ...current, type: event.target.value }))}>
                  {['drowsiness', 'weight-gain', 'nausea', 'tremor', 'dry-mouth', 'dizziness', 'headache', 'insomnia', 'cognitive-fog', 'thirst'].map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span className="form-label">Severity</span>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`rating-chip ${newSideEffect.severity === value ? 'rating-chip--active' : ''}`}
                      onClick={() => setNewSideEffect((current) => ({ ...current, severity: value }))}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </label>
              <label className="field-block field-block--full">
                <span className="form-label">Notes</span>
                <input className="text-input" value={newSideEffect.notes} onChange={(event) => setNewSideEffect((current) => ({ ...current, notes: event.target.value }))} placeholder="Optional details…" />
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={saveSideEffect}>
                Log side effect
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'medications' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Add medication</h2>
            </div>
            <div className="native-form-grid native-form-grid--two">
              <label className="field-block">
                <span className="form-label">Medication name</span>
                <input className="text-input" value={newMedication.name} onChange={(event) => setNewMedication((current) => ({ ...current, name: event.target.value }))} placeholder="Lithium, Lamotrigine…" />
              </label>
              <label className="field-block">
                <span className="form-label">Dose</span>
                <input className="text-input" value={newMedication.dose} onChange={(event) => setNewMedication((current) => ({ ...current, dose: event.target.value }))} placeholder="300mg" />
              </label>
              <label className="field-block">
                <span className="form-label">Frequency</span>
                <select className="text-input" value={newMedication.frequency} onChange={(event) => setNewMedication((current) => ({ ...current, frequency: event.target.value as Medication['frequency'] }))}>
                  {(['once-morning', 'once-evening', 'twice', 'three', 'as-needed'] as const).map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequencyLabel(frequency)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span className="form-label">Primary time</span>
                <input className="text-input" type="time" value={newMedication.time} onChange={(event) => setNewMedication((current) => ({ ...current, time: event.target.value }))} />
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={addMedication}>
                Add medication
              </button>
            </div>
          </div>

          <div className="manage-list">
            {medications.map((medication) => (
              <div key={medication.id} className="manage-item">
                <div className="med-chip" style={{ backgroundColor: medication.color }} />
                <div>
                  <strong>{medication.name} {medication.dose}</strong>
                  <p>{frequencyLabel(medication.frequency)} at {formatTime12(medication.time)}</p>
                </div>
                <button
                  type="button"
                  className="secondary-link secondary-link--small"
                  onClick={() => {
                    setMedications((current) => current.filter((item) => item.id !== medication.id))
                    setCurrentEffectiveness((current) => {
                      const next = { ...current }
                      delete next[medication.id]
                      return next
                    })
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'adherence' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Adherence by medication</h2>
            </div>
            <div className="analysis-bars">
              {adherenceByMedication.map((entry) => (
                <div key={entry.id} className="analysis-bars__row">
                  <div>
                    <strong>{entry.name}</strong>
                    <p>{entry.pct}% adhered over the last 14 days</p>
                  </div>
                  <div className="analysis-bars__track">
                    <div className="analysis-bars__fill" style={{ width: `${entry.pct}%`, background: entry.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Missed dose patterns</h2>
            </div>
            <div className="analysis-bars">
              {missedPatterns.map((entry) => (
                <div key={entry.label} className="analysis-bars__row">
                  <div>
                    <strong>{entry.label}</strong>
                    <p>{entry.missed} missed doses</p>
                  </div>
                  <div className="analysis-bars__track">
                    <div className="analysis-bars__fill analysis-bars__fill--orange" style={{ width: `${entry.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'sideeffects' ? (
        <section className="native-panel native-panel--stacked">
          <div className="manage-list">
            {sideEffects
              .slice()
              .reverse()
              .map((effect) => {
                const medication = medications.find((item) => item.id === effect.medId)
                return (
                  <div key={`${effect.date}-${effect.medId}-${effect.type}`} className="manage-item manage-item--tall">
                    <div>
                      <strong>{effect.type.replace(/-/g, ' ')}</strong>
                      <p>{medication?.name ?? 'Unknown medication'} · {formatShortDate(effect.date)}</p>
                    </div>
                    <div className="manage-item__stack">
                      <span className="tag">Severity {effect.severity}/5</span>
                      <p>{effect.notes || 'No additional notes'}</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      ) : null}

      {activeTab === 'effectiveness' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Medication effectiveness self-rating</h2>
            </div>
            <div className="manage-list">
              {medications.map((medication) => (
                <div key={medication.id} className="manage-item manage-item--tall">
                  <div>
                    <strong>{medication.name} {medication.dose}</strong>
                    <p>Rate how well it is helping this week.</p>
                  </div>
                  <div className="rating-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`rating-chip ${currentEffectiveness[medication.id] === value ? 'rating-chip--active' : ''}`}
                        onClick={() => setCurrentEffectiveness((current) => ({ ...current, [medication.id]: value }))}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={saveEffectiveness}>
                Save ratings
              </button>
            </div>
          </div>

          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Effectiveness over time</h2>
            </div>
            <div className="timeline-table-wrapper">
              <table className="timeline-table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    {effectivenessHistory.map((entry) => (
                      <th key={entry.week}>{entry.week}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication) => (
                    <tr key={medication.id}>
                      <td>{medication.name}</td>
                      {effectivenessHistory.map((entry) => (
                        <td key={`${entry.week}-${medication.id}`}>{entry.ratings[medication.id] ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
