import React from 'react'
import { Button } from '../ui/button'
import { LogOut, Menu } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'

function AdminHeader({setOpen}) {

  const dispatch = useDispatch()

  function handleLogout() {
    dispatch(logoutUser()).then((response) => {
        if (response.payload.success) {
            toast.success('Logged out successfully!')
        } else {
            toast.error('Logout failed. Please try again.')
        }
      })
  }

  return (
    <header className='flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200'>
      <Button onClick ={() => setOpen(true)} variant='ghost' size='icon-lg' className='cursor-pointer lg:hidden sm-block'>
        <Menu />
        <span className='sr-only'>Open sidebar</span>
      </Button>

      <div className='flex flex-1 justify-end text-lg font-semibold'>
      <Button onClick={handleLogout} size='lg' className='cursor-pointer bg-black text-white hover:bg-gray-950'>
        <LogOut />
        <span className='ml-2'>Logout</span>
      </Button>
      </div>
    </header>
  )
}

export default AdminHeader