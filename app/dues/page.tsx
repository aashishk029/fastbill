'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import Link from 'next/link'

interface Due {
  id: string
  name: string
  type: 'customer' | 'supplier' // ग्राहक या सप्लायर
  amount: number
  due_date?: string
  notes?: string
  created_at: string
}

export default function DuesPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('hi')
  const [userId, setUserId] = useState<string>('')
  const [dues, setDues] = useState<Due[]>([])
  const [tab, setTab] = useState<'customer' | 'supplier'>('customer') // कौन सा टैब खुला है
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // नया बकाया जोड़ने के लिए
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [showForm, setShowForm] = useState(false)

  const t = (key: string) => translations[language]?.[key] || key

  useEffect(() => {
    const loadDues = async () => {
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

        // Get all dues
        const { data: duesData } = await supabase
          .from('dues')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setDues(duesData || [])
      } catch (err) {
        console.error('Error loading dues:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDues()
  }, [router])

  const addNewDue = async () => {
    if (!newName || !newAmount) {
      alert(language === 'hi' ? 'नाम और रकम भरें' : 'Enter name and amount')
      return
    }

    setUpdating(true)
    try {
      const { data, error } = await supabase
        .from('dues')
        .insert({
          user_id: userId,
          name: newName,
          type: tab,
          amount: parseFloat(newAmount),
          due_date: newDueDate || null,
          notes: newNotes || null,
        })
        .select()
        .single()

      if (error) throw error

      setDues([data, ...dues])
      setNewName('')
      setNewAmount('')
      setNewDueDate('')
      setNewNotes('')
      setShowForm(false)
    } catch (err: any) {
      alert(err.message || 'Error adding due')
    } finally {
      setUpdating(false)
    }
  }

  const markAsPaid = async (id: string) => {
    if (!confirm(language === 'hi' ? 'क्या यह बकाया दे दिया गया?' : 'Mark as paid?')) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('dues')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDues(dues.filter(d => d.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error marking as paid')
    } finally {
      setUpdating(false)
    }
  }

  const updateAmount = async (id: string, newAmount: number) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('dues')
        .update({ amount: newAmount })
        .eq('id', id)

      if (error) throw error

      setDues(dues.map(d => d.id === id ? { ...d, amount: newAmount } : d))
    } catch (err: any) {
      alert(err.message || 'Error updating amount')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('loading')}</p>
      </div>
    )
  }

  // फ़िल्टर करें - केवल चुने गए टाइप के dues दिखाएं
  const filteredDues = dues.filter(d => d.type === tab)

  // कुल बकाया कैलकुलेट करें
  const totalDue = filteredDues.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="header bg-white border-b border-gray-200">
        <div className="page-container flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-xl">
            ←
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {language === 'hi' ? '💰 बकाया' : '💰 Dues'}
          </h1>
        </div>
      </div>

      <div className="page-container py-6 pb-24">
        {/* Tabs: ग्राहक vs सप्लायर */}
        <div className="flex gap-3 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setTab('customer')}
            className={`pb-3 px-2 font-semibold border-b-4 transition-all ${
              tab === 'customer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'hi' ? '👥 ग्राहकों का बकाया' : '👥 Customer Dues'}
          </button>
          <button
            onClick={() => setTab('supplier')}
            className={`pb-3 px-2 font-semibold border-b-4 transition-all ${
              tab === 'supplier'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'hi' ? '🏭 सप्लायर का बकाया' : '🏭 Supplier Dues'}
          </button>
        </div>

        {/* कुल बकाया दिखाएं */}
        <div className={`card-large mb-6 ${
          tab === 'customer'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
            : 'bg-gradient-to-r from-orange-500 to-orange-600'
        } text-white`}>
          <p className="text-sm opacity-90">
            {tab === 'customer'
              ? language === 'hi' ? 'ग्राहकों से कुल बकाया' : 'Total Customer Dues'
              : language === 'hi' ? 'सप्लायर को कुल देना' : 'Total Supplier Dues'
            }
          </p>
          <p className="text-4xl font-bold mt-3">₹{totalDue.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-2">
            {filteredDues.length} {language === 'hi' ? 'लोग' : 'people'}
          </p>
        </div>

        {/* नया बकाया जोड़ने का फॉर्म */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary w-full mb-6"
          >
            + {tab === 'customer'
              ? (language === 'hi' ? 'ग्राहक का बकाया' : 'Add Customer Due')
              : (language === 'hi' ? 'सप्लायर का बकाया' : 'Add Supplier Due')
            }
          </button>
        ) : (
          <div className="card-large bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              {tab === 'customer'
                ? language === 'hi' ? 'ग्राहक का बकाया जोड़ें' : 'Add Customer Due'
                : language === 'hi' ? 'सप्लायर का बकाया जोड़ें' : 'Add Supplier Due'
              }
            </h2>

            <div className="space-y-3">
              {/* नाम */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  {tab === 'customer'
                    ? language === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'
                    : language === 'hi' ? 'सप्लायर का नाम' : 'Supplier Name'
                  }
                </label>
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'नाम' : 'Name'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* रकम */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  {language === 'hi' ? 'रकम' : 'Amount'} (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* डू डेट */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  {language === 'hi' ? 'कब तक?' : 'Due Date'} ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* नोट्स */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  {language === 'hi' ? 'नोट्स' : 'Notes'} ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})
                </label>
                <textarea
                  placeholder={language === 'hi' ? 'कारण या विवरण' : 'Reason or details'}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:border-blue-600 resize-none h-20"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addNewDue}
                  disabled={updating}
                  className="btn-success flex-1 disabled:opacity-50"
                >
                  {updating ? t('loading') : t('save')}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setNewName('')
                    setNewAmount('')
                    setNewDueDate('')
                    setNewNotes('')
                  }}
                  className="btn-secondary flex-1"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* बकाया की सूची */}
        {filteredDues.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">
              {tab === 'customer'
                ? language === 'hi' ? 'कोई ग्राहक बकाया नहीं' : 'No customer dues'
                : language === 'hi' ? 'कोई सप्लायर बकाया नहीं' : 'No supplier dues'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDues.map((due) => {
              const isOverdue = due.due_date && new Date(due.due_date) < new Date()
              return (
                <div
                  key={due.id}
                  className={`card ${isOverdue ? 'border-2 border-red-400' : ''}`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{due.name}</h3>
                      {due.due_date && (
                        <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                          {language === 'hi' ? 'कब तक:' : 'Due:'} {new Date(due.due_date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                          {isOverdue && ` ⚠️ ${language === 'hi' ? 'देर हो गई!' : 'OVERDUE!'}`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => markAsPaid(due.id)}
                      className="text-green-600 text-sm hover:text-green-700 font-semibold px-2 py-1 bg-green-100 rounded"
                    >
                      {language === 'hi' ? '✓ दे दिया' : '✓ Paid'}
                    </button>
                  </div>

                  {/* Amount */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center justify-between">
                    <p className="text-gray-600 text-sm">{language === 'hi' ? 'रकम:' : 'Amount:'}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateAmount(due.id, Math.max(0, due.amount - 100))}
                        className="text-red-600 px-2 py-1 hover:bg-red-100 rounded"
                      >
                        −
                      </button>
                      <p className="text-2xl font-bold text-gray-900 w-24 text-center">₹{due.amount.toFixed(2)}</p>
                      <button
                        onClick={() => updateAmount(due.id, due.amount + 100)}
                        className="text-green-600 px-2 py-1 hover:bg-green-100 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {due.notes && (
                    <p className="text-xs text-gray-600 italic">💬 {due.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Important Info */}
        <div className="card mt-8 bg-blue-50 border-2 border-blue-200">
          <p className="text-sm font-semibold text-blue-900">
            {language === 'hi' ? '📞 महीने के आखिरी दिन रिमाइंडर' : '📞 End-of-Month Reminder'}
          </p>
          <p className="text-xs text-blue-700 mt-2">
            {language === 'hi'
              ? 'Phase 2 में आप अपने सभी बकायों को हर महीने के आखिरी दिन WhatsApp पर अपने ग्राहकों और सप्लायरों को स्वचालित संदेश भेज सकेंगे।'
              : 'In Phase 2, you can send automatic WhatsApp reminders to customers and suppliers on the last day of each month.'
            }
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <Link href="/dashboard" className="btn-primary w-full text-center">
          ← {t('back')}
        </Link>
      </div>
    </div>
  )
}
