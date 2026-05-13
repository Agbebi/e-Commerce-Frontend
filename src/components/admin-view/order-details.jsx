import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { TbCurrencyNaira } from 'react-icons/tb'
import { deliverOrder, getAllOrders, updateOrderStatus } from '../../store/admin/order-slice'
import { toast } from 'sonner'
import { Button } from '../ui/button'


const initialFormData = {
    status: ''
}


function AdminOrderDetailsView({ selectedOrder, setOpenDetailsDialog }) {

    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState(initialFormData)

    function handleStatusChange(e) {
        e.preventDefault()

        // Implement status change logic here
        const updatedStatus = formData.status

        dispatch(updateOrderStatus({ orderId: selectedOrder._id, updatedStatus })).then((data) =>{
            console.log(data);
            if(data.payload.success){
                setFormData(updatedStatus)
                setOpenDetailsDialog(false)
                dispatch(getAllOrders(user.id))
                toast.success('Order status updated successfully!')
            }
            
        })
        console.log('User data:', user)
    }

    const products = selectedOrder ? selectedOrder.cartItems.filter((item) => item.vendorId == user.id) : []

    return (

        selectedOrder ? (
            <DialogContent className='sm:max-w-[600px] bg-white border-none rounded-lg shadow-lg p-6' >
                <div className='grid gap-6 mt-6 text-xs'>
                    <div className='grid gap-2'>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Order ID</p>
                            <Label className='text-xs'>{selectedOrder._id || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className=' font-medium'>Order Date</p>
                            <Label className='text-xs'>{selectedOrder.orderDate || 'N/A'}</Label>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Order Status</p>
                            <Label className='text-xs'>{selectedOrder.orderStatus || 'N/A'}</Label>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Payment Status</p>
                            <Label className='text-xs'>{selectedOrder.paymentStatus || 'N/A'}</Label>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='  font-medium'>Total Amount</p>
                            <Label className='flex text-xs items-center gap-1'><TbCurrencyNaira />{products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2) || 'N/A'}</Label>
                        </div>
                    </div>



                    <div className='flex flex-col gap-4'>
                        <div className='grid gap-2'>
                            <Separator className='border-gray-100 border' />
                            <p className=' font-medium'>Order Products</p>
                            <Separator className='border-gray-100 border' />
                            <div className='grid grid-cols-3 p-4 gap-2 text-xs'>
                                {
                                    products && products.length > 0 ? (
                                        products.map((product) => (

                                            <ul className='grid text-xs border-x border-gray-200'>
                                                <li className='flex flex-col gap-1 items-center justify-between'>
                                                    <p className='font-medium'>{product.name}</p>
                                                    <p className='text-gray-600'>Qty: {product.quantity}</p>
                                                    <p className='text-gray-600'>Description: {product.description}</p>
                                                    <p className='flex items-center font-medium'><TbCurrencyNaira />{(product.price * product.quantity).toFixed(2) || 'N/A'}</p>
                                                </li>

                                            </ul>
                                        )
                                        )

                                    ) : <p className='  text-gray-600'>No products found for this order.</p>
                                }
                            </div>


                        </div>
                    </div>


                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Separator className='border-gray-100 border' />
                            <p className='  font-medium'>Shipping Info</p>
                            <Separator className='border-gray-100 border' />
                            <div className='grid gap-0.5 text-gray-600'>
                                <span className=' '>{selectedOrder.addressInfo.address}</span>
                                <span className=' '>{selectedOrder.addressInfo.city} {selectedOrder.addressInfo.state}, {selectedOrder.addressInfo.postalCode}</span>
                                <span className=' '>(+234) {selectedOrder.addressInfo.phoneNumber}</span>
                                <span className=' '>{selectedOrder.userInfo.userEmail}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <CommonForm 
                            formControls={[
                                {
                                    name: 'status',
                                    label: 'Status',
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
                                    user.role === 'admin' && selectedOrder.orderStatus !== 'delivered' && <Button onClick={() => dispatch(deliverOrder(selectedOrder._id)).then((data) =>{console.log(data)})} size='sm' className="bg-black text-white px-4 w-full mt-2 py-2 rounded-lg text-xs border-none hover:bg-gray-600">
                                    Set Delivered
                                  </Button>
                                  }
                    </div>
                </div>
            </DialogContent>) : <></>)

}

export default AdminOrderDetailsView