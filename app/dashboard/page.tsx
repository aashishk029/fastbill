'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  id: string
  shop_name: string
  language: Language
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [language, setLanguage] = useState<Language>('hi')
  const [loading, setLoading] = useState(true)

  const t = (key: string) => translations[language]?.[key] || key

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          router.push('/')
          return
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error) throw error

        setUser(data)
        setLanguage(data.language || 'hi')
      } catch (err) {
        console.error('Error loading user:', err)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner w-12 h-12 mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="header bg-white border-b border-gray-200">
        <div className="page-container flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">📝 FastBill</h1>
            <p className="text-sm text-gray-600">{user.shop_name}</p>
          </div>
          <div className="flex gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="hi">हिंदी</option>
              <option value="en">English</option>
            </select>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-8 space-y-4">
        {/* Welcome Message */}
        <div className="card-large bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90">
            {language === 'hi' ? 'आज कितना हुआ?' : 'How much today?'}
          </p>
          <p className="text-3xl font-bold mt-2">₹0</p>
          <p className="text-xs opacity-75 mt-2">
            {language === 'hi' ? 'अभी कोई बिल नहीं' : 'No bills yet'}
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-4 pt-4">
          {/* New Invoice Button */}
          <Link href="/invoice/create" className="block">
            <div className="btn-primary w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-center">
              <span className="text-2xl">📝</span>
              <p className="text-lg font-bold">{t('newInvoice')}</p>
              <p className="text-xs opacity-90">
                {language === 'hi' ? 'नया बिल बनाएं' : 'Create new bill'}
              </p>
            </div>
          </Link>

          {/* Today's Sales Button */}
          <Link href="/sales" className="block">
            <div className="btn-primary w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-center">
              <span className="text-2xl">📊</span>
              <p className="text-lg font-bold">{t('todaysSales')}</p>
              <p className="text-xs opacity-90">
                {language === 'hi' ? 'आज की कमाई देखें' : 'View today earnings'}
              </p>
            </div>
          </Link>

          {/* Inventory Button */}
          <Link href="/inventory" className="block">
            <div className="btn-primary w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-center">
              <span className="text-2xl">📦</span>
              <p className="text-lg font-bold">{t('myItems')}</p>
              <p className="text-xs opacity-90">
                {language === 'hi' ? 'सामान ट्रैक करें' : 'Track inventory'}
              </p>
            </div>
          </Link>

          {/* Dues Button (नया) */}
          <Link href="/dues" className="block">
            <div className="btn-primary w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-center">
              <span className="text-2xl">💰</span>
              <p className="text-lg font-bold">{language === 'hi' ? 'बकाया' : 'Dues'}</p>
              <p className="text-xs opacity-90">
                {language === 'hi' ? 'ग्राहक & सप्लायर बकाया' : 'Customer & Supplier Dues'}
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Info Section */}
        <div className="card space-y-3 mt-8">
          <h3 className="font-semibold text-gray-900">💡 {language === 'hi' ? 'जानकारी' : 'Tips'}</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ {language === 'hi' ? '5 सेकंड में बिल बनाएं' : 'Create bill in 5 seconds'}</li>
            <li>✓ {language === 'hi' ? 'सामान को ट्रैक करें' : 'Track your items'}</li>
            <li>✓ {language === 'hi' ? 'आज की कमाई देखें' : 'See today earnings'}</li>
            <li>✓ {language === 'hi' ? 'सब कुछ बादल में सेव होता है' : 'Everything saved in cloud'}</li>
          </ul>
        </div>

        {/* Help Footer */}
        <div className="text-center py-4 text-xs text-gray-500">
          <p>{language === 'hi' ? 'मदद के लिए WhatsApp करें' : 'Need help? WhatsApp us'}</p>
          <a href="https://wa.me/919999999999" className="text-blue-600 hover:underline">
            +91 99999 99999
          </a>
        </div>
      </div>
    </div>
  )
}
