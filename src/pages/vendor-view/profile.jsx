import React, { useState, useEffect } from 'react'
import API from '@/api/axios'
import { toast } from 'sonner'
import { Store, FileText, MapPin, Phone, User, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function VendorProfile() {
  const [profileForm, setProfileForm] = useState({
    shopName: '',
    shopDescription: '',
    shopAddress: '',
    phoneNumber: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      accountHolderName: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/api/auth/vendor/profile', {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        })
        if (response.data.success && response.data.data) {
          const data = response.data.data
          setProfileForm({
            shopName: data.shopName || '',
            shopDescription: data.shopDescription || '',
            shopAddress: data.shopAddress || '',
            phoneNumber: data.phoneNumber || '',
            bankDetails: {
              accountNumber: data.bankDetails?.accountNumber || '',
              bankName: data.bankDetails?.bankName || '',
              accountHolderName: data.bankDetails?.accountHolderName || '',
            },
          })
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await API.put('/api/auth/vendor/profile', profileForm, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      })

      if (response.data.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(response.data.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all duration-200"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Vendor Profile</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your shop and banking details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Shop Information */}
          <section className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Shop Information</h2>
              <p className="text-xs text-slate-500 mt-1">Update your shop details and contact information</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">Shop Name</Label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={profileForm.shopName}
                    onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                    placeholder="Your shop name"
                    className={inputClassName + " pl-10"}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    placeholder="+234 000 000 0000"
                    className={inputClassName + " pl-10"}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-xs font-medium text-slate-700">Shop Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={profileForm.shopAddress}
                    onChange={(e) => setProfileForm({ ...profileForm, shopAddress: e.target.value })}
                    placeholder="Your shop address"
                    className={inputClassName + " pl-10"}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-xs font-medium text-slate-700">Shop Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-4 text-slate-400" size={16} />
                  <textarea
                    value={profileForm.shopDescription}
                    onChange={(e) => setProfileForm({ ...profileForm, shopDescription: e.target.value })}
                    placeholder="Tell customers about your shop"
                    className={inputClassName + " pl-10 min-h-[120px] resize-none"}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Banking Details */}
          <section className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Banking Details</h2>
              <p className="text-xs text-slate-500 mt-1">Update your payout and banking information</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">Account Holder Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={profileForm.bankDetails.accountHolderName}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      bankDetails: { ...profileForm.bankDetails, accountHolderName: e.target.value }
                    })}
                    placeholder="Account holder name"
                    className={inputClassName + " pl-10"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">Bank Name</Label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={profileForm.bankDetails.bankName}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      bankDetails: { ...profileForm.bankDetails, bankName: e.target.value }
                    })}
                    placeholder="Bank name"
                    className={inputClassName + " pl-10"}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-xs font-medium text-slate-700">Account Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={profileForm.bankDetails.accountNumber}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      bankDetails: { ...profileForm.bankDetails, accountNumber: e.target.value }
                    })}
                    placeholder="Account number"
                    className={inputClassName + " pl-10"}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm px-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
      </div>
    </div>
  )
}

export default VendorProfile
