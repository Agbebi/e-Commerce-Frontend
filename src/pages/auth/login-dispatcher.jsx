import { LoginFormControls } from '../../config/index'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginDispatchAgent } from '@/store/auth-slice'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function DispatcherAuthLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function onSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    dispatch(loginDispatchAgent(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(`${data?.payload?.message}`)
        navigate('/dispatch/dashboard')
      } else {
        toast.error(`${data?.payload?.message}`)
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  const inputClassName = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Dispatcher Portal
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Dispatcher</h1>
        <p className="text-slate-500">Sign in to manage your deliveries</p>
      </div>

      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 border-3 border-slate-200 border-t-emerald-600 rounded-full mb-4"
          />
          <p className="text-slate-500 text-sm font-medium">Signing you in...</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Mail className="text-emerald-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Sign in to your dispatcher account</h3>
                <p className="text-xs text-slate-500">Manage your deliveries and routes</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className={inputClassName + " pl-10"}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className={inputClassName + " pl-10 pr-10"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link to="/auth/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Signing in...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      )}

      <div className="mt-6 space-y-2">
        <p className="text-sm text-slate-600 text-center">
          Not registered yet?{' '}
          <Link to="/auth/register-dispatch" className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-slate-600 text-center">
          Not a dispatcher?{' '}
          <Link to="/" className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
            Go to Marketplace
          </Link>
        </p>
      </div>
    </div>
  )
}

export default DispatcherAuthLogin
