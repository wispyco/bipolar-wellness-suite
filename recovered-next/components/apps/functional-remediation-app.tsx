'use client'

import { useMemo, useState } from 'react'

type Exercise = {
  id: string
  title: string
  skill: string
  prompt: string
}

type Goal = {
  id: string
  title: string
  progress: number
}

const exercises: Exercise[] = [
  {
    id: 'attention-reset',
    title: 'Attention Reset',
    skill: 'Attention',
    prompt: 'Name three things you can see, two you can hear, and one you can feel before returning to the task.',
  },
  {
    id: 'working-memory',
    title: 'Working Memory Walkthrough',
    skill: 'Memory',
    prompt: 'Repeat the next three-step task aloud before starting it, then check whether you completed each part.',
  },
  {
    id: 'task-chunking',
    title: 'Task Chunking',
    skill: 'Executive Function',
    prompt: 'Break one hard task into the smallest next three visible actions.',
  },
]

const initialGoals: Goal[] = [
  { id: 'goal-1', title: 'Return one work email each morning', progress: 60 },
  { id: 'goal-2', title: 'Use calendar reminders for medications and appointments', progress: 80 },
  { id: 'goal-3', title: 'Complete one household reset block three times this week', progress: 40 },
]

const accommodationIdeas = [
  'Use written instructions and checklists for multi-step tasks.',
  'Schedule cognitively demanding work earlier in the day when possible.',
  'Reduce context switching by batching email and admin tasks.',
  'Ask for agenda notes or follow-up summaries after important meetings.',
] as const

export function FunctionalRemediationApp() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(exercises[0].id)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [dailyFunctioning, setDailyFunctioning] = useState({ energy: 3, focus: 3, organization: 2 })
  const [newGoal, setNewGoal] = useState('')

  const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId) ?? exercises[0]
  const averageProgress = useMemo(
    () => (goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0),
    [goals],
  )

  const addGoal = () => {
    if (!newGoal.trim()) return
    setGoals((current) => [...current, { id: `goal-${Date.now()}`, title: newGoal.trim(), progress: 0 }])
    setNewGoal('')
  }

  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Exercises</span>
          <strong>{exercises.length}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Goal progress average</span>
          <strong>{averageProgress}%</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Daily functioning snapshot</span>
          <strong>{Math.round((dailyFunctioning.energy + dailyFunctioning.focus + dailyFunctioning.organization) / 3)}/5</strong>
        </div>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Cognitive exercises</h2>
            <p>Short, practical exercises focused on attention, memory, and executive function.</p>
          </div>
          <div className="manage-list">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                className={`library-module ${selectedExerciseId === exercise.id ? 'library-module--active' : ''}`}
                onClick={() => setSelectedExerciseId(exercise.id)}
              >
                <div>
                  <strong>{exercise.title}</strong>
                  <p>{exercise.prompt}</p>
                </div>
                <span className="tag">{exercise.skill}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>{selectedExercise.title}</h2>
            <p>{selectedExercise.prompt}</p>
          </div>
          <div className="comparison-grid comparison-grid--single">
            <div className="mini-stat mini-stat--wide">
              <span>Primary skill</span>
              <strong>{selectedExercise.skill}</strong>
            </div>
            <div className="mini-stat mini-stat--wide">
              <span>When to use it</span>
              <strong>Use when mental fog, overwhelm, or task-start friction is high.</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Goal tracking</h2>
          </div>
          <div className="analysis-bars">
            {goals.map((goal) => (
              <div key={goal.id} className="analysis-bars__row">
                <div>
                  <strong>{goal.title}</strong>
                  <p>{goal.progress}% complete</p>
                </div>
                <div className="analysis-bars__track">
                  <div className="analysis-bars__fill" style={{ width: `${goal.progress}%` }} />
                </div>
                <button
                  type="button"
                  className="secondary-link secondary-link--small"
                  onClick={() =>
                    setGoals((current) =>
                      current.map((item) => (item.id === goal.id ? { ...item, progress: Math.min(item.progress + 10, 100) } : item)),
                    )
                  }
                >
                  +10%
                </button>
              </div>
            ))}
          </div>
          <div className="native-form-grid native-form-grid--two">
            <label className="field-block field-block--full">
              <span className="form-label">Add a new functioning goal</span>
              <input className="text-input" value={newGoal} onChange={(event) => setNewGoal(event.target.value)} placeholder="Example: Use a checklist before leaving the house" />
            </label>
          </div>
          <div className="button-row">
            <button type="button" className="primary-link" onClick={addGoal}>
              Add goal
            </button>
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Daily functioning check</h2>
          </div>
          {([
            ['energy', 'Energy'],
            ['focus', 'Focus'],
            ['organization', 'Organization'],
          ] as const).map(([key, label]) => (
            <label key={key} className="field-block">
              <span className="form-label">{label}: {dailyFunctioning[key]}/5</span>
              <input
                className="slider-input"
                type="range"
                min={1}
                max={5}
                value={dailyFunctioning[key]}
                onChange={(event) => setDailyFunctioning((current) => ({ ...current, [key]: Number(event.target.value) }))}
              />
            </label>
          ))}
        </section>
      </div>

      <section className="native-card native-card--padded">
        <div className="native-section-heading">
          <h2>Accommodation ideas</h2>
        </div>
        <ul className="feature-list">
          {accommodationIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
