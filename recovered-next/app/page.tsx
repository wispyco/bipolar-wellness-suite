import Image from 'next/image'

const appCards = [
  {
    id: '01',
    title: 'Mood Spectrum Tracker',
    status: 'Active',
    href: '/apps/01-mood-tracker/index.html',
    summary:
      'Daily mood charting using the Life Chart Method with granular hypomania and depression tracking.',
    tag: 'Life Chart Method',
  },
  {
    id: '02',
    title: 'Circadian Rhythm Analyzer',
    status: 'Active',
    href: '/apps/02-circadian/index.html',
    summary:
      'Track sleep/wake patterns and their impact on mood cycles using chronobiological principles.',
    tag: 'Chronobiology',
  },
  {
    id: '03',
    title: 'Cognitive Patterns Journal',
    status: 'Coming Soon',
    summary:
      'CBT thought records for cognitive restructuring — identify and reframe distorted thinking patterns.',
    tag: 'CBT',
  },
  {
    id: '04',
    title: 'Early Warning Detector',
    status: 'Coming Soon',
    summary: 'Monitor prodromal symptoms to catch episodes early — personalized warning sign tracking.',
    tag: 'Prodromal Detection',
  },
  {
    id: '05',
    title: 'Social Rhythm Stabilizer',
    status: 'Coming Soon',
    summary:
      'IPSRT-based daily routine scheduling to stabilize biological rhythms through consistent social timing.',
    tag: 'IPSRT',
  },
  {
    id: '06',
    title: 'Medication Tracker',
    status: 'Coming Soon',
    summary: 'Adherence logging with side effect monitoring and medication schedule management.',
    tag: 'Adherence',
  },
  {
    id: '07',
    title: 'Quality of Life Dashboard',
    status: 'Coming Soon',
    summary: '12-domain QoL self-assessment based on the validated QoL.BD instrument.',
    tag: 'QoL.BD',
  },
  {
    id: '08',
    title: 'Psychoeducation Library',
    status: 'Coming Soon',
    summary: 'Evidence-based learning modules on bipolar disorder — understanding, managing, thriving.',
    tag: 'Psychoeducation',
  },
  {
    id: '09',
    title: 'Chronotherapy Planner',
    status: 'Coming Soon',
    summary: 'Bright light therapy and sleep phase scheduling based on chronotherapy protocols.',
    tag: 'Chronotherapy',
  },
  {
    id: '10',
    title: 'Crisis & Support Planner',
    status: 'Coming Soon',
    summary: 'Safety planning and support network organization — Stanley-Brown Safety Planning.',
    tag: 'Safety Planning',
  },
  {
    id: '11',
    title: 'Functional Remediation',
    status: 'Coming Soon',
    summary: 'Cognitive training and occupational goal-setting based on neurocognitive rehabilitation.',
    tag: 'Neurocognitive',
  },
  {
    id: '12',
    title: 'Command Center',
    status: 'Coming Soon',
    summary: 'Unified dashboard integrating all tools — your complete bipolar wellness overview.',
    tag: 'Integration',
  },
] as const

const foundations = [
  {
    title: 'Life Chart Method',
    body:
      'Developed at NIMH by Dr. Robert Post, the Life Chart Method provides granular longitudinal tracking of mood states, sleep, medications, and life events — enabling pattern recognition across the illness course.',
  },
  {
    title: 'Evidence-Based Therapies',
    body:
      'Each tool is grounded in validated psychosocial interventions: Cognitive Behavioral Therapy (CBT), Interpersonal and Social Rhythm Therapy (IPSRT), Family-Focused Therapy (FFT), and psychoeducation programs.',
  },
  {
    title: 'Self-Management Science',
    body:
      'Built on the chronic illness self-management framework — helping individuals develop personalized strategies, recognize patterns, and collaborate more effectively with their clinical teams.',
  },
] as const

export default function HomePage() {
  const activeCount = appCards.filter((card) => card.status === 'Active').length

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__backdrop hero__backdrop--top" />
        <div className="hero__backdrop hero__backdrop--bottom" />
        <div className="container hero__content">
          <div className="hero__badge">Spyro Health</div>
          <div className="hero__logoWrap">
            <Image src="/logo.png" alt="Spyro Health logo" width={96} height={96} priority />
          </div>
          <p className="eyebrow">Research-backed digital therapeutics</p>
          <h1>Bipolar Wellness Suite</h1>
          <p className="hero__lede">
            12 evidence-based tools for living well with bipolar disorder. Each app translates
            clinical research into practical daily support — mood tracking, chronobiology, CBT,
            IPSRT, and more.
          </p>
          <div className="hero__meta">
            <span>{activeCount} of 12 live</span>
            <span>Built on validated instruments</span>
            <span>Designed with patients</span>
          </div>
        </div>
      </section>

      <section className="container section-gap">
        <div className="section-heading">
          <p className="eyebrow">Toolkit</p>
          <h2>Recovery of the deployed dashboard</h2>
          <p>
            This Next.js app is a local reconstruction of the public dashboard after the original
            source repository disappeared.
          </p>
        </div>

        <div className="card-grid">
          {appCards.map((card) => {
            const isActive = card.status === 'Active'
            const Wrapper = isActive ? 'a' : 'div'
            const wrapperProps = isActive
              ? { href: card.href, target: '_blank', rel: 'noreferrer' }
              : {}

            return (
              <Wrapper className={`card ${isActive ? 'card--active' : ''}`} key={card.id} {...wrapperProps}>
                <div className="card__topline">
                  <span className={`pill ${isActive ? 'pill--active' : 'pill--muted'}`}>
                    {card.id} {card.status}
                  </span>
                  <span className="tag">{card.tag}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                {isActive ? <span className="card__cta">Open current static prototype →</span> : null}
              </Wrapper>
            )
          })}
        </div>
      </section>

      <section className="container section-gap research">
        <div className="section-heading">
          <p className="eyebrow">Research Foundation</p>
          <h2>Every tool is grounded in peer-reviewed clinical research</h2>
        </div>
        <div className="research__grid">
          {foundations.map((item) => (
            <article className="researchCard" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="container footer">
        <div>
          <strong>Spyro Health</strong>
          <p>
            Educational purposes only. These tools are not a substitute for professional medical
            advice, diagnosis, or treatment. Always consult your healthcare provider. If you are in
            crisis, call or text 988 (Suicide & Crisis Lifeline, US) or go to your nearest
            emergency room.
          </p>
        </div>
        <p className="footer__meta">© 2026 Spyro Health. Open source under MIT License.</p>
      </footer>
    </main>
  )
}
