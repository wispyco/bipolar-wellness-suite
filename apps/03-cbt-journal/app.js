/* ==========================================================================
   App 3: Cognitive Patterns Journal -- Logic
   ========================================================================== */

// --- Cognitive Distortions Data ---
const DISTORTIONS = {
  'all-or-nothing': {
    name: 'All-or-Nothing Thinking',
    desc: 'Seeing things in black-and-white categories. If a situation falls short of perfect, you see it as a total failure. Common during both manic (grandiose perfection) and depressive (complete failure) episodes.',
    example: '"I didn\'t finish everything on my list, so the whole day was wasted."',
    questions: [
      'Is there a middle ground between total success and total failure?',
      'Would I judge a friend this harshly for the same situation?',
      'What parts of this situation actually went well?'
    ],
    prompts: [
      'Try replacing "always/never" with "sometimes" or "this time"',
      'List three things that fall between the two extremes',
      'Rate the outcome on a 0-100 scale instead of pass/fail'
    ],
    exampleBefore: 'I made a mistake at work, so I am completely incompetent.',
    exampleAfter: 'I made one mistake, but I also completed several tasks well today. One error does not define my overall competence.'
  },
  'overgeneralization': {
    name: 'Overgeneralization',
    desc: 'Drawing broad conclusions from a single event. Using words like "always" or "never." This pattern intensifies during depressive episodes.',
    example: '"I got rejected once, so nobody will ever want me."',
    questions: [
      'Is this truly a pattern, or am I basing it on one or two events?',
      'Can I think of times when the opposite was true?',
      'What evidence contradicts this sweeping conclusion?'
    ],
    prompts: [
      'Replace "always" with "this time" or "sometimes"',
      'Think of three exceptions to this "rule"',
      'Ask: what would a scientist say about my sample size?'
    ],
    exampleBefore: 'I always mess things up. Nothing ever works out for me.',
    exampleAfter: 'This particular situation did not go as planned, but I have had many successes before. One setback is not a permanent pattern.'
  },
  'mental-filter': {
    name: 'Mental Filter',
    desc: 'Focusing exclusively on one negative detail while ignoring the bigger picture. Like a drop of ink that discolors an entire glass of water.',
    example: '"My presentation had one awkward pause, so it was terrible."',
    questions: [
      'Am I focusing on one thing and ignoring everything else?',
      'What would someone who watched the whole thing say?',
      'If I listed 10 aspects of this, how many are actually negative?'
    ],
    prompts: [
      'Write down five positive or neutral aspects of the situation',
      'Imagine watching a replay -- what else would you notice?',
      'Ask a trusted person what they observed'
    ],
    exampleBefore: 'My boss mentioned one area for improvement in my review, so the whole review was negative.',
    exampleAfter: 'My boss highlighted several strengths and mentioned one area to improve. Overall, the review was positive with constructive feedback.'
  },
  'disqualifying': {
    name: 'Disqualifying the Positive',
    desc: 'Dismissing positive experiences by insisting they "don\'t count." This maintains a negative belief despite contradictory evidence.',
    example: '"They only complimented me because they felt sorry for me."',
    questions: [
      'Why am I dismissing this positive thing?',
      'If a friend told me about this good thing, would I dismiss it?',
      'What if I simply accepted the positive at face value?'
    ],
    prompts: [
      'Practice saying "thank you" without adding a qualifier',
      'Keep a list of positives for one week without discounting them',
      'Notice the urge to dismiss and label it as a thinking habit'
    ],
    exampleBefore: 'Sure I got the promotion, but they probably just could not find anyone else.',
    exampleAfter: 'I got the promotion because my work has been recognized. I can accept this achievement.'
  },
  'jumping-conclusions': {
    name: 'Jumping to Conclusions',
    desc: 'Making interpretations without evidence. Includes mind-reading (assuming you know what others think) and fortune-telling (predicting things will turn out badly).',
    example: '"They looked at me funny -- they must think I am incompetent."',
    questions: [
      'What evidence do I actually have for this conclusion?',
      'Are there other possible explanations?',
      'Have my predictions been wrong before?'
    ],
    prompts: [
      'List three alternative explanations for what happened',
      'Ask yourself: am I confusing a thought with a fact?',
      'Consider checking in with the person rather than assuming'
    ],
    exampleBefore: 'My friend did not text back, so they must be angry at me.',
    exampleAfter: 'My friend might be busy. There are many reasons someone does not reply immediately. I will check in later.'
  },
  'magnification': {
    name: 'Magnification / Catastrophizing',
    desc: 'Exaggerating the importance of problems or shortcomings. Making mountains out of molehills. Particularly intense during mood episodes.',
    example: '"If I fail this test, my entire career is over."',
    questions: [
      'On a scale of 1-10, how bad is this really?',
      'Will this matter in a week? A month? A year?',
      'What is the worst that could realistically happen?'
    ],
    prompts: [
      'Imagine advising a friend in this exact situation',
      'Write down the worst, best, and most likely outcomes',
      'Rate your distress now vs. how you will feel in 48 hours'
    ],
    exampleBefore: 'I stumbled over my words in the meeting. Everyone will remember and my reputation is ruined.',
    exampleAfter: 'I stumbled briefly. Most people probably did not notice, and even if they did, it is a minor moment that will be forgotten quickly.'
  },
  'minimization': {
    name: 'Minimization',
    desc: 'Shrinking the importance of your positive qualities, achievements, or strengths. The flip side of magnification.',
    example: '"Anyone could have done what I did, it was nothing special."',
    questions: [
      'Would I minimize this achievement if someone else had done it?',
      'What skills or effort did this actually require?',
      'Am I holding myself to unreasonable standards?'
    ],
    prompts: [
      'Describe this accomplishment as if writing a reference for someone else',
      'List the specific steps and effort it took',
      'Accept compliments without deflecting for one day'
    ],
    exampleBefore: 'I managed to exercise three times this week, but that is nothing.',
    exampleAfter: 'Exercising three times this week took real effort, especially given how I have been feeling. That is worth acknowledging.'
  },
  'emotional-reasoning': {
    name: 'Emotional Reasoning',
    desc: 'Assuming that your feelings reflect reality. "I feel it, therefore it must be true." Especially relevant in bipolar disorder where mood states can distort perception.',
    example: '"I feel hopeless, so my situation must be hopeless."',
    questions: [
      'Just because I feel this way, does that make it true?',
      'How might I view this when my mood is different?',
      'What would the facts say if I removed the emotion?'
    ],
    prompts: [
      'Separate the feeling from the fact: "I feel X, but the facts are Y"',
      'Wait 24 hours before acting on strong emotions',
      'Check: is this thought mood-state dependent?'
    ],
    exampleBefore: 'I feel like a burden to everyone, so I must be one.',
    exampleAfter: 'I feel like a burden right now, but feelings are not facts. People in my life have chosen to be here, and my mood is coloring my perception.'
  },
  'should-statements': {
    name: 'Should Statements',
    desc: 'Rigid rules about how you or others "should" behave. Leads to guilt when directed at yourself and anger when directed at others.',
    example: '"I should be able to handle this without help."',
    questions: [
      'Where did this rule come from? Is it actually reasonable?',
      'Would I apply this same "should" to someone I care about?',
      'What happens if I replace "should" with "would like to"?'
    ],
    prompts: [
      'Replace "should" with "I prefer" or "it would be nice if"',
      'Ask: is this a preference or a moral obligation?',
      'Consider that flexibility is a strength, not weakness'
    ],
    exampleBefore: 'I should never need to take a mental health day. I should be stronger than this.',
    exampleAfter: 'Taking a mental health day is a responsible choice. Managing my condition is a sign of self-awareness, not weakness.'
  },
  'labeling': {
    name: 'Labeling',
    desc: 'Attaching a fixed, global label to yourself or others instead of describing the specific behavior. An extreme form of overgeneralization.',
    example: '"I\'m a loser" instead of "I made a mistake."',
    questions: [
      'Am I describing a behavior or defining my entire identity?',
      'Would this label hold up if I looked at all the evidence?',
      'Is one action really enough to define a whole person?'
    ],
    prompts: [
      'Replace the label with a specific description of what happened',
      'Think about how many different "labels" would apply to you across contexts',
      'Describe the behavior, not the person'
    ],
    exampleBefore: 'I am a failure because I could not keep up at work this week.',
    exampleAfter: 'I had a difficult week at work, which is understandable given my current circumstances. One tough week does not define me.'
  },
  'personalization': {
    name: 'Personalization',
    desc: 'Blaming yourself for events outside your control, or assuming everything is about you. Taking excessive responsibility.',
    example: '"My friend is in a bad mood -- I must have done something wrong."',
    questions: [
      'Am I really the only factor in this situation?',
      'What other explanations are there?',
      'Am I taking responsibility for someone else\'s emotions?'
    ],
    prompts: [
      'List all the possible factors that contributed, not just your role',
      'Assign a realistic percentage of responsibility to each factor',
      'Remember: you cannot control other people\'s feelings'
    ],
    exampleBefore: 'The team project failed because of me.',
    exampleAfter: 'The project had challenges from many directions. I contributed what I could, and the outcome involved multiple factors beyond my control.'
  },
  'mind-reading': {
    name: 'Mind Reading',
    desc: 'Believing you know what others are thinking without evidence. Often assuming the worst.',
    example: '"Everyone at the party thinks I am weird."',
    questions: [
      'How do I actually know what they are thinking?',
      'Have I asked them directly?',
      'What evidence do I have versus what am I assuming?'
    ],
    prompts: [
      'Treat your assumption as a hypothesis, not a fact',
      'Consider asking the person what they actually think',
      'Remember that most people are focused on themselves'
    ],
    exampleBefore: 'My therapist thinks I am not trying hard enough.',
    exampleAfter: 'I do not actually know what my therapist thinks. I could ask for direct feedback instead of guessing.'
  },
  'fortune-telling': {
    name: 'Fortune Telling',
    desc: 'Predicting that things will turn out badly without evidence. Treating predictions as established facts.',
    example: '"I know I will fail the exam, so why bother studying."',
    questions: [
      'Can I really predict the future?',
      'How accurate have my past predictions been?',
      'What would I do differently if the outcome were uncertain?'
    ],
    prompts: [
      'Track your predictions and compare them to actual outcomes',
      'Act as if the outcome is uncertain, because it is',
      'Focus on what you can control right now'
    ],
    exampleBefore: 'This new treatment will never work for me. Nothing does.',
    exampleAfter: 'I cannot know the outcome in advance. Past treatments had mixed results, and this one might be different. I will give it a fair chance.'
  },
  'blame': {
    name: 'Blame',
    desc: 'Holding others entirely responsible for your pain, or holding yourself entirely responsible for others. Opposite of personalization when directed outward.',
    example: '"It is all their fault I feel this way."',
    questions: [
      'Is responsibility really 100% on one side?',
      'What role did multiple factors play?',
      'Can I acknowledge shared responsibility?'
    ],
    prompts: [
      'Divide responsibility into percentages among all factors',
      'Focus on what you can control going forward',
      'Distinguish between explanation and excuse'
    ],
    exampleBefore: 'My partner ruined my day by being in a bad mood.',
    exampleAfter: 'My partner was in a bad mood, and I had a strong reaction to it. I can choose how I respond, even when others are difficult.'
  },
  'control-fallacies': {
    name: 'Control Fallacies',
    desc: 'Either feeling externally controlled (helpless victim) or internally controlled (responsible for everyone\'s happiness). Both extremes are distortions.',
    example: '"Nothing I do makes any difference" or "I must keep everyone happy."',
    questions: [
      'Am I overestimating or underestimating my control here?',
      'What can I actually influence versus what is outside my control?',
      'Am I taking on responsibility that is not mine?'
    ],
    prompts: [
      'Draw two circles: things I can control vs. things I cannot',
      'Focus your energy only on what is inside your circle of control',
      'Accept uncertainty as a normal part of life'
    ],
    exampleBefore: 'There is nothing I can do about my bipolar disorder. I am powerless.',
    exampleAfter: 'I cannot eliminate bipolar disorder, but I can manage it through treatment, self-care, and monitoring. I have agency in my recovery.'
  }
};

