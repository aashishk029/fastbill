import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FastBill - दुकान का बिल',
  description: 'Simple invoice and inventory app for shopkeepers',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-white text-gray-900 font-sans">
        <div className="min-h-screen max-w-md mx-auto bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}
