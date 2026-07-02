import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'
import { deliverOrder, getAllOrders, updateOrderStatus } from '../../store/vendor/order-slice'
import { toast } from 'sonner'
import { Button } from '../ui/button'


const initialFormData = {
    status: ''
}


function VendorOrderDetailsView({ selectedOrder, setOpenDetailsDialog }) {

    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState(initialFormData)

    function handleStatusChange(e) {
        e.preventDefault()

        // Implement status change logic here
        const updatedStatus = formData.status

        dispatch(updateOrderStatus({ orderId: selectedOrder._id, updatedStatus })).then((data) =>{
            if(data.payload.success){
                setFormData(updatedStatus)
                setOpenDetailsDialog(false)
                dispatch(getAllOrders(user.id))
                toast.success('Order status updated successfully!')
            }
            
        })
    }

    return (

        selectedOrder ? (
            <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white border-none rounded-lg shadow-lg p-6' >
                <div className='grid gap-6 mt-6 text-xs'>
                    <div className='grid gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Order ID</p>
                            <Label className='text-xs'>{selectedOrder._id || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Order Date</p>
                            <Label className='text-xs'>{selectedOrder.payoutDate.slice(0, 10) + " " + selectedOrder.payoutDate.slice(11, 16) || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Order Status</p>
                            <Label className='text-xs'>{selectedOrder.payoutStatus.charAt(0).toUpperCase() + selectedOrder.payoutStatus.slice(1) || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Total Amount</p>
                            <Label className='flex text-xs items-center gap-1'><TbCurrencyNaira />{formatPriceDisplay(selectedOrder.subTotal)}</Label>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Delivery Status</p>
                            <Label className='text-xs'>{selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1) || 'N/A'}</Label>
                        </div>



                    <div className='flex flex-col gap-4'>
                        <div className='grid gap-2'>
                            <Separator className='border-gray-100 border' />
                            <p className=' font-medium'>Order Products</p>
                            <Separator className='border-gray-100 border' />
                            <div className='grid grid-cols-2 sm:grid-cols-3 p-4 gap-2 text-xs'>
                                {
                                    selectedOrder && selectedOrder.cartItems ? (
                                        selectedOrder.cartItems.map((product) => (

                                            <ul className='grid text-xs border-x border-gray-200'>
                                                <li className='flex flex-col gap-1 p-2 items-center justify-between'>
                                                    <p className='font-medium text-center'>{product.name}</p>
                                                    <p className='text-gray-600'>Id: {product._id.slice(0, 10)}...</p>
                                                    <p className='text-gray-600'>Qty: {product.quantity}</p>
                                                    <p className='flex items-center font-medium'><TbCurrencyNaira />{formatPriceDisplay(product.price * product.quantity) || 'N/A'}</p>
                                                </li>

                                            </ul>
                                        )
                                        )

                                    ) : <p className='  text-gray-600'>No products found for this order.</p>
                                }
                            </div>


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
                                        { name: 'accepted', value: 'accepted', label: 'Accepted' },
                                        { name: 'packaging', value: 'packaging', label: 'Packaging' },
                                        { name: 'ready', value: 'ready', label: 'Ready for Pickup' },
                                        { name: 'cancelled', value: 'cancelled', label: 'Cancelled' },
                                    ]
                                }
                            ]}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={'Update Status'}
                            onSubmit={handleStatusChange}
                        />

                     
                                  {/* {
                                    user.role === 'vendor' && selectedOrder.payoutStatus !== 'delivered' && <Button onClick={() => dispatch(deliverOrder(selectedOrder._id)).then((data) =>{console.log(data)})} size='sm' className="bg-black text-white px-4 w-full mt-2 py-2 rounded-lg text-xs border-none hover:bg-gray-600">
                                    Set Delivered
                                  </Button>
                                  } */}
                    </div>
                </div>
            </DialogContent>) : <></>)

}

export default VendorOrderDetailsView