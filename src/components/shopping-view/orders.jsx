import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogContent } from '../ui/dialog'
import ShoppingOrderDetails from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, getOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Separator } from '../ui/separator'

function ShoppingOrders() {


  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orderList, orderDetails } = useSelector(state => state.shopOrder)


  useEffect(() => {
    dispatch(getAllOrders(user.id))
  }, [dispatch, user])

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId)).then((data) => {
      console.log(data);

      setOpenDetailsDialog(true)

    })

  }

  return (
    <Card className='border-none rounded-none gap-1 w-full'>
      <CardHeader className='flex justify-between items-center text-sm'>
        <div>Orders</div>
      </CardHeader>

      <CardContent className='py-4'>
      <Separator className='border-b mb-4 mt-0 border-gray-100' />
        <Table className=''>
          <TableHeader className='bg-orange-300 text-sm font-light'>
            <TableRow className='border-none font-light text-sm p-2 shadow'>
              <TableHead className='text-sm font-light'>Order ID</TableHead>
              <TableHead className='text-sm font-light'>Payment Date</TableHead>
              <TableHead className='text-sm font-light'>Payment Status</TableHead>
              <TableHead className='text-sm font-light'>Total Payment</TableHead>
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
                      `${order.orderStatus == 'pending' ? 'bg-amber-400' : 'bg-green-400'
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
                          <ShoppingOrderDetails /> : null
                      }
                    </Dialog>

                  </TableCell>

                </TableRow>

              ) : null
            }


          </TableBody>
          {/* <Separator className='border w-full' /> */}
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders