'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Invoice #{params.id}</h1>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Customer Name</p>
              <p className="font-semibold text-gray-900">Sample Customer</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Date</p>
              <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Items</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-800">Item 1</p>
              <p className="font-semibold">₹500</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-blue-600">₹500</p>
        </div>

        <Link
          href="/dashboard"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
