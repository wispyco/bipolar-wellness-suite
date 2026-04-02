import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="section-block">
        <div className="container content-card content-card--centered">
          <span className="eyebrow">Not found</span>
          <h1>This tool page does not exist.</h1>
          <p className="content-card__body">
            The suite homepage has the current list of available wellness tools and blueprint pages.
          </p>
          <Link href="/" className="primary-link">
            Back to the homepage
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
