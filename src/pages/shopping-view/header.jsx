import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BedIcon, CircleUser, CircleUserRound, House, HouseHeart, LogOutIcon, Menu, MenuIcon, ShoppingBasketIcon, ShoppingCart, User } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewCategories } from '../../config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import UserCartWrapper from '../../components/shopping-view/cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Label } from '@/components/ui/label'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ShopSidebar from '@/components/shopping-view/sidebar'
import { BiMenu } from 'react-icons/bi'





function MenuItems() {

  const navigate = useNavigate()
  const location = useLocation()
  const [, setSearchParams] = useSearchParams()


  function handleNavigate(getCurrentItem) {
    sessionStorage.removeItem('filters')
    const currentFilter = getCurrentItem.id !== 'home' ? {
      Category: [getCurrentItem.id]
    } : null

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))

    location.pathname.includes('listing') && currentFilter !== null ?
      setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`)) :
      navigate(getCurrentItem.path)



  }
  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
      {
        shoppingViewCategories.map((category) => (
          <Label key={category.value}
            className='cursor-pointer text-sm font-medium text-gray-900 hover:text-black hover:border-b-gray-500 border-b-2 border-transparent transition-colors duration-200'
            onClick={() => { handleNavigate(category) }}
          >
            {category.label}
          </Label>
        ))
      }
    </nav>
  )
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser()).then(toast.success('Logged out successfully!')).catch(() => toast.error('Logout failed!'))
  }

  useEffect(() => {
    dispatch(fetchCartItems({ userId: user.id }))
  }, [dispatch, user.id])

  return (
    <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button onClick={() => setOpenCartSheet(true)} className='rounded-full border border-gray-200' size='icon'>
          <ShoppingCart className='w-6 h-6' />
          <span className='sr-only'>Cart</span>
        </Button>
        <UserCartWrapper cartItems={cartItems} />
      </Sheet>


      <DropdownMenu>
        <DropdownMenuTrigger className='cursor-pointer' asChild>
          <Avatar className='bg-black'>
            <AvatarFallback className='bg-black text-white'>
              {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>


        <DropdownMenuContent side='right' className='bg-white text-black w-48 border border-gray-200 shadow-lg'>
          <DropdownMenuLabel>Logged in as {user.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
            <CircleUserRound className='mr-2 h-6 w-6' />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
            <LogOutIcon />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


function ShoppingHeader() {

  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser()).then(toast.success('Logged out successfully!')).catch(() => toast.error('Logout failed!'))
  }

  useEffect(() => {
    dispatch(fetchCartItems({ userId: user.id }))
  }, [dispatch, user.id])


  const [openSheet, setOpenSheet] = useState(false)
  const { cartItems } = useSelector((state) => state.shopCart)
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)


  const navigate = useNavigate()
  const location = useLocation()
  const [, setSearchParams] = useSearchParams()

  function handleNavigate(getCurrentItem) {
    sessionStorage.removeItem('filters')
    const currentFilter = getCurrentItem.id !== 'home' ? {
      Category: [getCurrentItem.id]
    } : null

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))

    location.pathname.includes('listing') && currentFilter !== null ?
      setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`)) :
      navigate(getCurrentItem.path)

    setOpenSheet(false)

  }



  return (
    <header className='fixed bg-neutral-100 w-full top-0 z-50 border-b border-gray-200'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <Link to="/shop/home" className='flex items-center gap-2'>
          <House className='h-6 w-6' />
          <span className='font-bold'>e-Shop</span>
        </Link>



        <div className='lg:hidden flex gap-2 justify-center items-center'>
          {isAuthenticated ? <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer' asChild>
              <Button
                className='rounded-full border border-gray-200' size='icon'>
                <User className='w-8 h-8' />
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent side='bottom' className='bg-white text-black w-48 border border-gray-200 shadow-lg'>
              <DropdownMenuLabel>Logged in as {user.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/shop/account')} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
                <CircleUserRound className='mr-2 h-6 w-6' />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
                <LogOutIcon />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : null}


          <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button onClick={() => {
              setOpenCartSheet(true)
            }} className='rounded-full border border-gray-200' size='icon'>
              <ShoppingCart className='w-6 h-6' />
              <span className='sr-only'>View Cart</span>
            </Button>
            <UserCartWrapper setOpenSheet={setOpenSheet} setOpenCartSheet={setOpenCartSheet} cartItems={cartItems} />
          </Sheet>



          <Sheet open={openSidebar} onOpenChange={() => setOpenSidebar(false)}>
            <Button onClick={() => setOpenSidebar(true)} className='rounded-lg border border-gray-200' size='icon'>
              <BiMenu className='w-6 h-6' />
              <span className='sr-only'>Cart</span>
            </Button>
            <ShopSidebar />
          </Sheet>
        </div>


        <div className='hidden lg:block'>
          <MenuItems />
        </div>

        {
          isAuthenticated ? <div className='hidden lg:block'><HeaderRightContent /></div> : null
        }

      </div>
    </header>
  )
}

export default ShoppingHeader
