'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { translations, Language } from '@/lib/translations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('hi')
  const [step, setStep] = useState<'language' | 'phone' | 'otp' | 'profile'>('language')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [shopName, setShopName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = (key: string) => translations[language]?.[key] || key

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone.replace(/\D/g, '')}`,
      })

      if (error) throw error
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Error sending OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone.replace(/\D/g, '')}`,
        token: otp,
        type: 'sms',
      })

      if (error) throw error
      setStep('profile')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async () => {
    if (!shopName) {
      setError('Please enter shop name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          phone: `+91${phone.replace(/\D/g, '')}`,
          shop_name: shopName,
          language: language,
        })

      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error creating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">📝 FastBill</h1>
          <p className="text-gray-600 text-sm">{language === 'hi' ? 'दुकान का बिल' : 'Shop Invoice'}</p>
        </div>

        {/* Language Selection */}
        {step === 'language' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
              {t('selectLanguage')}
            </h2>

            <button
              onClick={() => {
                setLanguage('hi')
                setStep('phone')
              }}
              className="btn-primary w-full text-center"
            >
              🇮🇳 हिंदी
            </button>

            <button
              onClick={() => {
                setLanguage('en')
                setStep('phone')
              }}
              className="btn-secondary w-full text-center"
            >
              🇬🇧 English
            </button>
          </div>
        )}

        {/* Phone Number Entry */}
        {step === 'phone' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('phoneNumber')}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-semibold">+91</span>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="input-field flex-1"
                maxLength={10}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length !== 10}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('sendOTP')}
            </button>

            <button
              onClick={() => {
                setLanguage('hi')
                setPhone('')
                setError('')
                setStep('language')
              }}
              className="btn-secondary w-full"
            >
              {t('back')}
            </button>
          </div>
        )}

        {/* OTP Entry */}
        {step === 'otp' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('enterOTP')}
            </h2>

            <p className="text-gray-600 text-sm text-center">
              {language === 'hi' ? '6-अंकीय कोड' : '6-digit code'}
            </p>

            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-field text-center text-2xl tracking-widest"
              maxLength={6}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('verifyOTP')}
            </button>

            <button
              onClick={() => setStep('phone')}
              className="btn-secondary w-full"
            >
              {t('back')}
            </button>
          </div>
        )}

        {/* Profile Creation */}
        {step === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('shopName')}
            </h2>

            <input
              type="text"
              placeholder={language === 'hi' ? 'आपकी दुकान का नाम' : 'Your shop name'}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="input-field"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleCreateProfile}
              disabled={loading}
              className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('getStarted')}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>{language === 'hi' ? '₹399/माह' : '₹399/month'}</p>
          <p className="mt-1">{language === 'hi' ? '7 दिन का निःशुल्क परीक्षण' : '7 days free trial'}</p>
        </div>
      </div>
    </div>
  )
}
