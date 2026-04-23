import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogContent } from '../ui/dialog'
import ShoppingOrderDetails from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, getOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'

function ShoppingOrders() {


  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.auth)
  const { orderList, orderDetails } = useSelector(state => state.shopOrder)


  useEffect(() => {
    dispatch(getAllOrders(user.id))
  }, [dispatch, user])

        function handleFetchOrderDetails(orderId) {
      dispatch(getOrderDetails(orderId)).then((data) =>{
        console.log(data);
        
        setOpenDetailsDialog(true)
        
      })
      
    }
  
console.log(orderDetails, 'Orders');

  return (
    <Card className='border-gray-100'>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader className='bg-gray-100 text-gray-700 '>
            <TableRow className='border-none shadow'>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>
                <span className="sr-only">View Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
          {
            orderList && orderList.length > 0 ? orderList.map(order =>
                <TableRow className='border-none shadow'>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.orderDate.split('T')[0]}</TableCell>
              <TableCell>
                <Badge className={
                  `${
                    order.orderStatus == 'pending' ? 'bg-amber-400' : 'bg-green-400'
                  }`
                  }>
                  {order.orderStatus}
                </Badge>
              </TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} >
                  <Button onClick={() => handleFetchOrderDetails(order._id)} className="bg-gray-500 text-white px-2 py-0 rounded hover:bg-gray-600">
                    View Details
                  </Button>

                  {
                    orderDetails && orderDetails !== null ?
                    <ShoppingOrderDetails />  : null
                  }
                  </Dialog>

              </TableCell>
            </TableRow>

            ) : null
          }

            
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders