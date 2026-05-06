import React from 'react'
import { Button } from '../ui/button';
import { Minus, Plus, TrashIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { TbCurrencyNaira } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';

function CartItemsContent({ cartItem }) {

  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()



  function handleCartItemDelete(cartItem) {
    console.log(user);
    dispatch(deleteCartItem({ userId: user.id, productId: cartItem.productId })).then((data) => {
      console.log(data, 'Deleted cart item data');
      if (data.payload.success) {
        toast.success('Cart item deleted successfully')
      } else {
        toast.error('Failed to delete cart item')
      }
    })
  }

  function handleQuantityChange(cartItem, action) {
    dispatch(updateCartItems({ userId: user.id, productId: cartItem.productId, quantity: action === 'plus' ? cartItem.quantity + 1 : cartItem.quantity - 1 })).then((data) => {
    })
  }


  return (
    <div className='text-sm flex bg-white rounded-lg  shadow items-center  gap-4 justify-around'>
      <div className='h-18 w-15 '>

        <img src={cartItem.image} alt={cartItem.name} className='w-full rounded-l h-full object-cover' />
      </div>
      <div className='flex-1 flex flex-col justify-center h-full w-full text-justify px-2'>
        <h3 className='font-normal'>{cartItem.name}</h3>
        <span className='font-light text-[11px] text-gray-600 italic mb-2'>{cartItem.productId.substring(0, 6) + '...'}</span>
        <p className='font-semibold flex items-center'>
          <TbCurrencyNaira className='w-5 h-5' />
          {((cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price) * cartItem.quantity).toFixed(2)}
        </p>
      </div>
      <div className='flex flex-col gap-1 mr-4 justify-around h-full items-center'>
        <div className='flex h-4 items-center gap-3 p-0 bg-white'>
          <Button disabled={cartItem.quantity <= 1} onClick={() => { handleQuantityChange(cartItem, 'minus') }} size='icon' className='rounded h-full w-4 p-0 shadow'>
            <Minus className='' />
            <span className='sr-only'>Decrease</span>
          </Button>
          <span className='font-normal text-lg w-full'>{cartItem.quantity}</span>
          <Button onClick={() => { handleQuantityChange(cartItem, 'plus') }} size='icon' className='rounded h-full w-4 p-2 shadow'>
            <Plus className='' />
            <span className='sr-only'>Increase</span>
          </Button>
        </div>
        <AiOutlineDelete onClick={() => handleCartItemDelete(cartItem)} className='w-4 h-4 cursor-pointer' />
      </div>

    </div>
  )
}

export default CartItemsContent