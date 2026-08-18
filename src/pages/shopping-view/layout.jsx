import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ShoppingHeader from './header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails } from '@/store/shop/product-slice'

function ShoppingLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleGetProductDetails = (productId) => {
    navigate(`/shop/product/${productId}`)
    dispatch(fetchProductDetails(productId))
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <ShoppingHeader onOpenProductDetails={handleGetProductDetails} />
      <main className='flex flex-col w-full min-h-screen'>
        <Outlet context={{ handleGetProductDetails }} />
      </main>
    </div>
  )
}

export default ShoppingLayout