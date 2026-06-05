import { Button } from '@/components/ui/button';
import React from 'react'
import { useSelector } from 'react-redux'

 const DispatchDeliveryPage = () => {

    // const urlParams = new URLSearchParams(window.location.search);
    // const orderId = urlParams.get('orderId');
    // const userId = urlParams.get('userId');

    const { user } = useSelector((state) => state.auth)

    console.log(user, 'User Data');
    

  return (
    <div>Your Order delivery is being confirmed...
    
      <Button className='bg-black text-white rounded-2xl'>
        Confirm Delivery
      </Button>
    </div>
  )
}


export default DispatchDeliveryPage