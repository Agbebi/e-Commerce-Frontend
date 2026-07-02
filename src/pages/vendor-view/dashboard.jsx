import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Package, DollarSign, PlusCircle, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchAllProducts } from '@/store/vendor/product-slice'
import { getAllOrders } from '@/store/vendor/order-slice'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'
import LoadingState from '@/components/ui/loading-state'

function VendorDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { productList, isLoading: productsLoading } = useSelector((state) => state.vendorProducts)
  const { orderList, isLoading: ordersLoading } = useSelector((state) => state.vendorOrders)

  const vendorId = user?.id || user?._id

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchAllProducts(vendorId))
      dispatch(getAllOrders(vendorId))
    }
  }, [dispatch, vendorId])

  const stats = useMemo(() => {
    const totalProducts = productList?.length || 0
    const totalOrders = orderList?.length || 0
    const pendingOrders = orderList?.filter((item) => item.deliveryStatus === 'pending').length || 0
    const totalRevenue = orderList?.reduce((sum, order) => {
      const value = Number(order.subTotal || 0)
      return sum + (Number.isNaN(value) ? 0 : value)
    }, 0)

    return [
      {
        label: 'Products',
        value: totalProducts,
        icon: <ShoppingBag className='h-5 w-5' />,
        description: 'Active product listings',
      },
      {
        label: 'Orders',
        value: totalOrders,
        icon: <ClipboardList className='h-5 w-5' />,
        description: 'Total orders received',
      },
      {
        label: 'Pending',
        value: pendingOrders,
        icon: <Package className='h-5 w-5' />,
        description: 'Awaiting fulfillment',
      },
      {
        label: 'Revenue',
        value: formatPriceDisplay(totalRevenue),
        icon: <TbCurrencyNaira className='h-5 w-5' />,
        description: 'Sales this period (NGN)',
      },
    ]
  }, [orderList, productList])

  const orderBreakdown = useMemo(() => {
    const total = orderList?.length || 0
    const labels = ['pending', 'processing', 'shipped', 'completed', 'cancelled']
    const colors = {
      pending: 'bg-amber-400',
      processing: 'bg-sky-500',
      shipped: 'bg-violet-500',
      completed: 'bg-emerald-500',
      cancelled: 'bg-red-500',
    }

    return labels.map((status) => {
      const count = orderList?.filter((order) => order.payoutStatus === status).length || 0
      return {
        status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
        color: colors[status],
      }
    })
  }, [orderList])

  const averageOrder = useMemo(() => {
    const total = orderList?.length || 0
    const totalRevenue = orderList?.reduce((sum, order) => {
      const value = Number(order.subTotal || 0)
      return sum + (Number.isNaN(value) ? 0 : value)
    }, 0)
    return total > 0 ? totalRevenue / total : 0
  }, [orderList])

  const lowStockProducts = useMemo(() => {
    return (productList || [])
      .filter((product) => Number(product.totalStock || 0) <= 5)
      .slice(0, 4)
  }, [productList])

  const recentOrders = orderList?.slice(0, 5) || []
  const featuredProducts = productList?.slice(0, 4) || []
  const isDashboardLoading = (productsLoading || ordersLoading) && (!productList?.length || !orderList?.length)

  if (isDashboardLoading) {
    return (
      <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <LoadingState
          title='Loading your dashboard'
          description='Gathering products, orders, and sales insights for your store.'
          className='min-h-[280px]'
        />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-orange-500'>Dashboard</p>
            <h1 className='mt-6 text-3xl font-semibold text-slate-900'>Welcome back, {user?.name || 'Vendor'}!</h1>
            <p className='mt-2 max-w-2xl text-sm text-gray-600'>Manage your inventory, track orders, and grow your store from one place.</p>
          </div>
          <div className='flex flex-col mt-8 gap-3 sm:flex-row'>
            <Button className='border border-gray-300 text-gray-600' variant='secondary' size='lg' onClick={() => navigate('/vendor/products')}>
              <PlusCircle className='h-4 w-4' />
              Manage Products
            </Button>
            <Button className='' variant='filled' size='lg' onClick={() => navigate('/vendor/orders')}>
              View Orders
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((item) => (
          <Card key={item.label} className='border py-4 border-gray-200 bg-white'>
            <CardContent className='space-y-4 px-4'>
              <div className='flex items-center justify-between'>
                <div className='rounded-2xl bg-orange-100 p-3 text-slate-700'>{item.icon}</div>
                <Badge className='bg-slate-100 text-slate-700'>{item.label}</Badge>
              </div>
              <div>
                <p className='text-lg sm:text-2xl ml-2 mb-2 font-bold'>{item.value}</p>
                <p className='mt-1 text-sm text-gray-500'>{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-4 xl:grid-cols-[1.4fr_0.6fr]'>
        <Card className='border-none shadow-none border-gray-200 bg-white'>
          <CardHeader>
            <CardTitle className='text-lg'>Store health</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='rounded-2xl border border-gray-100 bg-slate-50 p-4'>
                <p className='text-sm font-medium text-gray-500'>Average order value</p>
                <p className='mt-3 text-2xl font-semibold text-slate-900'>₦{formatPriceDisplay(averageOrder)}</p>
              </div>
              <div className='rounded-2xl border border-gray-100 bg-slate-50 p-4'>
                <p className='text-sm font-medium text-gray-500'>Low stock products</p>
                <p className='mt-3 text-2xl font-semibold text-slate-900'>{lowStockProducts.length}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='mt-2'>
                <p className='text-sm font-medium text-gray-500'>Order payout status</p>
                <div className='mt-3 space-y-3'>
                  {orderBreakdown.map((status) => (
                    <div key={status.status} className='space-y-2'>
                      <div className='flex items-center justify-between text-sm text-gray-600'>
                        <span>{status.label}</span>
                        <span>{status.count} orders</span>
                      </div>
                      <div className='h-2 overflow-hidden rounded-full bg-slate-100'>
                        <div className={`${status.color} h-full rounded-full`} style={{ width: `${status.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-none shadow-none border-gray-200 bg-white'>
          <CardHeader>
            <CardTitle className='text-lg'>Low stock alerts</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {lowStockProducts.length > 0 ? (
              <div className='space-y-3'>
                {lowStockProducts.map((product) => (
                  <div key={product._id} className='flex items-center gap-3 rounded-3xl border border-gray-100 bg-slate-50 p-3'>
                    <div className='flex-1 min-w-0'>
                      <p className='truncate font-semibold text-slate-900'>{product.name || 'Unnamed product'}</p>
                      <p className='text-sm text-gray-600'>{product.totalStock ?? 0} left in stock</p>
                    </div>
                    <Badge className='bg-amber-100 text-amber-700'>Restock</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>All products are healthy in stock right now.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 xl:grid-cols-[1.2fr_0.8fr]'>
        <Card className='border border-gray-200 bg-white'>
          <CardHeader>
            <CardTitle className='text-lg'>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {ordersLoading ? (
              <p className='text-sm text-gray-500'>Loading orders…</p>
            ) : recentOrders.length > 0 ? (
              <div className='space-y-3'>
                {recentOrders.map((order) => (
                  <div key={order._id} className='flex flex-col gap-3 rounded-2xl border border-gray-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold text-slate-900'>Order {order._id?.slice(-8) || 'N/A'}</p>
                      <p className='text-sm text-gray-600'>{order.payoutDate ? new Date(order.payoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Badge className='bg-slate-100 text-slate-700'>{order.deliveryStatus || 'Unknown'}</Badge>
                      <Badge className='bg-slate-100 text-slate-700'>{order.payoutStatus || 'Status'}</Badge>
                      <span className='text-sm font-medium text-slate-900'>₦{formatPriceDisplay(order.subTotal || 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>No recent orders yet. New orders will appear here once customers start buying your products.</p>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-200 bg-white mb-4'>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {productsLoading ? (
              <p className='text-sm text-gray-500'>Loading products…</p>
            ) : featuredProducts.length > 0 ? (
              <div className='grid gap-3'>
                {featuredProducts.map((product) => (
                  <div key={product._id} className='flex items-center gap-3 rounded-3xl border border-gray-100 bg-slate-50 p-3'>
                    <img
                      src={product.images?.[0] || product.image || 'https://via.placeholder.com/100'}
                      alt={product.name}
                      className='h-16 w-16 rounded-2xl object-cover'
                    />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-semibold text-slate-900'>{product.name || 'Unnamed product'}</p>
                      <p className='text-sm text-gray-600'>₦{formatPriceDisplay(product.salesPrice > 0 ? product.salesPrice : product.price || 0)}</p>
                    </div>
                    <Badge className='bg-slate-100 text-slate-700'>{product.totalStock ? `${product.totalStock} in stock` : 'No stock'}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>No products found. Add inventory so customers can start buying.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VendorDashboard