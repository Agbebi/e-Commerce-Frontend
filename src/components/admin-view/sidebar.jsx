import React, { Fragment } from 'react'
import { House } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBasket, ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'


const adminSidebarMenuItems = [
  {
    id : 'dashboard',
    label : 'Dashboard',
    href : '/admin/dashboard',
    icon : <LayoutDashboard />
},
{
    id : 'products',
    label : 'Products',
    href : '/admin/products',
    icon : <ShoppingBasket />
},
{
    id : 'orders',
    label : 'Orders',
    href : '/admin/orders',
    icon : <ShoppingCart />
},
]


const MenuItems = ({setOpen}) => {

  
  const navigate = useNavigate()
  return <nav className='cursor-pointer mt-8 flex-col flex gap-2'>
  {
    adminSidebarMenuItems.map(menuItem => <div key={menuItem.id} onClick={() => {navigate(`${menuItem.href}`); setOpen ? setOpen(false) : null}} className='flex items-center px-3 py-2 rounded-md gap-2 hover:bg-gray-700 hover:text-white'>
      {menuItem.icon}
      <span>{menuItem.label}</span>
    </div>)
  }
  </nav>
}

function AdminSidebar({open, setOpen}) {
  const navigate = useNavigate()
  
  return (
    <Fragment>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='left' className='w-64 bg-white border-r p-6 lg:hidden flex flex-col'>
        <div className='flex flex-col gap-2 h-full'>
          <SheetHeader className='border-b pb-4 mb-4'>
            <SheetTitle className='flex gap-2 justify-baseline'>
            <House />
            <span>Admin Panel</span></SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
      <aside className='w-64 hidden border-r border-gray-200 p-6 lg:flex flex-col'>
        <div onClick={() => {navigate('/admin/dashboard')}} className='flex cursor-pointer items-center gap-2'>
        <House />
           <h1 className='text-xl font-bold'>Admin Panel</h1>
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  )
}

export default AdminSidebar