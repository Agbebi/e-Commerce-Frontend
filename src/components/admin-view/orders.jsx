import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { deliverOrder, getAllOrders } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'

function AdminOrders() {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const { orderList } = useSelector((state) => state.adminOrders)

  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(getAllOrders(user.id))

  }, [user.id, dispatch])
  

// console.log(orderList, 'Order List found');



function handleDetailsView(order) {

  setOpenDetailsDialog(true)
  setSelectedOrder(order)
}

  return (
    <Card className='border-none'>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent className=''>
        <Table>
          <TableHeader className='bg-gray-100 text-gray-700 text-center '>
            <TableRow className='border-none font-light text-sm p-2 shadow'>
              <TableHead className='text-sm font-light text-center'>Order ID</TableHead>
              <TableHead className='text-sm font-light text-center'>Order Date</TableHead>
              <TableHead className='text-sm font-light text-center'>Order Status</TableHead>
              <TableHead className='text-sm font-light text-center'>Payment Status</TableHead>
              <TableHead className='text-sm font-light text-center'>Total</TableHead>
              <TableHead>
                <span className="sr-only">View Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {
            orderList && orderList.length > 0 ? (
              orderList.map((order) => (
            <TableBody className='text-xs text-center'>
            <TableRow className='border-none shadow'>
              <TableCell>{order._id || 'N/A'}</TableCell>
              <TableCell>{order.orderDate || 'N/A'}</TableCell>
              <TableCell>
            <Badge className={
                      {
                        pending: 'bg-amber-400',
                        processing: 'bg-blue-400',
                        shipped: 'bg-purple-400',
                        delivered: 'bg-green-400',
                        cancelled: 'bg-red-400',
                      }[order.orderStatus] || 'bg-gray-400'
                    }>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </Badge>
              </TableCell>
              <TableCell>
                <Badge className={
                  `${order.paymentStatus == 'pending' ? 'bg-amber-400' : 'bg-green-400'
                  }`
                }>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{order.cartItems.filter((item) => item.vendorId == user.id).reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2) || 'N/A'}</TableCell>
              <TableCell>
                <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} className='bg-white rounded-lg shadow-lg p-4'>
                  <Button size='sm' onClick={() => {
                    
                    handleDetailsView(order)}} className="bg-gray-500 text-white px-2 py-0 space-y-0 rounded-lg text-xs border-none hover:bg-gray-600">
                    View / Update
                  </Button>
                  <AdminOrderDetailsView selectedOrder={selectedOrder} setOpenDetailsDialog={setOpenDetailsDialog} />
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
          ))
          ) : null
          }
        </Table>
      </CardContent>
    </Card>
  )
}

export default AdminOrders