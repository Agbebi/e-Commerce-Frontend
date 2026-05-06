import React, { useState } from 'react'
import addressImg from '../../assets/addressImg.jpg'
import Address from '@/components/shopping-view/address'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'



function ShoppingAddressPage() {

    const [currentSelectedAddress, setCurrentSelectedAddress] = useState('')

  return (
    <div className='flex flex-col h-full'>
      <div className='relative w-full h-50'>
        <img
          src={addressImg}
          alt='Account Image'
          className=' object-cover h-full object-center w-full'
        />
      </div>
      <div className='w-full shadow sm:px-6 px-1 mx-auto py-4'>   
          <Tabs orientation='vertical' defaultValue='address' className='p-2 justify-center items-center grid grid-cols-1 sm:grid-cols-3'>
            <TabsList className='mx-auto my-2 hidden text-xs gap-2 md:mx-0 text-center'>
              <TabsTrigger value='address' className='p-2 bg-white text-black shadow-sm border-none data-[state=active]: data-[state=active]:'>Manage your Addresses</TabsTrigger>
            </TabsList>
           
            <TabsContent value='address' className='shadow-md rounded-lg bg-white sm:col-span-2'>
              <Address
                currentSelectedAddress={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
               />
            </TabsContent>
            
          </Tabs>
      </div>
    </div>
  )
}

export default ShoppingAddressPage