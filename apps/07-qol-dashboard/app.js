/* ==========================================================================
   App 7: Quality of Life Dashboard -- Logic
   ========================================================================== */

// --- QoL.BD Domains and Questions ---
const DOMAINS = [
  { id: 'physical', name: 'Physical', color: '#D4776B',
    questions: ['I have felt physically healthy this week','I have had enough energy for daily activities','I have been able to manage physical discomfort','I have felt satisfied with my physical fitness'],
    action: 'Focus on gentle exercise like walking 20-30 minutes daily. Regular physical activity improves mood and energy in BD. Even stretching or yoga counts. Consult your care team before starting intense exercise during mood episodes.' },
  { id: 'sleep', name: 'Sleep', color: '#7C6DAF',
    questions: ['I have been sleeping well','I wake up feeling rested','My sleep schedule has been consistent','I can fall asleep without difficulty'],
    action: 'Prioritize sleep hygiene: consistent bed/wake times, no screens 1hr before bed, cool dark room. Sleep disruption is a key trigger for mood episodes. See the Circadian Rhythm Analyzer app for detailed tracking.' },
  { id: 'mood', name: 'Mood', color: '#3B5998',
    questions: ['My mood has been stable this week','I have been able to enjoy things','I have felt emotionally balanced','I have managed mood fluctuations well'],
    action: 'Continue mood monitoring with the Mood Spectrum Tracker. Practice emotional regulation techniques from CBT. If mood is persistently low or elevated, contact your prescriber. Small daily pleasures help maintain baseline mood.' },
  { id: 'cognition', name: 'Cognition', color: '#E8A838',
    questions: ['I have been able to concentrate well','My memory has been reliable','I can think clearly and make decisions','I have felt mentally sharp'],
    action: 'Cognitive difficulties are common between episodes. Try the Functional Remediation app for exercises. Break tasks into smaller steps. Use lists and reminders. Adequate sleep and medication adherence support cognitive function.' },
  { id: 'leisure', name: 'Leisure', color: '#5B8C5A',
    questions: ['I have spent time on hobbies or interests','I have had fun or enjoyable experiences','I have had enough free time','I have been engaged in meaningful activities'],
    action: 'Schedule at least one pleasurable activity daily -- even brief ones count. Behavioral activation is a key CBT technique for depression. Avoid over-scheduling during elevated mood. Balance activity with rest.' },
  { id: 'social', name: 'Social', color: '#D4776B',
    questions: ['I have felt connected to others','My relationships have been positive','I have spent quality time with people I care about','I have felt supported by my social network'],
    action: 'Maintain regular social contact even when you do not feel like it. Social rhythm stability helps prevent episodes. Practice communication skills from IPSRT. One meaningful interaction per day is a good target.' },
  { id: 'spirituality', name: 'Spirituality', color: '#7C6DAF',
    questions: ['I have felt a sense of meaning or purpose','I have had moments of peace or gratitude','I have connected with my values','I have felt hopeful about the future'],
    action: 'Engage in practices that connect you to meaning: meditation, nature, community, creative expression, or religious/spiritual practice. Even 5 minutes of mindful breathing daily can improve this domain.' },
  { id: 'finance', name: 'Finance', color: '#3B5998',
    questions: ['I have felt in control of my finances','I have been able to cover my expenses','I have not made impulsive financial decisions','I feel secure about my financial situation'],
    action: 'Financial management is especially important during mood episodes. Consider giving a trusted person temporary access during mania. Set spending limits on cards. Automate bills. Review the Crisis Planner for financial safeguards.' },
  { id: 'household', name: 'Household', color: '#E8A838',
    questions: ['My living space has been clean and organized','I have kept up with household responsibilities','I have felt comfortable in my home','I have been able to manage daily chores'],
    action: 'Break household tasks into 15-minute blocks. Do one small thing each day rather than letting tasks accumulate. Ask for help when needed. A tidy environment supports mental well-being -- but perfectionism is not the goal.' },
  { id: 'self-esteem', name: 'Self-esteem', color: '#5B8C5A',
    questions: ['I have felt good about myself','I have recognized my own strengths','I have been kind to myself','I have felt worthy and valuable'],
    action: 'Practice self-compassion -- treat yourself as you would a good friend. Challenge negative self-talk using CBT thought records. Acknowledge small wins daily. Self-esteem often improves with mood stability and treatment adherence.' },
  { id: 'independence', name: 'Independence', color: '#D4776B',
    questions: ['I have been able to manage my own affairs','I have felt capable and self-reliant','I have made my own choices','I have handled daily responsibilities independently'],
    action: 'Build independence gradually. Set small, achievable goals each week. Accepting help is not a failure of independence -- it is wise self-management. Work with your care team to identify areas where you want more autonomy.' },
  { id: 'identity', name: 'Identity', color: '#7C6DAF',
    questions: ['I have felt like myself','Bipolar disorder does not define who I am','I know who I am beyond my diagnosis','I have felt authentic in my interactions'],
    action: 'Identity work is central to BD recovery. Journal about who you are beyond your diagnosis. Engage in activities that reflect your values and interests. IPSRT includes grieving "the healthy self" as a therapeutic step.' }
];

// --- Sample Assessment History ---
let assessmentHistory = [
  {
    date: '2026-03-17',
    scores: { physical:3.0, sleep:2.5, mood:2.75, cognition:2.5, leisure:3.25, social:3.5, spirituality:3.0, finance:3.75, household:2.25, 'self-esteem':2.5, independence:3.25, identity:2.75 }
  },
  {
    date: '2026-03-24',
    scores: { physical:3.25, sleep:3.0, mood:3.25, cognition:3.0, leisure:3.5, social:3.75, spirituality:3.25, finance:3.5, household:2.75, 'self-esteem':3.0, independence:3.5, identity:3.0 }
  },
  {
    date: '2026-03-31',
    scores: { physical:3.5, sleep:3.5, mood:3.75, cognition:3.25, leisure:3.75, social:4.0, spirituality:3.5, finance:3.75, household:3.0, 'self-esteem':3.25, independence:3.75, identity:3.25 }
  }
];

// Current assessment answers (for new assessment form)
let currentAnswers = {};
DOMAINS.forEach(d => { currentAnswers[d.id] = [0,0,0,0]; });

let radarChart = null, historyChart = null;

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected','true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'overview') renderOverview();
      if (tab.dataset.tab === 'assess') renderAssessment();
      if (tab.dataset.tab === 'domains') renderDomainDetail();
      if (tab.dataset.tab === 'history') renderHistory();
    }
  });
});

// --- Get Latest Scores ---
function getLatest() {
  return assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1].scores : null;
}

