import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import React from 'react'

function AdminProductTile({product, setFormData, setOpenProductSheet, setCurrentEditedId, handleDelete}) {        

  return (
    <Card className='w-full max-w-sm mx-auto py-0 overflow-hidden border-gray-300 shadow'>
        <div className='flex flex-col gap-3 pb-3'>
            <div className='relative'>
                <img 
                    src={product.image}
                    alt={product.name}
                    className='w-full h-[200px] object-cover rounded-t-lg'
                />
            </div>

            <CardContent className='px-4 py-2 rounded-tl-lg rounded-tr-lg'>
                <h2 className='text-xl font-bold mb-2'>{product.name}</h2>
                <div className='flex justify-between item-center mb-2'>
                    <span className={`${product.salesPrice > 0 ? 'line-through text-black opacity-70' : ''} text-md     text-black font-semibold`}>${product.price}</span>
                    <span className={`${!product.salesPrice || product.salesPrice == 0 ? 'hidden' : 'text-lg font-bold'} `}>${product.salesPrice}</span>
                </div>
            </CardContent>
            <CardFooter className='flex justify-between items-center'>
                <Button onClick={() => {
                    setOpenProductSheet(true)
                    setCurrentEditedId(product._id)
                    setFormData(product)
                }} className='cursor-pointer bg-black text-white hover:bg-gray-950'>Edit</Button>
                <Button onClick={() => handleDelete(product._id)} className='cursor-pointer bg-black text-white hover:bg-gray-950'>Delete</Button>
            </CardFooter>
        </div>
    </Card>

  )


}

export default AdminProductTile