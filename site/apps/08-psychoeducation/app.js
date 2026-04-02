/* ==========================================================================
   App 8: Psychoeducation Library -- Logic
   ========================================================================== */

const MODULES = [
  {
    id: 'what-is-bd', title: 'What is Bipolar Disorder?', time: '8 min', difficulty: 'beginner',
    desc: 'Understand the basics of bipolar disorder -- brain chemistry, prevalence, and what makes it different from normal mood changes.',
    tags: ['Fundamentals', 'Neuroscience'],
    sections: [
      { title: 'Overview', content: '<p>Bipolar disorder (BD) is a chronic psychiatric condition characterized by episodes of mania or hypomania and depression. It affects approximately 1-2% of the global population and typically emerges in late adolescence or early adulthood.</p><p>Unlike normal mood fluctuations, bipolar mood episodes are distinct periods that last days to weeks and significantly impair functioning. The disorder involves changes in energy, activity levels, sleep, and cognition -- not just mood.</p>', takeaway: 'Bipolar disorder is a medical condition involving brain chemistry, not a character flaw or weakness.' },
      { title: 'The Brain in BD', content: '<p>Research shows that bipolar disorder involves dysregulation of several brain systems:</p><ul><li>Neurotransmitter imbalances (serotonin, dopamine, norepinephrine)</li><li>Circadian rhythm disruptions affecting the biological clock</li><li>Changes in brain structure, particularly in the prefrontal cortex and amygdala</li><li>Genetic factors -- BD is one of the most heritable psychiatric conditions (60-85% heritability)</li></ul><p>This biological basis is why medication is typically necessary alongside psychotherapy.</p>', takeaway: 'BD has a strong biological basis involving brain chemistry, circadian rhythms, and genetics.' },
      { title: 'Prevalence and Course', content: '<p>BD affects people across all cultures and demographics. Key facts:</p><ul><li>Bipolar I affects about 1% of the population; Bipolar II about 1.1%</li><li>Average age of onset is 25 years, but can begin in adolescence</li><li>The condition is lifelong but highly manageable with proper treatment</li><li>Without treatment, episodes tend to become more frequent over time</li><li>With treatment, many people achieve long periods of stability</li></ul>', takeaway: 'BD is common, lifelong, and highly treatable. Early and consistent treatment leads to better outcomes.' }
    ],
    quiz: [
      { q: 'What percentage of the population does bipolar disorder affect?', options: ['0.1%','1-2%','5-10%','15%'], correct: 1 },
      { q: 'Which of these is NOT a feature of bipolar disorder?', options: ['Episodes of mania','Episodes of depression','Constant mood instability','Changes in energy and sleep'], correct: 2 },
      { q: 'Bipolar disorder heritability is estimated at:', options: ['10-20%','30-40%','60-85%','100%'], correct: 2 }
    ],
    citations: [
      'Goodwin FK, Jamison KR. Manic-Depressive Illness: Bipolar Disorders and Recurrent Depression. 2nd ed. Oxford University Press; 2007.',
      'Merikangas KR, et al. Prevalence and correlates of bipolar spectrum disorder in the world mental health survey initiative. Arch Gen Psychiatry. 2011;68(3):241-251.'
    ]
  },
  {
    id: 'types-bd', title: 'Types of Bipolar Disorder', time: '7 min', difficulty: 'beginner',
    desc: 'Learn the differences between Bipolar I, Bipolar II, Cyclothymia, and related conditions.',
    tags: ['Diagnosis', 'Subtypes'],
    sections: [
      { title: 'Bipolar I', content: '<p>Bipolar I disorder is defined by manic episodes lasting at least 7 days (or requiring hospitalization). Depressive episodes typically occur as well, usually lasting at least 2 weeks.</p><p>Manic episodes involve: elevated or irritable mood, decreased need for sleep, grandiosity, racing thoughts, increased goal-directed activity, and potentially risky behavior. These represent a clear change from baseline functioning.</p>', takeaway: 'Bipolar I is defined by full manic episodes. Depression usually occurs but is not required for diagnosis.' },
      { title: 'Bipolar II', content: '<p>Bipolar II involves hypomanic episodes (less severe than full mania, lasting at least 4 days) and major depressive episodes. Hypomania does not cause the severe impairment or psychosis that mania can.</p><p>Important: Bipolar II is not a "milder" form of BD. The depressive episodes in Bipolar II are often more frequent and severe than in Bipolar I, leading to significant impairment.</p>', takeaway: 'Bipolar II features hypomania and depression. It is not milder -- depression tends to be the dominant challenge.' },
      { title: 'Cyclothymia and Other Presentations', content: '<p>Cyclothymic disorder involves chronic fluctuating mood with periods of hypomanic and depressive symptoms that do not meet full episode criteria. It lasts at least 2 years.</p><p>Other presentations include:</p><ul><li>Bipolar with mixed features (simultaneous manic and depressive symptoms)</li><li>Rapid cycling (4+ episodes per year)</li><li>Bipolar with seasonal pattern</li><li>Substance/medication-induced bipolar</li></ul>', takeaway: 'Bipolar disorder exists on a spectrum. Your specific presentation guides your treatment plan.' }
    ],
    quiz: [
      { q: 'How long must a manic episode last for a Bipolar I diagnosis?', options: ['1 day','4 days','7 days','14 days'], correct: 2 },
      { q: 'Bipolar II is best described as:', options: ['A mild form of BD','Hypomania plus major depression','Only depression','Only hypomania'], correct: 1 },
      { q: 'Rapid cycling is defined as:', options: ['Mood changes within a day','2+ episodes per year','4+ episodes per year','Monthly episodes'], correct: 2 }
    ],
    citations: [
      'American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders. 5th ed. (DSM-5-TR). 2022.',
      'Vieta E, et al. Bipolar disorders. Nat Rev Dis Primers. 2018;4:18008.'
    ]
  },
  {
    id: 'medications', title: 'Medication Overview', time: '10 min', difficulty: 'intermediate',
    desc: 'Understand mood stabilizers, antipsychotics, and other medications commonly used in bipolar disorder treatment.',
    tags: ['Treatment', 'Pharmacology'],
    sections: [
      { title: 'Mood Stabilizers', content: '<p>Mood stabilizers are the cornerstone of BD treatment:</p><ul><li><strong>Lithium</strong> -- The gold standard. Effective for mania, depression prevention, and suicide risk reduction. Requires blood level monitoring.</li><li><strong>Valproate (Depakote)</strong> -- Effective for mania and mixed episodes. Requires liver function and blood level monitoring.</li><li><strong>Lamotrigine (Lamictal)</strong> -- Primarily effective for preventing depressive episodes. Must be titrated slowly to avoid rare but serious rash.</li><li><strong>Carbamazepine</strong> -- Alternative option, especially for those who do not respond to first-line treatments.</li></ul>', takeaway: 'Mood stabilizers are first-line treatment. Each has specific benefits and monitoring requirements.' },
      { title: 'Atypical Antipsychotics', content: '<p>Second-generation antipsychotics play an important role:</p><ul><li><strong>Quetiapine (Seroquel)</strong> -- Used for mania, depression, and maintenance. Can cause sedation and weight gain.</li><li><strong>Olanzapine (Zyprexa)</strong> -- Effective for mania. Significant metabolic side effects.</li><li><strong>Aripiprazole (Abilify)</strong> -- Effective for mania with lower metabolic risk.</li><li><strong>Lurasidone (Latuda)</strong> -- FDA-approved for bipolar depression with favorable metabolic profile.</li></ul><p>Side effects vary significantly between medications. Work with your prescriber to find the best balance of efficacy and tolerability.</p>', takeaway: 'Atypical antipsychotics are commonly used alongside or instead of mood stabilizers. Side effect profiles differ.' },
      { title: 'Important Medication Principles', content: '<p>Key principles for medication management in BD:</p><ul><li>Never stop or change medications without consulting your prescriber</li><li>Medication adherence is the single strongest predictor of stability</li><li>Most medications take 2-6 weeks to reach full effectiveness</li><li>Side effects often improve over time; discuss them with your doctor</li><li>Antidepressants alone can trigger mania and should be used cautiously</li><li>Polypharmacy (multiple medications) is common and sometimes necessary</li><li>Regular blood work may be needed for some medications</li></ul>', takeaway: 'Consistent adherence, patience with onset, and open communication with your prescriber are essential.' }
    ],
    quiz: [
      { q: 'Which medication is considered the gold standard for bipolar disorder?', options: ['Lamotrigine','Lithium','Quetiapine','Fluoxetine'], correct: 1 },
      { q: 'Why must lamotrigine be titrated slowly?', options: ['It causes mania','Risk of serious rash','It is addictive','It interacts with food'], correct: 1 },
      { q: 'Antidepressants in bipolar disorder should be:', options: ['Used as first-line treatment','Used cautiously due to mania risk','Never used','Used at high doses'], correct: 1 }
    ],
    citations: [
      'Yatham LN, et al. Canadian Network for Mood and Anxiety Treatments (CANMAT) and International Society for Bipolar Disorders (ISBD) 2018 guidelines for the management of patients with bipolar disorder. Bipolar Disord. 2018;20(2):97-170.',
      'Geddes JR, Miklowitz DJ. Treatment of bipolar disorder. Lancet. 2013;381(9878):1672-1682.'
    ]
  },
  {
    id: 'therapy', title: 'Therapy Options', time: '9 min', difficulty: 'intermediate',
    desc: 'Explore evidence-based psychotherapies for bipolar disorder including CBT, IPSRT, FFT, and psychoeducation.',
    tags: ['Psychotherapy', 'Treatment'],
    sections: [
      { title: 'Cognitive Behavioral Therapy (CBT)', content: '<p>CBT for bipolar disorder helps identify and change unhelpful thinking patterns and behaviors that can worsen mood episodes. Key components:</p><ul><li>Mood monitoring and early symptom detection</li><li>Challenging cognitive distortions (see the CBT Journal app)</li><li>Behavioral activation during depression</li><li>Activity scheduling and pacing during hypomania</li><li>Medication adherence strategies</li></ul><p>Multiple RCTs show CBT reduces relapse rates and improves functioning when added to medication.</p>', takeaway: 'CBT targets thoughts and behaviors that maintain mood episodes. It is one of the most studied therapies for BD.' },
      { title: 'Interpersonal and Social Rhythm Therapy (IPSRT)', content: '<p>IPSRT, developed by Ellen Frank, combines interpersonal therapy with social rhythm stabilization. It is based on the theory that disrupted daily routines trigger mood episodes in vulnerable individuals.</p><ul><li>Stabilize daily routines (wake, meals, work, social contact, sleep)</li><li>Resolve interpersonal problems that disrupt rhythms</li><li>Grieve the "healthy self" -- the person you might have been without BD</li><li>Manage role transitions and interpersonal conflicts</li></ul><p>See the Social Rhythm Stabilizer app for practical tools.</p>', takeaway: 'IPSRT stabilizes daily routines and resolves interpersonal issues to prevent circadian disruption.' },
      { title: 'Family-Focused Therapy and Psychoeducation', content: '<p><strong>Family-Focused Therapy (FFT)</strong> involves the patient and family members. It includes psychoeducation, communication enhancement, and problem-solving skills training. FFT has been shown to delay relapse and improve symptoms.</p><p><strong>Psychoeducation</strong> (what you are doing now) is recommended as a minimum intervention for all BD patients. Group psychoeducation programs lasting 12-21 sessions have shown significant reductions in relapse rates.</p><p>Other approaches include Dialectical Behavior Therapy (DBT), Mindfulness-Based Cognitive Therapy (MBCT), and peer support programs.</p>', takeaway: 'Family involvement and psychoeducation are first-line recommendations. Multiple therapy types have evidence for BD.' }
    ],
    quiz: [
      { q: 'What is the primary focus of IPSRT?', options: ['Medication management','Dream analysis','Stabilizing daily routines','Exposure therapy'], correct: 2 },
      { q: 'Psychoeducation for BD is recommended by guidelines as:', options: ['An alternative to medication','A last resort','A first-line adjunct treatment','Only for severe cases'], correct: 2 },
      { q: 'Family-Focused Therapy includes all EXCEPT:', options: ['Psychoeducation','Communication training','Hypnosis','Problem-solving skills'], correct: 2 }
    ],
    citations: [
      'Miklowitz DJ, et al. Intensive psychosocial intervention enhances functioning in patients with bipolar depression: results from a 9-month randomized controlled trial. Am J Psychiatry. 2007;164(9):1340-1347.',
      'Frank E, et al. Two-year outcomes for interpersonal and social rhythm therapy in individuals with bipolar I disorder. Arch Gen Psychiatry. 2005;62(9):996-1004.'
    ]
  },
  {
    id: 'triggers', title: 'Triggers and Warning Signs', time: '8 min', difficulty: 'beginner',
    desc: 'Identify common triggers for mood episodes and learn to recognize your personal warning signs.',
    tags: ['Prevention', 'Self-awareness'],
    sections: [
      { title: 'Common Triggers', content: '<p>Mood episodes are often precipitated by identifiable triggers:</p><ul><li><strong>Sleep disruption</strong> -- The most common and potent trigger for both mania and depression</li><li><strong>Stress</strong> -- Major life events (positive or negative) can trigger episodes</li><li><strong>Substance use</strong> -- Alcohol, cannabis, and stimulants destabilize mood</li><li><strong>Medication changes</strong> -- Stopping or changing medications without guidance</li><li><strong>Seasonal changes</strong> -- Many people with BD have seasonal patterns</li><li><strong>Interpersonal conflict</strong> -- Arguments, relationship changes, loss</li><li><strong>Schedule disruption</strong> -- Travel, shift changes, holidays</li></ul>', takeaway: 'Sleep disruption is the single most potent trigger. Knowing your personal triggers enables prevention.' },
      { title: 'Prodromal Warning Signs', content: '<p>Most mood episodes have warning signs (prodromes) that appear days or weeks before the full episode:</p><p><strong>Mania prodromes:</strong> decreased sleep need, increased energy, racing thoughts, talkativeness, increased confidence, impulsive behavior, irritability.</p><p><strong>Depression prodromes:</strong> fatigue, social withdrawal, difficulty concentrating, sleep changes, loss of interest, increased self-criticism, appetite changes.</p><p>Use the Early Warning Signal Detector app to track these systematically.</p>', takeaway: 'Learning to recognize your personal early warning signs is one of the most powerful self-management skills.' },
      { title: 'Building a Prevention Plan', content: '<p>Steps for developing your personal prevention strategy:</p><ul><li>List your known triggers from past episodes</li><li>Identify your personal early warning signs</li><li>Create graded action plans for different severity levels</li><li>Share your plan with your care team and support network</li><li>Practice the plan during stable periods so it becomes automatic</li><li>Review and update your plan after each episode</li></ul>', takeaway: 'A written, shared prevention plan is your most valuable tool against future episodes.' }
    ],
    quiz: [
      { q: 'What is the most common trigger for bipolar mood episodes?', options: ['Work stress','Sleep disruption','Relationship problems','Seasonal changes'], correct: 1 },
      { q: 'Prodromal warning signs appear:', options: ['After the episode','During the episode','Days to weeks before','Years before'], correct: 2 },
      { q: 'A prevention plan should be:', options: ['Kept secret','Written and shared with your care team','Only used during episodes','Changed weekly'], correct: 1 }
    ],
    citations: [
      'Proudfoot J, et al. Mechanisms underpinning effective peer support: a qualitative analysis of interactions between expert peers and patients newly-diagnosed with bipolar disorder. BMC Psychiatry. 2012;12:196.',
      'Lam D, Wong G. Prodromes, coping strategies and psychological interventions in bipolar disorders. Clinical Psychology Review. 2005;25(8):1028-1042.'
    ]
  },
  {
    id: 'sleep-circadian', title: 'Sleep and Circadian Rhythms', time: '9 min', difficulty: 'intermediate',
    desc: 'Understanding the critical relationship between sleep, circadian rhythms, and bipolar mood episodes.',
    tags: ['Sleep', 'Circadian'],
    sections: [
      { title: 'Why Sleep Matters in BD', content: '<p>Sleep and bipolar disorder are deeply interconnected:</p><ul><li>Sleep disruption is both a symptom AND a trigger of mood episodes</li><li>Reduced sleep can trigger mania within days</li><li>Oversleeping can deepen and prolong depression</li><li>The circadian system (body clock) is fundamentally disrupted in BD</li><li>Many BD medications directly affect sleep architecture</li></ul><p>Protecting sleep is arguably the single most important self-management behavior.</p>', takeaway: 'Sleep disruption is both cause and consequence of mood episodes. Protecting sleep is your top priority.' },
      { title: 'Circadian Rhythm Science', content: '<p>Your circadian system runs on a roughly 24-hour cycle controlled by the suprachiasmatic nucleus in the brain. In bipolar disorder:</p><ul><li>The circadian clock may be delayed, advanced, or have reduced amplitude</li><li>Light exposure is the most powerful synchronizer of the body clock</li><li>Social routines (social zeitgebers) help entrain the circadian system</li><li>Disrupted routines desynchronize the clock and trigger mood changes</li></ul><p>See the Circadian Rhythm Analyzer and Chronotherapy Planner apps for practical tools.</p>', takeaway: 'The bipolar brain has an unstable circadian clock. Regular routines and light exposure help keep it aligned.' },
      { title: 'Sleep Hygiene for BD', content: '<p>BD-specific sleep recommendations:</p><ul><li>Keep wake time consistent -- even on weekends (within 30 minutes)</li><li>Aim for 7-9 hours, but do not oversleep even when depressed</li><li>No screens 1 hour before bed (blue light suppresses melatonin)</li><li>Dim lights in the evening to signal bedtime to your brain</li><li>Avoid caffeine after noon and alcohol before bed</li><li>Morning bright light exposure (15-30 minutes) helps set the clock</li><li>If you cannot sleep for 30 minutes, get up and do something calm, then return</li><li>Report any significant sleep changes to your care team immediately</li></ul>', takeaway: 'Consistent wake times, evening dim light, morning bright light, and 7-9 hours of sleep are the foundation.' }
    ],
    quiz: [
      { q: 'Sleep disruption in BD is:', options: ['Only a symptom','Only a trigger','Both a symptom and a trigger','Neither'], correct: 2 },
      { q: 'The most powerful synchronizer of the body clock is:', options: ['Exercise','Food timing','Light exposure','Temperature'], correct: 2 },
      { q: 'The most important sleep habit for BD management is:', options: ['Sleeping 10+ hours','Napping daily','Consistent wake time','Late bedtime'], correct: 2 }
    ],
    citations: [
      'Harvey AG. Sleep and circadian rhythms in bipolar disorder: seeking synchrony, harmony, and regulation. Am J Psychiatry. 2008;165(7):820-829.',
      'Murray G, Harvey A. Circadian rhythms and sleep in bipolar disorder. Bipolar Disord. 2010;12(5):459-472.'
    ]
  },
  {
    id: 'stress', title: 'Stress Management', time: '8 min', difficulty: 'beginner',
    desc: 'Learn stress reduction techniques specifically adapted for bipolar disorder management.',
    tags: ['Coping', 'Wellness'],
    sections: [
      { title: 'Stress and BD', content: '<p>Stress is a major trigger for mood episodes. The stress-vulnerability model of BD suggests that people with the disorder have a lower threshold for stress-triggered mood changes. This means stress management is not optional -- it is a core treatment component.</p><p>Both positive and negative stress can trigger episodes. Promotions, weddings, and vacations can be just as destabilizing as losses, conflicts, and failures.</p>', takeaway: 'People with BD have a lower stress threshold. Both positive and negative stress can trigger episodes.' },
      { title: 'Evidence-Based Techniques', content: '<p>Stress reduction approaches with evidence for BD:</p><ul><li><strong>Mindfulness meditation</strong> -- 10-15 minutes daily reduces rumination and emotional reactivity</li><li><strong>Progressive muscle relaxation</strong> -- Systematic tension-release technique</li><li><strong>Deep breathing</strong> -- 4-7-8 technique (inhale 4 counts, hold 7, exhale 8)</li><li><strong>Regular exercise</strong> -- 30 minutes of moderate activity most days</li><li><strong>Time in nature</strong> -- Even 20 minutes outdoors improves mood and reduces cortisol</li><li><strong>Saying no</strong> -- Boundary-setting is a stress management skill</li></ul><p>Important: avoid intense exercise or stimulating activities if experiencing hypomania/mania signs.</p>', takeaway: 'Daily stress reduction practice is treatment, not luxury. Start with 10 minutes of mindfulness or deep breathing.' },
      { title: 'Building Resilience', content: '<p>Long-term strategies for stress resilience:</p><ul><li>Maintain a consistent daily routine (see Social Rhythm Stabilizer)</li><li>Build a support network and use it before reaching crisis</li><li>Learn to recognize your stress signals early</li><li>Plan ahead for known stressful periods (holidays, deadlines, transitions)</li><li>Practice self-compassion -- BD makes everything harder, and that is valid</li><li>Keep a regular therapy schedule even during stable periods</li></ul>', takeaway: 'Resilience is built through consistent routine, social support, and self-compassion -- not through willpower alone.' }
    ],
    quiz: [
      { q: 'In the stress-vulnerability model of BD:', options: ['Stress causes BD','People with BD have lower stress thresholds','Stress is irrelevant','Only negative stress matters'], correct: 1 },
      { q: 'Which stress technique involves 4-7-8 counting?', options: ['Mindfulness','Progressive muscle relaxation','Deep breathing','Yoga'], correct: 2 },
      { q: 'During hypomania/mania, you should:', options: ['Exercise intensely','Avoid stimulating activities','Take on new projects','Reduce sleep'], correct: 1 }
    ],
    citations: [
      'Deckersbach T, et al. Mindfulness-based cognitive therapy for bipolar disorder. Guilford Press; 2014.',
      'Sylvia LG, et al. Exercise treatment for bipolar disorder: potential mechanisms of action mediated through increased neurogenesis and decreased allostatic load. Psychother Psychosom. 2010;79(2):87-96.'
    ]
  },
  {
    id: 'support', title: 'Building Support Systems', time: '7 min', difficulty: 'beginner',
    desc: 'Create a strong support network and learn how to communicate about bipolar disorder with others.',
    tags: ['Relationships', 'Community'],
    sections: [
      { title: 'Why Support Matters', content: '<p>Research consistently shows that social support is one of the strongest protective factors against relapse in BD:</p><ul><li>People with strong support networks have fewer and shorter episodes</li><li>Social isolation is both a symptom of depression and a risk factor for relapse</li><li>Having someone who understands your warning signs can catch episodes early</li><li>Peer support (from others with BD) provides unique validation and practical advice</li></ul>', takeaway: 'Social support directly reduces relapse risk. Building your network is an investment in stability.' },
      { title: 'Communicating About BD', content: '<p>Telling others about your diagnosis can be challenging. Guidelines:</p><ul><li><strong>Choose timing</strong> -- During a stable period, in a private setting</li><li><strong>Start small</strong> -- You do not need to share everything at once</li><li><strong>Be specific</strong> -- "I have a medical condition that affects my mood and energy" is clear and de-stigmatizing</li><li><strong>Share what helps</strong> -- Tell them how they can support you</li><li><strong>Set boundaries</strong> -- You decide who knows and how much</li><li><strong>Prepare for questions</strong> -- People may have misconceptions</li></ul><p>See the Crisis Planner app for communication templates.</p>', takeaway: 'Disclosure is a personal choice. Start small, be specific, and share what kind of support actually helps.' },
      { title: 'Building Your Team', content: '<p>Your support team might include:</p><ul><li><strong>Professional</strong> -- Psychiatrist, therapist, primary care doctor</li><li><strong>Personal</strong> -- Partner, family member, close friend who understands</li><li><strong>Peer</strong> -- Support group, online community, DBSA or NAMI groups</li><li><strong>Practical</strong> -- Someone who can help with logistics during episodes</li><li><strong>Crisis</strong> -- People designated for emergency contact</li></ul><p>Not everyone needs to fill every role. Even one reliable person makes a significant difference.</p>', takeaway: 'Build a diverse support team: professional, personal, peer, practical, and crisis. Even one person helps.' }
    ],
    quiz: [
      { q: 'What does research say about social support and BD?', options: ['It has no effect','It reduces relapse risk','It replaces medication','It only helps during mania'], correct: 1 },
      { q: 'When communicating about BD, it is best to:', options: ['Tell everyone immediately','Never tell anyone','Choose timing during stable periods','Only disclose during episodes'], correct: 2 },
      { q: 'DBSA and NAMI are examples of:', options: ['Medications','Therapy types','Peer support organizations','Hospitals'], correct: 2 }
    ],
    citations: [
      'Miklowitz DJ. The Bipolar Disorder Survival Guide. 3rd ed. Guilford Press; 2019.',
      'Oud M, et al. Psychological interventions for adults with bipolar disorder: systematic review and meta-analysis. Br J Psychiatry. 2016;208(3):213-222.'
    ]
  }
];

