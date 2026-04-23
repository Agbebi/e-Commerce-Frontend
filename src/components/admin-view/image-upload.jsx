import React, { useEffect, useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

function ProductImageUpload({ imageFile, setImageFile, uploadedImgUrl, setUploadedImgUrl, imageLoadingState,  setImageLoadingState, isEditMode }) {

    const inputRef = useRef(null)

    function handleImageFileChange(event) {

        const selectedFile = event.target.files[0]
        if (selectedFile) {
            setImageFile(selectedFile)
        }
    }

    function handleDragOver(event){
        event.preventDefault()
    }

    function handleDrop(event){
        event.preventDefault()

        const droppedFile = event.dataTransfer.files?.[0]
        if (droppedFile){
            setImageFile(droppedFile)
        }

    }

    function handleRemoveImage(){
        setImageFile(null)

        if(inputRef.current){
            inputRef.current.value = ''
        }
    }

    async function uploadImageToCloudinary(){
        setImageLoadingState(true)
        const data = new FormData()
        data.append('my_file', imageFile)

        const response = await axios.post('/api/admin/products/upload-image', data)       
    
        if (response.status === 200){
            setUploadedImgUrl(response.data.data.url)            
            setImageLoadingState(false)
        }
    }

    useEffect(() =>{
        if (imageFile !== null)
            uploadImageToCloudinary()
        
    }, [imageFile])

    return (
        <div className='w-full max-w-md mx-auto mt-4'>

            <Label className='text-lg font-semibold mb-2 block'>Upload Image</Label>

            <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode ? '' : ''}border-2 border-dashed rounded-lg p-4 text-gray-500 border-gray-300 outline-none`}>
                <Input disabled={isEditMode} type='file' className='border-gray-300 hidden' id='image-upload' ref={inputRef} onChange={handleImageFileChange} />

                
         { !imageFile ?
                   
                        <Label htmlFor='image-upload' className={`${isEditMode ? 'cursor-not-allowed' : ''}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                            <UploadCloudIcon className='w-10 h-12 text-gray-500 mb-2' />
                            <span className='text-gray-500'>Drag & drop | Click to upload Image</span>

                        </Label> : (
                                imageLoadingState ? 

                                <Skeleton className='h-10 bg-gray-100'/> :

                            <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <FileIcon className='w-7 h-7 text-black mr-2'/>
                            </div>
                            <p className='text-sm font-medium'>{imageFile.name}</p>
                            <Button variant='ghost' size='icon' className='text-gray-500 hover:text-black' onClick={handleRemoveImage}>
                                <XIcon className='w-4 h-4'></XIcon>
                                <span className='sr-only'>Remove the Image</span>
                            </Button>
                        </div>)
                }
            </div>
        </div>
    )
}

export default ProductImageUpload