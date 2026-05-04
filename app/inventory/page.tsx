'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import Link from 'next/link'

interface InventoryItem {
  id: string
  item_name: string
  quantity: number
  price: number
}

export default function InventoryPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('hi')
  const [userId, setUserId] = useState<string>('')
  const [items, setItems] = useState<InventoryItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [newQty, setNewQty] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const t = (key: string) => translations[language]?.[key] || key

  useEffect(() => {
    const loadInventory = async () => {
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

        // Get inventory items
        const { data: itemsData, error } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })

        if (error) throw error
        setItems(itemsData || [])
      } catch (err) {
        console.error('Error loading inventory:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [router])

  const addNewItem = async () => {
    if (!newItem || !newQty || !newPrice) {
      alert(language === 'hi' ? 'सभी फील्ड भरें' : 'Fill all fields')
      return
    }

    setUpdating(true)
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          user_id: userId,
          item_name: newItem,
          quantity: parseInt(newQty),
          price: parseFloat(newPrice),
        })
        .select()
        .single()

      if (error) throw error

      setItems([data, ...items])
      setNewItem('')
      setNewQty('')
      setNewPrice('')
    } catch (err: any) {
      alert(err.message || 'Error adding item')
    } finally {
      setUpdating(false)
    }
  }

  const updateQuantity = async (id: string, delta: number) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    const newQuantity = Math.max(0, item.quantity + delta)

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', id)

      if (error) throw error

      setItems(items.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      ))
    } catch (err: any) {
      alert(err.message || 'Error updating quantity')
    } finally {
      setUpdating(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm(language === 'hi' ? 'क्या आप निश्चित हैं?' : 'Are you sure?')) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter(i => i.id !== id))
    } catch (err: any) {
      alert(err.message || 'Error deleting item')
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="header bg-white border-b border-gray-200">
        <div className="page-container flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-xl">
            ←
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{t('myItems')}</h1>
        </div>
      </div>

      <div className="page-container py-6 pb-24">
        {/* Add New Item Section */}
        <div className="card-large bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t('addNewItem')}</h2>

          <div className="space-y-3">
            {/* Item Name */}
            <div>
              <label className="text-xs text-gray-600 block mb-1">{t('itemName')}</label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'सामान का नाम' : 'Item name'}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">{t('quantity')}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">{t('price')}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <button
              onClick={addNewItem}
              disabled={updating}
              className="btn-success w-full disabled:opacity-50"
            >
              + {t('addItem')}
            </button>
          </div>
        </div>

        {/* Inventory List */}
        {items.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">{language === 'hi' ? 'कोई सामान नहीं' : 'No items yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card space-y-3">
                {/* Item Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.item_name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 text-xs hover:text-red-700 font-semibold"
                  >
                    {t('delete')}
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={updating || item.quantity === 0}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 font-bold text-xl disabled:cursor-not-allowed"
                  >
                    −
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600 text-xs">{language === 'hi' ? 'मात्रा' : 'Qty'}</p>
                    <p className="text-3xl font-bold text-gray-900">{item.quantity}</p>
                  </div>

                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 font-bold text-xl disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                {/* Stock Value */}
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600">{language === 'hi' ? 'कुल मूल्य' : 'Total Value'}</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inventory Summary */}
        {items.length > 0 && (
          <div className="card-large bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'hi' ? 'कुल इन्वेंटरी मूल्य' : 'Total Inventory Value'}
            </h3>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-700">{items.length} {language === 'hi' ? 'वस्तुएं' : 'items'}</span>
              <span className="text-3xl font-bold text-green-700">
                ₹{items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
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
