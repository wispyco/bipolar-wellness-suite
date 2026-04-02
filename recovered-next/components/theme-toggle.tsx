'use client'

import { useEffect, useRef, useState } from 'react'

const sunIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
)

const moonIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3c-.02.28-.03.57-.03.86A9 9 0 0 0 21 12.79Z" />
  </svg>
)

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const userHasToggled = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = (nextTheme: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', nextTheme)
      setTheme(nextTheme)
    }

    apply(mediaQuery.matches ? 'dark' : 'light')

    const onChange = (event: MediaQueryListEvent) => {
      if (!userHasToggled.current) {
        apply(event.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        userHasToggled.current = true
        document.documentElement.setAttribute('data-theme', nextTheme)
        setTheme(nextTheme)
      }}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? sunIcon : moonIcon}
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}
