/* ==========================================================================
   App 5: Social Rhythm Stabilizer -- Logic
   ========================================================================== */

// --- SRM-5 Activities ---
const ACTIVITIES = [
  { id: 'wake', name: 'Got out of bed', icon: 'wake', defaultTarget: '07:00',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>' },
  { id: 'contact', name: 'First contact with another person', icon: 'contact', defaultTarget: '08:00',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id: 'work', name: 'Started work, school, or main activity', icon: 'work', defaultTarget: '09:00',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
  { id: 'dinner', name: 'Had dinner', icon: 'dinner', defaultTarget: '18:30',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
  { id: 'bed', name: 'Went to bed', icon: 'bed', defaultTarget: '22:30',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' }
];

// --- State ---
let targets = {};
ACTIVITIES.forEach(a => targets[a.id] = a.defaultTarget);

let todayLog = {};
ACTIVITIES.forEach(a => { todayLog[a.id] = { time: '', who: 'alone' }; });

let extraActivities = [
  { id: 'ex1', name: 'Take medication', time: '08:00' },
  { id: 'ex2', name: 'Exercise', time: '17:00' }
];

// --- Sample History (14 days) ---
// Story: days 1-5 very consistent, days 6-9 disrupted (travel), days 10-14 recovering
const history = [];
const baseDate = new Date('2026-03-19');

const sampleTimes = [
  // Day 1-5: Consistent
  { wake:'07:05', contact:'08:10', work:'09:00', dinner:'18:30', bed:'22:25' },
  { wake:'07:00', contact:'08:00', work:'09:05', dinner:'18:35', bed:'22:30' },
  { wake:'07:10', contact:'08:15', work:'09:00', dinner:'18:25', bed:'22:20' },
  { wake:'06:55', contact:'08:05', work:'09:10', dinner:'18:30', bed:'22:35' },
  { wake:'07:05', contact:'08:00', work:'09:00', dinner:'18:40', bed:'22:30' },
  // Day 6-9: Disrupted (travel, social events)
  { wake:'09:30', contact:'10:00', work:'11:00', dinner:'21:00', bed:'01:30' },
  { wake:'10:00', contact:'10:30', work:'12:00', dinner:'20:30', bed:'00:45' },
  { wake:'08:45', contact:'11:00', work:'13:00', dinner:'21:30', bed:'01:00' },
  { wake:'09:00', contact:'09:30', work:'11:30', dinner:'20:00', bed:'00:15' },
  // Day 10-14: Recovering
  { wake:'08:00', contact:'09:00', work:'10:00', dinner:'19:00', bed:'23:00' },
  { wake:'07:30', contact:'08:30', work:'09:30', dinner:'18:45', bed:'22:45' },
  { wake:'07:15', contact:'08:15', work:'09:15', dinner:'18:30', bed:'22:30' },
  { wake:'07:10', contact:'08:05', work:'09:05', dinner:'18:35', bed:'22:25' },
  { wake:'07:00', contact:'08:00', work:'09:00', dinner:'18:30', bed:'22:30' }
];
const whoOptions = ['alone','others','alone','others','alone','others','others','others','others','alone','alone','others','alone','others'];

for (let i = 0; i < sampleTimes.length; i++) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + i);
  const entry = { date: d.toISOString().slice(0,10), activities: {} };
  ACTIVITIES.forEach(a => {
    entry.activities[a.id] = { time: sampleTimes[i][a.id], who: whoOptions[i] };
  });
  history.push(entry);
}

// Sample disruptions
let disruptions = [
  { date: '2026-03-24', activity: 'wake', what: 'Flew to Vancouver for a conference. Jet lag and excitement made it hard to maintain routine.', impact: 4, type: 'travel' },
  { date: '2026-03-25', activity: 'bed', what: 'Conference dinner ran late. Social pressure to stay. Did not get to bed until after 1am.', impact: 3, type: 'social' },
  { date: '2026-03-26', activity: 'work', what: 'No structured work schedule during conference. Free-form day.', impact: 2, type: 'work' },
  { date: '2026-03-27', activity: 'dinner', what: 'Group dinner at 9pm. Much later than usual.', impact: 3, type: 'social' }
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
      if (tab.dataset.tab === 'timeline') renderTimeline();
      if (tab.dataset.tab === 'disruptions') renderDisruptions();
      if (tab.dataset.tab === 'scheduler') renderScheduler();
      if (tab.dataset.tab === 'tips') renderTips();
    }
  });
});

