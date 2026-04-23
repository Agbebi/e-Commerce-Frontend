import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'


const initialFormData = {
    status: ''
}

function AdminOrderDetailsView() {


    const [formData, setFormData] = useState(initialFormData)

    function handleStatusChange(e) {
        e.preventDefault()
        
        // Implement status change logic here
        console.log('Status changed to:', formData.status)
    }

    return (
        <DialogContent className='sm:max-w-[600px] bg-white border-none rounded-lg shadow-lg p-6'>
            <div className='grid gap-6 mt-6'>
                <div className='grid gap-2'>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Order ID</p>
                        <Label>12345</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Order Date</p>
                        <Label>2023-01-01</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Order Status</p>
                        <Label>Pending</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>Price</p>
                        <Label>$100.00</Label>
                    </div>
                </div>

                <Separator className='border-gray-100 border' />

                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <p className='text-sm font-medium'>Order Details</p>
                        <ul className='grid gap-3'>
                            <li className='flex items-center justify-between'>
                                <p className='text-sm'>Product Name</p>
                                <p className='text-sm font-medium'>$50.00</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className='border-gray-100 border' />
                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <p className='text-sm font-medium'>Shipping Info</p>
                        <div className='grid gap-0.5 text-gray-600'>
                            <span className='text-sm'>John Doe</span>
                            <span className='text-sm'>123 Main St, Anytown, USA</span>
                            <span className='text-sm'>(123) 456-7890</span>
                            <span className='text-sm'>john.doe@example.com</span>
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
                                    { name: 'delivered', value: 'delivered', label: 'Delivered' },
                                    { name: 'cancelled', value: 'cancelled', label: 'Cancelled' },
                                ]
                            }
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={'Update Status'}
                        onSubmit={handleStatusChange}
                    />
                </div>
            </div>
        </DialogContent>
    )
}

export default AdminOrderDetailsView