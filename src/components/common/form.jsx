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
                        onChange={event => setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })}
                        className='border-gray-300'

                    />
                )
                break;

            case (types.SELECT):
                element = (
                    <Select onValueChange={(value)=> setFormData({
                        ...formData,
                        [getControlItem.name] : value
                    })} value={value} className='' >
                        <SelectTrigger className='w-full border-gray-300'>
                            <SelectValue placeholder={getControlItem.placeholder} />
                        </SelectTrigger>
                        <SelectContent className='w-full bg-white px-0 py-0 border border-gray-300'>
                            {
                                getControlItem.options &&
                                    getControlItem.options.length > 0 ?
                                    getControlItem.options.map(optionItem => <SelectItem  className='hover:bg-gray-200 px-4 w-full' key={optionItem.id} value={optionItem.value}>{optionItem.label}</SelectItem>) : null
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
                        className='border-gray-300'
                    />
                )
                break;

        }
        return element;

    }


    return (
        <form onSubmit={onSubmit}>
            <div className='flex flex-col gap-3'>
                {
                    formControls.map(
                        (controlItem) => (<div className='grid w-full gap-1.5' key={controlItem.name}>
                            <Label className='mb-1'>{controlItem.label}</Label>
                            {
                                renderInputsByComponentType(controlItem)
                            } 
                        </div>
                        ))}
            </div>
            <Button disabled={buttonDisabled} type='submit' className='mt-2 w-full bg-black text-white shadow cursor-pointer'>{buttonText || 'Submit'}</Button>
        </form>
    )
}

export default commonForm