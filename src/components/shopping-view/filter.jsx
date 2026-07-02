import { filterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { MdOutlineDelete, MdCategory, MdLabel } from 'react-icons/md'

const sectionIcons = {
    Category: MdCategory,
    Brand: MdLabel,
}

function ProductFilter({ filters, handleFilters, clearFilters, brandOptions = [] }) {
    const hasFilters = filters && Object.keys(filters).length > 0;
    const dynamicBrandOptions = (brandOptions || []).map((brand) =>
        typeof brand === 'string' ? { id: brand, label: brand } : brand,
    );
    const filterSections = [
        { key: 'Category', options: filterOptions.Category || [] },
        { key: 'Brand', options: dynamicBrandOptions.length > 0 ? dynamicBrandOptions : filterOptions.Brand || [] },
    ];

    return (
        <div className='rounded-lg border border-gray-200 bg-white shadow-xs'>
            <div className='flex flex-col gap-3 border-b border-gray-200 p-4'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h2 className='text-lg font-semibold'>Filters</h2>
                        <p className='text-sm text-gray-500'>Refine products by category and brand.</p>
                    </div>
                    {hasFilters ? (
                        <Button variant='outline' className='rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100' size='sm' onClick={clearFilters}>
                           <MdOutlineDelete className='sm:hidden mr-2 h-4 w-4' /> Clear all
                        </Button>
                    ) : null}
                </div>
                {hasFilters ? (
                    <div className='flex flex-wrap gap-2'>
                        {Object.entries(filters).flatMap(([section, values]) =>
                            values.map((value) => (
                                <Badge
                                    key={`${section}-${value}`}
                                    variant='outline'
                                    className='capitalize text-xs border-gray-200 bg-slate-50 text-slate-700'
                                >
                                    {value}
                                </Badge>
                            )),
                        )}
                    </div>
                ) : null}
            </div>
            <div className='p-4 space-y-4'>
                {filterSections.map(({ key, options }) => {
                    const SectionIcon = sectionIcons[key]
                    return (
                        <Fragment key={key}>
                            <div className='rounded-lg p-0'>
                                <div className='flex items-center justify-start gap-2'>
                                    {SectionIcon ? <SectionIcon className='h-4 w-4 text-gray-400' /> : null}
                                    <h3 className='text-md font-semibold text-slate-900'>{key}</h3>
                                </div>
                                <div className='grid p-2 grid-cols-2 gap-2 mt-2'>
                                    {options.map((option) => {
                                        const optionId = option.id || option.value || option;
                                        const optionLabel = option.label || option;
                                        const isChecked = filters?.[key]?.includes(optionId) ?? false
                                        return (
                                            <Label
                                                key={optionId}
                                                className='flex items-center border border-slate-100 rounded-lg text-left gap-3 bg-white px-2 py-2 text-xs font-normal text-gray-700 shadow-s transition hover:border-gray-200'
                                            >
                                                <Checkbox
                                                    id={`filter-${key}-${optionId}`}
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleFilters(key, optionId)}
                                                    className='border-gray-200'
                                                />
                                                {optionLabel}
                                            </Label>
                                        )
                                    })}
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default ProductFilter;