// --- Date ---
document.getElementById('log-date').textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

// --- Render SRM-5 Log ---
function renderSRM() {
  const el = document.getElementById('srm-list');
  el.innerHTML = ACTIVITIES.map(a => {
    const log = todayLog[a.id];
    return `
    <div class="srm-item">
      <div class="srm-item__icon srm-item__icon--${a.icon}">${a.svg}</div>
      <div class="srm-item__info">
        <div class="srm-item__name">${a.name}</div>
        <div class="srm-item__target">Target: ${formatTime12(targets[a.id])}</div>
      </div>
      <div class="srm-item__time">
        <input type="time" value="${log.time}" data-activity="${a.id}" class="srm-time-input">
      </div>
      <div class="srm-item__who">
        <button class="who-btn ${log.who==='alone'?'who-btn--active':''}" data-activity="${a.id}" data-who="alone">Alone</button>
        <button class="who-btn ${log.who==='others'?'who-btn--active':''}" data-activity="${a.id}" data-who="others">Others</button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('.srm-time-input').forEach(input => {
    input.addEventListener('change', e => { todayLog[e.target.dataset.activity].time = e.target.value; });
  });
  el.querySelectorAll('.who-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      todayLog[btn.dataset.activity].who = btn.dataset.who;
      renderSRM();
    });
  });
}

// Save log
document.getElementById('save-log').addEventListener('click', () => {
  const today = new Date().toISOString().slice(0,10);
  const entry = { date: today, activities: {} };
  ACTIVITIES.forEach(a => { entry.activities[a.id] = { ...todayLog[a.id] }; });
  const idx = history.findIndex(h => h.date === today);
  if (idx >= 0) history[idx] = entry; else history.push(entry);
  updateScore();
  showToast();
});

function showToast() {
  const t = document.getElementById('save-toast');
  t.hidden = false; t.classList.add('toast--visible');
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.hidden = true, 300); }, 2000);
}

// --- Regularity Score ---
function calcRegularity(entries) {
  if (entries.length < 2) return 0;
  let totalScore = 0;
  ACTIVITIES.forEach(a => {
    const times = entries.map(e => timeToMinutes(e.activities[a.id]?.time)).filter(t => t !== null);
    if (times.length < 2) return;
    const mean = times.reduce((s,v) => s+v, 0) / times.length;
    const variance = times.reduce((s,v) => s + Math.pow(v - mean, 2), 0) / times.length;
    const sd = Math.sqrt(variance);
    // Convert SD to 0-1 score (lower SD = higher score). SD of 0 = perfect, SD > 120min = 0
    const actScore = Math.max(0, 1 - sd / 120);
    totalScore += actScore;
  });
  return totalScore; // out of 5
}

function updateScore() {
  const last7 = history.slice(-7);
  const score = calcRegularity(last7);
  const rounded = score.toFixed(1);
  document.getElementById('score-value').textContent = rounded;

  // Animate ring
  const ring = document.getElementById('score-ring');
  const pct = score / 5;
  const circumference = 2 * Math.PI * 34;
  ring.style.strokeDashoffset = circumference * (1 - pct);

  // Color
  const color = score >= 4 ? '#5B8C5A' : score >= 3 ? '#E8A838' : '#D4776B';
  ring.style.stroke = color;
  document.getElementById('score-value').style.color = color;

  // Description
  let desc = '';
  if (score >= 4.5) desc = 'Excellent rhythm consistency. Your routines are well-established.';
  else if (score >= 4) desc = 'Good consistency. Minor variations are normal.';
  else if (score >= 3) desc = 'Moderate consistency. Some activities are drifting from targets.';
  else if (score >= 2) desc = 'Low consistency. Significant schedule variability detected.';
  else desc = 'Very low consistency. Routine disruption may affect mood stability.';
  document.getElementById('score-desc').textContent = desc;
}

// --- Timeline Charts ---
let timelineChart = null, regularityChart = null;

function renderTimeline() {
  const last14 = history.slice(-14);
  const labels = last14.map(h => {
    const d = new Date(h.date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  });

  const datasets = ACTIVITIES.map((a, idx) => {
    const colors = ['#E8A838','#7C6DAF','#3B5998','#5B8C5A','#D4776B'];
    return {
      label: a.name,
      data: last14.map(h => {
        const mins = timeToMinutes(h.activities[a.id]?.time);
        return mins !== null ? mins / 60 : null;
      }),
      borderColor: colors[idx],
      backgroundColor: colors[idx] + '20',
      pointRadius: 5, pointHoverRadius: 7, tension: 0.2, fill: false
    };
  });

  if (timelineChart) timelineChart.destroy();
  const ctx = document.getElementById('timeline-chart').getContext('2d');
  timelineChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } } },
      scales: {
        y: {
          min: 5, max: 26,
          ticks: { color: '#6E6B7B', callback: v => { const h = Math.floor(v) % 24; return (h > 12 ? h-12 : h || 12) + (h >= 12 ? 'pm' : 'am'); } },
          grid: { color: 'rgba(0,0,0,0.05)' }, reverse: false
        },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // Regularity chart
  const scores = [];
  for (let i = 0; i < last14.length; i++) {
    const windowStart = Math.max(0, i - 6);
    const window = last14.slice(windowStart, i + 1);
    scores.push(calcRegularity(window));
  }

  if (regularityChart) regularityChart.destroy();
  const ctx2 = document.getElementById('regularity-chart').getContext('2d');
  regularityChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Regularity Index',
        data: scores,
        backgroundColor: scores.map(s => s >= 4 ? 'rgba(91,140,90,0.6)' : s >= 3 ? 'rgba(232,168,56,0.6)' : 'rgba(212,119,107,0.6)'),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 5, ticks: { color: '#6E6B7B', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// --- Disruptions ---
function renderDisruptions() {
  document.getElementById('disrupt-date').value = new Date().toISOString().slice(0,10);
  const list = document.getElementById('disruption-list');
  list.innerHTML = disruptions.slice().reverse().map(d => {
    const actName = ACTIVITIES.find(a => a.id === d.activity)?.name || d.activity;
    const date = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' });
    return `
    <div class="disruption-item">
      <div class="disruption-item__impact disruption-item__impact--${d.impact}">${d.impact}</div>
      <div class="disruption-item__body">
        <div class="disruption-item__meta">
          <span>${date}</span>
          <span>${actName}</span>
          <span>${d.type}</span>
        </div>
        <p class="disruption-item__text">${esc(d.what)}</p>
      </div>
    </div>`;
  }).join('');
}

document.getElementById('disruption-form').addEventListener('submit', e => {
  e.preventDefault();
  const d = {
    date: document.getElementById('disrupt-date').value,
    activity: document.getElementById('disrupt-activity').value,
    what: document.getElementById('disrupt-what').value,
    impact: parseInt(document.getElementById('disrupt-impact').value),
    type: document.getElementById('disrupt-type').value
  };
  if (!d.what) return;
  disruptions.push(d);
  document.getElementById('disrupt-what').value = '';
  renderDisruptions();
});

// --- Scheduler ---
function renderScheduler() {
  const el = document.getElementById('scheduler-list');
  el.innerHTML = ACTIVITIES.map(a => `
    <div class="scheduler-item">
      <span class="scheduler-item__name">${a.name}</span>
      <input type="time" value="${targets[a.id]}" data-activity="${a.id}" class="target-input">
    </div>
  `).join('');

  el.querySelectorAll('.target-input').forEach(input => {
    input.addEventListener('change', e => { targets[e.target.dataset.activity] = e.target.value; });
  });

  renderExtraActivities();
}

document.getElementById('save-targets').addEventListener('click', () => { showToast(); renderSRM(); });

function renderExtraActivities() {
  const el = document.getElementById('extra-activities');
  el.innerHTML = extraActivities.map(a => `
    <div class="extra-activity">
      <span class="extra-activity__name">${esc(a.name)}</span>
      <span class="extra-activity__time">${formatTime12(a.time)}</span>
      <button class="extra-activity__remove" data-id="${a.id}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');

  el.querySelectorAll('.extra-activity__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      extraActivities = extraActivities.filter(a => a.id !== btn.dataset.id);
      renderExtraActivities();
    });
  });
}

