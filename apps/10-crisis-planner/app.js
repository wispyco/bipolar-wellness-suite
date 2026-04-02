/* ==========================================================================
   App 10: Crisis & Support Planner -- Logic
   ========================================================================== */

// --- Safety Plan Data (Stanley & Brown 6 Steps) ---
const PLAN_STEPS = [
  { num: 1, title: 'Warning Signs', subtitle: 'Thoughts, feelings, or behaviors that signal a crisis is developing',
    items: ['Increased thoughts of hopelessness or worthlessness', 'Withdrawing from all social contact for more than 2 days', 'Not sleeping for more than one full night', 'Thinking about self-harm or not wanting to be alive', 'Giving away possessions or saying goodbye'] },
  { num: 2, title: 'Internal Coping Strategies', subtitle: 'Things I can do on my own to take my mind off problems',
    items: ['Go for a 20-minute walk outside', 'Practice 4-7-8 breathing for 5 minutes', 'Take a warm shower or bath', 'Listen to my calming playlist', 'Write in my thought journal (CBT app)'] },
  { num: 3, title: 'Social Contacts for Distraction', subtitle: 'People and places that provide distraction (not necessarily about the crisis)',
    items: ['Call my friend Sarah -- she is good at casual conversation', 'Visit the local coffee shop and sit among people', 'Text my cousin Marcus about sports or movies'] },
  { num: 4, title: 'Professional Contacts', subtitle: 'Clinicians and agencies I can contact during a crisis',
    items: ['Dr. Chen (psychiatrist) -- 555-0142, M-F 9am-5pm', 'Therapy Line (after-hours) -- 555-0198', 'Community Mental Health Center -- 555-0165'] },
  { num: 5, title: 'Emergency Contacts', subtitle: 'People I can call when I feel I might act on suicidal thoughts',
    items: ['988 Suicide & Crisis Lifeline -- call or text 988', 'My brother James -- 555-0177 (has key to my apartment)', 'Crisis Text Line -- text HOME to 741741'] },
  { num: 6, title: 'Making the Environment Safe', subtitle: 'Steps to reduce access to lethal means',
    items: ['Medications stored in locked cabinet (James has the key)', 'Removed excess medications from home', 'Sharp objects stored at James\u0027 house during vulnerable periods', 'Installed safety locks on medicine cabinet'] }
];

let safetyPlan = PLAN_STEPS.map(s => ({ ...s, items: [...s.items] }));

// --- Support Network ---
let contacts = [
  { name: 'Dr. Chen', role: 'professional', phone: '555-0142', notes: 'Psychiatrist, M-F 9am-5pm' },
  { name: 'Dr. Ramirez', role: 'professional', phone: '555-0188', notes: 'Therapist, Tues/Thurs' },
  { name: 'James (brother)', role: 'family', phone: '555-0177', notes: 'Emergency key holder, available anytime' },
  { name: 'Sarah', role: 'friend', phone: '555-0155', notes: 'Good for distraction, no crisis talk' },
  { name: 'Marcus (cousin)', role: 'family', phone: '555-0133', notes: 'Lives nearby, can come over quickly' },
  { name: 'DBSA Support Group', role: 'peer', phone: '', notes: 'Thursdays 7pm, Community Center' },
  { name: '988 Lifeline', role: 'emergency', phone: '988', notes: '24/7, call or text' }
];

// --- Wellness Strategies ---
let depStrategies = [
  'Get out of bed and shower, even if I do nothing else',
  'Call or text one person today',
  'Walk outside for at least 10 minutes',
  'Eat one proper meal',
  'Use the Mood Tracker to log how I feel',
  'Listen to uplifting music or a podcast',
  'Do one small household task (dishes, laundry)',
  'Remind myself: depression lies, and this will pass'
];

let maniaStrategies = [
  'Check in with Dr. Chen about medication adjustment',
  'Give credit cards to James temporarily',
  'Cancel or postpone any new commitments',
  'Avoid caffeine and alcohol completely',
  'Set a strict 10 PM bedtime with no exceptions',
  'Ask someone to check my spending decisions',
  'Reduce screen time and stimulation',
  'Do not make any major life decisions until stable'
];

// --- Communication Templates ---
const TEMPLATES = [
  { title: 'For a Close Friend or Partner', for: 'Telling someone close about your condition',
    text: 'I wanted to share something personal with you. I have bipolar disorder, which is a medical condition that affects my mood, energy, and sleep. Sometimes I may go through periods where I feel very low or unusually energized.\n\nI am managing it with medication and therapy, and I am doing well. I wanted you to know because your support matters to me.\n\nThe most helpful thing you can do is: [customize this]. If you notice me acting differently from my usual self, it is okay to gently ask how I am doing.' },
  { title: 'For a Manager or Employer', for: 'Workplace disclosure (optional, as much as you are comfortable sharing)',
    text: 'I want to let you know that I manage a health condition that occasionally affects my energy levels and may require medical appointments. I am under the care of a specialist and my condition is well-managed.\n\nI may occasionally need: [flexible scheduling / work from home days / adjusted deadlines during flare-ups].\n\nI am committed to my work and wanted to be transparent so we can plan ahead if needed.' },
  { title: 'For Emergency Contacts', for: 'What my emergency contact needs to know',
    text: 'Thank you for agreeing to be my emergency contact. Here is what you need to know:\n\nI have bipolar disorder. If I contact you in crisis, here is what to do:\n1. Stay calm and listen\n2. Ask if I am safe\n3. Help me follow my safety plan (I will share it with you)\n4. If I am in immediate danger, call 988 or 911\n\nMy psychiatrist is Dr. [name] at [number].\nMy medications are: [list].\nDo NOT: [specific things that do not help for you].' },
  { title: 'Setting Boundaries During Episodes', for: 'Communicating needs when you are not feeling well',
    text: 'I am going through a difficult period right now with my bipolar disorder. I want to let you know a few things:\n\n- I may need more space than usual\n- Please do not take it personally if I cancel plans\n- The most helpful thing right now is: [specific request]\n- Please do not: [specific boundary]\n- I am working with my care team and following my treatment plan\n\nI will let you know when I am feeling more like myself. Thank you for understanding.' }
];

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected','true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'safety') renderSafetyPlan();
      if (tab.dataset.tab === 'network') renderNetwork();
      if (tab.dataset.tab === 'wellness') renderWellness();
      if (tab.dataset.tab === 'templates') renderTemplates();
    }
  });
});

