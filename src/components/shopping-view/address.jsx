import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import AddressCard from './address-card'
import { toast } from 'sonner'



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
        <Card className=' border-none shadow-none gap-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
                {
                    addressList && addressList.length > 0 ? addressList.map((address) => (
                        <AddressCard
                            currentSelectedAddress={currentSelectedAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            handleEditAddress={handleEditAddress}
                            address={address}
                        />
                    )) : <p className='text-center text-gray-400 col-span-full'>No address found. Please add a new address.</p>
                }
            </div>

            <CardHeader>
                <CardTitle className='mb-4 text-center sm:text-left'>{currentEditedId ? 'Edit Address' : 'Add New Address'}</CardTitle>
            </CardHeader>

            <CardContent className='space-y-6 shadow p-6 rounded-lg border-none'>
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId ? 'Update Address' : 'Add Address'}
                    onSubmit={handleManageAddress}
                    buttonDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address