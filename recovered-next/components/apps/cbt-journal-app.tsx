'use client'

import { useMemo, useState } from 'react'

type TabKey = 'record' | 'history' | 'patterns' | 'reframe' | 'distortions'

type RecordItem = {
  id: number
  date: string
  situation: string
  autoThought: string
  emotion: string
  intensity: number
  distortion: DistortionKey
  alternative: string
  newEmotion: string
  newIntensity: number
}

type Draft = {
  situation: string
  autoThought: string
  emotion: string
  intensity: number
  distortion: DistortionKey
  alternative: string
  newEmotion: string
  newIntensity: number
}

const cbtTabs: Array<{ key: TabKey; label: string }> = [
  { key: 'record', label: 'New Record' },
  { key: 'history', label: 'History' },
  { key: 'patterns', label: 'Pattern Analysis' },
  { key: 'reframe', label: 'Reframe Helper' },
  { key: 'distortions', label: 'Distortion Guide' },
]

const distortions = {
  'all-or-nothing': {
    name: 'All-or-Nothing Thinking',
    desc: 'Seeing situations in extremes instead of gradients.',
    questions: [
      'Is there a middle ground between total success and failure?',
      'Would I judge a friend this harshly?',
      'What parts of the situation went okay?',
    ],
    prompts: [
      'Replace “always/never” with “sometimes” or “this time”.',
      'Describe the outcome on a 0–100 scale, not pass/fail.',
    ],
    exampleBefore: 'I made one mistake, so I am incompetent.',
    exampleAfter: 'I made one mistake and still did several things competently.',
  },
  'overgeneralization': {
    name: 'Overgeneralization',
    desc: 'Treating a single event as a permanent pattern.',
    questions: [
      'Is this really a pattern or one difficult example?',
      'When has the opposite been true?',
      'What evidence challenges this rule?',
    ],
    prompts: [
      'Swap “always” for “this time”.',
      'List three exceptions.',
    ],
    exampleBefore: 'This went badly, so nothing ever works out.',
    exampleAfter: 'This was one setback, not the whole story.',
  },
  'mental-filter': {
    name: 'Mental Filter',
    desc: 'Focusing on one negative detail while filtering out the bigger picture.',
    questions: [
      'Am I ignoring neutral or positive information?',
      'What would a neutral observer notice?',
      'If I listed 10 facts, how many would actually be negative?',
    ],
    prompts: [
      'Write down five neutral or positive details.',
      'Describe the whole event, not just the sharpest pain point.',
    ],
    exampleBefore: 'There was one awkward moment, so the whole thing was terrible.',
    exampleAfter: 'One awkward moment happened inside a larger, mostly okay event.',
  },
  'disqualifying': {
    name: 'Disqualifying the Positive',
    desc: 'Discounting progress or praise so it cannot emotionally count.',
    questions: [
      'Why am I dismissing this positive evidence?',
      'Would I dismiss it for someone else?',
      'What happens if I accept the positive at face value?',
    ],
    prompts: [
      'Practice “thank you” without adding a qualifier.',
      'Write down one achievement and let it stand on its own.',
    ],
    exampleBefore: 'It does not count. Anyone could have done it.',
    exampleAfter: 'Consistency took effort, and it is okay to acknowledge that.',
  },
  'mind-reading': {
    name: 'Mind Reading',
    desc: 'Assuming you know what others think without real evidence.',
    questions: [
      'What evidence do I actually have?',
      'What are alternative explanations?',
      'Have I confused fear with fact?',
    ],
    prompts: [
      'Treat your guess as a hypothesis, not a fact.',
      'Check in directly rather than assuming.',
    ],
    exampleBefore: 'They are quiet, so they must be upset with me.',
    exampleAfter: 'They may be tired or distracted. I can ask instead of guessing.',
  },
  'fortune-telling': {
    name: 'Fortune Telling',
    desc: 'Predicting bad outcomes as if they are already facts.',
    questions: [
      'Can I actually predict the future here?',
      'How often have my worst predictions been wrong?',
      'What is the most likely outcome, not the scariest one?',
    ],
    prompts: [
      'List worst, best, and most likely outcomes.',
      'Focus on what I can do now instead of predicting disaster.',
    ],
    exampleBefore: 'Tomorrow will be a disaster.',
    exampleAfter: 'Tomorrow is uncertain, and I can prepare for what is in my control.',
  },
  'emotional-reasoning': {
    name: 'Emotional Reasoning',
    desc: 'Treating feelings as proof of reality.',
    questions: [
      'What are the facts separate from the feeling?',
      'How might I read this on a more stable day?',
      'Does feeling it make it true?',
    ],
    prompts: [
      'Say: “I feel X, and the facts are Y.”',
      'Wait before acting on intense emotion alone.',
    ],
    exampleBefore: 'I feel hopeless, so the situation must be hopeless.',
    exampleAfter: 'I feel hopeless right now, but the facts are more mixed than that feeling suggests.',
  },
  'should-statements': {
    name: 'Should Statements',
    desc: 'Rigid rules that create guilt, shame, or anger.',
    questions: [
      'Is this a rule or a preference?',
      'Would I say this should to someone I care about?',
      'What changes if I swap “should” for “would like to”?',
    ],
    prompts: [
      'Replace “should” with “prefer”.',
      'Trade perfection for flexibility.',
    ],
    exampleBefore: 'I should be stronger than this.',
    exampleAfter: 'This is hard, and I want to respond with care rather than punishment.',
  },
  'labeling': {
    name: 'Labeling',
    desc: 'Turning one behavior into a total identity judgment.',
    questions: [
      'Am I describing a behavior or my whole identity?',
      'What is a more specific description?',
      'Would this label hold up across all evidence?',
    ],
    prompts: [
      'Describe the event, not the person.',
      'Replace the label with a concrete observation.',
    ],
    exampleBefore: 'I am a failure.',
    exampleAfter: 'I had a difficult moment and I am still learning.',
  },
  personalization: {
    name: 'Personalization',
    desc: 'Taking too much responsibility for complex events.',
    questions: [
      'What else contributed here?',
      'Am I claiming 100% responsibility for a shared situation?',
      'What part is truly mine to own?',
    ],
    prompts: [
      'List all factors, not just yourself.',
      'Assign realistic percentages of responsibility.',
    ],
    exampleBefore: 'This is all my fault.',
    exampleAfter: 'I had a role, and there were also multiple other factors.',
  },
} as const

