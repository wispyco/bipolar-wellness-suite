'use client'

import { useMemo, useState } from 'react'

type SafetySection = {
  id: string
  title: string
  prompt: string
}

type Contact = {
  id: string
  name: string
  role: string
  phone: string
}

const safetySections: SafetySection[] = [
  { id: 'warning-signs', title: '1. Warning signs', prompt: 'What tells you a crisis is starting?' },
  { id: 'coping', title: '2. Internal coping strategies', prompt: 'What can you do on your own to reduce risk?' },
  { id: 'distraction', title: '3. Social contacts for distraction', prompt: 'Who helps you feel less alone without needing full disclosure?' },
  { id: 'professional', title: '4. Professional contacts', prompt: 'Who is on your clinical support team?' },
  { id: 'emergency', title: '5. Emergency contacts', prompt: 'Who should be called first in a crisis?' },
  { id: 'safety', title: '6. Make the environment safe', prompt: 'What steps reduce immediate risk?' },
] as const

const initialPlan = {
  'warning-signs': 'Sleeping far less than usual, racing thoughts, and feeling suddenly invincible.',
  coping: 'Dim lights, stop making decisions, text one trusted person, and switch to the sleep-protection routine.',
  distraction: 'Call Alex, walk with Maya, or go sit in the café near home instead of isolating.',
  professional: 'Psychiatrist, therapist, and family doctor contact list stored below.',
  emergency: 'Partner first, then sister, then crisis line if neither picks up.',
  safety: 'Hand over credit cards, avoid driving, remove extra medications, and stay with someone safe.',
} as Record<string, string>

const initialContacts: Contact[] = [
  { id: 'contact-1', name: 'Alex', role: 'Partner', phone: '(555) 210-1001' },
  { id: 'contact-2', name: 'Dr. Rivera', role: 'Psychiatrist', phone: '(555) 210-2002' },
  { id: 'contact-3', name: 'Maya', role: 'Friend / support person', phone: '(555) 210-3003' },
]

const quickResources = [
  'Call or text 988 in the United States for Suicide & Crisis Lifeline support.',
  'Go to the nearest emergency room if you cannot stay safe.',
  'Share this safety plan with at least one trusted person before you need it.',
] as const

export function CrisisSupportPlannerApp() {
  const [plan, setPlan] = useState<Record<string, string>>(initialPlan)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [newContact, setNewContact] = useState({ name: '', role: '', phone: '' })
  const [selectedTemplate, setSelectedTemplate] = useState<'depression' | 'mania'>('depression')
  const [toast, setToast] = useState<string | null>(null)

  const templateCopy = useMemo(
    () =>
      selectedTemplate === 'depression'
        ? 'I am noticing depression warning signs and may need extra support. Please help me keep structure, reduce isolation, and stay connected to my care plan.'
        : 'I am noticing activation / mania warning signs and may need help slowing down. Please help me protect sleep, reduce stimulation, and avoid impulsive decisions.',
    [selectedTemplate],
  )

  const savePlan = () => {
    setToast('Safety plan updated')
    window.setTimeout(() => setToast(null), 2400)
  }

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return
    setContacts((current) => [
      ...current,
      { id: `contact-${Date.now()}`, name: newContact.name.trim(), role: newContact.role.trim() || 'Support contact', phone: newContact.phone.trim() },
    ])
    setNewContact({ name: '', role: '', phone: '' })
  }

  return (
    <div className="native-app-shell">
      <div className="summary-grid">
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Safety-plan sections</span>
          <strong>{safetySections.length}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Support contacts</span>
          <strong>{contacts.length}</strong>
        </div>
        <div className="native-card native-card--padded adherence-card">
          <span className="summary-card__label">Emergency line</span>
          <strong>988</strong>
        </div>
      </div>

      <div className="native-card native-card--padded">
        <div className="native-section-heading">
          <h2>Personal safety plan</h2>
          <p>Use this as a practical, editable version of a Stanley-Brown style safety plan.</p>
        </div>
        <div className="manage-list">
          {safetySections.map((section) => (
            <label key={section.id} className="field-block">
              <span className="form-label">{section.title}</span>
              <span className="form-help">{section.prompt}</span>
              <textarea
                className="text-area"
                rows={3}
                value={plan[section.id] ?? ''}
                onChange={(event) => setPlan((current) => ({ ...current, [section.id]: event.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="button-row">
          <button type="button" className="primary-link" onClick={savePlan}>
            Save safety plan
          </button>
        </div>
      </div>

      <div className="two-column-grid">
        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Support network</h2>
            <p>Keep the people you may call or text visible and up to date.</p>
          </div>
          <div className="manage-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="manage-item">
                <div>
                  <strong>{contact.name}</strong>
                  <p>{contact.role}</p>
                </div>
                <div className="manage-item__actions">
                  <span className="tag">{contact.phone}</span>
                  <button type="button" className="secondary-link secondary-link--small" onClick={() => setContacts((current) => current.filter((item) => item.id !== contact.id))}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="native-form-grid native-form-grid--two">
            <label className="field-block">
              <span className="form-label">Name</span>
              <input className="text-input" value={newContact.name} onChange={(event) => setNewContact((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field-block">
              <span className="form-label">Role</span>
              <input className="text-input" value={newContact.role} onChange={(event) => setNewContact((current) => ({ ...current, role: event.target.value }))} />
            </label>
            <label className="field-block field-block--full">
              <span className="form-label">Phone</span>
              <input className="text-input" value={newContact.phone} onChange={(event) => setNewContact((current) => ({ ...current, phone: event.target.value }))} />
            </label>
          </div>
          <div className="button-row">
            <button type="button" className="primary-link" onClick={addContact}>
              Add contact
            </button>
          </div>
        </section>

        <section className="native-card native-card--padded">
          <div className="native-section-heading">
            <h2>Quick resources and templates</h2>
          </div>
          <ul className="feature-list">
            {quickResources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>

          <label className="field-block">
            <span className="form-label">Communication template</span>
            <select className="text-input" value={selectedTemplate} onChange={(event) => setSelectedTemplate(event.target.value as 'depression' | 'mania')}>
              <option value="depression">Depression support message</option>
              <option value="mania">Activation / mania support message</option>
            </select>
          </label>

          <div className="mini-stat mini-stat--wide">
            <span>Template preview</span>
            <strong>{templateCopy}</strong>
          </div>
        </section>
      </div>

      {toast ? <div className="inline-toast">{toast}</div> : null}
    </div>
  )
}
