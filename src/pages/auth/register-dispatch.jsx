import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerDispatchAgent } from '@/store/auth-slice'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, ArrowLeft, User, Mail, Lock, Phone, CheckCircle2, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

function DispatcherAuthRegister() {
  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    vehicleDetails: {
      vehicleNumber: '',
      vehicleType: ''
    }
  })
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateStep1 = () => {
    const required = ['userName', 'name', 'email', 'password']
    for (const field of required) {
      if (!formData[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}`)
        return false
      }
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  function onSubmit(event) {
    event.preventDefault()
    if (!termsAccepted) {
      toast.error('Please accept the Terms of Service and Privacy Policy')
      return
    }
    setIsSubmitting(true)

    dispatch(registerDispatchAgent(formData)).then((data) => {
      if (data?.payload?.success == true) {
        toast.success('Registration successful!')
        navigate('/auth/login-dispatch')
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
          Dispatcher Registration
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your dispatcher account</h1>
        <p className="text-slate-500">Set up your profile and start delivering</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {step > 1 ? <CheckCircle2 size={16} /> : '1'}
          </div>
          <span className={`text-sm font-medium transition-colors duration-300 ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
            Account
          </span>
        </div>
        <div className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            2
          </div>
          <span className={`text-sm font-medium transition-colors duration-300 ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
            Vehicle Details
          </span>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 border-3 border-slate-200 border-t-emerald-600 rounded-full mb-4"
          />
          <p className="text-slate-500 text-sm font-medium">Creating your account...</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <User className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
                      <p className="text-xs text-slate-500">Create your dispatcher account</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Username *</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                          placeholder="Choose a username"
                          className={inputClassName + " pl-10"}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          className={inputClassName + " pl-10"}
                          required
                        />
                      </div>
                    </div>

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
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Create a strong password"
                          className={inputClassName + " pl-10"}
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Must be at least 6 characters</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold text-sm"
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Truck className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Vehicle & Contact</h3>
                      <p className="text-xs text-slate-500">Tell us about your delivery setup</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="+234 000 000 0000"
                          className={inputClassName + " pl-10"}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Vehicle Type</Label>
                      <div className="relative">
                        <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={formData.vehicleDetails.vehicleType}
                          onChange={(e) => setFormData({
                            ...formData,
                            vehicleDetails: { ...formData.vehicleDetails, vehicleType: e.target.value }
                          })}
                          placeholder="e.g. Motorcycle, Van, Truck"
                          className={inputClassName + " pl-10"}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Vehicle Number</Label>
                      <div className="relative">
                        <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={formData.vehicleDetails.vehicleNumber}
                          onChange={(e) => setFormData({
                            ...formData,
                            vehicleDetails: { ...formData.vehicleDetails, vehicleNumber: e.target.value }
                          })}
                          placeholder="e.g. ABC-123XY"
                          className={inputClassName + " pl-10"}
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked)}
                        className="mt-0.5"
                      />
                      <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                        I agree to the{' '}
                        <Link to="#" className="text-emerald-600 hover:text-emerald-500 font-medium">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="#" className="text-emerald-600 hover:text-emerald-500 font-medium">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-11 font-semibold text-sm"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Creating...
                      </span>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle2 size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-slate-600 text-center pt-2">
            Already have an account?{' '}
            <Link to="/auth/login-dispatch" className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}

export default DispatcherAuthRegister