// --- Sample Data ---
const sampleRecords = [
  {
    id: 1, date: '2026-03-28 09:15',
    situation: 'Woke up late and missed morning meeting at work',
    autoThought: 'I am completely unreliable. Everyone at work must think I am incompetent.',
    emotion: 'Shame', intensity: 85,
    distortion: 'labeling',
    alternative: 'Missing one meeting does not make me unreliable. I have been on time for weeks. I can apologize and catch up on what I missed.',
    newEmotion: 'Mild embarrassment', newIntensity: 35
  },
  {
    id: 2, date: '2026-03-28 14:30',
    situation: 'Partner seemed quiet during dinner',
    autoThought: 'They are upset with me. I must have done something wrong.',
    emotion: 'Anxiety', intensity: 70,
    distortion: 'mind-reading',
    alternative: 'They might be tired from their own day. I can ask how they are feeling instead of assuming.',
    newEmotion: 'Curiosity', newIntensity: 25
  },
  {
    id: 3, date: '2026-03-29 08:00',
    situation: 'Feeling very energetic, started three new projects at once',
    autoThought: 'I can do everything. I do not need sleep. This is the real me.',
    emotion: 'Euphoria', intensity: 90,
    distortion: 'emotional-reasoning',
    alternative: 'This burst of energy might be a mood shift. I should pace myself and check in with my care team about whether this is sustainable.',
    newEmotion: 'Cautious optimism', newIntensity: 45
  },
  {
    id: 4, date: '2026-03-29 22:00',
    situation: 'Lay awake thinking about all the things that could go wrong tomorrow',
    autoThought: 'Tomorrow will be a disaster. I know something bad will happen.',
    emotion: 'Dread', intensity: 75,
    distortion: 'fortune-telling',
    alternative: 'I cannot predict tomorrow. Most of my catastrophic predictions have not come true. I will focus on what I can prepare for.',
    newEmotion: 'Mild concern', newIntensity: 30
  },
  {
    id: 5, date: '2026-03-30 11:00',
    situation: 'Friend cancelled lunch plans',
    autoThought: 'Nobody wants to spend time with me. I always end up alone.',
    emotion: 'Sadness', intensity: 80,
    distortion: 'overgeneralization',
    alternative: 'One cancellation does not mean nobody wants to see me. My friend might have a legitimate reason. I saw other friends last week.',
    newEmotion: 'Disappointment', newIntensity: 40
  },
  {
    id: 6, date: '2026-03-30 16:45',
    situation: 'Got positive feedback on a report but boss mentioned one correction',
    autoThought: 'The whole report was bad. That correction proves I do not know what I am doing.',
    emotion: 'Frustration', intensity: 65,
    distortion: 'mental-filter',
    alternative: 'The feedback was mostly positive. One correction is normal and helps me improve. I will focus on the overall positive reception.',
    newEmotion: 'Acceptance', newIntensity: 20
  },
  {
    id: 7, date: '2026-03-31 07:30',
    situation: 'Woke up feeling low, struggled to get out of bed',
    autoThought: 'I should be able to just get up. Other people do not have this problem. I am weak.',
    emotion: 'Self-criticism', intensity: 75,
    distortion: 'should-statements',
    alternative: 'Managing bipolar disorder takes extra effort. Getting up when I feel low is genuinely difficult, and that is okay. I will take it one step at a time.',
    newEmotion: 'Self-compassion', newIntensity: 35
  },
  {
    id: 8, date: '2026-03-31 13:00',
    situation: 'Team project received mixed reviews from client',
    autoThought: 'This is all my fault. I let the entire team down.',
    emotion: 'Guilt', intensity: 80,
    distortion: 'personalization',
    alternative: 'The project involved the whole team. Mixed reviews reflect many factors. I will take responsibility for my part and collaborate on improvements.',
    newEmotion: 'Resolve', newIntensity: 30
  },
  {
    id: 9, date: '2026-04-01 09:00',
    situation: 'Declined an invitation to a social event',
    autoThought: 'If I do not go, everyone will forget about me. But if I go, I will ruin the mood.',
    emotion: 'Conflict', intensity: 70,
    distortion: 'all-or-nothing',
    alternative: 'I can decline this event and attend the next one. Protecting my energy is valid. My friends understand, and one absence will not end our friendships.',
    newEmotion: 'Relief', newIntensity: 25
  },
  {
    id: 10, date: '2026-04-01 15:00',
    situation: 'Completed a week of consistent medication and journaling',
    autoThought: 'This does not count. Anyone could do this. It is not a real accomplishment.',
    emotion: 'Emptiness', intensity: 55,
    distortion: 'disqualifying',
    alternative: 'A week of consistency when managing bipolar disorder is a genuine achievement. I will acknowledge this effort and build on it.',
    newEmotion: 'Quiet pride', newIntensity: 20
  }
];

