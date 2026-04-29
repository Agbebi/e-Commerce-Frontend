import React, { useState } from 'react'
import accImg from '../../assets/accImg.jpg'
import Address from '@/components/shopping-view/address';
import { useDispatch, useSelector } from 'react-redux';
import CartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createNewOrder } from '@/store/shop/order-slice';


function ShoppingCheckout() {

  const dispatch = useDispatch()

  const { cartItems } = useSelector(state => state.shopCart)
  const { user } = useSelector(state => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const { approvalUrl } = useSelector(state => state.shopOrder)

  const totalPrice = cartItems && cartItems.items ? cartItems.items.reduce((total, item) => {
    const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
    return total + (itemPrice * item.quantity);
  }, 0) : 0;


  function handlePaypalPayment() {

    if(currentSelectedAddress === null){
      toast.error('Address is required!', {
        description : <span className="text-red-700">Click on an address card to select it.</span>
      })
      return

    }


    const orderData = {
      userId: user.id,
      cartId : cartItems._id,
      cartItems: cartItems.items.map(item => ({
        productId: item.productId,
        title: item.name,
        image: item.image,
        price: item.salesPrice > 0 ? item.salesPrice : item.price,
        quantity: item.quantity
      })),
      addressInfo : {
        addressId : currentSelectedAddress._id,
        address : currentSelectedAddress.address,
        city : currentSelectedAddress.city,
        postalCode : currentSelectedAddress.postalCode,
        phoneNumber : currentSelectedAddress.phoneNumber,
        notes : currentSelectedAddress.notes,
        country : currentSelectedAddress.country,
        state : currentSelectedAddress.state,
      }, 
      orderStatus : 'pending', 
      paymentMethod : 'PayPal', 
      paymentStatus : 'pending', 
      totalAmount : totalPrice, 
      orderDate : new Date(), 
      orderUpdateDate : new Date(), 
      paymentId : '', 
      payerId : ''
    }
    

     dispatch(createNewOrder(orderData))

     console.log(approvalUrl, 'Approval Url');
     

    }
    if(approvalUrl){
         window.location.href = approvalUrl.href
       }
  

  return (
    <div className='flex flex-col'>
      <div className='relative h-[300px] overflow-hidden w-full'>
        <img
          src={accImg}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-5 p-4'>
        <Address currentSelectedAddress={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />

        <div className='flex flex-col gap-4 p-4'>
          {
            cartItems && cartItems.items && cartItems.items.length > 0 ?
              cartItems.items.map((item) => (
                <CartItemsContent cartItem={item} />
              ))
              : null
          }
          <div className='mt-8 space-y-4'>
            <div className='flex justify-between'>
              <span className='font-bold'>Total</span>
              <span className='font-bold'>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <Button onClick={handlePaypalPayment} className='w-full mt-4 bg-black text-white hover:bg-gray-800'>Checkout with paypal</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout;