'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [shopName, setShopName] = useState('My Shop')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const menuItems = [
    { title: 'Create Invoice', href: '/invoice/create', icon: '📄', color: 'bg-blue-50' },
    { title: "Today's Sales", href: '/sales', icon: '📊', color: 'bg-green-50' },
    { title: 'Inventory', href: '/inventory', icon: '📦', color: 'bg-yellow-50' },
    { title: 'Customer Dues', href: '/dues', icon: '💰', color: 'bg-red-50' },
  ]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{shopName}</h1>
          <p className="text-gray-600 mt-2">दुकान का बिल</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.color} border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
            </Link>
          ))}
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full mt-8 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
