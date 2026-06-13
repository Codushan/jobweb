import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Hind } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const baloo = Baloo_2({ variable: '--font-baloo', subsets: ['latin'] })
const hind = Hind({ variable: '--font-hind', weight: ['400', '600', '700'], subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'EngineerNaukri – PSU & Govt Engineering Jobs Portal | GATE & Non-GATE',
  description: 'Find latest PSU, Central Govt, Defence, Railway & State Govt engineering job openings. GATE and Non-GATE jobs for B.Tech/BE graduates. Apply directly.',
  keywords: 'PSU jobs, engineering jobs, GATE jobs, government jobs for engineers, BHEL recruitment, DRDO recruitment, Railway engineering jobs, B.Tech jobs',
  verification: {
    google: 'XhNU-wKDOrj4x3Ba14LsYiTkUSrgazMU9EOcAYiX3Bc',
  },
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
  openGraph: {
    title: 'EngineerNaukri – PSU & Govt Engineering Jobs Portal',
    description: 'Find latest PSU, Central Govt, Defence & Railway engineering jobs. GATE and Non-GATE openings for B.Tech/BE graduates.',
    url: 'https://engineersjob.netlify.app',
    siteName: 'EngineerNaukri',
    type: 'website',
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
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LVGCNRXSHX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LVGCNRXSHX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
