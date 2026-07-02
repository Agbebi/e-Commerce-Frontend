import { LoginFormControls } from '../../config/index'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { useDispatch } from 'react-redux'
import { loginUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import { CiShop, CiUser } from 'react-icons/ci'
import { Checkbox } from '@/components/ui/checkbox'
import LoadingState from '@/components/ui/loading-state'



const initialState = {
  email: '',
  password: ''
}

function AuthLogin() {

  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()

  function onSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(`${data?.payload?.message}`)
      } else {
        toast.error(`${data?.payload?.message}`)
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div className='mx-auto w-full bg-white p-8 rounded-lg max-w-md space-y-6'>
      <div className='text-orange text-shadow-2xs flex items-center justify-between w-full  sm:flex-row gap-1'>
              <span className='flex items-center gap-2'>
                {/* <CiShop size={30} /> */}
                Tim Marketplace.
              </span>
              <span className='text-gray-500 text-sm flex items-center gap-2'><CiUser /> Customer Login</span>
            </div>
      <div className='text-center  mb-4'>
        <h1 className='text-2xl tracking-tight font-semibold text-gray-800 my-2'>Welcome back!</h1>
        <p className='text-gray-500 text-xs'>Please enter your details.</p>

      </div>
      {isSubmitting ? (
        <LoadingState title='Signing you in' description='We are validating your credentials and preparing your dashboard.' className='mt-2' />
      ) : (
        <CommonForm
          formControls={LoginFormControls}
          buttonText={'Sign In'}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
      <div className='flex flex-row px-6 text-xs justify-between p-1'>
        <div className='flex items-center gap-2 justify-around'>
          <Checkbox />
          <span>Remember me</span>
        </div>
        <div className='text-orange-600 underline'>Forgot Password?</div>
      </div>

      <div className='flex text-sm justify-center gap-2 text-gray-600 space-y-4'>
        <p>Doesn't have an account?</p>
        <Link
          className='font-medium underline text-gray-800 hover:underline'
          to='/auth/register'>
          Sign up
        </Link>
      </div>

      <Link
          className='font-medium underline text-center mx-auto text-gray-800 text-xs hover:underline'
          to='/'>
          Not a customer?
        </Link>
    </div>
  )
}

export default AuthLogin