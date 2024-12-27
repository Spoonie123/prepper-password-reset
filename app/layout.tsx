import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Reset - The Prepper APP',
  description: 'Reset your password for The Prepper APP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}