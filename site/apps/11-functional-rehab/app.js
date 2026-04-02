/* ==========================================================================
   App 11: Functional Remediation -- Logic
   ========================================================================== */

// --- State ---
let goals = [
  { id: 1, text: 'Complete work tasks without needing multiple reminders', category: 'work', done: false },
  { id: 2, text: 'Attend all scheduled meetings this week', category: 'work', done: true },
  { id: 3, text: 'Read for 20 minutes without losing focus', category: 'education', done: false },
  { id: 4, text: 'Prepare meals for the week on Sunday', category: 'daily', done: true },
  { id: 5, text: 'Reply to messages within 24 hours', category: 'social', done: false }
];

const ASSESSMENT_AREAS = [
  'Concentration and focus', 'Memory (remembering appointments, tasks)',
  'Decision making', 'Planning and organizing', 'Completing tasks on time',
  'Managing finances', 'Maintaining relationships', 'Self-care and hygiene',
  'Work/school performance', 'Household responsibilities'
];
let todayAssessment = {};
ASSESSMENT_AREAS.forEach((a, i) => todayAssessment[i] = 0);

// Sample assessment history
const baseDate = new Date('2026-03-22');
let assessmentHistory = [];
for (let d = 0; d < 10; d++) {
  const dt = new Date(baseDate); dt.setDate(dt.getDate() + d);
  const scores = {};
  ASSESSMENT_AREAS.forEach((_, i) => { scores[i] = Math.max(1, Math.min(5, Math.round(2.5 + d * 0.15 + (Math.random() - 0.3) * 1.5))); });
  assessmentHistory.push({ date: dt.toISOString().slice(0, 10), scores });
}

let exerciseHistory = [5, 3, 4, 6, 2, 5, 4, 3, 6, 5, 4, 3, 5, 4];
let exerciseCompletions = 52;

const ACCOMMODATIONS = [
  { title: 'Flexible scheduling', desc: 'Ability to adjust start times or take breaks as needed for medication side effects or energy fluctuations.' },
  { title: 'Reduced workload during episodes', desc: 'Temporary reduction in tasks or deadlines during acute mood episodes with a return-to-full plan.' },
  { title: 'Written instructions', desc: 'Receive important instructions in writing rather than only verbally to compensate for concentration difficulties.' },
  { title: 'Quiet workspace', desc: 'Access to a low-stimulation work area to reduce distractions during periods of difficulty concentrating.' },
  { title: 'Regular check-ins', desc: 'Brief weekly meetings with supervisor to review priorities and adjust workload as needed.' },
  { title: 'Remote work option', desc: 'Ability to work from home on days when commuting or social interaction is particularly difficult.' },
  { title: 'Extended deadlines', desc: 'Additional time for complex projects during periods of cognitive difficulty.' },
  { title: 'Task lists and reminders', desc: 'Use of organizational tools (apps, planners) during work hours without restriction.' },
  { title: 'Medical appointment flexibility', desc: 'Time off for regular psychiatric and therapy appointments without penalty.' },
  { title: 'Gradual return after absence', desc: 'Phased return to full duties after a medical leave rather than immediate full workload.' }
];
let accomChecked = [true, false, true, true, false, false, true, true, true, false];

