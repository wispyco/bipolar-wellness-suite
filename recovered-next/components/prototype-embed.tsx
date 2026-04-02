'use client'

import { useEffect, useRef } from 'react'

type PrototypeEmbedProps = {
  src: string
  title: string
}

export function PrototypeEmbed({ src, title }: PrototypeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const syncHeight = () => {
      const iframe = iframeRef.current
      if (!iframe) return

      try {
        const doc = iframe.contentDocument
        const body = doc?.body
        const html = doc?.documentElement
        const height = Math.max(
          body?.scrollHeight ?? 0,
          body?.offsetHeight ?? 0,
          html?.scrollHeight ?? 0,
          html?.offsetHeight ?? 0,
          1400,
        )

        iframe.style.height = `${height + 24}px`
      } catch {
        iframe.style.height = '1600px'
      }
    }

    syncHeight()
    const interval = window.setInterval(syncHeight, 1000)
    window.addEventListener('resize', syncHeight)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('resize', syncHeight)
    }
  }, [])

  return (
    <div className="prototype-frame">
      <iframe ref={iframeRef} src={src} title={title} className="prototype-frame__iframe" />
    </div>
  )
}
