import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Baloo_2, Hind } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const baloo = Baloo_2({ variable: '--font-baloo', subsets: ['latin'] })
const hind = Hind({ variable: '--font-hind', weight: ['400', '600', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Engineer Job Portal - Find Your Dream Job',
  description: 'Browse and apply to engineering job openings from top companies. GATE, Non-GATE, and mixed eligibility jobs.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${hind.variable} bg-background`}>
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" // Place your Publisher ID here
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
