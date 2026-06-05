import React from 'react'
import { Button } from '../ui/button'
import { LogOut, Menu, SearchIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { IoLogOutOutline } from 'react-icons/io5'
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import Input from '@mui/material/Input'

function DispatchHeader({ setOpen }) {

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
      <Button onClick={() => setOpen(true)} variant='ghost' size='icon-lg' className='cursor-pointer lg:hidden sm-block'>
        <Menu />
        <span className='sr-only'>Open sidebar</span>
      </Button>

      <div className='flex flex-2 justify-end text-lg items-center gap-3 font-semibold'>
          <span className=''>Tims Dispatch</span>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

        <div className='flex  text-lg font-semibold'>
          <Box sx={{ color: 'black' }}>
            <Badge color="primary" variant="dot">
              <IoIosNotificationsOutline size={24} />
            </Badge>
          </Box>

        </div>

        <Button onClick={handleLogout} size='' className='cursor-pointer border-none outline-none bg-black text-white hover:bg-gray-950'>
          <LogOut size={24} />
          <span className='ml-2 text-xs sm:text-sm'>Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default DispatchHeader