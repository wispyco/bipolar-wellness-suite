'use client'

import { useMemo, useState } from 'react'

type Module = {
  id: string
  title: string
  readingTime: string
  difficulty: 'Foundational' | 'Practical' | 'Advanced'
  summary: string
  takeaways: string[]
  question: string
  options: string[]
  answer: number
}

const modules: Module[] = [
  {
    id: 'bd-basics',
    title: 'What is Bipolar Disorder?',
    readingTime: '6 min',
    difficulty: 'Foundational',
    summary: 'A plain-language overview of mood episodes, polarity, and the difference between diagnosis and identity.',
    takeaways: [
      'Mood episodes have patterns, durations, and triggers worth monitoring.',
      'Symptoms are real, but they are not the whole person.',
      'Education supports earlier intervention and better self-management.',
    ],
    question: 'Which idea best supports self-management?',
    options: ['Ignore patterns to avoid overthinking', 'Learn episode patterns and early signs', 'Only focus on crisis moments'],
    answer: 1,
  },
  {
    id: 'medications',
    title: 'Medication Overview',
    readingTime: '8 min',
    difficulty: 'Practical',
    summary: 'A high-level guide to why mood stabilizers, antipsychotics, and adjunctive meds may be used.',
    takeaways: [
      'Medication plans are individualized and evolve with response and side effects.',
      'Adherence conversations matter as much as prescriptions.',
      'Medication changes should always be clinician-guided.',
    ],
    question: 'What is the safest approach to medication changes?',
    options: ['Adjust on your own if side effects are frustrating', 'Discuss changes with your prescriber first', 'Stop once symptoms improve'],
    answer: 1,
  },
  {
    id: 'sleep-circadian',
    title: 'Sleep and Circadian Rhythms',
    readingTime: '7 min',
    difficulty: 'Practical',
    summary: 'How regular wake time, bedtime, and light exposure affect bipolar stability.',
    takeaways: [
      'Wake time is one of the strongest circadian anchors.',
      'Sleep disruption can be both symptom and trigger.',
      'Protecting rhythm is a core self-management strategy.',
    ],
    question: 'Which routine is usually the strongest anchor?',
    options: ['Wake time', 'Weekend bedtime flexibility', 'Late-night productivity bursts'],
    answer: 0,
  },
  {
    id: 'triggers-signs',
    title: 'Triggers and Warning Signs',
    readingTime: '5 min',
    difficulty: 'Foundational',
    summary: 'Recognizing stressors, life events, sleep loss, and prodromal symptoms before escalation.',
    takeaways: [
      'Warning signs are easier to respond to when named early.',
      'Patterns can be collaborative tools with supports and clinicians.',
      'A trigger is not a failure; it is useful information.',
    ],
    question: 'Why track warning signs early?',
    options: ['To catch shifts before they escalate', 'To prove a mood episode is inevitable', 'To remove all uncertainty'],
    answer: 0,
  },
  {
    id: 'support-systems',
    title: 'Building Support Systems',
    readingTime: '6 min',
    difficulty: 'Practical',
    summary: 'How to communicate needs, boundaries, and support preferences with trusted people.',
    takeaways: [
      'Clear requests are easier for supporters to act on.',
      'Support planning works best before a crisis.',
      'Boundaries are part of support, not the opposite of it.',
    ],
    question: 'What makes support plans stronger?',
    options: ['Keeping needs vague', 'Naming concrete requests and contacts', 'Waiting until crisis to talk about them'],
    answer: 1,
  },
]

export function PsychoeducationLibraryApp() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0].id)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>(
    Object.fromEntries(modules.map((module) => [module.id, null])),
  )

  const selectedModule = modules.find((module) => module.id === selectedModuleId) ?? modules[0]
  const completedCount = Object.values(completed).filter(Boolean).length
  const bookmarkedCount = Object.values(bookmarked).filter(Boolean).length

  const quizResult = useMemo(() => {
    const selectedAnswer = quizAnswers[selectedModule.id]
    if (selectedAnswer === null) return null
    return selectedAnswer === selectedModule.answer
  }, [quizAnswers, selectedModule])

  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Modules</span>
          <strong>{modules.length}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Completed</span>
          <strong>{completedCount}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Bookmarked</span>
          <strong>{bookmarkedCount}</strong>
        </div>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Learning modules</h2>
            <p>Browse practical, citation-ready education topics for bipolar self-management.</p>
          </div>
          <div className="manage-list">
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                className={`library-module ${selectedModuleId === module.id ? 'library-module--active' : ''}`}
                onClick={() => setSelectedModuleId(module.id)}
              >
                <div>
                  <strong>{module.title}</strong>
                  <p>{module.summary}</p>
                </div>
                <div className="manage-item__actions">
                  <span className="tag">{module.readingTime}</span>
                  <span className="tag">{module.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>{selectedModule.title}</h2>
            <p>{selectedModule.summary}</p>
          </div>
          <div className="button-row">
            <button
              type="button"
              className={`choice-chip ${completed[selectedModule.id] ? 'choice-chip--active' : ''}`}
              onClick={() => setCompleted((current) => ({ ...current, [selectedModule.id]: !current[selectedModule.id] }))}
            >
              {completed[selectedModule.id] ? 'Completed' : 'Mark complete'}
            </button>
            <button
              type="button"
              className={`choice-chip ${bookmarked[selectedModule.id] ? 'choice-chip--active' : ''}`}
              onClick={() => setBookmarked((current) => ({ ...current, [selectedModule.id]: !current[selectedModule.id] }))}
            >
              {bookmarked[selectedModule.id] ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
          <div className="native-section-heading native-section-heading--compact">
            <h2>Key takeaways</h2>
          </div>
          <ul className="feature-list">
            {selectedModule.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="native-section-heading native-section-heading--compact">
            <h2>Knowledge check</h2>
            <p>{selectedModule.question}</p>
          </div>
          <div className="manage-list">
            {selectedModule.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`library-option ${quizAnswers[selectedModule.id] === index ? 'library-option--active' : ''}`}
                onClick={() => setQuizAnswers((current) => ({ ...current, [selectedModule.id]: index }))}
              >
                {option}
              </button>
            ))}
          </div>
          {quizResult !== null ? (
            <div className={`library-feedback ${quizResult ? 'library-feedback--correct' : 'library-feedback--incorrect'}`}>
              {quizResult ? 'Correct — this choice best matches the module guidance.' : 'Not quite — try the option that most supports practical self-management.'}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
