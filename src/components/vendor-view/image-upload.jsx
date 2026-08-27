import React, { useEffect, useRef, useState } from 'react'
import { UploadCloudIcon, XIcon, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import API from '../../api/axios'

let keyCounter = 0
const nextKey = () => `img_${Date.now()}_${keyCounter++}`

function ProductImageUpload({ initialImages = [], onChange, onBusyChange, disabled = false, maxImages = 5 }) {
  const inputRef = useRef(null)
  const previewUrls = useRef(new Map())
  const timers = useRef({})
  const inFlight = useRef(0)
  const [items, setItems] = useState(() =>
    (initialImages || []).map((url) => ({ key: nextKey(), url, status: 'done', progress: 100 }))
  )

  useEffect(() => {
    const urls = items.filter((item) => item.status === 'done' && item.url).map((item) => item.url)
    onChange?.(urls)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  useEffect(() => {
    const map = previewUrls.current
    return () => {
      map.forEach((url) => URL.revokeObjectURL(url))
      map.clear()
    }
  }, [])

  function getPreviewUrl(file) {
    if (!previewUrls.current.has(file)) {
      previewUrls.current.set(file, URL.createObjectURL(file))
    }
    return previewUrls.current.get(file)
  }

  function startSimulatedProgress(key) {
    timers.current[key] = setInterval(() => {
      setItems((prev) => prev.map((item) => {
        if (item.key !== key || item.status !== 'uploading') return item
        const next = Math.min(90, (item.progress || 0) + Math.random() * 12)
        return { ...item, progress: next }
      }))
    }, 300)
  }

  function stopSimulatedProgress(key) {
    if (timers.current[key]) {
      clearInterval(timers.current[key])
      delete timers.current[key]
    }
  }

  async function uploadItem(item) {
    inFlight.current += 1
    onBusyChange?.(true)
    startSimulatedProgress(item.key)
    try {
      const data = new FormData()
      data.append('my_file', item.file)
      const response = await API.post('/api/admin/products/upload-image', data, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            stopSimulatedProgress(item.key)
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setItems((prev) => prev.map((entry) =>
              entry.key === item.key ? { ...entry, progress: percentCompleted } : entry
            ))
          }
        }
      })
      stopSimulatedProgress(item.key)
      if (response.status === 200) {
        setItems((prev) => prev.map((entry) =>
          entry.key === item.key
            ? { ...entry, url: response.data.data.url, status: 'done', progress: 100, file: undefined }
            : entry
        ))
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      stopSimulatedProgress(item.key)
      console.error('Failed to upload image:', error)
      setItems((prev) => prev.map((entry) =>
        entry.key === item.key ? { ...entry, status: 'error' } : entry
      ))
    } finally {
      inFlight.current = Math.max(0, inFlight.current - 1)
      if (inFlight.current === 0) {
        onBusyChange?.(false)
      }
    }
  }

  function handleFiles(selectedFiles) {
    const remaining = maxImages - items.length
    if (remaining <= 0) return
    const accepted = Array.from(selectedFiles || []).slice(0, remaining)
    if (accepted.length === 0) return
    const newItems = accepted.map((file) => ({ key: nextKey(), file, status: 'uploading', progress: 8 }))
    setItems((prev) => [...prev, ...newItems])
    newItems.forEach((entry) => uploadItem(entry))
  }

  function handleInputChange(event) {
    handleFiles(event.target.files)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    if (disabled) return
    handleFiles(event.dataTransfer.files)
  }

  function handleRemove(key) {
    setItems((prev) => {
      const target = prev.find((entry) => entry.key === key)
      if (target?.file && previewUrls.current.has(target.file)) {
        URL.revokeObjectURL(previewUrls.current.get(target.file))
        previewUrls.current.delete(target.file)
      }
      stopSimulatedProgress(key)
      return prev.filter((entry) => entry.key !== key)
    })
  }

  function handleRetry(key) {
    setItems((prev) => {
      const target = prev.find((entry) => entry.key === key)
      if (!target?.file) return prev
      uploadItem(target)
      return prev.map((entry) =>
        entry.key === key ? { ...entry, status: 'uploading', progress: 8 } : entry
      )
    })
  }

  const canAdd = !disabled && items.length < maxImages

  return (
    <div>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-colors ${
          canAdd ? 'border-slate-200 bg-slate-50/60 hover:border-slate-300' : 'border-slate-100 bg-slate-50/30'
        } p-6`}
      >
        {items.length === 0 ? (
          <label
            htmlFor='product-image-upload'
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 py-10 text-center ${
              disabled ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100'>
              <UploadCloudIcon className='h-6 w-6 text-slate-500' />
            </div>
            <div>
              <p className='text-sm font-medium text-slate-700'>Drag &amp; drop or click to upload</p>
              <p className='mt-1 text-xs text-slate-400'>PNG, JPG or WEBP · up to {maxImages} images</p>
            </div>
          </label>
        ) : (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
            {items.map((item) => (
              <div key={item.key} className='group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100'>
                <img
                  src={item.file ? getPreviewUrl(item.file) : item.url}
                  alt=''
                  className='h-full w-full object-cover'
                />

                {item.status === 'uploading' && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleRemove(item.key)}
                      className='absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-red-600'
                    >
                      <XIcon className='h-3.5 w-3.5' />
                    </button>
                    <div className='absolute inset-0 flex flex-col justify-end gap-2 bg-slate-900/45 p-3'>
                      <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/30'>
                        <div
                          className='h-full rounded-full bg-white transition-all duration-200'
                          style={{ width: `${item.progress || 0}%` }}
                        />
                      </div>
                      <p className='text-center text-[11px] font-medium text-white'>Uploading… {Math.round(item.progress || 0)}%</p>
                    </div>
                  </>
                )}

                {item.status === 'error' && (
                  <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-500/10 p-3'>
                    <AlertCircle className='h-5 w-5 text-red-500' />
                    <p className='text-center text-[10px] font-medium text-red-600'>Upload failed</p>
                    <button
                      type='button'
                      onClick={() => handleRetry(item.key)}
                      className='flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-red-600 shadow-sm'
                    >
                      <RefreshCw className='h-3 w-3' /> Retry
                    </button>
                  </div>
                )}

                {item.status === 'done' && (
                  <button
                    type='button'
                    onClick={() => handleRemove(item.key)}
                    className='absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow-sm transition hover:bg-white hover:text-red-600 group-hover:opacity-100'
                  >
                    <XIcon className='h-3.5 w-3.5' />
                  </button>
                )}
              </div>
            ))}

            {canAdd && (
              <label
                htmlFor='product-image-upload'
                className='flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-500'
              >
                <UploadCloudIcon className='h-5 w-5' />
                <span className='text-[11px] font-medium'>Add image</span>
              </label>
            )}
          </div>
        )}

        <input
          id='product-image-upload'
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          disabled={disabled || !canAdd}
          className='hidden'
          onChange={handleInputChange}
        />
      </div>

      <p className='mt-3 text-center text-xs text-slate-400'>{items.length} of {maxImages} images added</p>
    </div>
  )
}

export default ProductImageUpload