const TIPS = [
  { cat: 'Attention', title: 'Use the 25-5 Technique', text: 'Work for 25 minutes, then take a 5-minute break. This matches the natural attention cycle and prevents fatigue. Set a timer so you do not have to watch the clock.' },
  { cat: 'Attention', title: 'Reduce Environmental Distractions', text: 'Turn off notifications, use noise-cancelling headphones, and work in a consistent location. External distractions compound the internal attention difficulties of BD.' },
  { cat: 'Memory', title: 'Write Everything Down', text: 'Do not trust your memory during or after episodes. Use a single notebook or app for all tasks, appointments, and notes. The act of writing also reinforces encoding.' },
  { cat: 'Memory', title: 'Use Spaced Repetition', text: 'Review important information at increasing intervals: 1 hour, 1 day, 3 days, 1 week. This dramatically improves long-term retention compared to cramming.' },
  { cat: 'Executive Function', title: 'Break Tasks Into Steps', text: 'Complex tasks feel overwhelming when executive function is impaired. Break every task into 3-5 concrete steps and do only one step at a time.' },
  { cat: 'Executive Function', title: 'Use External Structure', text: 'Calendars, alarms, checklists, and routines replace the internal executive functions that BD can disrupt. Build systems you follow even when well, so they are automatic during episodes.' },
  { cat: 'General', title: 'Medication Adherence Supports Cognition', text: 'Consistent medication use reduces the frequency and severity of episodes, which in turn protects cognitive function over time. Each episode causes additional cognitive burden.' },
  { cat: 'General', title: 'Exercise Boosts Brain Function', text: '30 minutes of moderate exercise 3-5 times per week increases BDNF (brain-derived neurotrophic factor), which supports memory, attention, and executive function.' }
];

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'goals') renderGoals();
      if (tab.dataset.tab === 'assessment') renderAssessment();
      if (tab.dataset.tab === 'progress') renderProgress();
      if (tab.dataset.tab === 'accommodations') renderAccommodations();
      if (tab.dataset.tab === 'tips') renderTips();
    }
  });
});

// === EXERCISES / GAMES ===

document.querySelectorAll('.ex-card__start').forEach(btn => {
  btn.addEventListener('click', () => startGame(btn.dataset.game));
});
document.getElementById('game-back').addEventListener('click', endGame);

function startGame(type) {
  document.querySelector('.exercise-categories').style.display = 'none';
  const area = document.getElementById('game-area');
  area.hidden = false;
  if (type === 'memory-match') runMemoryMatch();
  else if (type === 'number-sequence') runNumberSequence();
  else if (type === 'color-word') runColorWord();
  else if (type === 'category-sort') runCategorySort();
}

function endGame() {
  document.getElementById('game-area').hidden = true;
  document.querySelector('.exercise-categories').style.display = '';
}

// --- Memory Match ---
function runMemoryMatch() {
  document.getElementById('game-title').textContent = 'Memory Match';
  document.getElementById('game-score').textContent = '';
  const symbols = ['A','B','C','D','E','F','G','H'];
  let cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  let flipped = [], matched = new Set(), moves = 0;
  const content = document.getElementById('game-content');
  content.innerHTML = '<p class="game-instructions">Find all matching pairs. Click a card to flip it.</p><div class="match-grid" id="match-grid"></div>';
  const grid = document.getElementById('match-grid');

  function render() {
    grid.innerHTML = cards.map((c, i) => {
      const isFlipped = flipped.includes(i) || matched.has(i);
      const isMatched = matched.has(i);
      return `<div class="match-card ${isFlipped ? 'match-card--flipped' : 'match-card--hidden'} ${isMatched ? 'match-card--matched' : ''}" data-idx="${i}">${isFlipped ? c : '?'}</div>`;
    }).join('');
    grid.querySelectorAll('.match-card:not(.match-card--matched)').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.idx);
        if (flipped.includes(idx) || flipped.length >= 2) return;
        flipped.push(idx);
        moves++;
        render();
        if (flipped.length === 2) {
          setTimeout(() => {
            if (cards[flipped[0]] === cards[flipped[1]]) { matched.add(flipped[0]); matched.add(flipped[1]); }
            flipped = [];
            render();
            document.getElementById('game-score').textContent = 'Moves: ' + moves;
            if (matched.size === cards.length) {
              exerciseCompletions++;
              content.innerHTML = `<div class="game-result"><div class="game-result__score">Complete!</div><p class="game-result__text">You found all ${symbols.length} pairs in ${moves} moves.</p><button class="btn btn-primary" onclick="endGame()">Done</button></div>`;
            }
          }, 700);
        }
      });
    });
  }
  render();
}

// --- Number Sequence ---
function runNumberSequence() {
  document.getElementById('game-title').textContent = 'Number Sequence';
  document.getElementById('game-score').textContent = '';
  let level = 3, score = 0, sequence = [], userAnswer = [];
  const content = document.getElementById('game-content');

  function newRound() {
    sequence = []; userAnswer = [];
    for (let i = 0; i < level; i++) sequence.push(Math.floor(Math.random() * 10));
    showSequence();
  }

  function showSequence() {
    content.innerHTML = '<p class="game-instructions">Watch the numbers, then repeat them in order.</p><div class="seq-display"><div class="seq-number" id="seq-num"></div></div>';
    let i = 0;
    const el = document.getElementById('seq-num');
    const iv = setInterval(() => {
      if (i < sequence.length) { el.textContent = sequence[i]; i++; }
      else { clearInterval(iv); el.textContent = ''; showInput(); }
    }, 800);
  }

  function showInput() {
    content.innerHTML = `<p class="game-instructions">Enter the sequence you saw (${level} digits).</p>
      <div class="seq-answer" id="seq-answer"></div>
      <div class="seq-input-row">${[0,1,2,3,4,5,6,7,8,9].map(n => `<button class="seq-btn" data-n="${n}">${n}</button>`).join('')}</div>`;
    content.querySelectorAll('.seq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        userAnswer.push(parseInt(btn.dataset.n));
        document.getElementById('seq-answer').innerHTML = userAnswer.map(d => `<span class="seq-answer-digit">${d}</span>`).join('');
        if (userAnswer.length === sequence.length) checkAnswer();
      });
    });
  }

  function checkAnswer() {
    const correct = userAnswer.every((v, i) => v === sequence[i]);
    if (correct) { score++; level = Math.min(level + 1, 9); }
    else { level = Math.max(3, level - 1); }
    document.getElementById('game-score').textContent = 'Score: ' + score;
    if (score >= 5 || (!correct && score > 0)) {
      exerciseCompletions++;
      content.innerHTML = `<div class="game-result"><div class="game-result__score">Score: ${score}</div><p class="game-result__text">You reached level ${level} (${level}-digit sequences).</p><button class="btn btn-primary" onclick="endGame()">Done</button></div>`;
    } else {
      setTimeout(newRound, 1000);
    }
  }
  newRound();
}

// --- Color Word (Stroop) ---
function runColorWord() {
  document.getElementById('game-title').textContent = 'Color-Word Challenge';
  document.getElementById('game-score').textContent = '';
  const colors = [
    { name: 'Red', hex: '#D4776B' }, { name: 'Blue', hex: '#3B5998' },
    { name: 'Green', hex: '#5B8C5A' }, { name: 'Purple', hex: '#7C6DAF' },
    { name: 'Orange', hex: '#E8A838' }
  ];
  let score = 0, round = 0, maxRounds = 10;
  const content = document.getElementById('game-content');

  function nextRound() {
    if (round >= maxRounds) {
      exerciseCompletions++;
      content.innerHTML = `<div class="game-result"><div class="game-result__score">${score}/${maxRounds}</div><p class="game-result__text">You correctly identified the text color ${score} out of ${maxRounds} times.</p><button class="btn btn-primary" onclick="endGame()">Done</button></div>`;
      return;
    }
    const wordColor = colors[Math.floor(Math.random() * colors.length)];
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    content.innerHTML = `<p class="game-instructions">What COLOR is the text displayed in? (Ignore the word itself)</p>
      <div class="stroop-word" style="color:${textColor.hex}">${wordColor.name}</div>
      <div class="stroop-options">${colors.map(c => `<button class="stroop-opt" data-color="${c.name}" style="border-left:4px solid ${c.hex}">${c.name}</button>`).join('')}</div>`;
    content.querySelectorAll('.stroop-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const correct = btn.dataset.color === textColor.name;
        if (correct) { score++; btn.classList.add('stroop-opt--correct'); }
        else { btn.classList.add('stroop-opt--wrong'); content.querySelector(`[data-color="${textColor.name}"]`).classList.add('stroop-opt--correct'); }
        document.getElementById('game-score').textContent = score + '/' + (round + 1);
        round++;
        content.querySelectorAll('.stroop-opt').forEach(b => b.style.pointerEvents = 'none');
        setTimeout(nextRound, 800);
      });
    });
  }
  nextRound();
}

