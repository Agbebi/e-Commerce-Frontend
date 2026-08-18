import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import ShoppingOrderDetails from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, getOrderDetails } from '@/store/shop/order-slice'
import { TbCurrencyNaira } from 'react-icons/tb'
import { IoChevronForward, IoFilter, IoTime, IoCheckmarkCircle, IoCloseCircle, IoReceipt } from 'react-icons/io5'
import { formatPriceDisplay } from '@/lib/utils'
import LoadingState from '@/components/ui/loading-state'

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: IoTime,
    dot: 'bg-amber-500'
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: IoCheckmarkCircle,
    dot: 'bg-emerald-500'
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: IoCloseCircle,
    dot: 'bg-red-500'
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: IoTime,
    dot: 'bg-blue-500'
  }
}

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orderList, orderDetails, isLoading } = useSelector(state => state.shopOrder)

  const userId = user?.id || user?._id
  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ]

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrders({
        userID: userId,
        filterParams: statusFilter !== 'all' ? { status: statusFilter } : {},
        sortParams: sortOrder
      }))
    }
  }, [dispatch, userId, statusFilter, sortOrder])

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId)).then(() => {
      setOpenDetailsDialog(true)
    })
  }

  const totalSpent = orderList?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0
  const pendingCount = orderList?.filter(o => o.paymentStatus === 'pending').length || 0
  const completedCount = orderList?.filter(o => o.paymentStatus === 'completed').length || 0

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card className='border border-slate-100 shadow-sm rounded-2xl p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>Total Orders</p>
              <p className='text-2xl font-bold text-slate-900 mt-1'>{orderList?.length || 0}</p>
            </div>
            <div className='w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center'>
              <IoReceipt className='text-slate-600' size={20} />
            </div>
          </div>
        </Card>
        <Card className='border border-slate-100 shadow-sm rounded-2xl p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>Total Spent</p>
              <p className='text-2xl font-bold text-slate-900 mt-1'>{formatPriceDisplay(totalSpent)}</p>
            </div>
            <div className='w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center'>
              <TbCurrencyNaira className='text-emerald-600' size={20} />
            </div>
          </div>
        </Card>
        <Card className='border border-slate-100 shadow-sm rounded-2xl p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>Pending</p>
              <p className='text-2xl font-bold text-slate-900 mt-1'>{pendingCount}</p>
            </div>
            <div className='w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center'>
              <IoTime className='text-amber-600' size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <IoFilter className='text-slate-400' size={16} />
            <span className='text-xs font-medium text-slate-500 uppercase tracking-wider'>Filter by status</span>
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='shop-order-sort' className='text-xs font-medium text-slate-500'>Sort:</label>
            <select
              id='shop-order-sort'
              className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='newest'>Newest first</option>
              <option value='oldest'>Oldest first</option>
            </select>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type='button'
              onClick={() => setStatusFilter(option.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                statusFilter === option.value
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                  statusFilter === option.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {option.value === 'pending' ? pendingCount : option.value === 'completed' ? completedCount : 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator className='border-slate-100' />

      {/* Orders List */}
      <div className='space-y-4'>
        <AnimatePresence mode='popLayout'>
          {isLoading && !orderList?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='py-10'
            >
              <LoadingState
                title='Loading your orders'
                description='Please wait while we fetch your recent purchases.'
                compact
                className='border-none bg-transparent shadow-none'
              />
            </motion.div>
          ) : orderList && orderList.length > 0 ? (
            orderList.map((order, index) => {
              const status = statusConfig[order.paymentStatus] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='group'
                >
                  <Card className='border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300'>
                    <div className='p-5 sm:p-6'>
                      {/* Order Header */}
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
                        <div className='flex items-center gap-3'>
                          <div className={`w-10 h-10 rounded-xl ${status.color} border flex items-center justify-center`}>
                            <StatusIcon size={20} />
                          </div>
                          <div>
                            <p className='text-sm font-semibold text-slate-900'>Order #{order._id?.slice(-8).toUpperCase()}</p>
                            <p className='text-xs text-slate-500'>{order.orderDate?.slice(0, 10)}</p>
                          </div>
                        </div>
                        <Badge variant='outline' className={`${status.color} border font-medium`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`}></span>
                          {status.label}
                        </Badge>
                      </div>

                      {/* Order Items Preview */}
                      <div className='flex items-center gap-3 mb-4'>
                        <div className='flex -space-x-2'>
                          {order.childOrders?.slice(0, 3).map((childOrder, idx) => (
                            childOrder.cartItems?.slice(0, 1).map((item, itemIdx) => (
                              <div
                                key={item._id || idx}
                                className='w-10 h-10 rounded-lg border-2 border-white bg-slate-100 overflow-hidden shadow-sm'
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            ))
                          ))}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs text-slate-600 truncate'>
                            {order.childOrders?.reduce((sum, co) => sum + (co.cartItems?.length || 0), 0) || 0} items
                          </p>
                          <p className='text-sm font-semibold text-slate-900'>
                            {formatPriceDisplay(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className='flex items-center justify-between pt-4 border-t border-slate-100'>
                        <div className='flex items-center gap-4 text-xs text-slate-500'>
                          <span className='flex items-center gap-1'>
                            <IoCheckmarkCircle size={14} className='text-slate-400' />
                            Payment: {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                          </span>
                          <span className='hidden sm:flex items-center gap-1'>
                            <IoTime size={14} className='text-slate-400' />
                            {order.deliveryStatus?.charAt(0).toUpperCase() + order.deliveryStatus?.slice(1)}
                          </span>
                        </div>
                        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                          <Button
                            onClick={() => handleFetchOrderDetails(order._id)}
                            className='h-8 px-4 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg'
                          >
                            View Details
                            <IoChevronForward size={14} className='ml-1' />
                          </Button>
                          {orderDetails && orderDetails !== null && (
                            <ShoppingOrderDetails setOpenDetailsDialog={setOpenDetailsDialog} />
                          )}
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center py-16'
            >
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 border border-slate-100 mb-4'>
                <IoReceipt className='text-slate-300' size={28} />
              </div>
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>No orders found</h3>
              <p className='text-sm text-slate-500 max-w-sm mx-auto'>
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ShoppingOrders