type DistortionKey = keyof typeof distortions

const distortionKeys = Object.keys(distortions) as DistortionKey[]

const sampleRecords: RecordItem[] = [
  {
    id: 1,
    date: '2026-03-28 09:15',
    situation: 'Woke up late and missed a morning meeting at work.',
    autoThought: 'I am completely unreliable. Everyone must think I am incompetent.',
    emotion: 'Shame',
    intensity: 85,
    distortion: 'labeling',
    alternative: 'Missing one meeting does not define my reliability. I can repair the moment and move forward.',
    newEmotion: 'Embarrassment',
    newIntensity: 35,
  },
  {
    id: 2,
    date: '2026-03-28 14:30',
    situation: 'My partner seemed quiet during dinner.',
    autoThought: 'They are upset with me. I must have done something wrong.',
    emotion: 'Anxiety',
    intensity: 70,
    distortion: 'mind-reading',
    alternative: 'They may simply be tired. I can ask instead of assuming.',
    newEmotion: 'Curiosity',
    newIntensity: 25,
  },
  {
    id: 3,
    date: '2026-03-29 08:00',
    situation: 'I felt very energized and started three new projects at once.',
    autoThought: 'I can do everything. I do not need sleep. This is the real me.',
    emotion: 'Euphoria',
    intensity: 90,
    distortion: 'emotional-reasoning',
    alternative: 'This burst of energy could be a mood shift, so pacing and monitoring matter.',
    newEmotion: 'Cautious optimism',
    newIntensity: 45,
  },
  {
    id: 4,
    date: '2026-03-30 11:00',
    situation: 'A friend cancelled lunch plans.',
    autoThought: 'Nobody wants to spend time with me. I always end up alone.',
    emotion: 'Sadness',
    intensity: 80,
    distortion: 'overgeneralization',
    alternative: 'One cancellation does not mean permanent rejection. There are many other explanations.',
    newEmotion: 'Disappointment',
    newIntensity: 40,
  },
  {
    id: 5,
    date: '2026-04-01 15:00',
    situation: 'Completed a week of consistent medication and journaling.',
    autoThought: 'This does not count. Anyone could do this.',
    emotion: 'Emptiness',
    intensity: 55,
    distortion: 'disqualifying',
    alternative: 'Consistency took real effort and deserves acknowledgement.',
    newEmotion: 'Quiet pride',
    newIntensity: 20,
  },
]

const defaultDraft: Draft = {
  situation: '',
  autoThought: '',
  emotion: '',
  intensity: 50,
  distortion: 'all-or-nothing',
  alternative: '',
  newEmotion: '',
  newIntensity: 30,
}

