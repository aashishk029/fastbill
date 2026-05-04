'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Due {
  id: string
  name: string
  amount: number
  type: 'customer' | 'supplier'
  daysOverdue: number
}

export default function DuesPage() {
  const [activeTab, setActiveTab] = useState<'customer' | 'supplier'>('customer')
  const [dues, setDues] = useState<Due[]>([
    { id: '1', name: 'Customer 1', amount: 5000, type: 'customer', daysOverdue: 5 },
    { id: '2', name: 'Supplier 1', amount: 3000, type: 'supplier', daysOverdue: 0 },
  ])

  const filteredDues = dues.filter((due) => due.type === activeTab)
  const totalDues = filteredDues.reduce((sum, due) => sum + due.amount, 0)

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dues Tracker</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'customer'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Customer Dues
          </button>
          <button
            onClick={() => setActiveTab('supplier')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'supplier'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Supplier Dues
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm">Total {activeTab === 'customer' ? 'Customer' : 'Supplier'} Dues</p>
          <p className="text-3xl font-bold text-blue-600">₹{totalDues.toFixed(2)}</p>
        </div>

        <div className="space-y-3 mb-6">
          {filteredDues.map((due) => (
            <div
              key={due.id}
              className={`border rounded-lg p-4 ${
                due.daysOverdue > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-gray-800">{due.name}</p>
                <p className="text-lg font-bold text-gray-900">₹{due.amount}</p>
              </div>
              {due.daysOverdue > 0 && (
                <p className="text-red-600 text-sm font-semibold">Overdue by {due.daysOverdue} days</p>
              )}
            </div>
          ))}
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
