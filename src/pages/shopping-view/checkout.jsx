import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import checkoutImg from '../../assets/checkoutImg.jpg'
import Address from '@/components/shopping-view/address'
import { useDispatch, useSelector } from 'react-redux'
import { createNewOrder } from '@/store/shop/order-slice'
import { toast } from 'sonner'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'
import LoadingState from '@/components/ui/loading-state'
import { Loader2 } from 'lucide-react'
import { IoLocationOutline, IoBagOutline, IoCardOutline, IoShieldCheckmarkOutline } from 'react-icons/io5'

function ShoppingCheckout() {

  const dispatch = useDispatch()

  const { cartItems, isLoading: cartLoading } = useSelector(state => state.shopCart)
  const { user } = useSelector(state => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const { approvalUrl, isLoading: orderLoading } = useSelector(state => state.shopOrder)

  const totalPrice = cartItems && cartItems.items ? cartItems.items.reduce((total, item) => {
    const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
    return total + (itemPrice * item.quantity);
  }, 0) : 0;

  const shipping = totalPrice > 0 ? 0 : 0
  const tax = totalPrice * 0.0
  const grandTotal = totalPrice + shipping + tax

  function handleOpayPayment() {
    if (currentSelectedAddress === null) {
      toast.error('Address is required!', {
        description: <span className="text-red-700">Click on an address card to select it.</span>
      })
      return
    }

    const orderData = {
      userInfo: {
        userEmail: user.email,
        userId: user.id,
        userMobile: "+201088889999",
        userName: user.userName,
        name: user.name
      },
      cartId: cartItems._id,
      productList: cartItems.items.map(item => (
        {
          productId: item.productId,
          name: item.name,
          description: item.description,
          imageUrl: item.images?.[0] || item.image,
          price: item.salesPrice > 0 ? item.salesPrice : item.price,
          quantity: item.quantity,
          vendorId: item.vendorId
        }
      )),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        postalCode: currentSelectedAddress.postalCode,
        phoneNumber: currentSelectedAddress.phoneNumber,
        notes: currentSelectedAddress.notes,
        country: currentSelectedAddress.country,
        state: currentSelectedAddress.state,
      },
      orderStatus: 'pending',
      paymentMethod: 'Opay',
      paymentStatus: 'pending',
      totalAmount: grandTotal,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
      deliveryStatus: 'pending'
    }

    dispatch(createNewOrder(orderData))
  }

  if (approvalUrl) {
    window.location.href = approvalUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-[0.03]"></div>
        <div className="relative h-[200px] sm:h-[240px]">
          <img
            src={checkoutImg}
            className="w-full h-full object-cover"
            alt="Checkout"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                  Checkout
                </h1>
                <p className="text-sm text-white/80">
                  Complete your order and get it delivered
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Address & Cart */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6 mt-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <IoLocationOutline className="text-slate-700" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
                  <p className="text-xs text-slate-500">Select where you want your order delivered</p>
                </div>
              </div>
              <Address
                currentSelectedAddress={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </motion.div>

            {/* Cart Items Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <IoBagOutline className="text-slate-700" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                  <p className="text-xs text-slate-500">{cartItems?.items?.length || 0} items in your cart</p>
                </div>
              </div>

              <div className="space-y-3">
                {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                  cartItems.items.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-0.5">
                          <TbCurrencyNaira style={{ fontSize: '0.75rem' }} />
                          {formatPriceDisplay((item.salesPrice > 0 ? item.salesPrice : item.price) * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">Your cart is empty</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <IoCardOutline className="text-slate-700" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                  <p className="text-xs text-slate-500">Review your order details</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Subtotal</span>
                  <span className="text-sm font-semibold text-slate-900 flex items-center gap-0.5">
                    <TbCurrencyNaira style={{ fontSize: '0.75rem' }} />
                    {formatPriceDisplay(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Shipping</span>
                  <span className="text-sm font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tax</span>
                  <span className="text-sm font-semibold text-slate-900 flex items-center gap-0.5">
                    <TbCurrencyNaira style={{ fontSize: '0.75rem' }} />
                    {formatPriceDisplay(tax)}
                  </span>
                </div>
                <div className="h-px bg-slate-200 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-base font-bold text-slate-900 flex items-center gap-0.5">
                    <TbCurrencyNaira style={{ fontSize: '0.85rem' }} />
                    {formatPriceDisplay(grandTotal)}
                  </span>
                </div>
              </div>

              {orderLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <LoadingState
                    title="Preparing your order"
                    description="We are setting up checkout and redirecting you to payment."
                    compact
                    className="border-none bg-transparent shadow-none"
                  />
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpayPayment}
                  disabled={cartLoading || !cartItems?.items?.length}
                  className="w-full py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-2xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 flex items-center justify-center gap-2"
                >
                  <IoShieldCheckmarkOutline size={18} />
                  {cartLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating cart...
                    </span>
                  ) : (
                    `Pay ${formatPriceDisplay(grandTotal)}`
                  )}
                </motion.button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <IoShieldCheckmarkOutline size={14} />
                <span>Secure checkout powered by Opay</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout
