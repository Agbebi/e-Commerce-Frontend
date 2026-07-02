import { registerFormControls } from '../../config/index'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { useDispatch } from 'react-redux'
import { registerUser } from '@/store/auth-slice'
import { toast } from 'sonner'
import { CiShop } from 'react-icons/ci'
import { Checkbox } from '@/components/ui/checkbox'
import LoadingState from '@/components/ui/loading-state'



const initialState = {
  userName: '',
  email: '',
  password: '',
  phoneNumber: '',
  name: '',
}

function AuthRegister() {

  const [formData, setFormData] = useState(initialState)
  const [disabled, setDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log(formData);


  function onSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success == true) {
        toast.success('Account created. Please check your email to verify your address.')
        navigate('/auth/login')
      } else {
        toast.error(`${data?.payload?.message}`)
      }
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div className='mx-auto w-full h-full max-h-full overflow-auto flex flex-col justify-start bg-white p-8 md:p-4 rounded-lg max-w-md space-y-6 '>
      <div className='text-orange flex items-center justify-center gap-1'>
        {/* <CiShop size={30} />  */}
        Tim Marketplace.
      </div>
      <div className=' flex flex-col justify-center items-center text-center  mb-8'>
        <h1 className='text-2xl tracking-tight font-semibold text-gray-800 my-2'>Sign Up</h1>
        <p className='text-gray-500 text-sm'>Fill in your informations</p>

      </div>
      <div className='px-4 sm:px-8 text-gray-600 text-sm justify-between p-2'>

        {isSubmitting ? (
          <LoadingState title='Creating your account' description='We are setting up your profile and preparing your verification email.' className='mt-2' />
        ) : (
          <CommonForm
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonDisabled={disabled}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      <div className='flex flex-row px-6 text-gray-600 text-sm justify-between p-2'>
        <div className='flex items-center gap-3 justify-around'>
          <Checkbox onCheckedChange={(checked) => setDisabled(!checked)} />
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