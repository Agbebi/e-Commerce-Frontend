import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IoLocation } from 'react-icons/io5'
import { Package } from 'lucide-react'

function DispatchDeliveryPage() {
    return (
        <div className='space-y-6 pb-6'>
            {/* Header */}
            <div className='rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10'>
                <div className='flex flex-col gap-2'>
                    <p className='text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-slate-500'>
                        Dispatch
                    </p>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight'>
                        Delivery Confirmation
                    </h1>
                    <p className='mt-1 text-xs sm:text-sm text-slate-500'>
                        Confirm order delivery after OTP verification.
                    </p>
                </div>
            </div>

            {/* Content */}
            <Card className='border border-slate-200 bg-white rounded-2xl shadow-sm p-8'>
                <div className='flex flex-col items-center justify-center gap-5 text-center'>
                    <div className='w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center'>
                        <IoLocation className='h-7 w-7 text-slate-600' />
                    </div>
                    <div className='space-y-2'>
                        <h3 className='text-lg font-semibold text-slate-900'>
                            Your Order delivery is being confirmed...
                        </h3>
                        <p className='text-sm text-slate-500 max-w-md'>
                            Please ensure the customer has been verified with an OTP before
                            confirming delivery.
                        </p>
                    </div>
                    <Button className='bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11 font-semibold text-sm'>
                        Confirm Delivery
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default DispatchDeliveryPage
