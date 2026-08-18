import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { forgotPassword } from '@/store/auth-slice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    dispatch(forgotPassword(email)).then((data) => {
      if (data?.payload?.success) {
        setIsSubmitted(true)
        toast.success('Password reset link sent to your email')
      } else {
        toast.error(data?.payload?.message || 'Failed to send reset link')
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const inputClassName = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Password Recovery
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot password?</h1>
        <p className="text-slate-500">No worries, we'll send you reset instructions</p>
      </div>

      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 border-3 border-slate-200 border-t-orange-600 rounded-full mb-4"
          />
          <p className="text-slate-500 text-sm font-medium">Sending reset link...</p>
        </div>
      ) : isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="text-orange-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Check your email</h3>
          <p className="text-sm text-slate-600 mb-6">
            We sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>
          </p>
          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to login
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                <Mail className="text-orange-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Enter your email</h3>
                <p className="text-xs text-slate-500">We'll send you a reset link</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClassName + " pl-10"}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Sending...
              </span>
            ) : (
              <>
                Send reset link
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      )}

      <p className="mt-6 text-sm text-slate-600 text-center">
        Remember your password?{' '}
        <Link to="/auth/login" className="font-semibold text-slate-900 hover:text-orange-600 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default ForgotPassword