// --- State ---
let completed = new Set(); // module IDs
let bookmarked = new Set(); // module IDs
let quizAnswers = {}; // moduleId -> [answer indices]
let currentFilter = 'all';
let currentModuleId = null;

// Pre-populate: first 2 modules completed for demo
completed.add('what-is-bd');
completed.add('types-bd');
bookmarked.add('sleep-circadian');
bookmarked.add('medications');

// --- Render ---
function renderModuleList() {
  const list = document.getElementById('module-list');
  let filtered = MODULES;
  if (currentFilter === 'bookmarked') filtered = MODULES.filter(m => bookmarked.has(m.id));
  else if (currentFilter === 'completed') filtered = MODULES.filter(m => completed.has(m.id));
  else if (currentFilter === 'incomplete') filtered = MODULES.filter(m => !completed.has(m.id));

  list.innerHTML = filtered.map((m, i) => {
    const done = completed.has(m.id);
    const saved = bookmarked.has(m.id);
    return `
    <div class="module-card ${done ? 'module-card--completed' : ''}" data-id="${m.id}">
      <div class="module-card__body">
        <div class="module-card__meta">
          <span class="module-card__number">${String(MODULES.indexOf(m)+1).padStart(2,'0')}</span>
          <span class="module-card__difficulty module-card__difficulty--${m.difficulty}">${m.difficulty}</span>
          <span class="module-card__time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${m.time}</span>
        </div>
        <h3 class="module-card__title">${m.title}</h3>
        <p class="module-card__desc">${m.desc}</p>
        <div class="module-card__tags">${m.tags.map(t => `<span class="module-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="module-card__actions">
        <button class="bookmark-btn ${saved ? 'bookmark-btn--active' : ''}" data-id="${m.id}" aria-label="${saved ? 'Remove bookmark' : 'Bookmark'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
        <span class="completion-badge ${done ? 'completion-badge--done' : 'completion-badge--pending'}">${done ? 'Done' : 'Start'}</span>
      </div>
    </div>`;
  }).join('');

  // Events
  list.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.bookmark-btn')) return;
      openModule(card.dataset.id);
    });
  });
  list.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (bookmarked.has(id)) bookmarked.delete(id); else bookmarked.add(id);
      updateProgress();
      renderModuleList();
    });
  });

  updateProgress();
}

function updateProgress() {
  document.getElementById('completed-count').textContent = completed.size;
  document.getElementById('progress-fill').style.width = (completed.size / MODULES.length * 100) + '%';
  document.getElementById('bookmark-count').textContent = bookmarked.size;
}

// --- Filters ---
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    currentFilter = btn.dataset.filter;
    renderModuleList();
  });
});

// --- Open Module ---
function openModule(id) {
  currentModuleId = id;
  const m = MODULES.find(mod => mod.id === id);
  if (!m) return;

  document.getElementById('module-list').style.display = 'none';
  document.querySelector('.filter-bar').style.display = 'none';
  document.getElementById('module-view').hidden = false;

  const content = document.getElementById('module-content');
  content.innerHTML = `
    <div class="mc-header">
      <h2 class="mc-header__title">${m.title}</h2>
      <div class="mc-header__meta">
        <span>${m.time} read</span>
        <span>${m.difficulty}</span>
        <span>${m.sections.length} sections</span>
      </div>
    </div>

    ${m.sections.map((s, i) => `
      <div class="mc-section mc-section--open" data-idx="${i}">
        <div class="mc-section__header">
          <span class="mc-section__title">${s.title}</span>
          <svg class="mc-section__toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="mc-section__body">
          <div class="mc-section__text">${s.content}</div>
          <div class="mc-takeaway">
            <div class="mc-takeaway__title">Key Takeaway</div>
            <p class="mc-takeaway__text">${s.takeaway}</p>
          </div>
        </div>
      </div>
    `).join('')}

    <div class="mc-quiz" id="quiz-area">
      <h3 class="mc-quiz__title">Knowledge Check</h3>
      <p class="mc-quiz__desc">Test your understanding with ${m.quiz.length} questions.</p>
      ${m.quiz.map((q, qi) => `
        <div class="quiz-question" data-qi="${qi}">
          <div class="quiz-question__text">${qi+1}. ${q.q}</div>
          <div class="quiz-options">
            ${q.options.map((opt, oi) => `<div class="quiz-option" data-qi="${qi}" data-oi="${oi}">${opt}</div>`).join('')}
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary quiz-submit" id="quiz-submit">Check Answers</button>
      <div id="quiz-result"></div>
    </div>

    <div class="mc-citations">
      <div class="mc-citations__title">References</div>
      ${m.citations.map(c => `<div class="mc-citation">${c}</div>`).join('')}
    </div>
  `;

  // Section toggles
  content.querySelectorAll('.mc-section__header').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('mc-section--open'));
  });

  // Quiz logic
  if (!quizAnswers[id]) quizAnswers[id] = new Array(m.quiz.length).fill(-1);

  content.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const qi = parseInt(opt.dataset.qi);
      const oi = parseInt(opt.dataset.oi);
      quizAnswers[id][qi] = oi;
      content.querySelectorAll(`.quiz-option[data-qi="${qi}"]`).forEach(o => o.classList.remove('quiz-option--selected'));
      opt.classList.add('quiz-option--selected');
    });
  });

  document.getElementById('quiz-submit').addEventListener('click', () => {
    const answers = quizAnswers[id];
    let correct = 0;
    m.quiz.forEach((q, qi) => {
      const options = content.querySelectorAll(`.quiz-option[data-qi="${qi}"]`);
      options.forEach((o, oi) => {
        o.style.pointerEvents = 'none';
        if (oi === q.correct) o.classList.add('quiz-option--correct');
        else if (oi === answers[qi] && answers[qi] !== q.correct) o.classList.add('quiz-option--wrong');
      });
      if (answers[qi] === q.correct) correct++;
    });

    const pct = Math.round(correct / m.quiz.length * 100);
    const pass = pct >= 67;
    document.getElementById('quiz-result').innerHTML = `<div class="quiz-result ${pass ? 'quiz-result--pass' : 'quiz-result--fail'}">${correct}/${m.quiz.length} correct (${pct}%) -- ${pass ? 'Module complete!' : 'Review the material and try again.'}</div>`;

    if (pass) {
      completed.add(id);
      updateProgress();
    }

    document.getElementById('quiz-submit').style.display = 'none';
  });
}

// --- Back Button ---
document.getElementById('back-btn').addEventListener('click', () => {
  document.getElementById('module-view').hidden = true;
  document.getElementById('module-list').style.display = '';
  document.querySelector('.filter-bar').style.display = '';
  currentModuleId = null;
  renderModuleList();
});

// --- Init ---
renderModuleList();