function formatDate(dateString: string) {
  const date = new Date(dateString.replace(' ', 'T'))
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

export function CbtJournalApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('record')
  const [records, setRecords] = useState<RecordItem[]>(sampleRecords)
  const [draft, setDraft] = useState<Draft>(defaultDraft)
  const [selectedDistortion, setSelectedDistortion] = useState<DistortionKey>('all-or-nothing')
  const [expandedId, setExpandedId] = useState<number | null>(sampleRecords[0]?.id ?? null)
  const [toast, setToast] = useState<string | null>(null)

  const patternStats = useMemo(() => {
    const total = records.length
    const avgBefore = total ? Math.round(records.reduce((sum, record) => sum + record.intensity, 0) / total) : 0
    const avgAfter = total ? Math.round(records.reduce((sum, record) => sum + record.newIntensity, 0) / total) : 0
    const reduction = avgBefore ? Math.round((1 - avgAfter / avgBefore) * 100) : 0
    const frequency = distortionKeys
      .map((key) => ({
        key,
        label: distortions[key].name,
        count: records.filter((record) => record.distortion === key).length,
      }))
      .filter((item) => item.count > 0)
      .sort((left, right) => right.count - left.count)
    return { total, avgBefore, avgAfter, reduction, frequency }
  }, [records])

  const selectedGuide = distortions[selectedDistortion]

  const saveRecord = () => {
    if (!draft.situation.trim() || !draft.autoThought.trim() || !draft.emotion.trim()) {
      return
    }

    const nextRecord: RecordItem = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      situation: draft.situation.trim(),
      autoThought: draft.autoThought.trim(),
      emotion: draft.emotion.trim(),
      intensity: draft.intensity,
      distortion: draft.distortion,
      alternative: draft.alternative.trim(),
      newEmotion: draft.newEmotion.trim(),
      newIntensity: draft.newIntensity,
    }

    setRecords((current) => [nextRecord, ...current])
    setExpandedId(nextRecord.id)
    setDraft(defaultDraft)
    setActiveTab('history')
    setToast('Record saved successfully')
    window.setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="native-app-shell">
      <div className="native-tabs" role="tablist" aria-label="CBT journal sections">
        {cbtTabs.map(({ key, label }) => (
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

      {activeTab === 'record' ? (
        <section className="native-panel native-panel--form">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Thought Record</h2>
              <p>Capture the situation, automatic thought, emotion, distortion, and a more balanced reframe.</p>
            </div>
            <div className="native-form-grid">
              <label className="field-block field-block--full">
                <span className="form-label">Situation</span>
                <textarea className="text-area" rows={3} value={draft.situation} onChange={(event) => setDraft((current) => ({ ...current, situation: event.target.value }))} placeholder="What was happening? Where were you? Who was there?" />
              </label>
              <label className="field-block field-block--full">
                <span className="form-label">Automatic Thought</span>
                <textarea className="text-area" rows={3} value={draft.autoThought} onChange={(event) => setDraft((current) => ({ ...current, autoThought: event.target.value }))} placeholder="What went through your mind?" />
              </label>
              <label className="field-block">
                <span className="form-label">Emotion</span>
                <input className="text-input" value={draft.emotion} onChange={(event) => setDraft((current) => ({ ...current, emotion: event.target.value }))} placeholder="Sadness, anxiety, anger…" />
              </label>
              <label className="field-block">
                <span className="form-label">Intensity: {draft.intensity}</span>
                <input className="slider-input" type="range" min={0} max={100} value={draft.intensity} onChange={(event) => setDraft((current) => ({ ...current, intensity: Number(event.target.value) }))} />
              </label>
              <label className="field-block">
                <span className="form-label">Cognitive Distortion</span>
                <select className="text-input" value={draft.distortion} onChange={(event) => setDraft((current) => ({ ...current, distortion: event.target.value as DistortionKey }))}>
                  {distortionKeys.map((key) => (
                    <option key={key} value={key}>
                      {distortions[key].name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block field-block--full">
                <span className="form-label">Balanced Thought</span>
                <textarea className="text-area" rows={3} value={draft.alternative} onChange={(event) => setDraft((current) => ({ ...current, alternative: event.target.value }))} placeholder="What is a more balanced way to think about this?" />
              </label>
              <label className="field-block">
                <span className="form-label">New Emotion</span>
                <input className="text-input" value={draft.newEmotion} onChange={(event) => setDraft((current) => ({ ...current, newEmotion: event.target.value }))} placeholder="How do you feel now?" />
              </label>
              <label className="field-block">
                <span className="form-label">New Intensity: {draft.newIntensity}</span>
                <input className="slider-input" type="range" min={0} max={100} value={draft.newIntensity} onChange={(event) => setDraft((current) => ({ ...current, newIntensity: Number(event.target.value) }))} />
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="primary-link" onClick={saveRecord}>
                Save thought record
              </button>
              <button type="button" className="secondary-link" onClick={() => setDraft(defaultDraft)}>
                Clear
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'history' ? (
        <section className="native-panel native-panel--stacked">
          <div className="history-header-inline">
            <h2>Thought Record History</h2>
            <span className="tag">{records.length} records</span>
          </div>
          {records.map((record) => {
            const isExpanded = expandedId === record.id
            return (
              <article key={record.id} className="native-card native-card--padded history-card">
                <button type="button" className="history-card__summary" onClick={() => setExpandedId(isExpanded ? null : record.id)}>
                  <div className="history-card__left">
                    <span className={`history-dot history-dot--${record.intensity >= 70 ? 'high' : record.intensity >= 40 ? 'medium' : 'low'}`} />
                    <div>
                      <strong>{record.autoThought}</strong>
                      <p>{formatDate(record.date)}</p>
                    </div>
                  </div>
                  <div className="history-card__right">
                    <span className="tag">{distortions[record.distortion].name}</span>
                    <span>{isExpanded ? 'Hide' : 'Show'}</span>
                  </div>
                </button>
                {isExpanded ? (
                  <div className="history-card__details">
                    <div className="detail-stats-grid">
                      <div className="mini-stat mini-stat--wide">
                        <span>Situation</span>
                        <strong>{record.situation}</strong>
                      </div>
                      <div className="mini-stat">
                        <span>Initial Emotion</span>
                        <strong>{record.emotion} · {record.intensity}%</strong>
                      </div>
                      <div className="mini-stat">
                        <span>After Reframing</span>
                        <strong>{record.newEmotion} · {record.newIntensity}%</strong>
                      </div>
                    </div>
                    <div className="comparison-grid">
                      <div className="mini-stat mini-stat--wide">
                        <span>Automatic Thought</span>
                        <strong>{record.autoThought}</strong>
                      </div>
                      <div className="mini-stat mini-stat--wide">
                        <span>Balanced Thought</span>
                        <strong>{record.alternative || 'No balanced thought recorded yet.'}</strong>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>
      ) : null}

      {activeTab === 'patterns' ? (
        <section className="native-panel native-panel--stacked">
          <div className="summary-grid">
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Total records</span>
              <strong>{patternStats.total}</strong>
            </div>
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Average initial intensity</span>
              <strong>{patternStats.avgBefore}</strong>
            </div>
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Average reframed intensity</span>
              <strong>{patternStats.avgAfter}</strong>
            </div>
            <div className="native-card native-card--padded">
              <span className="summary-card__label">Average reduction</span>
              <strong>{patternStats.reduction}%</strong>
            </div>
          </div>
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Most common distortions</h2>
              <p>Frequency across your current thought records.</p>
            </div>
            <div className="analysis-bars">
              {patternStats.frequency.map((item) => (
                <div key={item.key} className="analysis-bars__row">
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.count} records</p>
                  </div>
                  <div className="analysis-bars__track">
                    <div className="analysis-bars__fill" style={{ width: `${(item.count / patternStats.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'reframe' ? (
        <section className="native-panel native-panel--stacked">
          <div className="native-card native-card--padded">
            <div className="native-section-heading">
              <h2>Reframe Helper</h2>
              <p>Select a distortion to see challenge questions, reframing prompts, and a worked example.</p>
            </div>
            <label className="field-block">
              <span className="form-label">Choose a distortion</span>
              <select className="text-input" value={selectedDistortion} onChange={(event) => setSelectedDistortion(event.target.value as DistortionKey)}>
                {distortionKeys.map((key) => (
                  <option key={key} value={key}>
                    {distortions[key].name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="two-column-grid">
            <section className="native-card native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>{selectedGuide.name}</h2>
                <p>{selectedGuide.desc}</p>
              </div>
              <ul className="feature-list">
                {selectedGuide.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </section>
            <section className="native-card native-card--padded">
              <div className="native-section-heading native-section-heading--compact">
                <h2>Reframing prompts</h2>
              </div>
              <ul className="feature-list">
                {selectedGuide.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
              <div className="comparison-grid comparison-grid--single">
                <div className="mini-stat mini-stat--wide">
                  <span>Distorted</span>
                  <strong>{selectedGuide.exampleBefore}</strong>
                </div>
                <div className="mini-stat mini-stat--wide">
                  <span>Reframed</span>
                  <strong>{selectedGuide.exampleAfter}</strong>
                </div>
              </div>
            </section>
          </div>
        </section>
      ) : null}

      {activeTab === 'distortions' ? (
        <section className="native-panel native-panel--stacked">
          {distortionKeys.map((key, index) => (
            <article key={key} className="native-card native-card--padded distortion-card">
              <div className="distortion-card__header">
                <span className="distortion-card__number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{distortions[key].name}</h2>
                  <p>{distortions[key].desc}</p>
                </div>
              </div>
              <p className="history-card__note">Example: {distortions[key].exampleBefore}</p>
            </article>
          ))}
        </section>
      ) : null}

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
