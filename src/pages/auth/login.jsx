import { LoginFormControls } from '../../config/index'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { useDispatch } from 'react-redux'
import { loginUser } from '@/store/auth-slice'
import { toast } from 'sonner'



const initialState = {
  email: '',
  password: ''
}

function AuthLogin() {

  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()

  function onSubmit(event) {
    event.preventDefault()

    dispatch(loginUser(formData)).then((data)=>{
      if (data?.payload?.success) {
        toast.success(`${data?.payload?.message}`)
      }else{
            toast.error(`${data?.payload?.message}`) 
          }}
    ) 
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-black my-2'>Log into your account</h1>
        <div className='flex justify-center gap-2'>
          <p>Doesn't have an account?</p>
          <Link
            className='font-medium text-black hover:underline'
            to='/auth/register'>
            Sign Up
          </Link>
        </div>
      </div>
      <CommonForm
        formControls={LoginFormControls}
        buttonText={'Sign In'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthLogin