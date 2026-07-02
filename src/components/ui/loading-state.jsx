import React from 'react'
import { Loader2 } from 'lucide-react'

function LoadingState({
  title = 'Loading...',
  description = 'Please wait while we finish the request.',
  compact = false,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center shadow-sm backdrop-blur ${className}`}>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/5'>
        <Loader2 className='h-6 w-6 animate-spin text-slate-900' />
      </div>
      <h3 className={`font-semibold text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>{title}</h3>
      <p className={`mt-2 max-w-sm text-sm text-slate-600 ${compact ? 'text-xs' : ''}`}>{description}</p>
    </div>
  )
}

export default LoadingState
