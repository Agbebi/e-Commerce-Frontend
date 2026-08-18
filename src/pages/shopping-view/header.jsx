import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { IoMenu, IoSearch, IoCartOutline, IoClose, IoHome, IoStorefront, IoReceipt, IoLocation, IoCall, IoPerson, IoLogOutOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { menuLinks } from '../../config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { logoutUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { fetchSearchResults, resetSearchResults } from '@/store/shop/search-slice'
import SearchBar from '@/components/common/search-bar'
import SearchResultsDropdown from '@/components/common/search-results-dropdown'
import NotificationBell from '@/components/common/notification-bell'
import CartDrawer from '@/components/shopping-view/cart-drawer'
import { Avatar as MuiAvatar, Badge, IconButton, alpha } from '@mui/material'

function MenuItems({ onNavigate, location }) {
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const iconMap = {
    'Home': IoHome,
    'Shop': IoStorefront,
    'View Orders': IoReceipt,
    'Manage Addresses': IoLocation,
    'Contact Us': IoCall,
  }

  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-1 lg:gap-6 lg:flex-row'>
      {menuLinks.map((link) => {
        const active = isActive(link.path)
        const Icon = iconMap[link.label]
        return (
          <button
            key={link.value}
            onClick={() => { navigate(link.path); onNavigate?.(); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 w-full lg:w-auto text-left ${
              active
                ? 'text-slate-900 bg-slate-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {active && Icon && <Icon size={16} />}
            {link.label}
          </button>
        )
      })}
    </nav>
  )
}

function MobileMenu({ open, onClose, isAuthenticated, location }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser()).then(toast.success('Logged out successfully!')).catch(() => toast.error('Logout failed!'))
    onClose()
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const iconMap = {
    'Home': IoHome,
    'Shop': IoStorefront,
    'View Orders': IoReceipt,
    'Manage Addresses': IoLocation,
    'Contact Us': IoCall,
    'Profile': IoPerson,
    'Order History': IoReceipt,
    'Addresses': IoLocation,
    'Logout': IoLogOutOutline,
  }

  return (
    <>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1400] lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-[280px] bg-white z-[1401] shadow-2xl lg:hidden flex flex-col"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <Link to="/shop/home" onClick={onClose} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">T</span>
                </div>
                <span className="text-lg font-bold text-slate-900">Tim Marketplace</span>
              </Link>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                <IoClose size={20} className="text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Menu</p>
                <nav className='flex flex-col gap-1'>
                  {menuLinks.map((link) => {
                    const active = isActive(link.path)
                    const Icon = iconMap[link.label]
                    return (
                      <button
                        key={link.value}
                        onClick={() => { navigate(link.path); onClose(); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                          active
                            ? 'text-slate-900 bg-slate-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {active && Icon && <Icon size={18} />}
                        {link.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {isAuthenticated && (
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Account</p>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => { navigate('/shop/account'); onClose(); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                        isActive('/shop/account')
                          ? 'text-slate-900 bg-slate-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {isActive('/shop/account') && <IoPerson size={18} />}
                      Profile
                    </button>
                    <button
                      onClick={() => { navigate('/shop/orders'); onClose(); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                        isActive('/shop/orders')
                          ? 'text-slate-900 bg-slate-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {isActive('/shop/orders') && <IoReceipt size={18} />}
                      Order History
                    </button>
                    <button
                      onClick={() => { navigate('/shop/address'); onClose(); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                        isActive('/shop/address')
                          ? 'text-slate-900 bg-slate-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {isActive('/shop/address') && <IoLocation size={18} />}
                      Addresses
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 w-full text-left"
                    >
                      <IoLogOutOutline size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </>
  )
}

function ShoppingHeader() {

  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cartItems } = useSelector((state) => state.shopCart)
  const [cartOpen, setCartOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutUser()).then(toast.success('Logged out successfully!')).catch(() => toast.error('Logout failed!'))
  }

  useEffect(() => {
    dispatch(fetchCartItems({ userId: user.id }))
  }, [dispatch, user.id])


  const navigate = useNavigate()
  const location = useLocation()
  const [, setSearchParams] = useSearchParams()

  function handleNavigate(getCurrentItem) {
    if (getCurrentItem.path === '/shop/listing') {
      sessionStorage.removeItem('filters')
      const currentFilter = getCurrentItem.id !== 'home' && getCurrentItem.id !== 'shop' ? {
        Category: [getCurrentItem.id]
      } : null

      sessionStorage.setItem('filters', JSON.stringify(currentFilter))

      location.pathname.includes('listing') && currentFilter !== null ?
        setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`)) :
        navigate(getCurrentItem.path)
    } else {
      navigate(getCurrentItem.path)
    }
  }

  return (
    <header className='sticky bg-white w-full top-0 z-50'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>

        <div className='flex items-center gap-3'>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className='lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors'
          >
            <IoMenu size={22} className='text-slate-700' />
          </button>

          <Link to="/shop/home" className='flex items-center gap-2.5 group'>
            <div className='w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors'>
              <span className='text-white text-sm font-bold'>T</span>
            </div>
            <div className='hidden sm:block'>
              <span className='text-lg font-bold text-slate-900 tracking-tight'>Tim Marketplace</span>
            </div>
          </Link>
        </div>

        <nav className='hidden lg:flex items-center gap-1'>
          {menuLinks.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/')
            const iconMap = {
              'Home': IoHome,
              'Shop': IoStorefront,
              'View Orders': IoReceipt,
              'Manage Addresses': IoLocation,
              'Contact Us': IoCall,
            }
            const Icon = iconMap[link.label]
            return (
              <button
                key={link.value}
                onClick={() => handleNavigate(link)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-slate-900 bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && Icon && <Icon size={16} />}
                {link.label}
              </button>
            )
          })}
        </nav>

        <div className='flex items-center gap-1 sm:gap-2'>
          <div className='hidden lg:block'>
            <HeaderSearch />
          </div>

          <div className='lg:hidden'>
            <IconButton
              onClick={() => navigate('/shop/search')}
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { backgroundColor: alpha('#000', 0.04) }
              }}
            >
              <IoSearch size={20} />
            </IconButton>
          </div>

          <NotificationBell />

          <IconButton
            onClick={() => setCartOpen(true)}
            sx={{
              color: 'text.secondary',
              '&:hover': { backgroundColor: alpha('#000', 0.04) },
              transition: 'all 0.2s ease',
            }}
          >
            <Badge
              badgeContent={cartItems?.items?.length || 0}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 18,
                  padding: '0 4px',
                  fontWeight: 600,
                  border: '2px solid white',
                },
              }}
            >
              <IoCartOutline size={20} />
            </Badge>
          </IconButton>

          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='cursor-pointer' asChild>
                <MuiAvatar sx={{ 
                  bgcolor: 'black', 
                  color: 'white', 
                  cursor: 'pointer', 
                  width: 32, 
                  height: 32, 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                </MuiAvatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent side='bottom' align='end' className='bg-white w-56 border border-slate-200 shadow-xl rounded-xl overflow-hidden p-1'>
                <div className='px-2 py-2'>
                  <p className='text-sm font-semibold text-slate-900'>{user.userName}</p>
                  <p className='text-xs text-slate-500'>{user.email}</p>
                </div>
                <DropdownMenuSeparator className='bg-slate-200 my-1' />
                <DropdownMenuItem onClick={() => navigate('/shop/account')} className='gap-3 cursor-pointer hover:bg-slate-50 rounded-lg'>
                  <IoPerson size={16} className='text-slate-600' />
                  <span className='text-sm text-slate-700'>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop/orders')} className='gap-3 cursor-pointer hover:bg-slate-50 rounded-lg'>
                  <IoReceipt size={16} className='text-slate-600' />
                  <span className='text-sm text-slate-700'>Order History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-slate-200 my-1' />
                <DropdownMenuItem onClick={handleLogout} className='gap-3 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg'>
                  <IoLogOutOutline size={16} />
                  <span className='text-sm font-medium'>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/auth/login"
              className='hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md'
            >
              <IoPerson size={16} />
              Login
            </Link>
          )}
        </div>
      </div>

      <MobileMenu 
        open={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        isAuthenticated={isAuthenticated}
        location={location}
      />
    </header>
  )
}

function HeaderSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchExpanded, setSearchExpanded] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { searchResults } = useSelector((state) => state.shopSearch)

  useEffect(() => {
    let timeoutId
    if (searchQuery.trim().length > 0) {
      timeoutId = setTimeout(() => {
        dispatch(fetchSearchResults(searchQuery))
      }, 300)
    } else {
      dispatch(resetSearchResults())
    }
    return () => clearTimeout(timeoutId)
  }, [searchQuery, dispatch])

  useEffect(() => {
    if (!searchExpanded) {
      setSearchQuery('')
      dispatch(resetSearchResults())
    }
  }, [searchExpanded, dispatch])

  const handleSearch = (keyword) => {
    navigate(`/shop/search?keyword=${keyword}`)
    setSearchQuery('')
    setSearchExpanded(false)
    dispatch(resetSearchResults())
  }

  const handleResultClick = (product) => {
    navigate(`/shop/product/${product._id}`)
    setSearchQuery('')
    setSearchExpanded(false)
    dispatch(resetSearchResults())
  }

  return (
    <div className='relative'>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        onSearch={handleSearch}
        expanded={searchExpanded}
        onExpandChange={setSearchExpanded}
      />
      {searchQuery.trim().length > 0 && (
        <SearchResultsDropdown
          results={searchResults}
          searchQuery={searchQuery}
          onResultClick={handleResultClick}
          onClose={() => dispatch(resetSearchResults())}
        />
      )}
    </div>
  )
}

export default ShoppingHeader
