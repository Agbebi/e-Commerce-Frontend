import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import CardContent from '@mui/material/CardContent'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/dispatch/order-slice'
import DispatchOrderDetailsView from './order-details'
import { Dialog } from '../ui/dialog'
import { BsInfo } from 'react-icons/bs'
import { CiReceipt } from 'react-icons/ci'

function DispatchOrders() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)

    const { orderList } = useSelector((state) => state.dispatchOrders)
    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllOrders(user._id))
    }, [dispatch, user._id])

    return (
        <Card className='border-gray-200 border gap-1 w-full'>

            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>

            <Separator className='border border-b border-gray-100 my-2' />

            <CardContent className='px-2 sm:px-4 flex flex-col gap-4'>
                <Stack direction='row' spacing={2} className='overflow-x-auto px-1'>
                    <Chip label="All" component='a' clickable variant='outlined' />
                    <Chip label="Pending" component='a' clickable variant='outlined' />
                    <Chip label="Shipped" component='a' clickable variant='outlined' />
                    <Chip label="Completed" component='a' clickable variant='outlined' />
                </Stack>

                <div className='w-full max-h-[60vh] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto p-2'>

                    {
                        orderList && orderList.length > 0 ? (
                            orderList.map((order) => (
                                <div className='w-full border border-gray-200 shadow-sm flex flex-col items-center text-center gap-2 p-4 rounded-md md:rounded-lg'>
                                    <div className='w-full flex items-center justify-center mb-2 px-2'>
                                        <span className='font-bold text-sm w-full'>{order.orderDate.slice(0, 10)}</span>
                                    </div>
                                    <p className='text-xs text-gray-600'>{order.userInfo.userName}</p>
                                    <p className={`text-sm font-medium ${{
                                        pending: 'text-orange-500',
                                        processing: 'text-blue-500',
                                        shipped: 'text-purple-500',
                                        delivered: 'text-green-500',
                                        cancelled: 'text-red-500',
                                    }[order.deliveryStatus] || 'text-gray-400'}`}
                                    >
                                        {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                                    </p>
                                    <span className='text-xs w-full'>{order._id.slice(0, 10) + '...'}</span>
                                    <Button onClick={() => {
                                        setSelectedOrder(order)
                                        setOpenDetailsDialog(true)
                                    }} variant='outline' size='sm' className='mt-2 shadow-xs border-gray-300 text-gray-700 hover:bg-gray-100 text-xs md:text-sm'>
                                        <CiReceipt className='' /> View Details
                                    </Button>
                                </div>

                            ))
                        ) : null
                    }


                </div>


            {openDetailsDialog && (
                <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} className='bg-white rounded-lg shadow-lg p-4'>
                    <DispatchOrderDetailsView selectedOrder={selectedOrder} setOpenDetailsDialog={setOpenDetailsDialog} />
                </Dialog>
            )}
            </CardContent>



        </Card>
    )
}

export default DispatchOrders