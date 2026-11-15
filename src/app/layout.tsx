import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Devanagari, Poppins } from 'next/font/google'
import { LanguageProvider } from '@/components/language/LanguageProvider'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import 'lenis/dist/lenis.css'
import './globals.css'
import './premium.css'
import './experience.css'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  fallback: ['system-ui', 'sans-serif'],
})

const notoDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], display: 'swap', variable: '--font-hindi' })

export const metadata: Metadata = {
  title: {
    default: 'Tejas Enterprises | Solar Solutions in Prayagraj',
    template: '%s | Tejas Enterprises',
  },
  description: 'Explore solar solutions for homes, businesses and institutions from Tejas Enterprises in Prayagraj, Uttar Pradesh.',
  authors: [{ name: 'Tejas Enterprises' }],
  creator: 'Tejas Enterprises',
  publisher: 'Tejas Enterprises',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Tejas Enterprises',
    title: 'Tejas Enterprises | Solar Solutions in Prayagraj',
    description: 'Solar solutions for homes, businesses and institutions in Prayagraj.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tejas Enterprises | Solar Solutions in Prayagraj',
    description: 'Solar solutions for homes, businesses and institutions in Prayagraj.',
  },
  icons: { icon: '/images/tejas/logo.jpeg', apple: '/images/tejas/logo.jpeg' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1628' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${notoDevanagari.variable}`}>
      <body id="top" className="min-h-screen bg-white text-navy-900 antialiased">
        <LanguageProvider>
          <SmoothScroll />
          {children}
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function r(){document.querySelectorAll('iframe[src*="netlify"],a[href*="netlify.com"],[data-netlify-badge],[data-netlify-drawer],netlify-drawer,.netlify-badge,#netlify-badge').forEach(function(e){e.remove()});document.querySelectorAll('body > div').forEach(function(d){if(d.querySelector&&d.querySelector('a[href*="netlify"]'))d.remove();})}r();if(typeof MutationObserver!=='undefined'){new MutationObserver(r).observe(document.body,{childList:true,subtree:true})}else{setInterval(r,2000)}})();`,
          }}
        />
      </body>
    </html>
  )
}
