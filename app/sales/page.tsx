'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import Link from 'next/link'

interface DailyTotal {
  date: string
  total: number
}

export default function SalesPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('hi')
  const [userId, setUserId] = useState<string>('')
  const [todayTotal, setTodayTotal] = useState(0)
  const [last7Days, setLast7Days] = useState<DailyTotal[]>([])
  const [average7Days, setAverage7Days] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const t = (key: string) => translations[language]?.[key] || key

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        setUserId(user.id)

        // Get user language
        const { data: userData } = await supabase
          .from('users')
          .select('language')
          .eq('id', user.id)
          .single()

        if (userData) setLanguage(userData.language || 'hi')

        // Get today's invoices
        const today = new Date().toISOString().split('T')[0]
        const { data: todayData } = await supabase
          .from('invoices')
          .select('total_amount')
          .eq('user_id', user.id)
          .eq('date', today)

        const todaySum = todayData?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0
        setTodayTotal(todaySum)

        // Get last 7 days
        const last7 = []
        const totals: DailyTotal[] = []
        let sum7Days = 0

        for (let i = 0; i < 7; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          last7.push(dateStr)

          const { data: dayData } = await supabase
            .from('invoices')
            .select('total_amount')
            .eq('user_id', user.id)
            .eq('date', dateStr)

          const dayTotal = dayData?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0
          totals.unshift({ date: dateStr, total: dayTotal })
          sum7Days += dayTotal
        }

        setLast7Days(totals)
        setAverage7Days(Math.round(sum7Days / 7))

        // Load notes (stored in localStorage for MVP, will move to DB later)
        const savedNotes = localStorage.getItem(`notes_${today}`)
        if (savedNotes) setNotes(savedNotes)
      } catch (err) {
        console.error('Error loading sales data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`notes_${today}`, notes)
      // TODO: Save to DB when we add a notes table
    } catch (err) {
      console.error('Error saving notes:', err)
    } finally {
      setSaving(false)
    }
  }

  const maxAmount = Math.max(...last7Days.map(d => d.total), todayTotal, 1)
  const scale = maxAmount > 0 ? 100 / maxAmount : 1

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="header bg-white border-b border-gray-200">
        <div className="page-container flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-xl">
            ←
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{t('todaysSales')}</h1>
        </div>
      </div>

      <div className="page-container py-6 pb-20">
        {/* Today's Total (Big and Bold) */}
        <div className="card-large bg-gradient-to-br from-green-500 to-green-600 text-white mb-6">
          <p className="text-sm opacity-90">{language === 'hi' ? 'आज की कमाई' : 'Today Total'}</p>
          <p className="text-5xl font-bold mt-3">₹{todayTotal.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-2">
            {language === 'hi' ? `${last7Days.filter(d => new Date(d.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length || 0} बिल` : 'bills'}
          </p>
        </div>

        {/* 7-Day Average */}
        <div className="card-large bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90">{t('lastSevenDaysAverage')}</p>
          <p className="text-4xl font-bold mt-3">₹{average7Days.toFixed(2)}</p>
        </div>

        {/* Bar Chart (Last 7 Days) */}
        <div className="card-large">
          <h3 className="font-semibold text-gray-900 mb-4">{language === 'hi' ? 'पिछले 7 दिन' : 'Last 7 Days'}</h3>

          <div className="space-y-3">
            {last7Days.map((day, idx) => {
              const dayDate = new Date(day.date)
              const dayName = dayDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                weekday: 'short',
              })
              const barHeight = day.total > 0 ? (day.total * scale) : 5

              return (
                <div key={day.date}>
                  <div className="flex justify-between items-end gap-3">
                    <span className="text-xs text-gray-600 w-8">{dayName}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-full"
                        style={{ width: `${barHeight}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                      ₹{day.total.toFixed(0)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notes Section */}
        <div className="card-large">
          <h3 className="font-semibold text-gray-900 mb-3">{t('notes')}</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={language === 'hi' ? 'आज कैसा दिन रहा?' : 'How was today?'}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:border-blue-600 resize-none h-24"
          />
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className="btn-secondary w-full mt-3 disabled:opacity-50"
          >
            {saving ? t('loading') : t('save')}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="card text-center">
            <p className="text-xs text-gray-600">{language === 'hi' ? 'सर्वश्रेष्ठ दिन' : 'Best Day'}</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ₹{Math.max(...last7Days.map(d => d.total), 0).toFixed(0)}
            </p>
          </div>

          <div className="card text-center">
            <p className="text-xs text-gray-600">{language === 'hi' ? 'कम से कम' : 'Lowest'}</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              ₹{Math.min(...last7Days.filter(d => d.total > 0).map(d => d.total), 0).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Total 7-Day */}
        <div className="card-large bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-200 mt-6">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-700 font-semibold">{language === 'hi' ? '7 दिन की कुल कमाई' : '7-Day Total'}:</span>
            <span className="text-3xl font-bold text-purple-700">
              ₹{(average7Days * 7).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <Link href="/dashboard" className="btn-primary w-full text-center">
          ← {t('back')}
        </Link>
      </div>
    </div>
  )
}
