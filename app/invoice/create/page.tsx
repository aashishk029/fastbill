'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import Link from 'next/link'

interface InvoiceItem {
  id: string
  item_name: string
  quantity: number
  price: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('hi')
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const [customerName, setCustomerName] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', item_name: '', quantity: 0, price: 0 }
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const t = (key: string) => translations[language]?.[key] || key

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        const { data } = await supabase
          .from('users')
          .select('language')
          .eq('id', user.id)
          .single()

        setUserId(user.id)
        if (data) setLanguage(data.language || 'hi')
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const addItem = () => {
    const newId = Date.now().toString()
    setItems([...items, { id: newId, item_name: '', quantity: 0, price: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const handleCreateInvoice = async () => {
    setError('')

    // Validation
    const validItems = items.filter(item => item.item_name && item.quantity > 0 && item.price > 0)
    if (validItems.length === 0) {
      setError(language === 'hi' ? 'कम से कम एक सामान जोड़ें' : 'Add at least one item')
      return
    }

    setSubmitting(true)

    try {
      const total = calculateTotal()
      const today = new Date().toISOString().split('T')[0]

      // Create invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: userId,
          customer_name: customerName || null,
          total_amount: total,
          date: today,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Create invoice items
      const itemsToInsert = validItems.map(item => ({
        invoice_id: invoiceData.id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      // Redirect to invoice view
      router.push(`/invoice/${invoiceData.id}`)
    } catch (err: any) {
      setError(err.message || 'Error creating invoice')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('loading')}</p>
      </div>
    )
  }

  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="header bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="page-container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ←
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{t('createInvoice')}</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="page-container py-6 pb-24">
        {/* Customer Name (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('customerName')} ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})
          </label>
          <input
            type="text"
            placeholder={language === 'hi' ? 'ग्राहक का नाम' : 'Customer name'}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('itemList')}</h2>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="card space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">{language === 'hi' ? 'सामान' : 'Item'} {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 text-xs hover:text-red-700 font-semibold"
                    >
                      {t('delete')}
                    </button>
                  )}
                </div>

                {/* Item Name */}
                <div>
                  <label className="text-xs text-gray-600 block mb-1">{t('itemName')}</label>
                  <input
                    type="text"
                    placeholder={language === 'hi' ? 'दूध, चाय, आदि' : 'Milk, tea, etc.'}
                    value={item.item_name}
                    onChange={(e) => updateItem(item.id, 'item_name', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Quantity and Price in Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">{t('quantity')}</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">{t('price')}</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.price || ''}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Subtotal */}
                {item.quantity > 0 && item.price > 0 && (
                  <div className="text-right text-sm">
                    <span className="text-gray-600">{language === 'hi' ? 'रु' : '₹'}</span>
                    <span className="font-bold text-gray-900 ml-1">
                      {(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            onClick={addItem}
            className="btn-secondary w-full mt-4"
          >
            + {t('addItem')}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Total */}
        {total > 0 && (
          <div className="card-large bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300">
            <div className="flex justify-between items-baseline">
              <span className="text-gray-700 font-semibold">{t('total')}:</span>
              <span className="text-3xl font-bold text-green-700">₹{total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <button
          onClick={handleCreateInvoice}
          disabled={submitting || calculateTotal() === 0}
          className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          {submitting ? t('loading') : t('createBill')}
        </button>
      </div>
    </div>
  )
}
