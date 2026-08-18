import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  DollarSign,
  PlusCircle,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
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
        icon: <ShoppingBag className="h-5 w-5" />,
        description: 'Active listings',
      },
      {
        label: 'Orders',
        value: totalOrders,
        icon: <ClipboardList className="h-5 w-5" />,
        description: 'Total received',
      },
      {
        label: 'Pending',
        value: pendingOrders,
        icon: <Package className="h-5 w-5" />,
        description: 'Awaiting action',
      },
      {
        label: 'Revenue',
        value: `₦${formatPriceDisplay(totalRevenue)}`,
        icon: <TbCurrencyNaira className="h-5 w-5" />,
        description: 'Sales this period',
      },
    ]
  }, [orderList, productList])

  const orderBreakdown = useMemo(() => {
    const total = orderList?.length || 0
    const labels = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const colors = {
      pending: 'bg-slate-400',
      processing: 'bg-slate-500',
      shipped: 'bg-slate-600',
      delivered: 'bg-slate-700',
      cancelled: 'bg-slate-300',
    }

    return labels.map((status) => {
      const count = orderList?.filter((order) => order.deliveryStatus === status).length || 0
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <LoadingState
          title="Loading your dashboard"
          description="Gathering products, orders, and sales insights for your store."
          className="min-h-[280px]"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero / Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 pointer-events-none" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
              Welcome back, {user?.shopName || 'Vendor'}
            </h1>
            <p className="max-w-md text-sm text-slate-500 leading-relaxed">
              Manage your inventory, track orders, and grow your store from one place.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row pt-1">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/vendor/products')}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/vendor/orders')}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                View Orders
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <img
              src="/illustration.png"
              alt="Vendor dashboard illustration"
              className="w-full max-w-sm lg:max-w-md drop-shadow-sm"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((item) => (
          <Card
            key={item.label}
            className="border border-slate-200 bg-white rounded-2xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                {item.icon}
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Bento Grid - Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Store Health - Spans 2 columns */}
        <Card className="lg:col-span-2 border border-slate-200 bg-white rounded-3xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Store Health</h3>
                <p className="text-sm text-slate-500 mt-1">A quick look at performance and inventory status</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-8">
            {/* Top metrics */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. Order Value</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">₦{formatPriceDisplay(averageOrder)}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                      <ArrowUpRight className="h-3 w-3" />
                      +12% from last month
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Low Stock Items</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">{lowStockProducts.length}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                      <Activity className="h-3 w-3" />
                      Needs attention
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Order Status Breakdown</p>
                <span className="text-xs text-slate-500 font-medium">{orderList?.length || 0} total orders</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {orderBreakdown.map((status) => (
                  <div
                    key={status.status}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center"
                  >
                    <div className="relative flex h-14 w-14 items-center justify-center">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" fill="none" strokeWidth="6" className="text-slate-200" />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="none"
                          strokeWidth="6"
                          strokeLinecap="round"
                          className={`${status.color} transition-all duration-500`}
                          strokeDasharray={`${2 * Math.PI * 24}`}
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - (status.percent / 100))}`}
                        />
                      </svg>
                      <span className="text-xs font-bold text-slate-900">{status.percent}%</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{status.label}</p>
                      <p className="text-[11px] text-slate-500">{status.count} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border border-slate-200 bg-white rounded-3xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">Low Stock</h3>
                <p className="text-xs text-slate-500 mt-1">Items that may need restocking soon</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="px-8 pb-8">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{product.name || 'Unnamed product'}</p>
                        <p className="text-xs text-slate-500">{product.totalStock ?? 0} left in stock</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs">Restock</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="p-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-3">
                  <Package className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-slate-900">All healthy</p>
                <p className="text-xs text-slate-500 mt-1">No low stock items</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Bento Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Orders - Spans 2 columns */}
        <Card className="lg:col-span-2 border border-slate-200 bg-white rounded-3xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">Recent Orders</h3>
                <p className="text-xs text-slate-500 mt-1">Latest transactions from your store</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/vendor/orders')}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                View all
                <ArrowUpRight className="h-3 w-3 ml-1 rotate-45" />
              </Button>
            </div>
          </div>
          <div className="px-8 pb-8">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 hover:border-slate-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Order #{order._id?.slice(-8) || 'N/A'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.payoutDate ? new Date(order.payoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        {order.deliveryStatus || 'Unknown'}
                      </Badge>
                      <span className="text-sm font-bold text-slate-900">₦{formatPriceDisplay(order.subTotal || 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="p-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-3">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-slate-900">No orders yet</p>
                <p className="text-xs text-slate-500 mt-1">Orders will appear here</p>
              </div>
            )}
          </div>
        </Card>

        {/* Featured Products */}
        <Card className="border border-slate-200 bg-white rounded-3xl overflow-hidden">
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">Products</h3>
                <p className="text-xs text-slate-500 mt-1">Your top inventory items</p>
              </div>
            </div>
          </div>
          <div className="px-8 pb-8">
            {productsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 hover:border-slate-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{product.name || 'Unnamed product'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">₦{formatPriceDisplay(product.salesPrice > 0 ? product.salesPrice : product.price || 0)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Stock</span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                        {product.totalStock ? `${product.totalStock} left` : 'Out'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="p-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-3">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-slate-900">No products</p>
                <p className="text-xs text-slate-500 mt-1">Add inventory to get started</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VendorDashboard
