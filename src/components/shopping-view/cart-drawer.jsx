import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoCartOutline, IoClose, IoRemoveOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import { deleteCartItem, updateCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { formatPriceDisplay } from '@/lib/utils'

const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 200,
      mass: 0.8
    }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 200,
      mass: 0.8
    }
  }
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

function CartItem({ cartItem, index, onRemove, onQuantityChange }) {
  const [quantity, setQuantity] = useState(cartItem.quantity)
  const [imageLoaded, setImageLoaded] = useState(false)

  React.useEffect(() => {
    setQuantity(cartItem.quantity)
  }, [cartItem.quantity])

  const handleQuantityChange = (action) => {
    const nextQuantity = action === 'plus' ? quantity + 1 : quantity - 1
    if (nextQuantity < 1) return
    setQuantity(nextQuantity)
    onQuantityChange(cartItem, nextQuantity)
  }

  const handleRemove = () => {
    onRemove(cartItem)
  }

  const itemPrice = (cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price) * quantity

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        damping: 20,
        stiffness: 200
      }}
    >
      <div className="relative flex gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 overflow-hidden group">
        <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 relative bg-slate-100 border border-slate-100">
          <motion.img
            src={cartItem.images?.[0] || cartItem.image}
            alt={cartItem.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-snug truncate">{cartItem.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono tracking-tight">{cartItem.productId.substring(0, 8)}...</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <TbCurrencyNaira className="text-slate-900" style={{ fontSize: '0.8rem' }} />
              <span className="text-sm font-bold text-slate-900">{formatPriceDisplay(itemPrice)}</span>
            </div>

            <div className="flex items-center gap-1">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange('minus')} disabled={quantity <= 1} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-40 transition-all duration-200">
                <IoRemoveOutline size={13} />
              </motion.button>

              <div className="w-8 text-center text-sm font-bold text-slate-900 select-none tabular-nums">{quantity}</div>

              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange('plus')} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
                <IoAddOutline size={13} />
              </motion.button>
            </div>
          </div>
        </div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileTap={{ scale: 0.9 }} 
          onClick={handleRemove} 
          className="absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <IoTrashOutline size={13} />
        </motion.button>
      </div>
    </motion.div>
  )
}

function CartDrawer({ open, onClose, cartItems }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const totalPrice = cartItems?.items?.length ? cartItems.items.reduce((total, item) => {
    const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price
    return total + (itemPrice * item.quantity)
  }, 0) : 0

  const handleQuantityChange = (cartItem, newQuantity) => {
    dispatch(updateCartItems({
      userId: user.id,
      productId: cartItem.productId,
      quantity: newQuantity,
      description: cartItem.description,
      name: cartItem.name,
      imageUrl: cartItem.images?.[0] || cartItem.image,
      price: cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price,
    }))
  }

  const handleRemove = (cartItem) => {
    dispatch(deleteCartItem({ userId: user.id, productId: cartItem.productId })).then((data) => {
      if (data.payload.success) {
        toast.success('Cart item deleted successfully', { style: { background: 'white' } })
      } else {
        toast.error('Failed to delete cart item', { style: { background: 'white' } })
      }
    })
  }

  const handleCheckout = () => {
    onClose()
    navigate('/shop/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[1300]"
          />

          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-screen w-full max-w-[420px] z-[1301] flex flex-col items-center overflow-hidden bg-slate-50/80 backdrop-blur-xl"
          >
            <div className="w-full flex flex-col gap-3 overflow-hidden h-full">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80"
              >
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      <IoCartOutline size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">Your Cart</h2>
                      <p className="text-xs text-slate-500 font-medium">{cartItems?.items?.length || 0} {cartItems?.items?.length === 1 ? 'item' : 'items'}</p>
                    </div>
                  </div>

                  <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
                    <IoClose size={18} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto w-full px-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.15) transparent' }}>
                <AnimatePresence mode="popLayout">
                  {cartItems?.items?.length > 0 ? (
                    <div className="flex flex-col gap-2 py-2">
                      {cartItems.items.map((item, index) => (
                        <CartItem
                          key={item.productId}
                          cartItem={item}
                          index={index}
                          onRemove={handleRemove}
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                      <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                        <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                          <IoCartOutline size={36} color="#94a3b8" />
                        </div>
                      </motion.div>
                      <p className="text-base font-semibold text-slate-900">Your cart is empty</p>
                      <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed">Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {cartItems?.items?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="w-full bg-white border-t border-slate-200/80">
                    <div className="p-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
                              <TbCurrencyNaira style={{ fontSize: '0.65rem' }} className="text-slate-600" />
                            </div>
                            <span className="text-sm text-slate-500 font-medium">Subtotal</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 tabular-nums">{formatPriceDisplay(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
                              <IoClose size={10} className="text-slate-600" />
                            </div>
                            <span className="text-sm text-slate-500 font-medium">Shipping</span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">Calculated at checkout</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1" />
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
                              <TbCurrencyNaira style={{ fontSize: '0.65rem' }} className="text-white" />
                            </div>
                            <span className="text-base font-bold text-slate-900 tracking-tight">Total</span>
                          </div>
                          <span className="text-base font-bold text-slate-900 tabular-nums">{formatPriceDisplay(totalPrice)}</span>
                        </div>

                        <motion.button whileTap={{ scale: 0.98 }} onClick={handleCheckout} className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 text-white text-center text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2">
                          Confirm Order
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
