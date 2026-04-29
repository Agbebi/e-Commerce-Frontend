import React from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { useSelector } from 'react-redux'


function ShoppingOrderDetails() {


 const {orderDetails} = useSelector(state => state.shopOrder)
  
    
  return (
     <DialogContent className='sm:max-w-[600px] bg-white border-none rounded-lg shadow-lg p-6'>
            <div className='grid gap-6 mt-6'>
                <div className='grid gap-2'>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Order ID</p>
                        <Label>{orderDetails._id}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Order Date</p>
                        <Label>{orderDetails.orderDate}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Order Status</p>
                        <Label>{orderDetails.orderStatus}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Price</p>
                        <Label>${orderDetails.totalAmount}</Label>
                    </div>
                </div>

                <Separator className='border-gray-100 border' />

                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <p className='text-sm font-medium'>Order Details</p>
                        <ul className='grid gap-3'>

                        {
                            orderDetails && orderDetails.cartItems ? 

                        
                                orderDetails.cartItems.map(item =>
                                    <li className='flex items-center justify-between'>
                                <p className='text-sm'>{item.title}</p>
                                <p className='text-sm font-medium'>${item.price}</p>
                            </li>
                                )                            
                             : null
                        }
                            
                        </ul>
                    </div>
                </div>

                <Separator className='border-gray-100 border' />
                
                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <p className='text-sm font-medium'>Shipping Info</p>
                        <div className='grid gap-0.5 text-gray-600'>
                            <span className='text-sm'>{orderDetails.addressInfo.address}</span>
                            <span className='text-sm'>{orderDetails.addressInfo.city}</span>
                            <span className='text-sm'>{orderDetails.addressInfo.state}, {orderDetails.addressInfo.country}</span>
                            <span className='text-sm'>{orderDetails.addressInfo.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>

  )
}

export default ShoppingOrderDetails