import { Card, CardContent } from '@/components/ui/card'
import { deleteCartItem, fetchCartItems } from '@/store/shop/cart-slice'
import { capturePayment } from '@/store/shop/order-slice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

function PaymentSuccess() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  const params = new URLSearchParams(location.search)



  const paypalToken = params.get('token')
  const orderID = paypalToken


  useEffect(() => {
    if (orderID) {
      dispatch(capturePayment({ orderID: orderID, userId: user.id })).then(() => {
        dispatch(fetchCartItems({ userId: user.id })).then((data) => {
          if (data.error) {
            navigate('/shop/home')
          }
        })
      })
    }


  }, [dispatch, orderID, user, navigate])

  return (
    <Card className='mt-4 border-gray-100 bg-green-50 mx-4 shadow-stone-50'>
      <CardContent className='text-gray-600 font-semibold'>Payment is being acknowledged... Once payment is confirmed, You will be redirected back to home!</CardContent>
    </Card>
  )
}

export default PaymentSuccess