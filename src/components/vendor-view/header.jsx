import React from 'react'
import { Button } from '../ui/button'
import { Menu, Bell, LogOut, ChevronDown, User } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import NotificationBell from '@/components/common/notification-bell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
      {/* Left: Mobile menu */}
      <div className="flex items-center">
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-lg hover:bg-slate-100"
        >
          <Menu className="h-5 w-5 text-slate-600" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </div>

      {/* Center: Brand (mobile) */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 md:hidden">
        <span className="text-sm font-semibold text-slate-900 tracking-tight">Tims Marketplace</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Notifications */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-lg hover:bg-slate-100 h-9 px-2 sm:px-3">
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold text-xs">
                {user?.shopName?.charAt(0).toUpperCase() || 'V'}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900 leading-tight">{user?.shopName || 'Vendor'}</span>
                <span className="text-[10px] text-slate-500 leading-tight">Shop Owner</span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 shadow-sm bg-white">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-900">{user?.shopName || 'Vendor'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/vendor/profile')} className="cursor-pointer rounded-lg">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 rounded-lg focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AdminHeader
