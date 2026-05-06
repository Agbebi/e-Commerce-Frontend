import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { MdOutlineEdit } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoAdd } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'

function AddressCard({ address, handleDeleteAddress, handleEditAddress, currentSelectedAddress, setCurrentSelectedAddress }) {
  
      const location = useLocation()

  return (
    <Card onClick={setCurrentSelectedAddress ? () => (setCurrentSelectedAddress(address)
    ) : null} className={`flex justify-between shadow-sm rounded-lg items-center px-3 space-x-0 py-1 flex-row text-sm ${currentSelectedAddress == address ? 'border-green-200 ' : 'border-gray-200'}`}>
      <CardContent className='px-0 items-center'>
        <div className=''>
          <p>{address.state}, {address.country}</p>
          <span className='text-gray-500 text-xs'>{address.address}, {address.city}</span>
        </div>
      </CardContent>

     { location.pathname.includes('checkout') ? null : <CardFooter className='flex p-1  gap-2'>
        <Button onClick={() => { handleEditAddress(address) }} className=' p-1 cursor-pointer  text-xs text-gray-600'>Edit</Button>
        <Button onClick={() => { handleDeleteAddress(address) }} className='p-1 cursor-pointer text-xs text-red-600'>Delete</Button>
      </CardFooter>}
    </Card>
  )
}

export default AddressCard