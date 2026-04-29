import { filterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

function ProductFilter({ filters, handleFilters }) {
    return (
        <div className='rounded-lg shadow-sm'>
            <div className='border-b p-4 border-gray-200'>
                <h2 className='text-lg font-bold '>Filters</h2>
            </div>
            <div className='p-4 space-y-4'>
                {
                    Object.keys(filterOptions).map((keyItem) => (
                        <Fragment key={keyItem}>
                            <div >
                                <h3 className='text-base font-semibold'>{keyItem}</h3>
                                <div className='grid gap-2 mt-2'>
                                    {
                                        filterOptions[keyItem].map((option) =>
                                            <Label className='flex items-center gap-4 font-normal text-gray-600'>
                                                <Checkbox checked={
                                                    filters && Object.keys(filters).length > 0 && filters[keyItem] && filters[keyItem].includes(option.id) ? true : false
                                                } onCheckedChange={() => handleFilters(keyItem, option.id)} className='border-gray-300 ' />
                                                {option.label}
                                            </Label>
                                        )
                                    }
                                </div>
                            </div>
                            <Separator />
                        </Fragment>
                    )
                    )
                }
            </div>
        </div>
    )
}

export default ProductFilter;