import React from 'react'
import { motion } from 'framer-motion'
import { IoReceipt } from 'react-icons/io5'
import ShoppingOrders from '@/components/shopping-view/orders'

function ShoppingOrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-[0.03]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <IoReceipt className="text-slate-700" size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Your Orders
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Track and manage your purchases. View order details, payment status, and delivery updates.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 lg:p-8"
        >
          <ShoppingOrders />
        </motion.div>
      </div>
    </div>
  )
}

export default ShoppingOrdersPage