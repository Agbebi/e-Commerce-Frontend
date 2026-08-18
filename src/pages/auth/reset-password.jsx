import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetPassword } from '@/store/auth-slice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link')
      navigate('/auth/login')
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)

    dispatch(resetPassword({ token, newPassword: password })).then((data) => {
      if (data?.payload?.success) {
        setIsSuccess(true)
        toast.success('Password reset successful!')
      } else {
        toast.error(data?.payload?.message || 'Failed to reset password')
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const inputClassName = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"

  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Password Reset
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Password updated!</h1>
          <p className="text-slate-500">Your password has been reset successfully</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-emerald-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">All set!</h3>
          <p className="text-sm text-slate-600 mb-6">
            You can now sign in with your new password
          </p>
          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm"
          >
            Sign in
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Reset Password
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create new password</h1>
        <p className="text-slate-500">Enter a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <Lock className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Set your new password</h3>
              <p className="text-xs text-slate-500">Make it strong and secure</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className={inputClassName + " pl-10 pr-10"}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Must be at least 6 characters</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Confirm New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={inputClassName + " pl-10 pr-10"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
              Resetting...
            </span>
          ) : (
            <>
              <CheckCircle2 size={16} className="mr-2" />
              Reset Password
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
