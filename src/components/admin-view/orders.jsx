import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetailsView from './order-details'

function AdminOrders() {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)


  return (
    <Card className='border-none'>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
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

          <TableBody className=''>
            <TableRow className='border-none shadow'>
              <TableCell>15234</TableCell>
              <TableCell>2023-01-01</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>$100.00</TableCell>
              <TableCell>
                <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} className='bg-white rounded-lg shadow-lg p-4'>
                  <Button onClick={() => setOpenDetailsDialog(true)} className="bg-gray-500 text-white px-2 py-1 space-y-0 rounded-3xl border-none hover:bg-gray-600">
                    View Details
                  </Button>
                  <AdminOrderDetailsView />
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AdminOrders