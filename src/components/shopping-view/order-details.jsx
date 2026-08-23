import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { QRCodeSVG } from 'qrcode.react'
import { TbCurrencyNaira } from 'react-icons/tb'
import { IoReceipt, IoLocation, IoPerson, IoPrint, IoCheckmarkCircle, IoTime, IoCloseCircle, IoChevronForward } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, queryPaymentStatus } from '@/store/shop/order-slice'
import { toast } from 'sonner'
import { formatPriceDisplay } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: IoTime },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: IoCheckmarkCircle },
  failed: { label: 'Failed', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', icon: IoCloseCircle },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: IoTime },
  accepted: { label: 'Accepted', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: IoCheckmarkCircle },
  packaging: { label: 'Packaging', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', icon: IoTime },
  ready: { label: 'Ready', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: IoCheckmarkCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', icon: IoCloseCircle },
}

function ShoppingOrderDetails({ setOpenDetailsDialog }) {
  const { orderDetails } = useSelector(state => state.shopOrder)
  const { cartItems } = useSelector(state => state.shopCart)
  const printRef = useRef(null)

  const dispatch = useDispatch()

  const handlePrint = () => {
    if (!printRef.current) return
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    const contentToPrint = printRef.current.innerHTML
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Order Details</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 24px; background: white; color: #111827; }
            .print-container { max-width: 800px; margin: 0 auto; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="print-container">${contentToPrint}</div>
          <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleCompletePayment = () => {
    const productList = cartItems.items.map(item => ({
      productId: item.productId,
      name: item.name,
      description: item.description,
      imageUrl: item.images?.[0] || item.image,
      price: item.salesPrice > 0 ? item.salesPrice : item.price,
      quantity: item.quantity,
      vendorId: item.vendorId
    }))

    dispatch(queryPaymentStatus({ opayReference: orderDetails._id, cartId: cartItems._id, productList })).then((response) => {
      if (response.payload.order.data.cashierUrl) {
        sessionStorage.setItem('orderID', response.payload.order.data.reference)
        window.location.href = response.payload.order.data.cashierUrl
      } else {
        toast.error('Payment failed or already completed. Please check your orders for details.')
        dispatch(getAllOrders(orderDetails.userInfo.userId))
        setOpenDetailsDialog(false)
      }
    })
  }

  const paymentStatus = orderDetails?.paymentStatus || 'pending'
  const deliveryStatus = orderDetails?.deliveryStatus || 'pending'
  const paymentStatusConfig = statusConfig[paymentStatus] || statusConfig.pending
  const deliveryStatusConfig = statusConfig[deliveryStatus] || statusConfig.pending
  const PaymentIcon = paymentStatusConfig.icon
  const DeliveryIcon = deliveryStatusConfig.icon

  const orderItems = orderDetails?.childOrders?.flatMap(co => co.cartItems || []) || []
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <DialogContent className='w-full max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white border border-slate-200 shadow-2xl rounded-3xl p-0'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-white border-b border-slate-100 px-6 sm:px-8 py-5 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center'>
            <IoReceipt className='text-white' size={20} />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900'>Order Details</h2>
            <p className='text-xs text-slate-500'>Order #{orderDetails?._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='border border-slate-200 text-slate-700 hover:bg-slate-50' onClick={handlePrint}>
            <IoPrint size={14} className='mr-1.5' />
            Print Invoice
          </Button>
        </div>
      </div>

      <div ref={printRef} className='p-6 sm:p-8 space-y-6'>
        {/* Status Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${paymentStatusConfig.color}`}>
            <div className='w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center'>
              <PaymentIcon size={20} />
            </div>
            <div>
              <p className='text-xs font-medium opacity-80'>Payment Status</p>
              <p className='text-sm font-bold'>{paymentStatusConfig.label}</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${deliveryStatusConfig.color}`}>
            <div className='w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center'>
              <DeliveryIcon size={20} />
            </div>
            <div>
              <p className='text-xs font-medium opacity-80'>Delivery Status</p>
              <p className='text-sm font-bold'>{deliveryStatusConfig.label}</p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
          <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>Order Information</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <p className='text-xs text-slate-500 mb-1'>Order ID</p>
              <p className='text-sm font-medium text-slate-900 font-mono break-all'>{orderDetails?._id}</p>
            </div>
            <div>
              <p className='text-xs text-slate-500 mb-1'>Order Date</p>
              <p className='text-sm font-medium text-slate-900'>
                {orderDetails?.orderDate?.slice(0, 10)} {orderDetails?.orderDate?.slice(11, 19)}
              </p>
            </div>
            <div>
              <p className='text-xs text-slate-500 mb-1'>Total Amount</p>
              <p className='text-sm font-bold text-slate-900 flex items-center gap-1'>
                <TbCurrencyNaira size={14} />
                {formatPriceDisplay(orderDetails?.totalAmount ?? 0)}
              </p>
            </div>
            <div>
              <p className='text-xs text-slate-500 mb-1'>Total Items</p>
              <p className='text-sm font-medium text-slate-900'>{orderItems.length} items</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>Order Items</h3>
          <div className='space-y-3'>
            {orderItems.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className='flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all duration-200'
              >
                <div className='w-16 h-16 rounded-xl bg-slate-100 border border-slate-100 overflow-hidden flex-shrink-0'>
                  <img src={item.imageUrl} alt={item.name} className='w-full h-full object-cover' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-slate-900 truncate'>{item.name}</p>
                  <p className='text-xs text-slate-500'>Qty: {item.quantity}</p>
                </div>
                <div className='text-right flex-shrink-0'>
                  <p className='text-sm font-bold text-slate-900 flex items-center gap-0.5'>
                    <TbCurrencyNaira size={12} />
                    {formatPriceDisplay(item.price)}
                  </p>
                  <p className='text-xs text-slate-500'>Subtotal</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator className='border-slate-100' />

        {/* Address & User Info */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
            <div className='flex items-center gap-2 mb-3'>
              <IoLocation className='text-slate-600' size={16} />
              <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Delivery Address</h3>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-slate-900'>{orderDetails?.addressInfo?.address}</p>
              <p className='text-sm text-slate-600'>{orderDetails?.addressInfo?.city}</p>
               <p className='text-sm text-slate-600'>
                 {orderDetails?.addressInfo?.state ? `${orderDetails.addressInfo.state}, ` : ''}{orderDetails?.addressInfo?.country}
               </p>
              <p className='text-sm text-slate-600'>{orderDetails?.addressInfo?.phoneNumber}</p>
            </div>
          </div>

          <div className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
            <div className='flex items-center gap-2 mb-3'>
              <IoPerson className='text-slate-600' size={16} />
              <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Customer Information</h3>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-slate-900'>{orderDetails?.userInfo?.userName}</p>
              <p className='text-sm text-slate-600'>{orderDetails?.userInfo?.userEmail}</p>
              <p className='text-sm text-slate-600'>{orderDetails?.userInfo?.userMobile}</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className='flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100'>
          <p className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4'>Track Your Order</p>
          <QRCodeGenerator url={`${window.location.origin}/shop/orders?orderId=${orderDetails?._id}`} />
          <p className='text-xs text-slate-500 mt-3'>Scan to track your order</p>
        </div>

        {/* Complete Payment Button */}
        {paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='pt-2'
          >
            <Button
              onClick={handleCompletePayment}
              className='w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-semibold text-sm'
            >
              <IoCheckmarkCircle size={18} className='mr-2' />
              Complete Payment
            </Button>
          </motion.div>
        )}
      </div>
    </DialogContent>
  )
}

const QRCodeGenerator = ({ url }) => (
  <div className='flex items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl shadow-sm'>
    <QRCodeSVG value={url} size={120} />
  </div>
)

export default ShoppingOrderDetails