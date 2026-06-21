import React from 'react'
import { Input } from "../ui/input"
import { Label } from '../ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import {Select, SelectTrigger, SelectValue, SelectItem,  SelectContent } from '../ui/select'



const types = {
    INPUT: 'input',
    SELECT: 'select',
    LABEL: 'label',
    TEXTAREA: 'textarea'
}


function commonForm({ formControls, formData, setFormData, onSubmit, buttonText, buttonDisabled }) {

    function renderInputsByComponentType(getControlItem) {
        let element = null
        const value = formData[getControlItem.name] || ''

        switch (getControlItem.componentType) {
            case (types.INPUT):
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        componentType={getControlItem.componentType}
                        type={getControlItem.type}
                        id={getControlItem.name}
                        value={value}
                        disabled={getControlItem.disabled}
                        onChange={event => {
                            const nextValue = event.target.value
                            if (typeof getControlItem.customOnChange === 'function') {
                                getControlItem.customOnChange(nextValue)
                            } else {
                                setFormData({
                                    ...formData,
                                    [getControlItem.name]: nextValue
                                })
                            }
                        }}
                        className='border-gray-200 rounded-none text-xs placeholder:text-xs '

                    />
                )
                break;

            case (types.SELECT):
                element = (
                    <Select
                        onValueChange={(value)=> {
                            if (typeof getControlItem.customOnChange === 'function') {
                                getControlItem.customOnChange(value)
                            } else {
                                setFormData({
                                    ...formData,
                                    [getControlItem.name] : value
                                })
                            }
                        }}
                        value={value}
                        className=''
                        disabled={getControlItem.disabled}
                    >
                        <SelectTrigger className='w-full text-xs border-gray-300'>
                            <SelectValue placeholder={getControlItem.placeholder} />
                        </SelectTrigger>
                        <SelectContent className='w-full bg-white px-0 py-0 border text-xs border-gray-300'>
                            {
                                getControlItem.options &&
                                    getControlItem.options.length > 0 ?
                                    getControlItem.options.map(optionItem => <SelectItem  className='hover:bg-gray-200 text-xs px-4 w-full' key={optionItem.id} value={optionItem.value}>{optionItem.label}</SelectItem>) : null
                            }
                        </SelectContent>
                    </Select>
                )
                break;

            case (types.TEXTAREA):
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.id}
                        value={value}
                        onChange={event => setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })}
                        className='border-gray-300 placeholder:text-xs'
                    />
                )
                break;

        }
        return element;

    }


    return (
        <form onSubmit={onSubmit}>
            <div className='flex flex-col space-y-6 mb-4'>
                {
                    formControls.map(
                        (controlItem) => (<div className='grid w-full gap-1' key={controlItem.name}>
                            <Label className='mb-1 font-medium text-black text-xs'>{controlItem.label}</Label>
                            {
                                renderInputsByComponentType(controlItem)
                            } 
                        </div>
                        ))}
            </div>
            <Button disabled={buttonDisabled} type='submit' size='' className='mt-2 text-xs w-full bg-black text-white shadow cursor-pointer'>{buttonText || 'Submit'}</Button>
        </form>
    )
}

export default commonForm