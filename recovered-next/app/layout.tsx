import type { Metadata } from 'next'
import { DM_Serif_Display, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' })
const display = DM_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Bipolar Wellness Suite — Spyro Health',
  description:
    'A unified Next.js home for research-backed bipolar wellness tools spanning mood tracking, routines, CBT, medication, psychoeducation, safety planning, and more.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${display.variable}`}>{children}</body>
    </html>
  )
}
