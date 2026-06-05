import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import VendorOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/vendor/order-slice'
import { Badge } from '../ui/badge'

function VendorOrders() {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const { orderList } = useSelector((state) => state.vendorOrders)

  const dispatch = useDispatch()
  const userId = user?.id || user?._id

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrders(userId))
    }
  }, [dispatch, userId])


  function handleDetailsView(order) {

    setOpenDetailsDialog(true)
    setSelectedOrder(order)
  }

  return (
    <Card className='border-none gap-1 w-full'>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent className='grid w-full overflow-auto'>
        <Table>
          <TableHeader className='bg-gray-100 text-gray-700 text-center '>
            <TableRow className='border-none text-sm p-2 shadow'>
              <TableHead className='text-sm  text-center'>Order ID</TableHead>
              <TableHead className='text-sm  text-center'>Order Date</TableHead>
              <TableHead className='text-sm  text-center'>Delivery Status</TableHead>
              <TableHead className='text-sm  text-center'>Order Status</TableHead>
              <TableHead className='text-sm  text-center'>Total (NG)</TableHead>
              <TableHead>
                <span className="sr-only">View Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='text-xs text-center'>
            {
              orderList && orderList?.length > 0 ? (
                orderList.map((order) => (
                  <TableRow className='border-none shadow'>
                    <TableCell>{order._id || 'N/A'}</TableCell>
                    <TableCell>{`${order.payoutDate.slice(0, 10) + " " + order.payoutDate.slice(11, 16)}` || `N/A`}</TableCell>

                    <TableCell>
                      <Badge className={
                        {
                          pending: 'bg-amber-400',
                          accepted: 'bg-blue-400',
                          packaging: 'bg-purple-400',
                          ready: 'bg-green-400',
                        }[order.deliveryStatus] || 'bg-gray-400'
                      }>
                        {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={
                        {
                          pending: 'bg-amber-400',
                          processing: 'bg-blue-400',
                          shipped: 'bg-purple-400',
                          completed: 'bg-green-400',
                          cancelled: 'bg-red-400',
                        }[order.payoutStatus] || 'bg-gray-400'
                      }>
                        {order.payoutStatus.charAt(0).toUpperCase() + order.payoutStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{Number(order.subTotal).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell>
                      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} className='bg-white rounded-lg shadow-lg p-4'>
                        <Button size='sm' onClick={() => {

                          handleDetailsView(order)
                        }} className="bg-gray-500 text-white px-2 py-0 space-y-0 rounded-lg text-xs border-none hover:bg-gray-600">
                          View / Update
                        </Button>
                        <VendorOrderDetailsView selectedOrder={selectedOrder} setOpenDetailsDialog={setOpenDetailsDialog} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : <p>No orders found.</p>
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default VendorOrders