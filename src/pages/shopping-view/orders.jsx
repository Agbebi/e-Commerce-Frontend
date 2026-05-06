import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Address from '@/components/shopping-view/address'
import ShoppingOrders from '@/components/shopping-view/orders'
import ordersImg from '../../assets/orderImg.jpg'
import { GoArrowDown, GoArrowRight } from 'react-icons/go'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'


function ShoppingOrdersPage() {
  return (
    <div className='flex flex-col h-full'>
      <div className='relative w-full bg-gray-100 h-50 mb-6'>
        <img
          src={ordersImg}
          alt='Account Image'
          className=' object-cover h-full w-full'
        />
      </div>
      <div className='w-full flex flex-col sm:px-6 px-2 mx-auto py-4'>
        <div className='mx-auto text-gray-600 flex items-center gap-1'>
            <BsFillArrowRightCircleFill /><span>Your Orders </span>
        </div>   
          <Tabs orientation='horiontal' defaultValue='orders' className='p-4 justify-center grid grid-cols-1 sm:grid-cols-3'>
             <TabsContent value='orders' className='border rounded-lg border-gray-100 bg-white  sm:col-span-3'>
              <ShoppingOrders />
            </TabsContent>
          </Tabs>
      </div>
    </div>
  )
}

export default ShoppingOrdersPage