// --- State ---
let records = [...sampleRecords];
let distortionChart = null;
let intensityChart = null;

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => {
      t.classList.remove('app-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('app-tab--active');
    tab.setAttribute('aria-selected', 'true');

    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'history') renderHistory();
      if (tab.dataset.tab === 'patterns') renderPatterns();
      if (tab.dataset.tab === 'distortions') renderDistortionGuide();
    }
  });
});

// --- Intensity Sliders ---
document.getElementById('intensity').addEventListener('input', e => {
  document.getElementById('intensity-value').textContent = e.target.value;
});
document.getElementById('new-intensity').addEventListener('input', e => {
  document.getElementById('new-intensity-value').textContent = e.target.value;
});

// --- Form Submit ---
document.getElementById('thought-form').addEventListener('submit', e => {
  e.preventDefault();
  const record = {
    id: Date.now(),
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    situation: document.getElementById('situation').value,
    autoThought: document.getElementById('auto-thought').value,
    emotion: document.getElementById('emotion').value,
    intensity: parseInt(document.getElementById('intensity').value),
    distortion: document.getElementById('distortion').value,
    alternative: document.getElementById('alternative').value,
    newEmotion: document.getElementById('new-emotion').value,
    newIntensity: parseInt(document.getElementById('new-intensity').value)
  };

  if (!record.situation || !record.autoThought || !record.emotion) return;

  records.unshift(record);
  e.target.reset();
  document.getElementById('intensity').value = 50;
  document.getElementById('intensity-value').textContent = '50';
  document.getElementById('new-intensity').value = 30;
  document.getElementById('new-intensity-value').textContent = '30';

  showToast();
});

