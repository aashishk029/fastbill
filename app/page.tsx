'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">FastBill</h1>
        <h2 className="text-xl text-center mb-6 text-gray-600">दुकान का बिल</h2>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold mb-2">✅ App Router Working!</p>
          <p className="text-green-700 text-sm">Deployment successful</p>
        </div>

        {mounted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Deployed at: {new Date().toLocaleString()}
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Invoice & Inventory Management for Small Shops</p>
        </div>
      </div>
    </div>
  )
}