// --- Safety Plan ---
function renderSafetyPlan() {
  const el = document.getElementById('plan-steps');
  el.innerHTML = safetyPlan.map(step => `
    <div class="plan-step" data-step="${step.num}">
      <div class="plan-step__header">
        <span class="plan-step__number plan-step__number--${step.num}">${step.num}</span>
        <div class="plan-step__info">
          <div class="plan-step__title">${step.title}</div>
          <div class="plan-step__subtitle">${step.subtitle}</div>
        </div>
        <span class="plan-step__count">${step.items.length} items</span>
        <svg class="plan-step__toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="plan-step__body">
        <div class="plan-items">
          ${step.items.map((item, i) => `
            <div class="plan-item">
              <span class="plan-item__text">${esc(item)}</span>
              <button class="plan-item__remove" data-step="${step.num}" data-idx="${i}" aria-label="Remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          `).join('')}
        </div>
        <div class="plan-add">
          <input type="text" class="form-input plan-add-input" data-step="${step.num}" placeholder="Add to this step...">
          <button class="btn btn-primary plan-add-btn" data-step="${step.num}">Add</button>
        </div>
      </div>
    </div>
  `).join('');

  // Toggle steps
  el.querySelectorAll('.plan-step__header').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('plan-step--open'));
  });

  // Remove items
  el.querySelectorAll('.plan-item__remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const stepNum = parseInt(btn.dataset.step);
      const idx = parseInt(btn.dataset.idx);
      const step = safetyPlan.find(s => s.num === stepNum);
      if (step) { step.items.splice(idx, 1); renderSafetyPlan(); }
    });
  });

  // Add items
  el.querySelectorAll('.plan-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepNum = parseInt(btn.dataset.step);
      const input = el.querySelector(`.plan-add-input[data-step="${stepNum}"]`);
      const val = input.value.trim();
      if (!val) return;
      const step = safetyPlan.find(s => s.num === stepNum);
      if (step) { step.items.push(val); input.value = ''; renderSafetyPlan(); showToast(); }
    });
  });
}

// --- Support Network ---
function renderNetwork() {
  const map = document.getElementById('network-map');
  map.innerHTML = contacts.map(c => `
    <div class="network-contact">
      <div class="network-contact__avatar network-contact__avatar--${c.role}">${c.name.charAt(0)}</div>
      <div class="network-contact__info">
        <div class="network-contact__name">${esc(c.name)}</div>
        <div class="network-contact__detail">${c.phone ? c.phone + ' -- ' : ''}${esc(c.notes)}</div>
      </div>
      <span class="network-contact__role">${c.role}</span>
    </div>
  `).join('');
}

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  if (!name) return;
  contacts.push({
    name,
    role: document.getElementById('c-role').value,
    phone: document.getElementById('c-phone').value,
    notes: document.getElementById('c-notes').value
  });
  document.getElementById('c-name').value = '';
  document.getElementById('c-phone').value = '';
  document.getElementById('c-notes').value = '';
  renderNetwork();
  showToast();
});

// --- Wellness Plans ---
function renderWellness() {
  renderStrategyList('dep-strategies', depStrategies, 'dep');
  renderStrategyList('mania-strategies', maniaStrategies, 'mania');
}

function renderStrategyList(containerId, list, prefix) {
  const el = document.getElementById(containerId);
  el.innerHTML = list.map((s, i) => `
    <div class="strategy-item">
      <span class="strategy-item__text">${esc(s)}</span>
      <button class="strategy-item__remove" data-prefix="${prefix}" data-idx="${i}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');

  el.querySelectorAll('.strategy-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      if (btn.dataset.prefix === 'dep') depStrategies.splice(idx, 1);
      else maniaStrategies.splice(idx, 1);
      renderWellness();
    });
  });
}

document.getElementById('dep-add-btn').addEventListener('click', () => {
  const input = document.getElementById('dep-new');
  if (input.value.trim()) { depStrategies.push(input.value.trim()); input.value = ''; renderWellness(); }
});
document.getElementById('mania-add-btn').addEventListener('click', () => {
  const input = document.getElementById('mania-new');
  if (input.value.trim()) { maniaStrategies.push(input.value.trim()); input.value = ''; renderWellness(); }
});

// --- Communication Templates ---
function renderTemplates() {
  const el = document.getElementById('template-list');
  el.innerHTML = TEMPLATES.map((t, i) => `
    <div class="template-card">
      <h3 class="template-card__title">${t.title}</h3>
      <p class="template-card__for">${t.for}</p>
      <div class="template-card__text">${esc(t.text)}</div>
    </div>
  `).join('');
}

// --- Helpers ---
function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
function showToast() {
  const t = document.getElementById('save-toast');
  t.hidden = false; t.classList.add('toast--visible');
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.hidden = true, 300); }, 2000);
}

// --- Init ---
renderSafetyPlan();
