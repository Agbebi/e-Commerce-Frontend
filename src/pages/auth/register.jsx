import { registerFormControls } from '../../config/index'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { useDispatch } from 'react-redux'
import { registerUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import { CiShop } from 'react-icons/ci'
import { Checkbox } from '@/components/ui/checkbox'



const initialState = {
  userName: '',
  email: '',
  password: ''
}

function AuthRegister() {

  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log(formData);
  

  function onSubmit(event) {
    event.preventDefault()

    dispatch(registerUser(formData)).then((data)=>{
    if (data?.payload?.success == true) {
      toast.success('Registration successful!')
      navigate('/auth/login')
    }else{
      toast.error(`${data?.payload?.message}`) 
    }}

    )

    // For now just log the form data - later wire to API or redux action
    console.log('Register submit', formData)
  }

  return (
    <div className='mx-auto w-full h-full max-h-full flex flex-col justify-center md:justify-start bg-white p-8 md:p-4 rounded-lg max-w-md space-y-6 '>
          <div className='text-orange font-light flex items-center justify-center sm:justify-start sm:flex-row gap-1'>
            <CiShop size={30} /> Tim Marketplace.
          </div>
          <div className='text-center sm:text-left mb-8'>
            <h1 className='text-2xl tracking-tight font-semibold text-gray-800 my-2'>Sign Up</h1>
            <p className='text-gray-500 text-sm'>Fill your informations below or sign in with your social account</p>
    
          </div>
          <CommonForm
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
          <div className='flex flex-row px-6 text-gray-600 text-sm justify-between p-2'>
            <div className='flex items-center gap-3 justify-around'>
              <Checkbox />
              <span className='text-xs'>Agree with Terms & Condition and Privacy Policy</span>
            </div>
          </div>
    
          <div className='flex text-sm justify-center gap-2 text-gray-600 space-y-4'>
            <p>Already have an account?</p>
            <Link
              className='font-medium underline text-gray-800 hover:underline'
              to='/auth/login'>
              Sign In
            </Link>
          </div>
        </div>
  )
}

export default AuthRegister