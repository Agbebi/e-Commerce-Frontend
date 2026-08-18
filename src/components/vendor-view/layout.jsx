import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './sidebar'
import AdminHeader from './header'

function VendorLayout() {

  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className='flex min-h-screen w-full'>
        {/* Sidebar */}
        <div className="hidden lg:block">
            <AdminSidebar open={openSidebar} setOpen = {setOpenSidebar} />
        </div>
        <div className='flex flex-1 flex-col gap-4'>
            {/* Admin Header */}
         <AdminHeader setOpen = {setOpenSidebar} />
            <main className='flex-1 flex-col flex bg-white md:p-6 px-4'>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default VendorLayout