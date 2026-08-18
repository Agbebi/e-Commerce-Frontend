import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartItem, updateCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { IoRemoveOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'

function CartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(cartItem.quantity)

  useEffect(() => {
    setQuantity(cartItem.quantity)
  }, [cartItem.quantity])

  function handleCartItemDelete(cartItem) {
    dispatch(deleteCartItem({ userId: user.id, productId: cartItem.productId })).then((data) => {
      if (data.payload.success) {
        toast.success('Cart item deleted successfully', {
          style: { background: 'white' },
        })
      } else {
        toast.error('Failed to delete cart item', {
          style: { background: 'white' },
        })
      }
    })
  }

  function handleQuantityChange(cartItem, action) {
    const nextQuantity = action === 'plus' ? quantity + 1 : quantity - 1
    if (nextQuantity < 1) return

    setQuantity(nextQuantity)
    dispatch(updateCartItems({
      userId: user.id,
      productId: cartItem.productId,
      quantity: nextQuantity,
      description: cartItem.description,
      name: cartItem.name,
      imageUrl: cartItem.images?.[0] || cartItem.image,
      price: cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price,
    }))
  }

  const itemPrice = (cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price) * quantity

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
          <img
            src={cartItem.images?.[0] || cartItem.image}
            alt={cartItem.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 truncate leading-snug">
            {cartItem.name}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono tracking-tight">
            {cartItem.productId.substring(0, 8)}...
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <TbCurrencyNaira style={{ fontSize: '0.75rem' }} className="text-slate-900" />
            <span className="text-sm font-bold text-slate-900">
              {formatPriceDisplay(itemPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
        >
          <IoTrashOutline size={15} />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">Quantity</span>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
          <button
            onClick={() => handleQuantityChange(cartItem, 'minus')}
            disabled={quantity <= 1}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 transition-all duration-200"
          >
            <IoRemoveOutline size={13} />
          </button>
          <div className="w-8 text-center text-sm font-bold text-slate-900 select-none tabular-nums">
            {quantity}
          </div>
          <button
            onClick={() => handleQuantityChange(cartItem, 'plus')}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
          >
            <IoAddOutline size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItemsContent
