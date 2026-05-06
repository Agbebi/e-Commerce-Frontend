import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import AddressCard from './address-card'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { IoAdd } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'



const initialFormData = {
    address: '',
    city: '',
    phoneNumber: '',
    state: '',
    postalCode: '',
    country: '',
    notes: ''

}

function Address({currentSelectedAddress, setCurrentSelectedAddress}) {



    const [formData, setFormData] = useState(initialFormData)
    const [currentEditedId, setCurrentEditedId] = useState(null)
    const [addAddress, setAddAddress] = useState(false)
    const { user } = useSelector(state => state.auth)
    const { addressList } = useSelector(state => state.shopAddress)

    const dispatch = useDispatch()

    function handleManageAddress(event) {
        event.preventDefault()

        if(addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialFormData)
            toast.error('You can only have 3 addresses. Please delete an existing address to add a new one.')

            return
        }

        currentEditedId !== null ? dispatch(editAddress({
             userId: user.id,
            addressId: currentEditedId,
            formData : formData
        })).then((data) => {
            if (data.payload.success) {
                dispatch(fetchAllAddresses(user.id))
                setFormData(initialFormData)
                setCurrentEditedId(null)
                toast.success('Address updated successfully')
            }
        }) :

            dispatch(addNewAddress({
                ...formData,
                userId: user.id
            })).then((data) => {
                if (data.payload.success) {
                    dispatch(fetchAllAddresses(user.id))
                    setFormData(initialFormData)
                    toast.success('Address added successfully')
                }

            })
    }

    function handleDeleteAddress(getCurrentAddress) {
        dispatch(deleteAddress({ userId: user.id, addressId: getCurrentAddress._id })).then((data) => {
            if (data.payload.success) {
                dispatch(fetchAllAddresses(user.id))
                toast.success('Address deleted successfully')
                setFormData(initialFormData)
                setCurrentEditedId(null)
            }
        })
    }

    function handleEditAddress(getCurrentAddress) {        
        setCurrentEditedId(getCurrentAddress._id)
        setFormData({
            ...formData,
            address: getCurrentAddress.address,
            city: getCurrentAddress.city,
            phoneNumber: getCurrentAddress.phoneNumber,
            state: getCurrentAddress.state,
            postalCode: getCurrentAddress.postalCode,
            country: getCurrentAddress.country,
            notes: getCurrentAddress.notes
        })
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key] !== '').every(item => item === true)
    }


    useEffect(() => {
        dispatch(fetchAllAddresses(user.id))
    }, [dispatch])

    return (
        <Card className=' border-none shadow-none gap-4 py-2'>
            <div className='grid grid-cols-1 p-4 sm:grid-cols-1 md:grid-cols-2 gap-4'>
                {
                    addressList && addressList.length > 0 ? addressList.map((address) => (
                        <AddressCard
                            currentSelectedAddress={currentSelectedAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            handleEditAddress={handleEditAddress}
                            setAddAddress={setAddAddress}
                            address={address}
                        />
                    )) : <div className='flex flex-col justify-center gap-2 items-center'>
                    <p className='text-center text-sm outline-gray-200 outline-dashed h-20 flex items-center p-4 rounded-lg text-gray-400 col-span-full'>No address found! <br /> Go to Menu and select Manage address to add an address </p>
                    </div>
                }
            </div>

          
           {location.pathname.includes('account') || location.pathname.includes('address')  ?  <>
             <CardHeader className='p-1 m-0 mb-0 gap-0'>
                <CardTitle className='text-center sm:text-left'>{currentEditedId ? 'Edit Address' : 'Add New Address'}</CardTitle>
            </CardHeader>

            <CardContent className='p-4 border-none'>
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId ? 'Update Address' : 'Add Address'}
                    onSubmit={handleManageAddress}
                    buttonDisabled={!isFormValid()}
                />
            </CardContent>
            </> : null }
        </Card>
    )
}

export default Address