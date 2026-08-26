import React, { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IoTime, IoCheckmarkCircle } from 'react-icons/io5'
import { Package } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/dispatch/order-slice'
import { formatPriceDisplay } from '@/lib/utils'

function DispatchDashboard() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { orderList, isLoading } = useSelector((state) => state.dispatchOrders)

    const userId = user?._id || user?.id

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

    useEffect(() => {
        if (userId) {
            dispatch(getAllOrders({ userId }))
        }
    }, [dispatch, userId])

    const stats = {
        total: orderList?.length || 0,
        pending: orderList?.filter(o => (o.deliveryStatus || 'pending') === 'pending').length || 0,
        processing: orderList?.filter(o => (o.deliveryStatus || 'pending') === 'processing').length || 0,
        shipped: orderList?.filter(o => (o.deliveryStatus || 'pending') === 'shipped').length || 0,
        delivered: orderList?.filter(o => (o.deliveryStatus || 'pending') === 'delivered').length || 0,
    }

    return (
        <div className='space-y-6 pb-6'>
            {/* Header */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-slate-500'>
                        Dispatch
                    </p>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight'>
                        Dashboard
                    </h1>
                    <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                        Overview of all orders in the system.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                <Card className='border border-slate-200 bg-white rounded-2xl shadow-sm p-4 sm:p-5'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1'>
                                Total Orders
                            </p>
                            <p className='text-2xl font-bold text-slate-900'>{stats.total}</p>
                        </div>
                        <div className='w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center'>
                            <Package className='h-5 w-5 text-slate-600' />
                        </div>
                    </div>
                </Card>
                <Card className='border border-amber-200 bg-amber-50/30 rounded-2xl shadow-sm p-4 sm:p-5'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-medium text-amber-700 uppercase tracking-wider mb-1'>
                                Pending
                            </p>
                            <p className='text-2xl font-bold text-amber-700'>{stats.pending}</p>
                        </div>
                        <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center'>
                            <IoTime className='h-5 w-5 text-amber-600' />
                        </div>
                    </div>
                </Card>
                <Card className='border border-blue-200 bg-blue-50/30 rounded-2xl shadow-sm p-4 sm:p-5'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-medium text-blue-700 uppercase tracking-wider mb-1'>
                                Processing
                            </p>
                            <p className='text-2xl font-bold text-blue-700'>{stats.processing}</p>
                        </div>
                        <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center'>
                            <IoTime className='h-5 w-5 text-blue-600' />
                        </div>
                    </div>
                </Card>
                <Card className='border border-purple-200 bg-purple-50/30 rounded-2xl shadow-sm p-4 sm:p-5'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-medium text-purple-700 uppercase tracking-wider mb-1'>
                                Shipped
                            </p>
                            <p className='text-2xl font-bold text-purple-700'>{stats.shipped}</p>
                        </div>
                        <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center'>
                            <Package className='h-5 w-5 text-purple-600' />
                        </div>
                    </div>
                </Card>
                <Card className='border border-emerald-200 bg-emerald-50/30 rounded-2xl shadow-sm p-4 sm:p-5'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-[10px] font-medium text-emerald-700 uppercase tracking-wider mb-1'>
                                Delivered
                            </p>
                            <p className='text-2xl font-bold text-emerald-700'>{stats.delivered}</p>
                        </div>
                        <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center'>
                            <IoCheckmarkCircle className='h-5 w-5 text-emerald-600' />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className='border border-slate-200 bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>
                    Recent Orders
                </h3>
                {isLoading ? (
                    <div className='flex flex-col items-center justify-center py-16 text-center'>
                        <Package className='h-6 w-6 text-slate-400 animate-pulse mb-3' />
                        <p className='text-sm text-slate-500'>Loading orders...</p>
                    </div>
                ) : orderList && orderList.length > 0 ? (
                    <div className='space-y-3'>
                        {orderList.slice(0, 8).map((order) => (
                            <div
                                key={order._id}
                                className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors'
                            >
                                <div className='flex items-center gap-3 min-w-0 flex-1'>
                                    <div className='h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs flex-shrink-0'>
                                        #{order._id?.slice(-4)}
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <p className='text-sm font-medium text-slate-900 truncate'>
                                            Order #{order._id?.slice(-8) || 'N/A'}
                                        </p>
                                        <p className='text-xs text-slate-500 truncate'>
                                            {order.userInfo?.userName || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between sm:justify-end gap-3 flex-shrink-0'>
                                    <span className='text-sm font-bold text-slate-900'>
                                        &#8358;{formatPriceDisplay(order.totalAmount || 0)}
                                    </span>
                                    <Badge
                                        className={`${getStatusColor(order.deliveryStatus || 'pending')} text-[10px] font-semibold px-2 py-0.5 rounded-md border-0`}
                                    >
                                        {(order.deliveryStatus || 'pending')
                                            .charAt(0)
                                            .toUpperCase() +
                                            (order.deliveryStatus || 'pending').slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <div className='w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4'>
                            <Package className='h-6 w-6 text-slate-400' />
                        </div>
                        <p className='text-sm text-slate-500'>No orders found</p>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default DispatchDashboard
