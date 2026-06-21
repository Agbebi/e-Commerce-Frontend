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
        <SheetContent className='bg-white sm:max-w-md w-full max-w-xs p-4 gap-4 pt-6 overflow-y-auto'>
            <SheetHeader className='rounded-xl  px-4 py-5 text-orange-700'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700'>
                    <SlBasket className='h-6 w-6' />
                </div>
                <div className='mt-3 text-center'>
                    <h2 className='text-lg font-semibold'>Your Cart</h2>
                    <p className='text-sm text-gray-600/80'>Review the items before checkout.</p>
                </div>
            </SheetHeader>

            <div className='rounded-lg flex flex-col  py-3 sm:px2 gap-3 mt-4'>
                {cartItems?.items?.length > 0 ? (
                    cartItems.items.map((item) => (
                        <CartItemsContent key={item.productId} cartItem={item} />
                    ))
                ) : (
                    <div className='rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-500'>
                        Your cart seems empty — add a few items to get started.
                    </div>
                )}
            </div>

            <SheetFooter className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                <div className='space-y-3'>
                    <div className='flex justify-between text-sm text-slate-600'>
                        <span>Subtotal</span>
                        <span className='font-semibold flex items-center gap-1'>
                            <TbCurrencyNaira className='h-4 w-4 text-slate-700' />
                            {totalPrice.toFixed(2)}
                        </span>
                    </div>
                    <div className='flex justify-between text-sm text-slate-600'>
                        <span>Shipping</span>
                        <span className='font-semibold text-slate-500'>Calculated at checkout</span>
                    </div>
                </div>
                <Separator className='my-4 border-gray-100' />
                <div className='flex justify-between items-center text-base font-semibold'>
                    <span>Total</span>
                    <span className='flex items-center gap-1 text-slate-900'>
                        <TbCurrencyNaira className='h-4 w-4' />
                        {totalPrice.toFixed(2)}
                    </span>
                </div>
                <Button
                    onClick={() => {
                        navigate('/shop/checkout')
                        setOpenCartSheet(false)
                        setOpenSheet(false)
                    }}
                    className='w-full rounded-full bg-black py-3 text-sm text-white hover:bg-slate-900'
                >
                    Confirm Order
                </Button>
            </SheetFooter>
        </SheetContent>
    )
}

export default UserCartWrapper
