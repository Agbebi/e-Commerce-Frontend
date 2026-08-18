import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, updatePassword } from '@/store/auth-slice'
import { toast } from 'sonner'
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function ShoppingAccount() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [profileForm, setProfileForm] = useState({
    name: '',
    userName: '',
    email: '',
    phoneNumber: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingProfile(true)

    dispatch(updateProfile(profileForm)).then((data) => {
      if (data?.payload?.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data?.payload?.message || 'Failed to update profile')
      }
    }).finally(() => {
      setIsSubmittingProfile(false)
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsSubmittingPassword(true)

    dispatch(updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })).then((data) => {
      if (data?.payload?.success) {
        toast.success('Password updated successfully!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(data?.payload?.message || 'Failed to update password')
      }
    }).finally(() => {
      setIsSubmittingPassword(false)
    })
  }

  const inputClassName = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-[0.03]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <User className="text-slate-700" size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Account Settings
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Manage your profile information and update your password
            </p>
          </motion.div>
        </div>
      </div>

      {/* Account Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <Tabs defaultValue="profile" className="w-full">
            <div className="border-b border-slate-100 rounded-t-3xl bg-slate-50/50">
              <TabsList className="w-full justify-start p-0 bg-transparent h-auto">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-slate-900 data-[state=active]:bg-transparent text-slate-500 hover:text-slate-700"
                >
                  <User size={16} />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="password" 
                  className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-slate-900 data-[state=active]:bg-transparent text-slate-500 hover:text-slate-700"
                >
                  <Shield size={16} />
                  Password
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Personal Information</h3>
                <p className="text-sm text-slate-500">Update your account details and public profile</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-700">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        className={inputClassName + " pl-10"}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-700">Username *</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={profileForm.userName}
                        onChange={(e) => setProfileForm({ ...profileForm, userName: e.target.value })}
                        placeholder="Choose a username"
                        className={inputClassName + " pl-10"}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputClassName + " pl-10"}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Changing your email will require re-verification</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      placeholder="+234 000 000 0000"
                      className={inputClassName + " pl-10"}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmittingProfile}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm px-6"
                  >
                    {isSubmittingProfile ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="password" className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Update Password</h3>
                <p className="text-sm text-slate-500">Ensure your account is using a strong, secure password</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">Current Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className={inputClassName + " pl-10 pr-10"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">New Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className={inputClassName + " pl-10 pr-10"}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Must be at least 6 characters</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">Confirm New Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className={inputClassName + " pl-10 pr-10"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm px-6"
                  >
                    {isSubmittingPassword ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Updating...
                      </span>
                    ) : (
                      <>
                        <Shield size={16} className="mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default ShoppingAccount
