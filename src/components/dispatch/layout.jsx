import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DispatchSidebar from './sidebar'
import DispatchHeader from './header'

function DispatchLayout() {
    const [openSidebar, setOpenSidebar] = useState(false)

    return (
        <div className='flex min-h-screen w-full bg-slate-50/40'>
            {/* Sidebar */}
            <DispatchSidebar open={openSidebar} setOpen={setOpenSidebar} />
            <div className='flex flex-1 flex-col'>
                {/* Dispatch Header */}
                <DispatchHeader setOpen={setOpenSidebar} />
                <main className='flex-1 flex-col p-4 md:p-6 overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DispatchLayout
