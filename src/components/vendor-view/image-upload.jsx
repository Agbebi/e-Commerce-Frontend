import React, { useEffect, useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import API from '../../api/axios';
import { Skeleton } from '../ui/skeleton';


function ProductImageUpload({ imageFiles, setImageFiles, uploadedImgUrls, setUploadedImgUrls, imageLoadingState, setImageLoadingState, isEditMode }) {

    const inputRef = useRef(null)

    function handleImageFileChange(event) {
        const selectedFiles = Array.from(event.target.files || [])
        const nextFiles = [...imageFiles, ...selectedFiles].slice(0, 5)

        setImageFiles(nextFiles)
    }

    function handleDragOver(event){
        event.preventDefault()
    }

    function handleDrop(event){
        event.preventDefault()

        const droppedFiles = Array.from(event.dataTransfer.files || [])
        const nextFiles = [...imageFiles, ...droppedFiles].slice(0, 5)
        if (nextFiles.length > imageFiles.length) {
            setImageFiles(nextFiles)
        }
    }

    function handleRemoveImage(index){
        const nextFiles = imageFiles.filter((_, idx) => idx !== index)
        setImageFiles(nextFiles)
        setUploadedImgUrls(uploadedImgUrls.filter((_, idx) => idx !== index))

        if(inputRef.current){
            inputRef.current.value = ''
        }
    }

    async function uploadImageToCloudinary(file, index){
        setImageLoadingState(true)

        const data = new FormData()
        data.append('my_file', file)

        const response = await API.post('/api/admin/products/upload-image', data)

        if (response.status === 200){
            setUploadedImgUrls(prev => {
                const next = [...prev]
                next[index] = response.data.data.url
                return next
            })
            setImageLoadingState(false)
        }
    }

    useEffect(() =>{
        imageFiles.forEach((file, idx) => {
            if (!uploadedImgUrls[idx]) {
                uploadImageToCloudinary(file, idx)
            }
        })
    }, [imageFiles])

    return (
        <div className='w-full max-w-md mx-auto mt-4'>

            <Label className='text-lg font-semibold mb-2 block'>Upload Images (up to 5)</Label>

            <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode ? '' : ''}border-2 border-dashed rounded-lg p-4 text-gray-500 border-gray-300 outline-none`}>
                <Input disabled={isEditMode} type='file' multiple className='border-gray-300 hidden' id='image-upload' ref={inputRef} onChange={handleImageFileChange} />

                {imageFiles.length === 0 ?
                    <Label htmlFor='image-upload' className={`${isEditMode ? 'cursor-not-allowed' : ''}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                        <UploadCloudIcon className='w-10 h-12 text-gray-500 mb-2' />
                        <span className='text-gray-500'>Drag & drop or click to upload images</span>
                        <span className='text-xs text-gray-400 mt-1'>You can upload up to 5 images.</span>
                    </Label>
                    : (
                        <div className='flex flex-col gap-3'>
                            {imageFiles.map((file, idx) => (
                                <div key={`${file.name}-${idx}`} className='flex items-center justify-between rounded border p-2 bg-white'>
                                    <div className='flex items-center gap-2 min-w-0'>
                                        <FileIcon className='w-6 h-6 text-black' />
                                        <div className='flex flex-col min-w-0'>
                                            <p className='text-xs font-medium max-w-[180px] truncate'>{file.name}</p>
                                            <p className='text-xs text-gray-500'>{Math.round(file.size / 1024)} KB</p>
                                        </div>
                                    </div>
                                    <Button variant='ghost' size='icon' className='text-gray-500 hover:text-black' onClick={() => handleRemoveImage(idx)}>
                                        <XIcon className='w-4 h-4'></XIcon>
                                        <span className='sr-only'>Remove the Image</span>
                                    </Button>
                                </div>
                            ))}
                            {imageFiles.length < 5 && (
                                <Label htmlFor='image-upload' className='flex items-center justify-center h-14 rounded border border-dashed border-gray-300 cursor-pointer text-sm text-gray-500'>
                                    Add more images
                                </Label>
                            )}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default ProductImageUpload
