import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand-mark" aria-label="Go to the Bipolar Wellness Suite homepage">
          <Image src="/logo.png" alt="Spyro Health logo" width={44} height={44} priority />
          <div>
            <div className="brand-mark__eyebrow">Spyro Health</div>
            <div className="brand-mark__title">Bipolar Wellness Suite</div>
          </div>
        </Link>
        <div className="site-header__actions">
          <Link href="/" className="header-link">
            Home
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
