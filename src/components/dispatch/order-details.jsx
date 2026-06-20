import React, { useEffect, useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { deliverOrder, deliverOrderConfirmed, getAllOrders, updateOrderStatus } from '../../store/dispatch/order-slice'
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

    function isDelivered() {
        const result = selectedOrder.deliveryStatus === 'delivered'
        return result
    }

    useEffect(() => {
        const childOrders = selectedOrder ? selectedOrder.childOrders : []
        if (user?.id && childOrders.length > 0) {
            dispatch(getOrderDetails({ id: user.id, childOrders }))
        }
    }, [dispatch, user.id, selectedOrder])
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

                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Delivery Status</p>
                            <Label className='text-xs'>{selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1) || 'N/A'}</Label>
                        </div>
                    </div>

                    <div className='text-center mx-auto'>Customer Informations</div>

                    <div className='grid gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Name of Receiver</p>
                            <Label className='text-xs'>{selectedOrder.userInfo.name || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>E-mail</p>
                            <Label className='text-xs'>{selectedOrder.userInfo.userEmail || 'N/A'}</Label>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Phone Number</p>
                            <Label className='text-xs'>{selectedOrder.userInfo.userMobile || 'N/A'}</Label>
                        </div>
                    </div>

                    
                     <div className='text-center mx-auto'>Product Details</div>

                    <div className='flex items-center w-full justify-between'>
                        <div className='font-medium text-center w-full'>
                            <span className='text-normal font-bold'></span>
                            {
                                orderDetails && orderDetails.length > 0 ? (
                                    orderDetails.map((product) => (
                                        <div className='mb-4'>
                                            <div className='grid grid-cols-3 justify-between text-center items-center mb-2 w-full gap-1 border-t border-b border-gray-200 p-1'>


                                                <span className='font-bold '>{product.vendorId.shopName}</span>
                                                <span className={`font-md ${{
                                                    pending: 'text-orange-500',
                                                    accepted: 'text-blue-500',
                                                    packaging: 'text-purple-500',
                                                    ready: 'text-green-500',
                                                    cancelled: 'text-red-500',
                                                }[product.deliveryStatus] || 'text-gray-400'}`}>{product.deliveryStatus.charAt(0).toUpperCase() + product.deliveryStatus.slice(1)}</span>
                                                <span className='font-md '>{product.vendorId.phoneNumber}</span>
                                            </div>
                                            {
                                                product.cartItems && product.cartItems.length > 0 ? (
                                                    <div className='grid grid-cols-1 gap-0 text-xs w-full'>{
                                                        product.cartItems.map((item) => (
                                                            <div className='flex flex-row justify-between text-xs gap-2 p-1 w-full'>
                                                                <div className='flex flex-col w-full'>
                                                                    {/* <p className='font-medium text-gray-600'>Product Details</p> */}
                                                                    <p className='font-medium flex items-center gap-1 justify-between w-full'>
                                                                        <span className='font-semibold text-gray-800'>{item.name}</span>
                                                                        <span className='font-semibold text-gray-800'>x {item.quantity}</span>
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
                            buttonDisabled={isDelivered()}
                        />


                        {
                            user.role === 'dispatch' && selectedOrder.deliveryStatus !== 'delivered' && <Button onClick={() => dispatch(deliverOrder(selectedOrder._id)).then((data) => {
                                if (data.payload.success) {
                                    const digits = data.payload.data
                                    let otp = prompt('Whats the OTP sent to the customer\'s phone number for order confirmation?')
                                    if (otp === digits.toString()) {
                                        dispatch(deliverOrderConfirmed(selectedOrder._id)).then((response) => {
                                            console.log(response)
                                            toast.success('OTP verified successfully! Order marked as delivered.')
                                            setFormData('delivered')
                                            setOpenDetailsDialog(false)
                                            dispatch(getAllOrders(user.id))
                                        })
                                    } else {
                                        toast.error('Incorrect OTP. Please try again.')
                                    }
                                    dispatch(getAllOrders(user.id))
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