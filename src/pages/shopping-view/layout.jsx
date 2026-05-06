import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingHeader from './header'

function ShoppingLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
    {/* Common Header */}
    <ShoppingHeader />
    <main className='flex flex-col w-full min-h-screen'>
        <Outlet />
    </main>
    </div>
  )
}

export default ShoppingLayout