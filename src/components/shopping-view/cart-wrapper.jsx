import React from 'react'
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import CartItemsContent from './cart-items-content'
import { useNavigate } from 'react-router-dom'
import { Separator } from '../ui/separator'
import { SlBasket } from 'react-icons/sl'
import { TbCurrencyNaira } from 'react-icons/tb'
import  cart from '../../assets/cart.jpg'

function UserCartWrapper({ cartItems, setOpenCartSheet, setOpenSheet }) {

    const navigate = useNavigate();

    const totalPrice = cartItems && cartItems.items ? cartItems.items.reduce((total, item) => {
        const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
        return total + (itemPrice * item.quantity);
    }, 0) : 0;

    return (
        <SheetContent  className='bg-white sm:max-w-md w-80 p-4 first:gap-1 justify-center pt-10'>
        <SheetHeader style={{backgroundImage : cart}} className='outline-orange-200  flex flex-col items-center justify-center p-1'>
                <SlBasket className='w-6 rounded-full h-6' />
               <span className='text-lg font-light text-orange-600'> Your Cart</span>
                
            </SheetHeader> 
            <div className='flex flex-col overscroll-y-auto overscroll-x-hidden rounded-lg p-2 gap-2 mt-2'>
                {cartItems && cartItems.items && cartItems.items.length > 0 ?
                    cartItems.items.map((item) => (                    
                            <CartItemsContent cartItem={item} />
                    )) : <div
                        className='text-sm text-center outline w-full flex items-center justify-center h-20 opacity-50 outline-gray-200'>
                        Your cart seems empty, start adding some items!
                    </div>
                }
            </div>


            <SheetFooter className='p-1'>
                {/* <Separator className='border border-gray-100' /> */}
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                        <span className='font-sm text-gray-800 font-light text-sm'>Subtotal</span>
                        <span className='font-bold flex'><TbCurrencyNaira className='w-6 h-6 font-light text-gray-800' />{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='font-sm text-gray-800 font-light text-sm'>Shipping</span>
                        <span className='font-bold flex'>--</span>
                    </div>
                </div>
                <Separator className='border border-gray-100' />
                <div className='flex justify-between items-center'>
                    <span className='font-medium'>Total</span>
                    <span className='font-bold flex'><TbCurrencyNaira className='w-6 h-6 font-light text-gray-800' />{totalPrice.toFixed(2)}</span>
                </div>
                <Button
                    onClick={() => {
                        navigate('/shop/checkout')
                        setOpenCartSheet(false)
                        setOpenSheet(false)

                    }}
                    className='w-full text-sm mt-6 border shadow bg-black text-white'>
                    Confirm Order
                </Button>
            </SheetFooter>
        </SheetContent>
    )
}

export default UserCartWrapper
