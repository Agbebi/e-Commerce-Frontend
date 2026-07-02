import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Minus, Plus, TrashIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { TbCurrencyNaira } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';
import { Input } from '../ui/input';
import { IoAddCircle, IoAddCircleOutline, IoAddOutline, IoRemoveCircleOutline, IoRemoveOutline } from 'react-icons/io5';
import { CiCircleRemove } from 'react-icons/ci';
import { MdDelete, MdDeleteOutline } from 'react-icons/md';
import { formatPriceDisplay } from '@/lib/utils';



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
          style: {
            background: 'white',
          },
        })
      } else {
        toast.error('Failed to delete cart item', {
          style: {
            background: 'white',
          },
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

  return (
    <div className='text-xs flex items-center border border-slate-200 gap-2 rounded-xl bg-white pr-3 shadow-xs'>
      <div className='min-w-[60px] h-full w-fit overflow-hidden rounded-l-xl border-none border-slate-100 '>
        <img src={cartItem.images?.[0] || cartItem.image} alt={cartItem.name} className='h-full w-full w-20 max-h-20 sm:max-w-40 object-cover' />
      </div>
      <div className='flex-1 flex flex-col justify-center gap-1 py-1 text-left'>
        <h3 className='text-sm font-semibold leading-5 text-slate-900'>{cartItem.name.slice(0, 8)}</h3>
        <span className='text-[11px] text-gray-500 italic'>{cartItem.productId.substring(0, 6) + '...'}</span>
        <p className='flex items-center text-sm font-semibold text-slate-900'>
          <TbCurrencyNaira className='h-4 w-4' />
          {formatPriceDisplay((cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price) * quantity)}
        </p>
      </div>
      <div className='flex flex-col items-center justify-around h-full max-w-25'>
        <div className='flex items-center gap-0  rounded border border-slate-200 '>
          <Button disabled={quantity <= 1} onClick={() => { handleQuantityChange(cartItem, 'minus') }} size='icon' className='h-6 w-6 p-0 text-slate-600 bg-slate-100 rounded-none transition-transform duration-150 active:scale-95'>
            <IoRemoveOutline className={`h-4 w-4 ${quantity <= 1 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`} />
            <span className='sr-only'>Decrease</span>
          </Button>
          <input className='w-10 bg-white text-center text-xs font-semibold text-slate-900' 
            value={quantity}
            disabled
          />
          <Button onClick={() => { handleQuantityChange(cartItem, 'plus') }} size='icon' className='h-6 w-6 p-0 bg-slate-100 rounded-none text-slate-600 transition-transform duration-150 active:scale-95'>
            <IoAddOutline className='h-4 w-4 opacity-80 hover:opacity-100 text-green-600' />
            <span className='sr-only'>Increase</span>
          </Button>
        </div>
        <MdDeleteOutline onClick={() => handleCartItemDelete(cartItem)} className='h-5 w-5 text-red-400 cursor-pointer opacity-80 transition hover:opacity-100' />
      </div>

    </div>
  )
}

export default CartItemsContent