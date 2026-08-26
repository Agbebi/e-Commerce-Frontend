import React, { useEffect, useState, useMemo } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/dispatch/order-slice'
import DispatchOrderDetailsView from './order-details'
import { Dialog } from '../ui/dialog'
import { CiReceipt, CiUser } from 'react-icons/ci'
import { Package, MapPin } from 'lucide-react'
import { formatPriceDisplay } from '@/lib/utils'

function DispatchOrders() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('newest')

    const { orderList, isLoading } = useSelector((state) => state.dispatchOrders)
    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const userId = user?._id || user?.id

    function formatDate(dateStr) {
        if (!dateStr) return ''
        const d = new Date(dateStr)
        if (isNaN(d)) return dateStr
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const filterOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

    const filteredOrders = useMemo(() => {
        let result = [...(orderList || [])]

        if (statusFilter !== 'all') {
            result = result.filter(order => (order.deliveryStatus || 'pending') === statusFilter)
        }

        if (sortOrder === 'newest') {
            result.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
        } else if (sortOrder === 'oldest') {
            result.sort((a, b) => new Date(a.orderDate || 0) - new Date(b.orderDate || 0))
        }

        return result
    }, [orderList, statusFilter, sortOrder])

    useEffect(() => {
        if (userId) {
            dispatch(getAllOrders({ userId, filterParams: statusFilter !== 'all' ? { status: statusFilter } : {}, sortParams: sortOrder }))
        }
    }, [dispatch, userId, statusFilter, sortOrder])

    function handleDetailsView(order) {
        setSelectedOrder(order)
        setOpenDetailsDialog(true)
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            processing: 'bg-blue-50 text-blue-700 border-blue-200',
            shipped: 'bg-purple-50 text-purple-700 border-purple-200',
            delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            cancelled: 'bg-red-50 text-red-700 border-red-200',
        }
        return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'
    }

    return (
        <div className='space-y-6 pb-6'>
            {/* Header */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='space-y-1'>
                        <p className='text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-slate-500'>
                            Dispatch
                        </p>
                        <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight'>
                            All Orders
                        </h1>
                        <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                            Review orders, update delivery status, and manage customer shipments.
                        </p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700'>
                            {orderList?.length || 0} orders total
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters & Sort */}
            <div className='rounded-2xl border border-slate-200 bg-white p-5 sm:p-6'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='flex flex-wrap items-center gap-2'>
                        {filterOptions.map((option) => {
                            const active = statusFilter === option
                            return (
                                <button
                                    key={option}
                                    type='button'
                                    onClick={() => setStatusFilter(option)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                        active
                                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </button>
                            )
                        })}
                    </div>
                    <div className='flex items-center gap-3'>
                        <label htmlFor='dispatch-order-sort' className='text-xs font-medium text-slate-500'>
                            Sort:
                        </label>
                        <select
                            id='dispatch-order-sort'
                            className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300'
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value='newest'>Newest first</option>
                            <option value='oldest'>Oldest first</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {isLoading && !orderList?.length ? (
                <div className='rounded-2xl border border-slate-200 bg-white p-6'>
                    <div className='flex flex-col items-center justify-center py-16 text-center'>
                        <div className='w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4'>
                            <Package className='h-6 w-6 text-slate-400 animate-pulse' />
                        </div>
                        <p className='text-sm text-slate-500'>Loading orders...</p>
                    </div>
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className='space-y-3'>
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className='group border border-slate-200 bg-white rounded-2xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200'
                        >
                            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                                <div className='flex items-start gap-3 sm:gap-4 min-w-0 flex-1'>
                                    <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs sm:text-sm flex-shrink-0'>
                                        #{order._id?.slice(-4)}
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-sm font-semibold text-slate-900'>
                                                Order #{order._id?.slice(-8) || 'N/A'}
                                            </p>
                                            <Badge
                                                className={`${getStatusColor(order.deliveryStatus || 'pending')} text-[10px] font-semibold px-2 py-0.5 rounded-md border-0`}
                                            >
                                                {(order.deliveryStatus || 'pending').charAt(0).toUpperCase() +
                                                    (order.deliveryStatus || 'pending').slice(1)}
                                            </Badge>
                                        </div>
                                        <p className='text-xs text-slate-500 mt-1'>
                                            {formatDate(order.orderDate)}
                                        </p>
                                        <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5'>
                                            <div className='flex items-center gap-1'>
                                                <CiUser className='h-3 w-3 text-slate-400' />
                                                <span className='text-xs text-slate-600'>
                                                    {order.userInfo?.userName || 'N/A'}
                                                </span>
                                            </div>
                                            {order.addressInfo?.address && (
                                                <div className='flex items-center gap-1'>
                                                    <MapPin className='h-3 w-3 text-slate-400' />
                                                    <span className='text-xs text-slate-600 truncate max-w-[140px] sm:max-w-[180px]'>
                                                        {order.addressInfo.address}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-6 flex-shrink-0 mt-2 sm:mt-0'>
                                    <div className='text-left flex sm:flex-col items-center gap-6 sm:gap-0 sm:text-right mb-2 sm:mb-0'>
                                        <p className='text-xs text-slate-500 sm:mb-0.5'>Total</p>
                                        <p className='text-xl font-bold text-slate-900'>
                                            &#8358;{formatPriceDisplay(order.totalAmount || 0)}
                                        </p>
                                    </div>
                                    <Button
                                        size='sm'
                                        onClick={() => handleDetailsView(order)}
                                        className='border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 w-full sm:w-auto'
                                        variant='outline'
                                    >
                                        <CiReceipt className='mr-1' size={14} />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='rounded-2xl border border-slate-200 bg-white p-10 text-center'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-white border border-slate-100 text-slate-400'>
                            <Package className='h-6 w-6' />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-slate-900'>No orders found</p>
                            <p className='text-xs text-slate-500 mt-1'>
                                Orders will appear here once customers start purchasing.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {openDetailsDialog && (
                <Dialog
                    open={openDetailsDialog}
                    onOpenChange={setOpenDetailsDialog}
                    className='bg-white rounded-lg shadow-lg p-4'
                >
                    <DispatchOrderDetailsView
                        selectedOrder={selectedOrder}
                        setOpenDetailsDialog={setOpenDetailsDialog}
                    />
                </Dialog>
            )}
        </div>
    )
}

export default DispatchOrders