// --- Category Sort ---
function runCategorySort() {
  document.getElementById('game-title').textContent = 'Category Sort';
  document.getElementById('game-score').textContent = '';
  const categories = { 'Fruits': ['Apple','Banana','Orange','Grape','Mango'], 'Animals': ['Dog','Cat','Eagle','Whale','Frog'] };
  const allItems = [];
  Object.entries(categories).forEach(([cat, items]) => items.forEach(item => allItems.push({ item, cat })));
  allItems.sort(() => Math.random() - 0.5);
  let placed = {};
  const content = document.getElementById('game-content');

  function render() {
    const remaining = allItems.filter(a => !placed[a.item]);
    content.innerHTML = `<p class="game-instructions">Sort each item into the correct category. Click an item, then click a bucket.</p>
      <div style="text-align:center;margin-bottom:var(--space-4)">${remaining.map(a => `<span class="sort-item" data-item="${a.item}">${a.item}</span>`).join('')}${remaining.length === 0 ? '<span style="color:var(--color-text-faint);font-size:var(--text-sm)">All sorted!</span>' : ''}</div>
      <div class="sort-buckets">${Object.keys(categories).map(cat => `
        <div class="sort-bucket" data-cat="${cat}">
          <div class="sort-bucket__title">${cat}</div>
          <div class="sort-bucket__items">${Object.entries(placed).filter(([_, c]) => c === cat).map(([item]) => `<span class="sort-item sort-item--placed">${item}</span>`).join('')}</div>
        </div>
      `).join('')}</div>`;

    let selected = null;
    content.querySelectorAll('.sort-item:not(.sort-item--placed)').forEach(el => {
      el.addEventListener('click', () => {
        content.querySelectorAll('.sort-item').forEach(s => s.style.outline = '');
        el.style.outline = '2px solid var(--color-primary)';
        selected = el.dataset.item;
      });
    });
    content.querySelectorAll('.sort-bucket').forEach(bucket => {
      bucket.addEventListener('click', () => {
        if (!selected) return;
        placed[selected] = bucket.dataset.cat;
        selected = null;
        render();
        if (Object.keys(placed).length === allItems.length) {
          let correct = allItems.filter(a => placed[a.item] === a.cat).length;
          exerciseCompletions++;
          document.getElementById('game-score').textContent = correct + '/' + allItems.length;
          setTimeout(() => {
            content.innerHTML = `<div class="game-result"><div class="game-result__score">${correct}/${allItems.length} Correct</div><p class="game-result__text">You sorted ${correct} items into the right category.</p><button class="btn btn-primary" onclick="endGame()">Done</button></div>`;
          }, 500);
        }
      });
    });
  }
  render();
}

// === GOALS ===
function renderGoals() {
  const el = document.getElementById('goals-list');
  el.innerHTML = goals.map(g => `
    <div class="goal-item ${g.done ? 'goal-item--done' : ''}">
      <button class="goal-item__check ${g.done ? 'goal-item__check--done' : ''}" data-id="${g.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
      <span class="goal-item__text">${esc(g.text)}</span>
      <span class="goal-item__cat">${g.category}</span>
    </div>
  `).join('');
  el.querySelectorAll('.goal-item__check').forEach(btn => {
    btn.addEventListener('click', () => {
      const goal = goals.find(g => g.id === parseInt(btn.dataset.id));
      if (goal) { goal.done = !goal.done; renderGoals(); }
    });
  });
}

document.getElementById('goal-form').addEventListener('submit', e => {
  e.preventDefault();
  const text = document.getElementById('goal-text').value.trim();
  if (!text) return;
  goals.push({ id: Date.now(), text, category: document.getElementById('goal-category').value, done: false });
  document.getElementById('goal-text').value = '';
  renderGoals();
});

// === ASSESSMENT ===
function renderAssessment() {
  const el = document.getElementById('assessment-items');
  el.innerHTML = ASSESSMENT_AREAS.map((area, i) => `
    <div class="assess-row">
      <span class="assess-row__label">${area}</span>
      <div class="assess-row__btns">${[1,2,3,4,5].map(v => `<button class="assess-btn ${todayAssessment[i]===v?'assess-btn--active':''}" data-area="${i}" data-val="${v}">${v}</button>`).join('')}</div>
    </div>
  `).join('');
  el.querySelectorAll('.assess-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      todayAssessment[parseInt(btn.dataset.area)] = parseInt(btn.dataset.val);
      renderAssessment();
    });
  });
}

document.getElementById('save-assessment').addEventListener('click', () => {
  assessmentHistory.push({ date: new Date().toISOString().slice(0, 10), scores: { ...todayAssessment } });
  showToast();
});

// === PROGRESS ===
let exChart = null, fnChart = null;
function renderProgress() {
  const last14 = exerciseHistory.slice(-14);
  const labels14 = last14.map((_, i) => 'Day ' + (i + 1));

  if (exChart) exChart.destroy();
  exChart = new Chart(document.getElementById('exercise-chart').getContext('2d'), {
    type: 'bar',
    data: { labels: labels14, datasets: [{ label: 'Exercises', data: last14, backgroundColor: 'rgba(124,109,175,0.6)', borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#6E6B7B', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } } } }
  });

  const avgScores = assessmentHistory.slice(-10).map(a => {
    const vals = Object.values(a.scores).filter(v => v > 0);
    return vals.length > 0 ? parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)) : 0;
  });
  const fnLabels = assessmentHistory.slice(-10).map(a => { const d = new Date(a.date + 'T00:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); });

  if (fnChart) fnChart.destroy();
  fnChart = new Chart(document.getElementById('function-chart').getContext('2d'), {
    type: 'line',
    data: { labels: fnLabels, datasets: [{ label: 'Avg Functioning', data: avgScores, borderColor: '#3B5998', backgroundColor: 'rgba(59,89,152,0.1)', fill: true, tension: 0.3, pointRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 5, ticks: { color: '#6E6B7B', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } } } }
  });

  document.getElementById('stat-exercises').textContent = exerciseCompletions;
  document.getElementById('stat-streak').textContent = '7';
  document.getElementById('stat-avg').textContent = avgScores.length > 0 ? avgScores[avgScores.length - 1].toFixed(1) : '0';
  document.getElementById('stat-goals').textContent = goals.filter(g => g.done).length;
}

// === ACCOMMODATIONS ===
function renderAccommodations() {
  const el = document.getElementById('accommodations-list');
  el.innerHTML = ACCOMMODATIONS.map((a, i) => `
    <div class="accom-item">
      <button class="accom-item__check ${accomChecked[i] ? 'accom-item__check--done' : ''}" data-idx="${i}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
      <div class="accom-item__body">
        <div class="accom-item__title">${a.title}</div>
        <div class="accom-item__desc">${a.desc}</div>
      </div>
    </div>
  `).join('');
  el.querySelectorAll('.accom-item__check').forEach(btn => {
    btn.addEventListener('click', () => { accomChecked[parseInt(btn.dataset.idx)] = !accomChecked[parseInt(btn.dataset.idx)]; renderAccommodations(); });
  });
}

// === TIPS ===
function renderTips() {
  const el = document.getElementById('tips-list');
  if (el.children.length > 0) return;
  el.innerHTML = TIPS.map(t => `
    <div class="tip-card">
      <div class="tip-card__cat">${t.cat}</div>
      <h3 class="tip-card__title">${t.title}</h3>
      <p class="tip-card__text">${t.text}</p>
    </div>
  `).join('');
}

// === HELPERS ===
function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
function showToast() { const t = document.getElementById('save-toast'); t.hidden = false; t.classList.add('toast--visible'); setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.hidden = true, 300); }, 2000); }