document.getElementById('add-activity-btn').addEventListener('click', () => {
  const name = document.getElementById('new-activity-name').value.trim();
  const time = document.getElementById('new-activity-time').value;
  if (!name || !time) return;
  extraActivities.push({ id: 'ex_' + Date.now(), name, time });
  document.getElementById('new-activity-name').value = '';
  document.getElementById('new-activity-time').value = '';
  renderExtraActivities();
});

// --- Tips ---
const TIPS = [
  { category: 'routine', title: 'Anchor Your Day with 5 Activities', text: 'The SRM-5 tracks five core daily anchors. Keeping these within 30 minutes of your target time each day creates the predictability your circadian system needs. Even small consistency improvements help.', evidence: 'Frank et al. (2005): IPSRT plus medication significantly delayed time to recurrence of any mood episode compared to medication alone.' },
  { category: 'routine', title: 'Protect Your Wake Time', text: 'Of all five rhythms, your wake time is the most important to keep consistent. It sets the tone for your entire circadian cycle. Even on weekends, try to wake within 30 minutes of your usual time.', evidence: 'Social Zeitgeber theory: stable wake times anchor the circadian pacemaker (Ehlers et al., 1988).' },
  { category: 'sleep', title: 'Bedtime is Non-Negotiable', text: 'Irregular bedtimes are one of the strongest predictors of mood episodes in bipolar disorder. Create a wind-down ritual that starts 30-60 minutes before your target bedtime.', evidence: 'Harvey et al. (2015): sleep disturbance is both a symptom and a trigger for bipolar mood episodes.' },
  { category: 'sleep', title: 'Avoid Sleep Restriction and Oversleep', text: 'Both too little and too much sleep can trigger episodes. Sleep deprivation can trigger mania, while oversleeping can deepen depression. Aim for 7-9 hours consistently.', evidence: 'Wehr et al. (1987): sleep loss can trigger mania in vulnerable individuals.' },
  { category: 'social', title: 'Plan for Social Disruptions', text: 'Social events are the most common rhythm disruptors. Before accepting invitations, consider the impact on your sleep and routine. It is okay to set boundaries around timing.', evidence: 'Malkoff-Schwartz et al. (1998): social rhythm disruptions preceded manic episodes in 65% of cases studied.' },
  { category: 'social', title: 'First Contact Matters', text: 'When you first interact with another person each day affects your social rhythm. Try to make this happen around the same time daily, whether it is a partner, coworker, or phone call.', evidence: 'Monk et al. (1990): Social Rhythm Metric development and validation.' },
  { category: 'routine', title: 'Use Meal Times as Anchors', text: 'Eating at regular times helps synchronize your peripheral circadian clocks (separate from the brain clock). Regular dinner times are particularly important for evening rhythm stability.', evidence: 'Wehrens et al. (2017): delayed meal times shift peripheral circadian rhythms by up to 5 hours.' },
  { category: 'crisis', title: 'When Rhythms Break Down', text: 'Travel, holidays, conflict, and illness will disrupt your rhythms. The key is rapid recovery, not perfect prevention. After a disruption, return to your target schedule as quickly as possible rather than gradually.', evidence: 'Frank (2007): IPSRT manual recommends rapid rhythm restoration after disruptions.' },
  { category: 'crisis', title: 'Track Disruptions to Find Patterns', text: 'Logging what disrupts your routine helps you anticipate and plan. If work deadlines consistently disrupt your bedtime, that is actionable information for planning.', evidence: 'Clinical recommendation from IPSRT protocol (Frank, 2005).' },
  { category: 'social', title: 'Communicate Your Needs', text: 'Tell the people close to you about the importance of your routine. Most people will accommodate your schedule needs if you explain that routine stability is part of your treatment.', evidence: 'Miklowitz (2008): family and social support improve outcomes in bipolar disorder management.' }
];

function renderTips() {
  const el = document.getElementById('tips-grid');
  if (el.children.length > 0) return;
  el.innerHTML = TIPS.map(t => `
    <div class="tip-card">
      <span class="tip-card__category tip-card__category--${t.category}">${t.category}</span>
      <h3 class="tip-card__title">${t.title}</h3>
      <p class="tip-card__text">${t.text}</p>
      <p class="tip-card__evidence">${t.evidence}</p>
    </div>
  `).join('');
}

// --- Helpers ---
function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  let mins = h * 60 + m;
  // Handle past-midnight times (e.g. 01:30 bed = 25.5 hours)
  if (mins < 300) mins += 1440; // before 5am treated as previous day's late night
  return mins;
}

function formatTime12(t) {
  if (!t) return '--';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return hour + ':' + String(m).padStart(2,'0') + ' ' + ampm;
}

function esc(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }

// --- Init ---
renderSRM();
updateScore();