function showToast() {
  const toast = document.getElementById('save-toast');
  toast.hidden = false;
  toast.classList.add('toast--visible');
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.hidden = true, 300);
  }, 2000);
}

// --- History ---
function renderHistory() {
  const list = document.getElementById('history-list');
  document.getElementById('record-count').textContent = records.length + ' records';

  list.innerHTML = records.map(r => {
    const dotClass = r.intensity >= 70 ? 'high' : r.intensity >= 40 ? 'medium' : 'low';
    const distName = DISTORTIONS[r.distortion]?.name || r.distortion || 'Not specified';
    return `
      <div class="history-item" data-id="${r.id}">
        <div class="history-item__header" onclick="this.parentElement.classList.toggle('history-item--open')">
          <div class="history-item__dot history-item__dot--${dotClass}"></div>
          <div class="history-item__summary">
            <div class="history-item__thought">${escHtml(r.autoThought)}</div>
            <div class="history-item__date">${formatDate(r.date)}</div>
          </div>
          <span class="history-item__badge">${distName}</span>
          <svg class="history-item__toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="history-item__detail">
          <div class="detail-grid">
            <div class="detail-item detail-item--full">
              <div class="detail-item__label">Situation</div>
              <div class="detail-item__value">${escHtml(r.situation)}</div>
            </div>
            <div class="detail-item detail-item--full">
              <div class="detail-item__label">Automatic Thought</div>
              <div class="detail-item__value">${escHtml(r.autoThought)}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item__label">Initial Emotion</div>
              <div class="detail-item__value">${escHtml(r.emotion)}</div>
              <div class="detail-item__intensity-bar">
                <div class="intensity-bar"><div class="intensity-bar__fill intensity-bar__fill--before" style="width:${r.intensity}%"></div></div>
                <span style="font-size:var(--text-xs);color:var(--color-text-faint)">${r.intensity}%</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-item__label">After Reframing</div>
              <div class="detail-item__value">${escHtml(r.newEmotion)}</div>
              <div class="detail-item__intensity-bar">
                <div class="intensity-bar"><div class="intensity-bar__fill intensity-bar__fill--after" style="width:${r.newIntensity}%"></div></div>
                <span style="font-size:var(--text-xs);color:var(--color-text-faint)">${r.newIntensity}%</span>
              </div>
            </div>
            <div class="detail-item detail-item--full">
              <div class="detail-item__label">Balanced Thought</div>
              <div class="detail-item__value">${escHtml(r.alternative)}</div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// --- Patterns ---
function renderPatterns() {
  // Stats
  const total = records.length;
  const avgBefore = total ? Math.round(records.reduce((s, r) => s + r.intensity, 0) / total) : 0;
  const avgAfter = total ? Math.round(records.reduce((s, r) => s + r.newIntensity, 0) / total) : 0;
  const reduction = avgBefore ? Math.round((1 - avgAfter / avgBefore) * 100) : 0;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-avg-before').textContent = avgBefore;
  document.getElementById('stat-avg-after').textContent = avgAfter;
  document.getElementById('stat-reduction').textContent = reduction + '%';

  // Distortion frequency chart
  const freq = {};
  records.forEach(r => {
    if (r.distortion && DISTORTIONS[r.distortion]) {
      freq[r.distortion] = (freq[r.distortion] || 0) + 1;
    }
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(([k]) => DISTORTIONS[k].name);
  const data = sorted.map(([, v]) => v);

  if (distortionChart) distortionChart.destroy();
  const ctx1 = document.getElementById('distortion-chart').getContext('2d');
  distortionChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: 'rgba(124, 109, 175, 0.6)',
        borderColor: '#7C6DAF',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { stepSize: 1, color: '#6E6B7B' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { color: '#6E6B7B', font: { size: 11 } }, grid: { display: false } }
      }
    }
  });

  // Intensity trend chart
  const reversed = [...records].reverse();
  if (intensityChart) intensityChart.destroy();
  const ctx2 = document.getElementById('intensity-chart').getContext('2d');
  intensityChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: reversed.map((_, i) => 'Record ' + (i + 1)),
      datasets: [
        {
          label: 'Initial Intensity',
          data: reversed.map(r => r.intensity),
          borderColor: '#D4776B',
          backgroundColor: 'rgba(212, 119, 107, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        },
        {
          label: 'After Reframing',
          data: reversed.map(r => r.newIntensity),
          borderColor: '#5B8C5A',
          backgroundColor: 'rgba(91, 140, 90, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle' } }
      },
      scales: {
        y: { min: 0, max: 100, ticks: { color: '#6E6B7B' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// --- Reframe Helper ---
document.getElementById('reframe-distortion').addEventListener('change', e => {
  const key = e.target.value;
  const content = document.getElementById('reframe-content');
  if (!key || !DISTORTIONS[key]) {
    content.hidden = true;
    return;
  }
  const d = DISTORTIONS[key];
  content.hidden = false;
  document.getElementById('reframe-name').textContent = d.name;
  document.getElementById('reframe-desc').textContent = d.desc;
  document.getElementById('reframe-questions').innerHTML = d.questions.map(q => `<li>${q}</li>`).join('');
  document.getElementById('reframe-prompts').innerHTML = d.prompts.map(p => `<li>${p}</li>`).join('');
  document.getElementById('reframe-example-before').textContent = d.exampleBefore;
  document.getElementById('reframe-example-after').textContent = d.exampleAfter;
});

// --- Distortion Guide ---
function renderDistortionGuide() {
  const guide = document.getElementById('distortion-guide');
  if (guide.children.length > 0) return; // already rendered

  let i = 1;
  guide.innerHTML = Object.entries(DISTORTIONS).map(([key, d]) => `
    <div class="distortion-card">
      <div class="distortion-card__header">
        <span class="distortion-card__number">${String(i++).padStart(2, '0')}</span>
        <h3 class="distortion-card__name">${d.name}</h3>
      </div>
      <p class="distortion-card__desc">${d.desc}</p>
      <p class="distortion-card__example">${d.example}</p>
    </div>
  `).join('');
}

// --- Helpers ---
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
           ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

// --- Init ---
renderHistory();
