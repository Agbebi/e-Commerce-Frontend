import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import VendorOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/vendor/order-slice'
import { Badge } from '../ui/badge'
import { formatPriceDisplay } from '@/lib/utils'
import LoadingState from '@/components/ui/loading-state'

function VendorOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const { user } = useSelector((state) => state.auth)
  const { orderList, isLoading } = useSelector((state) => state.vendorOrders)

  const dispatch = useDispatch()
  const userId = user?.id || user?._id
  const filterOptions = ['all', 'pending', 'packaging', 'accepted', 'ready', 'cancelled']

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrders({
        userId,
        filterParams: statusFilter !== 'all' ? { status: statusFilter } : {},
        sortParams: sortOrder
      }))
    }
  }, [dispatch, userId, statusFilter, sortOrder])


  function handleDetailsView(order) {
    setOpenDetailsDialog(true)
    setSelectedOrder(order)
  }

  return (
    // <div className=''>
    <Card className='rounded-lg w-full grid border border-gray-200 bg-white shadow-sm'>
      <CardHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <CardTitle className='text-lg'>All Orders</CardTitle>
              <p className='text-sm text-gray-500 mt-4'>Review order activity, update fulfillment, and stay on top of store performance.</p>
            </div>
            <div className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700'>
              {orderList?.length || 0} orders total
            </div>
          </div>

          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-wrap items-center gap-2 text-sm text-slate-600'>
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type='button'
                  onClick={() => setStatusFilter(option)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${statusFilter === option ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            <div className='flex items-center gap-2 text-sm text-slate-600'>
              <label htmlFor='vendor-order-sort' className='font-medium'>Sort:</label>
              <select
                id='vendor-order-sort'
                className='rounded border border-slate-300 bg-white px-3 py-1 text-sm'
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value='newest'>Newest first</option>
                <option value='oldest'>Oldest first</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='grid overflow-auto w-full'>
        <Table className=' overflow-auto'>
          <TableHeader className='bg-slate-50 text-slate-700 text-center'>
            <TableRow className='border-none text-sm'>
              <TableHead className='text-sm text-center'>Order ID</TableHead>
              <TableHead className='text-sm text-center'>Order Date</TableHead>
              <TableHead className='text-sm text-center'>Delivery Status</TableHead>
              <TableHead className='text-sm text-center'>Order Status</TableHead>
              <TableHead className='text-sm text-center'>Total (NG)</TableHead>
              <TableHead>
                <span className="sr-only">View Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='text-sm text-center'>
            {isLoading && !orderList?.length ? (
              <TableRow>
                <TableCell colSpan={6} className='py-10'>
                  <LoadingState
                    title='Loading orders'
                    description='Fetching the latest order activity from your store.'
                    compact
                    className='border-none bg-transparent shadow-none'
                  />
                </TableCell>
              </TableRow>
            ) : orderList && orderList.length > 0 ? (
              orderList.map((order) => (
                <TableRow key={order._id} className='border-b border-slate-100'>
                  <TableCell className='font-medium text-slate-900'>{order._id || 'N/A'}</TableCell>
                  <TableCell className='text-slate-600'>
                    {order.payoutDate ? new Date(order.payoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      {
                        pending: 'bg-amber-100 text-amber-700',
                        accepted: 'bg-blue-100 text-blue-700',
                        packaging: 'bg-purple-100 text-purple-700',
                        ready: 'bg-emerald-100 text-emerald-700',
                      }[order.deliveryStatus] || 'bg-slate-100 text-slate-700'
                    }>
                      {order.deliveryStatus ? order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1) : 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      {
                        pending: 'bg-amber-100 text-amber-700',
                        processing: 'bg-sky-100 text-sky-700',
                        shipped: 'bg-purple-100 text-purple-700',
                        completed: 'bg-emerald-100 text-emerald-700',
                        cancelled: 'bg-red-100 text-red-700',
                      }[order.payoutStatus] || 'bg-slate-100 text-slate-700'
                    }>
                      {order.payoutStatus ? order.payoutStatus.charAt(0).toUpperCase() + order.payoutStatus.slice(1) : 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-semibold text-slate-900'>
                    {formatPriceDisplay(order.subTotal)}
                  </TableCell>
                  <TableCell>
                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} className='bg-white rounded-lg shadow-lg p-4'>
                      <Button size='' onClick={() => handleDetailsView(order)} className='rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700'>
                        View / Update
                      </Button>
                      {openDetailsDialog && <VendorOrderDetailsView selectedOrder={selectedOrder} setOpenDetailsDialog={setOpenDetailsDialog} />}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-center text-sm text-gray-500'>
                  No orders found yet. Once a customer places an order, it will appear here for quick review and updates.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    // </div>
  )
}

export default VendorOrders