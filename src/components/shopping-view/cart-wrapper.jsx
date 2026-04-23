import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import CartItemsContent from './cart-items-content'
import { ShoppingBasketIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function UserCartWrapper({ cartItems, setOpenCartSheet, setOpenSheet }) {

    const navigate = useNavigate();

    const totalPrice = cartItems && cartItems.items ? cartItems.items.reduce((total, item) => {
        const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
        return total + (itemPrice * item.quantity);
    }, 0) : 0;

    return (
        <SheetContent className='bg-white sm:max-w-md p-4'>
            <SheetHeader className='font-bold text-2xl'>
                <SheetTitle>
                    Your Cart
                </SheetTitle>
            </SheetHeader>

            <div className='mt-4 space-y-2'>
                {cartItems && cartItems.items && cartItems.items.length > 0 ?
                    cartItems.items.map((item) => (
                        <CartItemsContent cartItem={item} />
                    )) : <div
                        className='shadow text-sm outline w-full flex items-center justify-center h-20 space-x-4 opacity-50 rounded-xl outline-dashed outline-gray-200'>
                        Your cart seems empty, start adding some items!
                    </div>
                }
            </div>
            <div className='mt-8 space-y-4'>
                <div className='flex justify-between'>
                    <span className='font-bold'>Total</span>
                    <span className='font-bold'>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <Button
                onClick={() => {
                    setOpenCartSheet(false)
                    setOpenSheet(false)
                    navigate('/shop/checkout')
                    
                    }}
                className='w-full mt-6 border shadow border-gray-300 hover:bg-black hover:text-white'>
                <ShoppingBasketIcon />
                Checkout</Button>
        </SheetContent>
    )
}

export default UserCartWrapper