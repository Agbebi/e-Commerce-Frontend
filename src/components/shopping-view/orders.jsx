import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ShoppingOrderDetails from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, getOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { TbCurrencyNaira } from 'react-icons/tb'

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orderList, orderDetails } = useSelector(state => state.shopOrder)

  const userId = user?.id || user?._id
  const filterOptions = ['all', 'pending', 'completed', 'failed']

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrders({
        userID: userId,
        filterParams: statusFilter !== 'all' ? { status: statusFilter } : {},
        sortParams: sortOrder
      }))
    }
  }, [dispatch, userId, statusFilter, sortOrder])

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId)).then((data) => {
      console.log(data);
      setOpenDetailsDialog(true)
    })
  }

  return (
    <Card className='border-none rounded-none grid gap-1 w-full'>
      <CardHeader className='flex justify-between items-center text-sm'>
        <div>Orders</div>
      </CardHeader>

      <CardContent className='py-4 overflow-auto'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4'>
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
            <label htmlFor='shop-order-sort' className='font-medium'>Sort:</label>
            <select
              id='shop-order-sort'
              className='rounded border border-slate-300 bg-white px-3 py-1 text-xs'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='newest'>Newest first</option>
              <option value='oldest'>Oldest first</option>
            </select>
          </div>
        </div>
        <Separator className='border-b mb-4 mt-0 border-gray-100' />
        <Table className='w-full'>
          <TableHeader className='bg-orange-300 text-sm '>
            <TableRow className='border-none text-sm p-2 shadow'>
              <TableHead className='text-sm text-center'>Order ID</TableHead>
              <TableHead className='text-sm text-center'>Payment Date</TableHead>
              <TableHead className='text-sm text-center'>Payment Status</TableHead>
              <TableHead className='text-sm text-center'>Total Payment (NG)</TableHead>
              <TableHead>
                <span className="sr-only">View Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='text-xs'>
            {
              orderList && orderList.length > 0 ? orderList.map(order =>
                <TableRow className='border-none shadow text-center'>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.orderDate.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Badge className={
                      `${order.paymentStatus == 'pending' ? 'bg-amber-400' : 'bg-green-400'
                      }`
                    }>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{Number(order.totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  <TableCell>
                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} >
                      <Button onClick={() => handleFetchOrderDetails(order._id)} className="bg-gray-500 text-white px-2 py-0 rounded hover:bg-gray-600">
                        View Details
                      </Button>

                      {
                        orderDetails && orderDetails !== null ?
                          <ShoppingOrderDetails setOpenDetailsDialog={setOpenDetailsDialog} /> : null
                      }
                    </Dialog>

                  </TableCell>

                </TableRow>

              ) : <p>No orders found.</p>
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders