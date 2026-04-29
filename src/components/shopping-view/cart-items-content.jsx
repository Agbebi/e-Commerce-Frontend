import React from 'react'
import { Button } from '../ui/button';
import { Minus, Plus, TrashIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';

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
      console.log(data, 'Updated cart item data');
    })
  }




  return (
    <div className='flex items-center space-x-4 p-3 gap-2 bg-gray-100 rounded-md'>
      <img src={cartItem.image} alt={cartItem.name} className='w-16 h-16 rounded-full object-cover' />
      <div className='flex-1'>
        <h3 className='font-bold'>{cartItem.name}</h3>
        <div className='flex items-center mt-3 gap-3'>
          <Button disabled={cartItem.quantity <= 1} onClick={() => {handleQuantityChange(cartItem, 'minus')}} size='icon' className='h-5 w-5 p-2 border border-gray-400 rounded-full'>
            <Minus className='w-4 h-4' />
            <span className='sr-only'>Decrease</span>
          </Button>
          <span>{cartItem.quantity}</span>
          <Button onClick={() => {handleQuantityChange(cartItem, 'plus')}} size='icon' className='h-5 w-5 p-2 border border-gray-400 rounded-full'>
            <Plus className='w-4 h-4' />
            <span className='sr-only'>Increase</span>
          </Button>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <p className='font-semibold'>${((cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price) * cartItem.quantity).toFixed(2)}</p>
        <TrashIcon onClick={() => handleCartItemDelete(cartItem)} className='mt-1 cursor-pointer' size={20} />
      </div>
    </div>
  )
}

export default CartItemsContent