'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import Link from 'next/link'

interface Invoice {
  id: string
  customer_name?: string
  total_amount: number
  created_at: string
  date: string
}

interface InvoiceItem {
  item_name: string
  quantity: number
  price: number
}

export default function InvoiceViewPage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  const [language, setLanguage] = useState<Language>('hi')
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [shopName, setShopName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const t = (key: string) => translations[language]?.[key] || key

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/')
          return
        }

        // Get user info
        const { data: userData } = await supabase
          .from('users')
          .select('shop_name, language')
          .eq('id', user.id)
          .single()

        if (userData) {
          setShopName(userData.shop_name)
          setLanguage(userData.language || 'hi')
        }

        // Get invoice
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', invoiceId)
          .eq('user_id', user.id)
          .single()

        if (invoiceError) throw invoiceError
        setInvoice(invoiceData)

        // Get invoice items
        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select('item_name, quantity, price')
          .eq('invoice_id', invoiceId)

        if (itemsError) throw itemsError
        setItems(itemsData || [])
      } catch (err: any) {
        setError(err.message || 'Error loading invoice')
      } finally {
        setLoading(false)
      }
    }

    loadInvoice()
  }, [invoiceId, router])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const text = `${shopName}\n${invoice?.customer_name ? `Customer: ${invoice.customer_name}\n` : ''}Total: ₹${invoice?.total_amount.toFixed(2)}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invoice',
          text: text,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text)
      alert(language === 'hi' ? 'कॉपी किया गया' : 'Copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <Link href="/dashboard" className="btn-primary">
            {t('back')}
          </Link>
        </div>
      </div>
    )
  }

  const date = new Date(invoice.created_at)
  const formattedDate = date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')
  const formattedTime = date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="header bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="page-container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ←
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{language === 'hi' ? 'बिल' : 'Invoice'}</h1>
          </div>
        </div>
      </div>

      {/* Invoice Content (Print-friendly) */}
      <div className="page-container py-8 invoice-print max-w-sm">
        {/* Shop Header */}
        <div className="text-center mb-8 border-b-2 border-gray-900 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{shopName}</h1>
          <p className="text-gray-600 text-sm">{language === 'hi' ? 'चालान' : 'Invoice'}</p>
        </div>

        {/* Date & Time */}
        <div className="text-sm text-gray-700 mb-6 space-y-1">
          <div className="flex justify-between">
            <span>{t('date')}:</span>
            <span className="font-semibold">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('time')}:</span>
            <span className="font-semibold">{formattedTime}</span>
          </div>
        </div>

        {/* Customer Name (if exists) */}
        {invoice.customer_name && (
          <div className="text-sm text-gray-700 mb-6 pb-4 border-b border-gray-300">
            <div className="flex justify-between">
              <span>{t('customerName')}:</span>
              <span className="font-semibold">{invoice.customer_name}</span>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="text-left font-bold pb-2">{language === 'hi' ? 'सामान' : 'Item'}</th>
                <th className="text-center font-bold pb-2">{t('quantity')}</th>
                <th className="text-right font-bold pb-2">{t('price')}</th>
                <th className="text-right font-bold pb-2">{language === 'hi' ? 'कुल' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-2">{item.item_name}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-2 font-semibold">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-6 pt-4 border-t-2 border-gray-900">
            <div className="text-right">
              <p className="text-sm text-gray-700">{t('total')}:</p>
              <p className="text-2xl font-bold text-gray-900">₹{invoice.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 pt-6 border-t border-gray-300">
          <p>{t('thankyou')}</p>
          <p className="mt-1">{language === 'hi' ? 'फिर से आएं' : 'Visit again'}</p>
        </div>
      </div>

      {/* Action Buttons (Not printed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto no-print">
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="btn-primary flex-1 text-center"
          >
            🖨️ {t('print')}
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex-1 text-center"
          >
            📤 {t('share')}
          </button>
          <Link href="/dashboard" className="btn-secondary flex-1 text-center">
            ✓ {t('done')}
          </Link>
        </div>
      </div>
    </div>
  )
}
