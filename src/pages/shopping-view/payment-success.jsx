// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { getOrderDetails } from '@/store/shop/order-slice'
import { fetchCartItems } from '@/store/shop/cart-slice'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoCheckmarkCircle, IoCloseCircle, IoTime, IoReceipt, IoHome, IoList } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function PaymentSuccess() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const orderId = sessionStorage.getItem('orderID')
  const hasFetched = useRef(false)

  const [status, setStatus] = useState('processing')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    if (!orderId || hasFetched.current) return
    hasFetched.current = true

    let pollCount = 0
    const maxPolls = 10
    const pollInterval = 2000

    const checkOrderStatus = async () => {
      try {
        const result = await dispatch(getOrderDetails(orderId)).unwrap()
        const paymentStatus = result?.data?.paymentStatus

        if (paymentStatus === 'completed') {
          setStatus('success')
          setMessage('Payment confirmed! Your order has been received.')
          dispatch(fetchCartItems({ userId: user.id }))
        } else if (paymentStatus === 'failed') {
          setStatus('failed')
          setMessage('Payment failed. Please try again or contact support.')
        } else if (pollCount >= maxPolls) {
          setStatus('failed')
          setMessage('Payment verification timed out. Please check your orders for details.')
        } else {
          pollCount++
        }
      } catch {
        if (pollCount >= maxPolls) {
          setStatus('failed')
          setMessage('Something went wrong while verifying your payment.')
        } else {
          pollCount++
        }
      }
    }

    checkOrderStatus()
    const timer = setInterval(checkOrderStatus, pollInterval)
    return () => clearInterval(timer)
  }, [orderId, dispatch, user.id])

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => navigate('/shop/orders'), 4000)
      return () => clearTimeout(timer)
    }
  }, [status, navigate])

  const statusConfig = {
    processing: {
      icon: IoTime,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'Processing Payment',
      subtitle: 'Please wait while we confirm your transaction',
    },
    success: {
      icon: IoCheckmarkCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      title: 'Payment Successful',
      subtitle: 'Your order has been placed successfully',
    },
    failed: {
      icon: IoCloseCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'Payment Failed',
      subtitle: 'We could not verify your payment',
    },
  }

  const current = statusConfig[status] || statusConfig.processing
  const StatusIcon = current.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <Card className={`border ${current.border} bg-white rounded-3xl shadow-sm overflow-hidden`}>
          <div className="p-8 sm:p-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className={`w-20 h-20 rounded-full ${current.bg} flex items-center justify-center`}
              >
                <StatusIcon size={40} className={current.color} />
              </motion.div>
            </div>

            {/* Title & Message */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2"
              >
                {current.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-slate-600 max-w-sm mx-auto"
              >
                {message}
              </motion.p>
            </div>

            {/* Processing Animation */}
            <AnimatePresence>
              {status === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center mb-8"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full"
                    />
                    <span className="text-sm text-slate-600">Verifying payment...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Countdown */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-8"
              >
                <p className="text-xs text-slate-500">
                  Redirecting to orders in <span className="font-semibold text-slate-700">4</span>s...
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {status === 'success' && (
                <Button
                  onClick={() => navigate('/shop/orders')}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold text-sm"
                >
                  <IoList size={16} className="mr-2" />
                  View Orders
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/shop/home')}
                className={`${status === 'success' ? 'flex-1' : 'w-full'} border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-11 font-semibold text-sm`}
              >
                <IoHome size={16} className="mr-2" />
                Continue Shopping
              </Button>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-center gap-2">
            <IoReceipt size={14} className="text-slate-400" />
            <p className="text-xs text-slate-500">
              Reference: <span className="font-mono text-slate-700">{orderId?.slice(-8) || 'N/A'}</span>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default PaymentSuccess