// --- Overview ---
function renderOverview() {
  const scores = getLatest();
  if (!scores) return;

  // Overall
  const vals = Object.values(scores);
  const avg = (vals.reduce((s,v) => s+v, 0) / vals.length).toFixed(1);
  document.getElementById('overall-value').textContent = avg;

  let desc = '';
  if (avg >= 4) desc = 'Your quality of life is in a strong place. Keep maintaining your current strategies.';
  else if (avg >= 3) desc = 'Moderate quality of life with room for improvement in some areas.';
  else if (avg >= 2) desc = 'Several domains need attention. Consider discussing with your care team.';
  else desc = 'Quality of life is significantly impacted. Please reach out to your healthcare provider.';
  document.getElementById('overall-desc').textContent = desc;

  // Strengths and growth
  const sorted = DOMAINS.map(d => ({ ...d, score: scores[d.id] || 0 })).sort((a,b) => b.score - a.score);
  const strengths = sorted.filter(d => d.score >= 3.5);
  const growth = sorted.filter(d => d.score < 3.0);
  document.getElementById('strength-count').textContent = strengths.length;
  document.getElementById('growth-count').textContent = growth.length;
  document.getElementById('strengths-list').innerHTML = strengths.map(d => `<span class="domain-pill domain-pill--green">${d.name} (${d.score.toFixed(1)})</span>`).join('') || '<span style="font-size:var(--text-xs);color:var(--color-text-faint)">Complete an assessment to see strengths</span>';
  document.getElementById('growth-list').innerHTML = growth.map(d => `<span class="domain-pill domain-pill--amber">${d.name} (${d.score.toFixed(1)})</span>`).join('') || '<span style="font-size:var(--text-xs);color:var(--color-text-faint)">No growth areas identified</span>';

  // Radar chart
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(document.getElementById('radar-chart').getContext('2d'), {
    type: 'radar',
    data: {
      labels: DOMAINS.map(d => d.name),
      datasets: [{
        label: 'Current',
        data: DOMAINS.map(d => scores[d.id] || 0),
        borderColor: '#3B5998',
        backgroundColor: 'rgba(59,89,152,0.15)',
        pointBackgroundColor: DOMAINS.map(d => d.color),
        pointRadius: 5, borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 5, ticks: { stepSize: 1, color: '#6E6B7B', backdropColor: 'transparent', font: { size: 10 } },
          grid: { color: 'rgba(0,0,0,0.06)' },
          pointLabels: { color: '#6E6B7B', font: { size: 11 } },
          angleLines: { color: 'rgba(0,0,0,0.06)' }
        }
      }
    }
  });

  // Domain bars
  document.getElementById('domain-bars').innerHTML = sorted.map(d => {
    const pct = (d.score / 5 * 100);
    const color = d.score >= 3.5 ? '#5B8C5A' : d.score >= 2.5 ? '#E8A838' : '#D4776B';
    return `
    <div class="domain-bar-item">
      <span class="domain-bar-item__name">${d.name}</span>
      <div class="domain-bar-item__bar"><div class="domain-bar-item__fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="domain-bar-item__score" style="color:${color}">${d.score.toFixed(1)}</span>
    </div>`;
  }).join('');
}

