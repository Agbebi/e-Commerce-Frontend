import React from 'react'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import NotificationBell from '@/components/common/notification-bell'

function DispatchHeader({ setOpen }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        <header className='sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-200'>
            {/* Left: Mobile menu */}
            <div className='flex items-center'>
                <Button
                    onClick={() => setOpen(true)}
                    variant='ghost'
                    size='icon'
                    className='lg:hidden rounded-lg hover:bg-slate-100'
                >
                    <Menu className='h-5 w-5 text-slate-600' />
                    <span className='sr-only'>Open sidebar</span>
                </Button>
            </div>

            {/* Center: Brand (mobile) */}
            <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 md:hidden'>
                <span className='text-sm font-semibold text-slate-900 tracking-tight'>
                    Dispatch Panel
                </span>
            </div>

            {/* Right: Actions */}
            <div className='flex items-center gap-1 sm:gap-2'>
                <div className='relative'>
                    <NotificationBell />
                </div>

                <Button
                    onClick={handleLogout}
                    variant='ghost'
                    size='sm'
                    className='hidden sm:flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl'
                >
                    <span className='text-xs font-medium'>Logout</span>
                </Button>
            </div>
        </header>
    )
}

export default DispatchHeader
