import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import React from 'react'
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'

function VendorProductTile({product, setFormData, setOpenProductSheet, setCurrentEditedId, handleDelete}) {        

  const formatAmount = (value) => formatPriceDisplay(value)

  const hasDiscount = product.salesPrice > 0 && product.salesPrice < product.price
  const isLowStock = product.totalStock <= 5 && product.totalStock > 0
  const isOutOfStock = product.totalStock === 0

  return (
    <Card className='group py-0 w-full overflow-hidden border border-slate-200 bg-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300'>
        <div className='flex flex-col'>
            {/* Image Section */}
            <div className='relative aspect-[4/3] overflow-hidden bg-slate-50'>
                <img 
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    loading='lazy'
                />
                
                {/* Gradient overlay on hover */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                
                {/* Badges */}
                <div className='absolute top-2 left-2 flex flex-col gap-1'>
                    {isOutOfStock && (
                        <Badge className='text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-white border-0 shadow-sm'>
                            Out of stock
                        </Badge>
                    )}
                    {isLowStock && (
                        <Badge className='text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-900 border border-slate-200 shadow-sm'>
                            {product.totalStock} left
                        </Badge>
                    )}
                    {hasDiscount && (
                        <Badge className='text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-900 border border-slate-200 shadow-sm'>
                            {Math.round(((product.price - product.salesPrice) / product.price) * 100)}% off
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <CardContent className='flex-1 px-3.5 py-3'>
                <div className='space-y-2'>
                    <h2 className='text-xs font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[2rem]'>
                        {product.name}
                    </h2>
                    
                    <div className='flex items-center justify-between'>
                        <span className='text-[10px] font-medium text-slate-500 uppercase tracking-wider capitalize'>
                            {product.subcategory || product.category}
                        </span>
                        {hasDiscount && (
                            <span className='text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded'>
                                -{Math.round(((product.price - product.salesPrice) / product.price) * 100)}%
                            </span>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className='flex items-baseline gap-1.5 pt-0.5'>
                        <span className='text-sm font-bold text-slate-900 flex items-center gap-0.5'>
                            <TbCurrencyNaira className='h-3.5 w-3.5' />
                            {formatAmount(product.salesPrice > 0 ? product.salesPrice : product.price)}
                        </span>
                        {hasDiscount && (
                            <span className='text-[11px] text-slate-400 line-through font-medium'>
                                ₦{formatAmount(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Indicator */}
                    <div className='flex items-center gap-1 pt-0.5'>
                        <div className={`h-1 w-1 rounded-full ${
                            isOutOfStock ? 'bg-slate-400' : 
                            isLowStock ? 'bg-amber-500' : 
                            'bg-emerald-500'
                        }`} />
                        <span className='text-[10px] text-slate-500'>
                            {isOutOfStock ? 'Out of stock' : 
                             isLowStock ? 'Low stock' : 
                             `${product.totalStock} in stock`}
                        </span>
                    </div>
                </div>
            </CardContent>

            {/* Actions Section */}
            <CardFooter className='flex gap-2 px-3.5 pb-3.5 pt-0'>
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
                    className='flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                    size='sm'
                    variant='outline'
                >
                    <MdOutlineEdit className='mr-1 h-3.5 w-3.5 hidden md:block' /> Edit
                </Button>
                <Button
                    onClick={() => handleDelete(product._id)}
                    className='flex-1 rounded-lg border border-red-200 bg-white px-2.5 py-2 text-[11px] font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-sm'
                    size='sm'
                    variant='outline'
                >
                    <MdOutlineDelete className='mr-1 h-3.5 w-3.5 hidden md:block' /> Remove
                </Button>
            </CardFooter>
        </div>
    </Card>

  )

}

export default VendorProductTile
