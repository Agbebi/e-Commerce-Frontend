import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthLayout from './components/ui/auth/layout'
import AuthRegister from './pages/auth/register'
import AuthLogin from './pages/auth/login'
import VendorLayout from './components/vendor-view/layout'
import VendorDashboard from './pages/vendor-view/dashboard'
import VendorFeatures from './pages/vendor-view/features'
import VendorOrders from './pages/vendor-view/orders'
import VendorProducts from './pages/vendor-view/products'
import VendorProductForm from './pages/vendor-view/product-form'
import ShoppingLayout from './pages/shopping-view/layout'
import NotFound from './pages/not-found'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/auth/unauth-page/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice'
import { getNotifications } from './store/notification-slice'
import LoadingState from './components/ui/loading-state'
import ProductDetailsPage from './pages/shopping-view/product-details-page'
import PaymentSuccess from './pages/shopping-view/payment-success'
import ShoppingOrdersPage from './pages/shopping-view/orders'
import ShoppingAddressPage from './pages/shopping-view/address-page'
import SearchPage from './pages/shopping-view/search'
import ContactPage from './pages/shopping-view/contact'
import VendorProfile from './pages/vendor-view/profile'
import DispatchDashboard from './pages/dispatch/dashboard'
import DispatchDeliveryPage from './pages/dispatch/deliver'
import DispatchLayout from './components/dispatch/layout'
import DispatchOrdersPage from './pages/dispatch/orders'
import VendorAuthRegister from './pages/auth/register-vendor'
import FirstPage from './pages/first-page'
import DispatcherAuthRegister from './pages/auth/register-dispatch'
import VendorAuthLogin from './pages/auth/login-vendor'
import DispatcherAuthLogin from './pages/auth/login-dispatcher'
import VerifyEmailPage from './pages/auth/verify-email'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ResetPasswordPage from './pages/auth/reset-password'
import useSocket from './hooks/useSocket'

const App = () => {
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  useSocket()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      dispatch(getNotifications())
    }
  }, [isAuthenticated, user, isLoading, dispatch])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10'>
        <div className='w-full max-w-md'>
          <LoadingState title='Preparing your experience' description='We are loading your account details and storefront settings.' />
        </div>
      </div>
    )
  }



  return (
    <>
      <main>
        <div className='flex flex-col'>
          <Routes>
            <Route path='/auth' element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            } >
            
              <Route path='login' element={<AuthLogin />} />
              <Route path='login-vendor' element={<VendorAuthLogin />} />
              <Route path='login-dispatch' element={<DispatcherAuthLogin />} />

              <Route path='register' element={<AuthRegister />} />
              <Route path='register-vendor' element={<VendorAuthRegister />} />
              <Route path='register-dispatcher' element={<DispatcherAuthRegister />} />
              <Route path='verify-email' element={<VerifyEmailPage />} />
              <Route path='forgot-password' element={<ForgotPasswordPage />} />
              <Route path='reset-password/:token' element={<ResetPasswordPage />} />
            </Route>

            <Route path='/vendor' element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <VendorLayout />
              </CheckAuth>
            } >
              <Route path='dashboard' element={<VendorDashboard />} />
              <Route path='features' element={<VendorFeatures />} />
              <Route path='orders' element={<VendorOrders />} />
              <Route path='products' element={<VendorProducts />} />
              <Route path='products/new' element={<VendorProductForm />} />
              <Route path='products/edit/:id' element={<VendorProductForm />} />
              <Route path='profile' element={<VendorProfile />} />
            </Route>


            <Route path='/dispatch' element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <DispatchLayout />
              </CheckAuth>
            } >
              <Route path='dashboard' element={<DispatchDashboard />} />
              <Route path='orders' element={<DispatchOrdersPage />} />
              <Route path='deliver' element={<DispatchDeliveryPage />} />
            </Route>

            <Route path='/shop' element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout />
              </CheckAuth>}
            >
              <Route path='home' element={<ShoppingHome />} />
              <Route path='account' element={<ShoppingAccount />} />
              <Route path='listing' element={<ShoppingListing />} />
              <Route path='checkout' element={<ShoppingCheckout />} />
              <Route path='payment' element={<PaymentSuccess />} />
              <Route path='orders' element={<ShoppingOrdersPage />} />
              <Route path='address' element={<ShoppingAddressPage />} />
              <Route path='search' element={<SearchPage />} />
              <Route path='contact' element={<ContactPage />} />
              <Route path='product/:productId' element={<ProductDetailsPage />} />
            </Route>
            <Route path='/unauth-page' element={<UnauthPage />} />
            <Route path='*' element={<CheckAuth />} />
             <Route path='/' element={<FirstPage />} />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App;