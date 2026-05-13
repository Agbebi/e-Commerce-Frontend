import { Card, CardContent } from '@/components/ui/card'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { capturePayment } from '@/store/shop/order-slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

function PaymentSuccess() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useSelector(state => state.shopCart)
  const { user } = useSelector(state => state.auth)
  // const [cartId, setCartId] = useState('')



  const opayReference = sessionStorage.getItem('orderID')
  const cartId = cartItems._id
  
  
  useEffect(() => {
    if (opayReference) {
      dispatch(capturePayment({ opayReference: opayReference, cartId: cartId })).then((data) => {
        console.log(data),
        dispatch(fetchCartItems({ userId: user.id })).then((data) => {
          if (data.error) {
            navigate('/shop/orders')
          }
        })
      })
    }


  }, [cartId, dispatch, opayReference, navigate, user.id])

  return (
    <Card className='mt-4 border-gray-100 bg-green-50 mx-4 shadow-stone-50'>
      <CardContent className='text-gray-600 font-semibold'>Payment is being acknowledged... Once payment is confirmed, You will be redirected back to home!</CardContent>
    </Card>
  )
}

export default PaymentSuccess