import React from 'react'
import accImg from '../../assets/accImg.jpg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Address from '@/components/shopping-view/address'
import ShoppingOrders from '@/components/shopping-view/orders'

function ShoppingAccount() {
  return (
    <div className='flex flex-col'>
      <div className='relative w-full h-[300px]'>
        <img 
          src={accImg}
          alt='Account Image'
          className=' object-cover h-full object-center w-full'
        />
      </div>
      <div className='grid grid-cols-1 container mx-auto gap-8 py-0'>
        <div className='flex border-none rounded-2xl border p-6 shadow flex-col gap-4'>
          <Tabs defaultValue='orders' className='gap-4'>
            <TabsList className='mx-auto md:mx-0'>
              <TabsTrigger value='orders' className='data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg'>Orders</TabsTrigger>
              <TabsTrigger value='address' className='data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg'>Address</TabsTrigger>
            </TabsList>
            <TabsContent value='orders'>
                <ShoppingOrders />
            </TabsContent>
            <TabsContent value='address'>
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShoppingAccount