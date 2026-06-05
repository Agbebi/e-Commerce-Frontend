import React, { useEffect, useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { deliverOrder, getAllOrders, updateOrderStatus } from '../../store/dispatch/order-slice'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { getOrderDetails } from '@/store/dispatch/order-slice'
import { PiBuildingsLight } from 'react-icons/pi'


const initialFormData = {
    status: ''
}


function DispatchOrderDetailsView({ selectedOrder, setOpenDetailsDialog }) {

    const { user } = useSelector((state) => state.auth)
    const { orderDetails } = useSelector((state) => state.dispatchOrders)

    console.log(user.role, 'User role in order details view')

    const dispatch = useDispatch()

    const [formData, setFormData] = useState(initialFormData)

    function handleStatusChange(e) {
        e.preventDefault()

        // Implement status change logic here
        const updatedStatus = formData.status

        dispatch(updateOrderStatus({ orderId: selectedOrder._id, updatedStatus })).then((data) => {
            if (data.payload.success) {
                setFormData(updatedStatus)
                setOpenDetailsDialog(false)
                dispatch(getAllOrders(user.id))
                toast.success('Order status updated successfully!')
            }

        })
    }


    useEffect(() => {
        const childOrders = selectedOrder ? selectedOrder.childOrders : []
        if (user?.id && childOrders.length > 0) {
            dispatch(getOrderDetails({ id: user.id, childOrders })).then((data) => {
                console.log(data, 'Updated order list after status change');
            })
        }
    }, [dispatch, user.id, selectedOrder])

    console.log(orderDetails, 'Order details from state')
    return (

        selectedOrder ? (
            <DialogContent className='overflow-y-auto bg-white border-none rounded-lg shadow-lg p-6' >
                <div className='grid gap-6 mt-6 text-xs'>
                    <div className='grid gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Order ID</p>
                            <Label className='text-xs'>{selectedOrder._id || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Order Date</p>
                            <Label className='text-xs'>{selectedOrder.orderDate.slice(0, 10) || 'N/A'}</Label>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='  font-medium'>Delivery Status</p>
                        <Label className='text-xs'>{selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1) || 'N/A'}</Label>
                    </div>

                    <div className='flex items-center w-full justify-between'>
                        <div className='font-medium text-center w-full'>
                            <span className='text-normal font-bold'></span>
                            {
                                orderDetails && orderDetails.length > 0 ? (
                                    orderDetails.map((product) => (
                                        <div className=''>
                                            <div className='flex justify-around w-full border-t border-b border-gray-200 items-center p-1'>
                                                <span className='text-gray-600 italic'><PiBuildingsLight size={20} /></span>
                                                <span className='font-md '>Solat Tech Incorporation.</span>
                                                <span className={`font-md ${{
                                        pending: 'text-orange-500',
                                        accepted: 'text-blue-500',
                                        packaging: 'text-purple-500',
                                        ready: 'text-green-500',
                                        cancelled: 'text-red-500',
                                    }[product.deliveryStatus] || 'text-gray-400'}`}>{product.deliveryStatus.charAt(0).toUpperCase() + product.deliveryStatus.slice(1)}</span>
                                            </div>
                                            {
                                                product.cartItems && product.cartItems.length > 0 ? (
                                                    <div className='grid grid-cols-1 gap-2 text-xs w-full'>{
                                                        product.cartItems.map((item) => (
                                                            <div className='flex flex-row justify-between text-xs gap-2 p-2 w-full'>
                                                                <div className='flex flex-col w-full'>
                                                                    {/* <p className='font-medium text-gray-600'>Product Details</p> */}
                                                                    <p className='font-medium flex items-center gap-1 justify-between w-full'>
                                                                        <span className='text-gray-600 italic'>Name:</span> <span className='font-md text-gray-800'>{item.name}</span>
                                                                    </p>
                                                                    <p className='font-medium flex items-center gap-1 justify-between w-full'>
                                                                        <span className='text-gray-600 italic'>Desc:</span><span className='font-md text-gray-800'>{item.description}</span>
                                                                    </p>

                                                                    <p className='font-medium flex items-center gap-1 justify-between w-full'>
                                                                        <span className='text-gray-600 italic'>Qty:</span> <span className='font-md text-gray-800'>{item.quantity}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <p className='text-gray-600'>No products found for this order.</p>
                                            }
                                        </div>
                                    ))
                                ) : <p className='text-gray-600'>No products found for this order.</p>
                            }
                        </div>
                    </div>

                    <div>
                        <CommonForm
                            formControls={[
                                {
                                    name: 'status',
                                    label: 'Update Status',
                                    placeholder: 'Select Status',
                                    componentType: 'select',
                                    options: [
                                        { name: 'pending', value: 'pending', label: 'Pending' },
                                        { name: 'processing', value: 'processing', label: 'Processing' },
                                        { name: 'shipped', value: 'shipped', label: 'Shipped' },
                                        { name: 'cancelled', value: 'cancelled', label: 'Cancelled' },
                                    ]
                                }
                            ]}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={'Update Status'}
                            onSubmit={handleStatusChange}
                        />


                        {
                            user.role === 'dispatch' && selectedOrder.deliveryStatus !== 'delivered' && <Button onClick={() => dispatch(deliverOrder(selectedOrder._id)).then((data) => {
                                if (data.payload.success) {
                                    setOpenDetailsDialog(false)
                                    dispatch(getAllOrders(user.id))
                                    toast.success('Order status updated successfully!')
                                }
                            })} size='sm' className="bg-black text-white px-4 w-full mt-2 py-2 rounded-lg text-xs border-none hover:bg-gray-600">
                                Set Delivered
                            </Button>
                        }
                    </div>
                </div>
            </DialogContent>) : <></>)

}

export default DispatchOrderDetailsView