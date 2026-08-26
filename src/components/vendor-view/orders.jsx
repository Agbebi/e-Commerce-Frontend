import React, { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import VendorOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/vendor/order-slice'
import { Badge } from '../ui/badge'
import { formatPriceDisplay } from '@/lib/utils'
import LoadingState from '@/components/ui/loading-state'
import { Package, ArrowUpRight, Filter, ChevronDown } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '../ui/select'

function VendorOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const { user } = useSelector((state) => state.auth)
  const { orderList, isLoading } = useSelector((state) => state.vendorOrders)

  const dispatch = useDispatch()
  const userId = user?.id || user?._id
  const filterOptions = ['all', 'pending', 'packaging', 'accepted', 'ready', 'cancelled']

  const filteredOrders = useMemo(() => {
    let result = [...orderList]

    if (statusFilter !== 'all') {
      result = result.filter(order => order.shippingStatus === statusFilter)
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.payoutDate || 0) - new Date(a.payoutDate || 0))
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.payoutDate || 0) - new Date(b.payoutDate || 0))
    }

    return result
  }, [orderList, statusFilter, sortOrder])

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrders({
        userId,
        filterParams: statusFilter !== 'all' ? { status: statusFilter } : {},
        sortParams: sortOrder
      }))
    }
  }, [dispatch, userId, statusFilter, sortOrder])

  function handleDetailsView(order) {
    setOpenDetailsDialog(true)
    setSelectedOrder(order)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-slate-100 text-slate-700',
      accepted: 'bg-sky-50 text-sky-700',
      packaging: 'bg-violet-50 text-violet-700',
      ready: 'bg-emerald-50 text-emerald-700',
      cancelled: 'bg-red-50 text-red-700',
      processing: 'bg-sky-50 text-sky-700',
      shipped: 'bg-violet-50 text-violet-700',
      completed: 'bg-emerald-50 text-emerald-700',
      delivered: 'bg-emerald-50 text-emerald-700',
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className='space-y-6 pb-6'>
      {/* Header */}
      <div className='rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-6 sm:space-y-5'>
            <p className='text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-slate-500'>Orders</p>
            <h1 className='mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight'>
              All Orders
            </h1>
            <p className='mt-2 text-xs sm:text-sm text-slate-500'>
              Review order activity, update fulfillment, and stay on top of store performance.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700'>
              {orderList?.length || 0} orders total
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='rounded-2xl border border-slate-200 bg-white p-5 sm:p-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-wrap items-center gap-2'>
            {filterOptions.map((option) => (
              <button
                key={option}
                type='button'
                onClick={() => setStatusFilter(option)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  statusFilter === option 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-3'>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className='w-40 rounded-lg border-slate-200 bg-slate-50 text-xs'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent className='w-full bg-white border-slate-200 text-xs'>
                <SelectItem value='newest'>Newest first</SelectItem>
                <SelectItem value='oldest'>Oldest first</SelectItem>
              </SelectContent>
            </Select>
            <span className='text-xs text-slate-500 font-medium'>
              Showing {filteredOrders.length} of {orderList?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading && !orderList?.length ? (
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <LoadingState
            title='Loading orders'
            description='Fetching the latest order activity from your store.'
            className='min-h-[200px]'
          />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className='space-y-3'>
          {filteredOrders.map((order) => (
            <Card 
              key={order._id} 
              className='border border-slate-200 bg-white rounded-2xl hover:shadow-sm transition-shadow'
            >
              <CardContent className='p-5'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs'>
                        #{order._id?.slice(-4)}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>
                          Order #{order._id?.slice(-8) || 'N/A'}
                        </p>
                        <p className='text-xs text-slate-500 mt-0.5'>
                          {order.payoutDate ? new Date(order.payoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-2 ml-[52px]'>
                      <Badge className={`${getStatusColor(order.shippingStatus)} text-[10px] font-semibold px-2 py-0.5 rounded-md border-0`}>
                        {order.shippingStatus ? order.shippingStatus.charAt(0).toUpperCase() + order.shippingStatus.slice(1) : 'Unknown'}
                      </Badge>
                      <Badge className={`${getStatusColor(order.payoutStatus)} text-[10px] font-semibold px-2 py-0.5 rounded-md border-0`}>
                        {order.payoutStatus ? order.payoutStatus.charAt(0).toUpperCase() + order.payoutStatus.slice(1) : 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 sm:gap-6'>
                    <div className='text-right'>
                      <p className='text-xs text-slate-500 mb-0.5'>Total</p>
                      <p className='text-sm font-bold text-slate-900'>₦{formatPriceDisplay(order.subTotal || 0)}</p>
                    </div>
                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          size='sm' 
                          onClick={() => handleDetailsView(order)}
                          className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                          variant='outline'
                        >
                          View <ArrowUpRight className='ml-1 h-3 w-3 rotate-45' />
                        </Button>
                      </DialogTrigger>
                      {openDetailsDialog && selectedOrder?._id === order._id && (
                        <VendorOrderDetailsView 
                          selectedOrder={selectedOrder} 
                          setOpenDetailsDialog={setOpenDetailsDialog} 
                        />
                      )}
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center'>
          <div className='flex flex-col items-center justify-center gap-3'>
            <div className='p-3 rounded-full bg-white border border-slate-100 text-slate-400'>
              <Package className='h-6 w-6' />
            </div>
            <div>
              <p className='text-sm font-medium text-slate-900'>No orders found</p>
              <p className='text-xs text-slate-500 mt-1'>Orders will appear here once customers start purchasing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorOrders
