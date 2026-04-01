# Bipolar Wellness Suite — App Specifications

## Project Structure
- Site deployed at: /home/user/workspace/bipolar-wellness-suite/site/
- GitHub: wispyco/bipolar-wellness-suite
- Each app goes in: site/apps/XX-name/index.html + app.css + app.js
- Shared CSS: site/shared/styles.css
- Hub: site/index.html (update card status from "Coming Soon" to "Active" when app is built)

## Design System
- Primary: #3B5998 (deep calm blue)
- Secondary: #7C6DAF (soft violet)
- Accent: #E8A838 (warm amber for CTAs)
- Success: #5B8C5A (sage green)
- Warning: #D4776B (soft coral)
- Light bg: #FAFAF7, Dark bg: #1A1A2E
- Fonts: Inter (body), DM Serif Display (headings) from Google Fonts
- All apps use Chart.js v4 from CDN where charts are needed
- No localStorage — use in-memory JS state only
- Include sample/demo data so apps look populated
- Dark mode with data-theme attribute
- Navigation back to hub homepage

## Git Config
- user.email: anders@kitson.org
- user.name: Anders Kitson

## App Specs

### App 2: Circadian Rhythm Analyzer (Hour 2)
Based on Social Rhythm Therapy and chronobiology research.
- Sleep log: bedtime, wake time, sleep quality (1-5), naps
- Sleep architecture visualization (bar chart showing sleep windows over time)
- Circadian rhythm score based on consistency of sleep/wake times
- Sleep-mood correlation display (pulls concept from App 1's mood data)
- Social rhythm metric tracking (5 daily anchors: out of bed, first contact, start work/school, dinner, to bed)
- Tips for sleep hygiene based on bipolar-specific research
- Sample data: 14 days showing irregular sleep during episode → stabilizing

### App 3: Cognitive Patterns Journal (Hour 3)
Based on CBT for bipolar disorder (Lam et al., Scott et al.).
- Thought record form: situation, automatic thought, emotion (with intensity 0-100), cognitive distortion type (dropdown of 15 common distortions), alternative thought, new emotion rating
- Cognitive distortion identifier with descriptions
- Pattern analysis: which distortions appear most frequently (pie/bar chart)
- Mood-thought connection view showing how thought patterns relate to mood states
- "Reframe" helper with guided prompts for each distortion type
- Sample data: 10 thought records showing common bipolar cognitive patterns

### App 4: Early Warning Signal Detector (Hour 4)
Based on prodromal symptom monitoring research.
- Personalized warning sign checklist (user can add their own)
- Pre-loaded common prodromal signs for mania (decreased sleep need, increased energy, racing thoughts, etc.) and depression (withdrawal, fatigue, hopelessness, etc.)
- Daily check-in: rate each warning sign 0-3 (absent to severe)
- Color-coded alert system: green (stable), yellow (early warning), orange (escalating), red (crisis level)
- Trend visualization showing warning sign scores over time
- Action plan recommendations based on severity level
- Connects to App 1's mood data conceptually (shows mood alongside warning signs)

### App 5: Social Rhythm Stabilizer (Hour 5)
Based on Interpersonal and Social Rhythm Therapy (IPSRT) by Frank et al.
- Social Rhythm Metric (SRM-5) implementation: 5 daily activities with timing
- Activity scheduler with recurring events
- Rhythm regularity index calculation
- Visual timeline showing daily routine consistency
- Disruption logging: what disrupted the rhythm, impact assessment
- Weekly rhythm stability score
- Tips for maintaining social rhythms specific to bipolar management

### App 6: Medication Adherence Tracker (Hour 6)
Based on medication adherence research in bipolar disorder.
- Medication list manager: name, dose, frequency, time of day
- Daily check-off for each medication
- Side effect logger with severity (1-5) for common BD medication side effects
- Adherence percentage calculation and visualization (weekly/monthly)
- Missed dose tracking and pattern identification
- Side effect trend analysis over time
- Medication effectiveness self-rating (correlate with mood from App 1)

### App 7: Quality of Life Dashboard (Hour 7)
Based on QoL.BD (Quality of Life in Bipolar Disorder) framework — 12 domains.
- 12-domain assessment: Physical, Sleep, Mood, Cognition, Leisure, Social, Spirituality, Finance, Household, Self-esteem, Independence, Identity
- Each domain: 4 Likert-scale questions
- Radar/spider chart showing all 12 domains
- Domain comparison over time (track assessments weekly)
- Strength identification: highlight top domains
- Growth areas: identify domains needing attention
- Action suggestions for each low-scoring domain

### App 8: Psychoeducation Library (Hour 8)
Based on CANMAT/ISBD guidelines psychoeducation recommendations.
- Interactive learning modules on: What is BD, Types of BD, Medication overview, Therapy options, Triggers and warning signs, Sleep and circadian rhythms, Stress management, Building support systems
- Each module: title, reading time, difficulty, expandable sections with key takeaways
- Quiz/knowledge check at end of each module
- Progress tracking (modules completed)
- Research citations and links for each topic
- Bookmark/favorite system

### App 9: Chronotherapy Planner (Hour 9)
Based on ISBD chronotherapy recommendations.
- Bright Light Therapy scheduler: recommended timing, duration, intensity
- Dark Therapy / blue light management planner
- Wake therapy (sleep deprivation therapy) protocols with safety guidelines
- Light exposure log: time, duration, intensity, mood before/after
- Seasonal adjustment recommendations
- Integration with sleep data (conceptual link to App 2)
- Evidence summaries for each chronotherapy approach

### App 10: Crisis & Support Planner (Hour 10)
Based on safety planning research and BD crisis intervention.
- Personal safety plan builder (Stanley & Brown model):
  1. Warning signs
  2. Internal coping strategies
  3. Social contacts for distraction
  4. Professional contacts
  5. Emergency contacts
  6. Making the environment safe
- Emergency resources (crisis hotlines, 988, etc.)
- Support network map (visual representation of support circle)
- Wellness plan: what works for me when depressed/manic
- Communication templates for telling others about your condition
- Quick-access emergency button at top

### App 11: Functional Remediation Exercises (Hour 11)
Based on functional remediation research (Torrent et al.).
- Cognitive training exercises: attention, memory, executive function
- Occupational goal setting and tracking
- Daily functioning self-assessment
- Cognitive exercise games (simple memory match, attention tasks)
- Progress tracking with improvement metrics
- Tips for managing cognitive symptoms of BD
- Work/school accommodation planning tools

### App 12: Integrated Command Center (Hour 12)
The master dashboard pulling concepts from all 11 apps.
- Overview dashboard with key metrics from each app
- Unified timeline showing all data streams
- Cross-correlation insights (mood vs sleep vs medication vs rhythms)
- Weekly wellness report generator
- Export data functionality
- Insights engine highlighting patterns across all domains
- Navigation hub to jump into any specific app

## Homepage Update Instructions
When adding a new app, update the hub at site/index.html:
1. Change the app's `<div class="app-list-card app-list-card--coming">` to `<a href="apps/XX-name/index.html" class="app-list-card app-list-card--active">`
2. Change `</div>` closing tag to `</a>`
3. Replace `<span class="badge badge-coming">Coming Soon</span>` with `<span class="badge badge-active"><svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg> Active</span>`
4. Add arrow SVG to the meta section: `<svg class="app-list-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
5. Update the count in `<span class="hub-list-section__count">X of 12 active</span>`

## Deployment Commands
Deploy to S3 and push to GitHub:
```bash
# 1. Deploy to S3 preview
deploy_website(project_path="/home/user/workspace/bipolar-wellness-suite/site", site_name="Bipolar Wellness Suite", entry_point="index.html")
```

## Git Commands
```bash
cd /home/user/workspace/bipolar-wellness-suite
git config user.email "anders@kitson.org"
git config user.name "Anders Kitson"
git add -A
git commit -m "App X: [name]"
git push origin main
# Use api_credentials=["github"]
```
