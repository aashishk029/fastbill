'use client'

export default function Home() {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
          <h1>FastBill - दुकान का बिल</h1>
          <p>App Router is working!</p>
          <p>Testing deployment: {new Date().toISOString()}</p>
        </div>
      </body>
    </html>
  )
}
