import { registerFormControls } from '../../config/index'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommonForm from '../../components/common/form'
import { useDispatch } from 'react-redux'
import { registerUser } from '@/store/auth-slice'
import { toast } from 'sonner'



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
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-black my-2'>Create new account</h1>
        <div className='flex justify-center gap-2'>
          <p>Already have an account?</p>
          <Link
            className='font-medium text-black hover:underline'
            to='/auth/login'>
            Login
          </Link>
        </div>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={'Sign Up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthRegister