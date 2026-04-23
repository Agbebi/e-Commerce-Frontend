import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

function AddressCard({address, handleDeleteAddress, handleEditAddress, currentSelectedAddress , setCurrentSelectedAddress}) {
  return (
    <Card onClick={setCurrentSelectedAddress ?  () =>( setCurrentSelectedAddress(address)
    ) : null} className={`shadow-sm ${currentSelectedAddress == address ? 'border-orange-200' : 'border-gray-50'}`}>
        <CardContent className='grid gap-4 text-gray-700'>
            <Label>Address : {address.address}</Label>
            <Label>City : {address.city}</Label>
            <Label>State : {address.state}</Label>
            <Label>Postal Code : {address.postalCode}</Label>
            <Label>Phone Number : {address.phoneNumber}</Label>
            <Label>Notes : {address.notes}</Label>
        </CardContent>

        <CardFooter className='flex justify-between'>
            <Button onClick={() => {handleEditAddress(address)}} className='bg-black text-white text-sm'>Edit</Button>
            <Button onClick={() => {handleDeleteAddress(address)}} className='bg-black text-white text-sm'>Delete</Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard