import React, { Fragment } from 'react'
import { House, LayoutDashboard, ShoppingBasket, ShoppingCart, User, ChevronRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'

const vendorSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/vendor/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: 'products',
    label: 'Products',
    href: '/vendor/products',
    icon: <ShoppingBasket className="h-5 w-5" />,
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/vendor/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/vendor/profile',
    icon: <User className="h-5 w-5" />,
  },
]

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (href) => location.pathname === href

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {vendorSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.href)
            setOpen?.(false)
          }}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            isActive(menuItem.href)
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className={`p-2 rounded-lg transition-all ${
            isActive(menuItem.href)
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
          }`}>
            {menuItem.icon}
          </div>
          <span className="font-medium text-sm">{menuItem.label}</span>
          {isActive(menuItem.href) && (
            <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
          )}
        </div>
      ))}
    </nav>
  )
}

function VendorSidebar({ open, setOpen }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser()).then((response) => {
      if (response.payload.success) {
        toast.success('Logged out successfully!')
        navigate('/')
      } else {
        toast.error('Logout failed. Please try again.')
      }
    })
  }

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-white border-r p-0 lg:hidden flex flex-col">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-slate-100 p-6">
              <SheetTitle className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/vendor/dashboard')}>
                <div className="p-2 rounded-lg bg-slate-900 text-white">
                  <House className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold text-slate-900">Tims Marketplace</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 p-4">
              <MenuItems setOpen={setOpen} />
            </div>
            <div className="p-4 border-t border-slate-100">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white h-screen sticky top-0">
        {/* Logo */}
        <div
          onClick={() => navigate('/vendor/dashboard')}
          className="flex cursor-pointer items-center gap-3 px-6 py-6 border-b border-slate-100"
        >
          <div className="p-2 rounded-lg bg-slate-900 text-white">
            <House className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 tracking-tight">Tims Marketplace</h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Vendor</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <MenuItems setOpen={setOpen} />
        </div>

        {/* User Mini Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold text-xs">
              {user?.shopName?.charAt(0).toUpperCase() || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.shopName || 'Vendor'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'vendor@example.com'}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full mt-3 justify-start gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}

export default VendorSidebar
