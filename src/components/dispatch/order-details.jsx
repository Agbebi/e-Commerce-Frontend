import React, { useEffect, useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { deliverOrder, deliverOrderConfirmed, getAllOrders, getOrderDetails, updateOrderStatus } from '../../store/dispatch/order-slice'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { IoLocation, IoPerson, IoReceipt, IoTime, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { formatPriceDisplay } from '@/lib/utils'

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: IoTime },
    processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: IoTime },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', icon: IoTime },
    delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: IoCheckmarkCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', icon: IoCloseCircle },
}

const initialFormData = {
    status: ''
}

function DispatchOrderDetailsView({ selectedOrder, setOpenDetailsDialog }) {

    const { user } = useSelector((state) => state.auth)
    const { orderDetails } = useSelector((state) => state.dispatchOrders)

    const dispatch = useDispatch()
    const [formData, setFormData] = useState(initialFormData)

    function handleStatusChange(e) {
        e.preventDefault()

        const updatedStatus = formData.status

        dispatch(updateOrderStatus({ orderId: selectedOrder._id, updatedStatus })).then((data) => {
            if (data.payload.success) {
                setFormData({ status: '' })
                setOpenDetailsDialog(false)
                dispatch(getAllOrders(user._id || user.id))
                toast.success('Order status updated successfully!')
            } else {
                toast.error('Failed to update order status!')
            }
        })
    }

    function isDelivered() {
        return selectedOrder.deliveryStatus === 'delivered'
    }

    useEffect(() => {
        const childOrders = selectedOrder ? selectedOrder.childOrders : []
        if (user?.id && childOrders.length > 0) {
            dispatch(getOrderDetails({ id: user.id, childOrders }))
        }
    }, [dispatch, user.id, selectedOrder])

    return (
        selectedOrder ? (
            <DialogContent className='w-full max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white border border-slate-200 shadow-2xl rounded-3xl p-0'>
                {/* Header */}
                <div className='sticky top-0 z-10 bg-white border-b border-slate-100 px-6 sm:px-8 py-5 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center'>
                            <IoReceipt className='text-white' size={20} />
                        </div>
                        <div>
                            <h2 className='text-lg font-bold text-slate-900'>Order Details</h2>
                            <p className='text-xs text-slate-500'>Order #{selectedOrder._id?.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                <div className='p-6 sm:p-8 space-y-6'>
                    {/* Delivery Status Card */}
                    <div className='flex items-center gap-3 p-4 rounded-2xl border bg-slate-50 border-slate-100'>
                        <div className='w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center'>
                            {(() => {
                                const config = statusConfig[selectedOrder.deliveryStatus] || statusConfig.pending
                                const Icon = config.icon
                                return <Icon size={20} className='text-slate-600' />
                            })()}
                        </div>
                        <div>
                            <p className='text-xs font-medium opacity-80'>Delivery Status</p>
                            <p className='text-sm font-bold text-slate-900'>
                                {(selectedOrder.deliveryStatus || 'pending').charAt(0).toUpperCase() +
                                    (selectedOrder.deliveryStatus || 'pending').slice(1)}
                            </p>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
                        <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>
                            Order Information
                        </h3>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <p className='text-xs text-slate-500 mb-1'>Order ID</p>
                                <p className='text-sm font-medium text-slate-900 font-mono break-all'>
                                    {selectedOrder._id || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className='text-xs text-slate-500 mb-1'>Order Date</p>
                                <p className='text-sm font-medium text-slate-900'>
                                    {selectedOrder.orderDate
                                        ? new Date(selectedOrder.orderDate).toLocaleString(undefined, {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className='text-xs text-slate-500 mb-1'>Total Amount</p>
                                    <p className='text-sm font-bold text-slate-900'>
                                        &#8358;{formatPriceDisplay(selectedOrder.totalAmount || 0)}
                                    </p>
                            </div>
                            <div>
                                <p className='text-xs text-slate-500 mb-1'>Total Items</p>
                                <p className='text-sm font-medium text-slate-900'>
                                    {orderDetails && orderDetails.length > 0
                                        ? orderDetails.reduce(
                                                (sum, co) => sum + (co.cartItems?.length || 0),
                                                0
                                            ) + ' items'
                                        : '0 items'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info & Delivery Address */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <div className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
                            <div className='flex items-center gap-2 mb-3'>
                                <IoPerson className='text-slate-600' size={16} />
                                <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                    Customer Information
                                </h3>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-sm font-medium text-slate-900'>
                                    {selectedOrder.userInfo?.userName || 'N/A'}
                                </p>
                                <p className='text-sm text-slate-600'>
                                    {selectedOrder.userInfo?.userEmail || 'N/A'}
                                </p>
                                <p className='text-sm text-slate-600'>
                                    {selectedOrder.userInfo?.userMobile ||
                                        selectedOrder.addressInfo?.phoneNumber ||
                                        'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
                            <div className='flex items-center gap-2 mb-3'>
                                <IoLocation className='text-slate-600' size={16} />
                                <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                                    Delivery Address
                                </h3>
                            </div>
                            {selectedOrder.addressInfo ? (
                                <div className='space-y-1'>
                                    <p className='text-sm text-slate-900'>
                                        {selectedOrder.addressInfo.address || 'N/A'}
                                    </p>
                                    <p className='text-sm text-slate-600'>
                                        {[
                                            selectedOrder.addressInfo.city,
                                            selectedOrder.addressInfo.state,
                                            selectedOrder.addressInfo.postalCode,
                                        ]
                                            .filter(Boolean)
                                            .join(', ') || 'N/A'}
                                    </p>
                                    <p className='text-sm text-slate-600'>
                                        {selectedOrder.addressInfo.country || 'N/A'}
                                    </p>
                                    {selectedOrder.addressInfo.phoneNumber && (
                                        <p className='text-sm text-slate-600'>
                                            {selectedOrder.addressInfo.phoneNumber}
                                        </p>
                                    )}
                                    {selectedOrder.addressInfo.notes && (
                                        <p className='text-sm text-slate-600'>
                                            <span className='font-medium'>Notes:</span>{' '}
                                            {selectedOrder.addressInfo.notes}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className='text-sm text-slate-500'>
                                    No delivery address available for this order.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>
                            Product Details
                        </h3>
                        {orderDetails && orderDetails.length > 0 ? (
                            <div className='space-y-4'>
                                {orderDetails.map((product, idx) => (
                                    <div
                                        key={product._id || idx}
                                        className='border border-slate-100 rounded-2xl p-3 sm:p-4 bg-slate-50/50'
                                    >
                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs mb-2 sm:mb-3'>
                                            <div className='flex items-center gap-2'>
                                                <Badge
                                                    className={`${
                                                        statusConfig[product.deliveryStatus || 'pending']?.color ||
                                                        'bg-slate-100 text-slate-700 border-slate-200'
                                                    } text-[10px] font-semibold px-2 py-0.5 rounded-md border-0`}
                                                >
                                                    {(product.deliveryStatus || 'pending')
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        (product.deliveryStatus || 'pending').slice(1)}
                                                </Badge>
                                                <span className='font-semibold text-slate-700 truncate'>
                                                    {product.vendorId?.shopName ||
                                                        (product.vendorId?._id
                                                            ? 'Vendor #' + product.vendorId._id.slice(-4)
                                                            : 'Vendor')}
                                                </span>
                                            </div>
                                            {product.vendorId?.phoneNumber && (
                                                <span className='text-slate-600'>
                                                    {product.vendorId.phoneNumber}
                                                </span>
                                            )}
                                        </div>

                                        {product.cartItems && product.cartItems.length > 0 ? (
                                            <div className='grid grid-cols-1 gap-2 text-xs w-full'>
                                                {product.cartItems.map((item) => (
                                                    <div
                                                        key={item._id || item.productId}
                                                        className='flex flex-row justify-between items-center gap-2 p-2 w-full bg-white rounded-lg border border-slate-100'
                                                    >
                                                        <div className='flex flex-col w-full min-w-0'>
                                                            <span className='font-semibold text-gray-800 truncate'>
                                                                {item.name}
                                                            </span>
                                                            <span className='text-slate-500'>
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                        <div className='flex items-center gap-1 text-right flex-shrink-0'>
                                                            <span className='font-semibold text-slate-900'>
                                                                &#8358;{formatPriceDisplay(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='text-xs text-slate-500'>
                                                No products found for this vendor.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-sm text-slate-500'>
                                No products found for this order.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className='space-y-2 pt-2'>
                        <CommonForm
                            formControls={[
                                {
                                    name: 'status',
                                    label: 'Update Delivery Status',
                                    placeholder: 'Select Status',
                                    componentType: 'select',
                                    options: [
                                        { name: 'pending', value: 'pending', label: 'Pending' },
                                        { name: 'processing', value: 'processing', label: 'Processing' },
                                        { name: 'shipped', value: 'shipped', label: 'Shipped' },
                                        { name: 'cancelled', value: 'cancelled', label: 'Cancelled' },
                                    ]
                                }
                            ]}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={'Update Status'}
                            onSubmit={handleStatusChange}
                            buttonDisabled={isDelivered()}
                            className='text-xs'
                        />

                        {user.role === 'dispatch' &&
                            selectedOrder.deliveryStatus !== 'delivered' && (
                                <Button
                                    onClick={() =>
                                        dispatch(deliverOrder(selectedOrder._id)).then(
                                            (data) => {
                                                if (data.payload?.success) {
                                                    const digits = data.payload.data
                                                    let otp = prompt(
                                                        "What's the OTP sent to the customer's phone number for order confirmation?"
                                                    )
                                                    if (otp === digits.toString()) {
                                                        dispatch(
                                                            deliverOrderConfirmed(selectedOrder._id)
                                                        ).then((response) => {
                                                            console.log(response)
                                                            toast.success(
                                                                'OTP verified successfully! Order marked as delivered.'
                                                            )
                                                            setFormData({ status: '' })
                                                            setOpenDetailsDialog(false)
                                                            dispatch(
                                                                getAllOrders(user._id || user.id)
                                                            )
                                                        })
                                                    } else {
                                                        toast.error(
                                                            'Incorrect OTP. Please try again.'
                                                        )
                                                        }
                                                    }
                                                }
                                            )
                                        }
                                    size='sm'
                                    className='w-full bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs border-0'
                                >
                                    Set Delivered
                                </Button>
                            )}
                    </div>
                </div>
            </DialogContent>
        ) : (
            <></>
        )
    )
}

export default DispatchOrderDetailsView
