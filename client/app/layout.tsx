import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuietInk — Write. Breathe. Reflect.',
  description: 'A vintage Royal typewriter journaling experience with AI companion.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise-overlay">{children}</body>
    </html>
  )
}