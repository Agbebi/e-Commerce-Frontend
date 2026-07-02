import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { checkAuth } from '@/store/auth-slice'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const dispatch = useDispatch()

  const statusMessage = useMemo(() => {
    switch (searchParams.get('status')) {
      case 'success':
        return {
          title: 'Email verified successfully',
          description: 'Your email address has been confirmed. You can now sign in to your account.',
          tone: 'success'
        }
      case 'already-verified':
        return {
          title: 'Email already verified',
          description: 'This email address was verified earlier. You can sign in now.',
          tone: 'info'
        }
      case 'expired':
        return {
          title: 'Verification link expired',
          description: 'The confirmation link has expired. Please register again to receive a new one.',
          tone: 'error'
        }
      case 'invalid':
      default:
        return {
          title: 'Unable to verify email',
          description: 'The verification link is invalid or could not be processed. Please try again.',
          tone: 'error'
        }
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('status')) {
      setStatus('ready')
      dispatch(checkAuth())
    }
  }, [dispatch, searchParams])

  return (
    <div className='mx-auto flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-10'>
      <div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-slate-900'>Email Verification</h1>
          <p className='mt-2 text-sm text-slate-600'>Confirm your address to complete your registration.</p>
        </div>

        {status === 'loading' ? (
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
            Verifying your email, please wait...
          </div>
        ) : (
          <div className={`rounded-xl border p-4 text-sm ${
            statusMessage.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : statusMessage.tone === 'info'
                ? 'border-sky-200 bg-sky-50 text-sky-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}>
            <h2 className='font-semibold'>{statusMessage.title}</h2>
            <p className='mt-2'>{statusMessage.description}</p>
          </div>
        )}

        <div className='mt-6 flex flex-col items-center justify-center gap-3'>
          <Button asChild className='rounded-full bg-slate-900 text-white hover:bg-slate-800'>
            <Link to='/auth/login'>Go to Sign In</Link>
          </Button>
          <Button variant='outline' className='rounded-full' onClick={() => dispatch(checkAuth())}>
            Refresh auth state
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
