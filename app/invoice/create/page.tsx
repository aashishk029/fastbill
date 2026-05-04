'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateInvoicePage() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0 }])
  const [saving, setSaving] = useState(false)

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }])
  }

  const handleSaveInvoice = async () => {
    setSaving(true)
    // Invoice saving logic would go here
    setTimeout(() => {
      setSaving(false)
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter customer name"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Items</h3>
            {items.map((item, idx) => (
              <div key={idx} className="mb-3">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[idx].description = e.target.value
                    setItems(newItems)
                  }}
                  placeholder="Item description"
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[idx].quantity = parseInt(e.target.value) || 0
                      setItems(newItems)
                    }}
                    placeholder="Qty"
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none"
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[idx].rate = parseFloat(e.target.value) || 0
                      setItems(newItems)
                    }}
                    placeholder="Rate"
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddItem}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold"
          >
            + Add Item
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <button
          onClick={handleSaveInvoice}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 mb-3"
        >
          {saving ? 'Saving...' : 'Save Invoice'}
        </button>

        <Link href="/dashboard" className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-300 font-semibold">
          Cancel
        </Link>
      </div>
    </div>
  )
}