// --- Assessment Form ---
function renderAssessment() {
  const el = document.getElementById('assess-domains');
  el.innerHTML = DOMAINS.map(d => {
    const answers = currentAnswers[d.id];
    const domainAvg = answers.some(a => a > 0) ? (answers.reduce((s,v) => s+v, 0) / answers.filter(v => v > 0).length).toFixed(1) : '--';
    return `
    <div class="assess-domain" data-domain="${d.id}">
      <div class="assess-domain__header">
        <span class="assess-domain__name">${d.name}</span>
        <span class="assess-domain__score">${domainAvg}</span>
        <svg class="assess-domain__toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="assess-domain__body">
        ${d.questions.map((q, qi) => `
          <div class="assess-question">
            <div class="assess-question__text">${q}</div>
            <div class="likert-scale">
              ${[1,2,3,4,5].map(v => `<button class="likert-btn ${answers[qi]===v?'likert-btn--active':''}" data-domain="${d.id}" data-q="${qi}" data-val="${v}">${v}</button>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }).join('');

  // Toggle domains open/close
  el.querySelectorAll('.assess-domain__header').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('assess-domain--open'));
  });

  // Likert buttons
  el.querySelectorAll('.likert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAnswers[btn.dataset.domain][parseInt(btn.dataset.q)] = parseInt(btn.dataset.val);
      renderAssessment();
      updateProgress();
    });
  });

  updateProgress();
}

function updateProgress() {
  let answered = 0, total = 48;
  Object.values(currentAnswers).forEach(a => a.forEach(v => { if (v > 0) answered++; }));
  document.getElementById('assess-fill').style.width = (answered/total*100) + '%';
  document.getElementById('assess-progress-text').textContent = answered + ' of ' + total + ' answered';
}

// Submit assessment
document.getElementById('submit-assessment').addEventListener('click', () => {
  const scores = {};
  let complete = true;
  DOMAINS.forEach(d => {
    const answers = currentAnswers[d.id];
    const filled = answers.filter(v => v > 0);
    if (filled.length < 4) complete = false;
    scores[d.id] = filled.length > 0 ? parseFloat((filled.reduce((s,v) => s+v, 0) / filled.length).toFixed(2)) : 0;
  });

  assessmentHistory.push({
    date: new Date().toISOString().slice(0,10),
    scores
  });

  // Reset
  DOMAINS.forEach(d => { currentAnswers[d.id] = [0,0,0,0]; });

  showToast();
  renderOverview();
});

// --- Domain Detail ---
function renderDomainDetail() {
  const sel = document.getElementById('domain-select');
  if (sel.options.length === 0) {
    sel.innerHTML = DOMAINS.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    sel.addEventListener('change', showDomainDetail);
  }
  showDomainDetail();
}

function showDomainDetail() {
  const id = document.getElementById('domain-select').value;
  const domain = DOMAINS.find(d => d.id === id);
  const scores = getLatest();
  if (!domain || !scores) return;

  const score = scores[id] || 0;
  const color = score >= 3.5 ? '#5B8C5A' : score >= 2.5 ? '#E8A838' : '#D4776B';

  // Get question-level scores from last assessment's raw answers (use domain average as proxy)
  const qScores = domain.questions.map(() => score); // simplified

  document.getElementById('domain-detail').innerHTML = `
    <div class="detail-card">
      <h3 class="card__title">${domain.name}</h3>
      <div class="detail-card__score-row">
        <span class="detail-card__score-big" style="color:${color}">${score.toFixed(1)}</span>
        <div class="detail-card__bar"><div class="detail-card__bar-fill" style="width:${score/5*100}%;background:${color}"></div></div>
      </div>
      <div class="detail-card__questions">
        ${domain.questions.map((q, i) => `
          <div class="detail-q">
            <span class="detail-q__text">${q}</span>
            <span class="detail-q__val" style="color:${color}">${qScores[i].toFixed(1)}</span>
          </div>
        `).join('')}
      </div>
      <div class="detail-card__action">
        <div class="detail-card__action-title">Suggested Actions</div>
        <p class="detail-card__action-text">${domain.action}</p>
      </div>
    </div>`;
}

// --- History ---
function renderHistory() {
  const labels = assessmentHistory.map(a => {
    const d = new Date(a.date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  });

  // Overall trend
  const overallScores = assessmentHistory.map(a => {
    const vals = Object.values(a.scores);
    return parseFloat((vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1));
  });

  if (historyChart) historyChart.destroy();
  historyChart = new Chart(document.getElementById('history-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Overall QoL',
        data: overallScores,
        borderColor: '#3B5998', backgroundColor: 'rgba(59,89,152,0.1)',
        fill: true, tension: 0.3, pointRadius: 6, pointBackgroundColor: '#3B5998', borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 5, ticks: { color: '#6E6B7B', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B' }, grid: { display: false } }
      }
    }
  });

  // History list
  document.getElementById('history-list').innerHTML = assessmentHistory.slice().reverse().map(a => {
    const vals = Object.values(a.scores);
    const avg = (vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1);
    const color = avg >= 3.5 ? '#5B8C5A' : avg >= 2.5 ? '#E8A838' : '#D4776B';
    const date = new Date(a.date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    return `
    <div class="history-item">
      <span class="history-item__date">${date}</span>
      <span class="history-item__score" style="color:${color}">${avg}</span>
      <div class="history-item__bar"><div class="history-item__fill" style="width:${avg/5*100}%;background:${color}"></div></div>
    </div>`;
  }).join('');
}

// --- Helpers ---
function esc(s) { const d = document.createElement('div'); d.textContent = s||''; return d.innerHTML; }
function showToast() {
  const t = document.getElementById('save-toast');
  t.hidden = false; t.classList.add('toast--visible');
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.hidden = true, 300); }, 2000);
}

// --- Init ---
renderOverview();
