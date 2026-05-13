import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BedIcon, CircleUser, CircleUserRound, House, HouseHeart, LogOutIcon, Menu, MenuIcon, ShoppingBasketIcon, ShoppingCart, User } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewCategories, menuLinks } from '../../config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import UserCartWrapper from '../../components/shopping-view/cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Label } from '@/components/ui/label'
import { CiHome, CiMenuBurger, CiSearch } from 'react-icons/ci'
import { IoBasket, IoCall, IoCallOutline } from 'react-icons/io5'
import { FaAddressCard, FaHome } from 'react-icons/fa'
import { SlLogout } from 'react-icons/sl'
import { Separator } from '@/components/ui/separator'
import { FaShopify } from 'react-icons/fa6'
import { BiBasket } from 'react-icons/bi'





function MenuItems() {

  const navigate = useNavigate()
  // const location = useLocation()
  // const [, setSearchParams] = useSearchParams()
  // const [openMenu, setOpenMenu] = useState(false)


  // function handleNavigate(getCurrentItem) {
  //   // sessionStorage.removeItem('filters')
  //   // const currentFilter = getCurrentItem.id !== 'home' ? {
  //   //   Category: [getCurrentItem.id]
  //   // } : null

  //   // sessionStorage.setItem('filters', JSON.stringify(currentFilter))

  //   // location.pathname.includes('listing') && currentFilter !== null ?
  //   //   setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`)) :
  //     navigate(getCurrentItem.path)    
  // }
  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
      {
        menuLinks.map((category) => (
          <Label key={category.value}
            className={`cursor-pointer text-sm font-medium text-gray-900 transition-colors duration-200`}
            onClick={() => { navigate(category.path); }}
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

      <Button size='sm' onClick={() => navigate('/shop/search')} className='rounded-full border border-gray-200'><CiSearch size='sm' className='w-6 h-7' /></Button>

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button onClick={() => setOpenCartSheet(true)} className='rounded-full border border-gray-200' size='icon'>
          <ShoppingCart className='w-6 h-6' />
          <span className='sr-only'>Cart</span>
        </Button>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems} />
      </Sheet>


      <DropdownMenu>
        <DropdownMenuTrigger className='cursor-pointer' asChild>
          <Avatar className='bg-black'>
            <AvatarFallback className='bg-black text-white'>
              {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>


        <DropdownMenuContent side='right' className='bg-white w-48 border border-gray-100'>
          <DropdownMenuLabel className='text-gray-600 font-light'>Logged in as {user.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator className='' />
          <DropdownMenuItem onClick={() => navigate('/shop/account')} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
            <CircleUserRound className='mr-2 h-6 w-6' />
            <span className='font-light'>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
            <LogOutIcon />
            <span className='text-light'>Logout</span>
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
    <header className='sticky bg-white w-full top-0 z-50'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>

        <div className='flex items-center lg:hidden gap-2 flex-row'>

          <DropdownMenu className=''>
            <DropdownMenuTrigger className=' p-2'>
              <CiMenuBurger className='' />
            </DropdownMenuTrigger>

            <DropdownMenuContent className='border-gray-100 shadow-sm bg-white p-2 mx-2 rounded-lg'>
              <DropdownMenuGroup className='flex flex-col gap-2'>
                <DropdownMenuLabel className='text-xs font-light text-gray-500'>Links</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/shop/home')} className='w-full text-gray-800' ><FaHome /><span className=''> Home</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop/listing')} className='w-full text-gray-800' ><FaShopify /><span className=''> Shop</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop/orders')} className='w-full text-gray-800'><IoBasket /><span>View Orders</span> </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop/address')} className='w-full text-gray-800' ><FaAddressCard /><span>Manage Addresses</span> </DropdownMenuItem>
                <DropdownMenuItem className='w-full text-gray-800' ><IoCall /><span className=''> Contact Us</span></DropdownMenuItem>
              </DropdownMenuGroup>


              <DropdownMenuSeparator className='border-b border-gray-200 w-3/4 mx-auto py-0 inset-0.5' />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link to="/shop/home" className='flex items-center gap-2'>
          <span className='font-light text-black'>Tim Marketplace</span>
        </Link>

        <div className='lg:hidden flex gap-2 justify-center items-center'>
          <Button size='sm' onClick={() => navigate('/shop/search')} className='rounded-full border border-gray-200'><CiSearch size='sm' className='w-6 h-7' /></Button>
          {isAuthenticated ?

            <DropdownMenu>
              <DropdownMenuTrigger className='cursor-pointer' asChild>
                <Button
                  className='rounded-full border border-gray-200' size='icon'>
                  <User className='w-8 h-8' />
                </Button>
              </DropdownMenuTrigger>


              <DropdownMenuContent side='bottom' className='bg-white mr-4 text-black w-48 border border-gray-200 shadow-sm'>
                <DropdownMenuLabel className='flex flex-col items-center justify-center gap-2 w-full'>
                  <Avatar className='w-6 h-6' size='10'>
                    <AvatarFallback className=' bg-black text-white text-lg'>T</AvatarFallback>
                  </Avatar>
                  <span className='w-full text-center'>Welcome back, {user.userName}!</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='border-b border-gray-200' />
                <DropdownMenuItem onClick={() => navigate('/shop/orders')} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
                  <BiBasket className=' h-6 w-6' />
                  <span>Order History?</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='hover:bg-gray-800 cursor-pointer hover:text-white'>
                  <SlLogout />
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
