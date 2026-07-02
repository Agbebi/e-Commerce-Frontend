import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import React from 'react'
import { CiBellOn } from 'react-icons/ci'
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'

function VendorProductTile({product, setFormData, setOpenProductSheet, setCurrentEditedId, handleDelete}) {        

    const formatAmount = (value) => formatPriceDisplay(value)

  return (
    <Card className='w-full max-w-sm mx-auto py-0 overflow-hidden border-gray-300 shadow'>
        <div className='flex flex-col gap-3 pb-3'>
            <div className='relative'>
                <img 
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className='w-full h-[150px] object-cover rounded-t-lg'
                />


                {product.salesPrice > 0 || product.totalStock <= 5 ? (
                        <Badge className={`absolute top-2 left-2 flex justify-between items-center bg-amber-400  hover:bg-amber-600`}>
                            {product.totalStock === 0 ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <CiBellOn className="" />
                                    <span>
                                        {product.totalStock <= 5 ? ` ${product.totalStock} items left ` : 'Sale'}
                                    </span>
                                </>
                            )}
                        </Badge>
                    ) : null}
            </div>

            <CardContent className='px-4 py-1 rounded-tl-lg rounded-tr-lg'>
                <h2 className='text-md font-bold mb-2 text-justify'>{product.name}</h2>
                <div className='flex justify-between items-center gap-2 mb-2 text-xs text-gray-500'>
                    <span className='capitalize'>{product.subcategory ? `${product.subcategory}` : ''}</span>
                    <span className='capitalize'>{product.category}</span>
                </div>
                <div className='flex justify-between item-center mb-2'>
                    <span className={`${product.salesPrice > 0 ? 'line-through font-medium text-black opacity-70' : ''} text-sm flex items-center text-black font-bold`}><TbCurrencyNaira /> {formatAmount(product.price)}</span>
                    <span className={`${!product.salesPrice || product.salesPrice == 0 ? 'hidden' : 'text-sm font-bold'} flex items-center `}><TbCurrencyNaira />{formatAmount(product.salesPrice)}</span>
                </div>
            </CardContent>
            <CardFooter className='flex flex-col justify-between gap-2 items-center px-4 pb-4'>
                <Button
                    onClick={() => {
                        setOpenProductSheet(true)
                        setCurrentEditedId(product._id)
                        setFormData({
                            ...product,
                            specifications: Array.isArray(product.specifications) && product.specifications.length > 0
                                ? product.specifications
                                : (Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0
                                    ? product.keyFeatures.map((feature) => ({ name: 'Feature', value: feature }))
                                    : []),
                            keyFeatures: Array.isArray(product.keyFeatures) ? product.keyFeatures.join('\n') : product.keyFeatures || '',
                            subcategory: product.subcategory || ''
                        })
                    }}
                    className='w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100'
                    size='sm'
                >
                    <MdOutlineEdit className='mr-2 h-4 w-4' /> Edit
                </Button>
                <Button
                    onClick={() => handleDelete(product._id)}
                    className='w-full rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100'
                    size='sm'
                >
                    <MdOutlineDelete className='mr-2 h-4 w-4' /> Remove
                </Button>
            </CardFooter>
        </div>
    </Card>

  )

}

export default VendorProductTile