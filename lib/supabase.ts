import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email?: string
  phone?: string
  shop_name: string
  language: 'hi' | 'en'
  created_at: string
}

export interface Invoice {
  id: string
  user_id: string
  customer_name?: string
  total_amount: number
  created_at: string
  date: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  item_name: string
  quantity: number
  price: number
}

export interface InventoryItem {
  id: string
  user_id: string
  item_name: string
  quantity: number
  price: number
  updated_at: string
}

// Auth helper
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}
