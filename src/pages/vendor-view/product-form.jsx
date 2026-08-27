import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import ProductImageUpload from '../../components/vendor-view/image-upload'
import { addNewProduct, editProduct, fetchProductById } from '../../store/vendor/product-slice'
import {
  addProductFormElements,
  categorySubcategoryMap,
  specificationTemplatesByCategory,
  specificationTemplatesBySubcategory
} from '../../config/index'
import { toast } from 'sonner'
import API from '../../api/axios'

function VendorProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const initialFormData = useMemo(() => ({
    image: null,
    name: '',
    description: '',
    category: '',
    subcategory: '',
    specifications: [],
    keyFeatures: '',
    brand: '',
    price: '',
    salesPrice: '',
    totalStock: '',
    vendorId: user?.id
  }), [user?.id])

  const [formData, setFormData] = useState(initialFormData)
  const [imageUrls, setImageUrls] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [availableBrands, setAvailableBrands] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    let active = true
    setIsLoadingProduct(true)
    dispatch(fetchProductById(id))
      .then((data) => {
        if (!active) return
        const product = data?.payload?.data
        if (product) {
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
          setImageUrls(Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []))
        } else {
          toast.error('Could not load the product to edit.')
          navigate('/vendor/products')
        }
        setIsLoadingProduct(false)
      })
      .catch(() => {
        if (!active) return
        toast.error('Could not load the product to edit.')
        navigate('/vendor/products')
      })
    return () => { active = false }
  }, [id, isEdit, dispatch, navigate])

  useEffect(() => {
    API.get('/api/shop/products/brands')
      .then((response) => {
        if (response?.data?.success) setAvailableBrands(response.data.data || [])
      })
      .catch(() => {})
  }, [])

  const canInteract = isEdit || imageUrls.length > 0

  const guidance = !canInteract
    ? (isUploading
        ? 'Uploading your images — you can start adding details in a moment.'
        : 'Upload at least one product image to start adding details.')
    : ''

  const categoryRequiresSubcategory = useMemo(() => (selectedCategory) => {
    const options = categorySubcategoryMap[selectedCategory] || []
    return Array.isArray(options) && options.length > 0
  }, [])

  const getSuggestedSpecifications = (selectedCategory, selectedSubcategory) => {
    if (selectedSubcategory && specificationTemplatesBySubcategory[selectedSubcategory]) {
      return specificationTemplatesBySubcategory[selectedSubcategory].map((specification) => ({ ...specification }))
    }
    if (selectedCategory && specificationTemplatesByCategory[selectedCategory]) {
      return specificationTemplatesByCategory[selectedCategory].map((specification) => ({ ...specification }))
    }
    return specificationTemplatesByCategory.default.map((specification) => ({ ...specification }))
  }

  const addSpecificationRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { name: '', value: '' }]
    }))
  }

  const updateSpecificationRow = (index, field, value) => {
    setFormData((prev) => {
      const nextSpecifications = [...(prev.specifications || [])]
      nextSpecifications[index] = { ...nextSpecifications[index], [field]: value }
      return { ...prev, specifications: nextSpecifications }
    })
  }

  const removeSpecificationRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const formControls = useMemo(() => {
    return addProductFormElements.map((control) => {
      if (control.name !== 'subcategory') {
        if (control.name === 'category') {
          return {
            ...control,
            disabled: !canInteract || control.disabled,
            customOnChange: (value) => {
              setFormData((prev) => ({
                ...prev,
                category: value,
                subcategory: '',
                specifications: prev.specifications?.length > 0 ? prev.specifications : getSuggestedSpecifications(value, '')
              }))
            }
          }
        }
        return { ...control, disabled: !canInteract || control.disabled }
      }
      const options = categorySubcategoryMap[formData.category] || []
      return {
        ...control,
        options,
        disabled: !canInteract || !formData.category || options.length === 0,
        placeholder: formData.category
          ? categoryRequiresSubcategory(formData.category)
            ? 'Select a subcategory'
            : 'No subcategory required for this category'
          : 'Select a category first',
        customOnChange: (value) => {
          setFormData((prev) => ({
            ...prev,
            subcategory: value,
            specifications: prev.specifications?.length > 0 ? prev.specifications : getSuggestedSpecifications(prev.category, value)
          }))
        }
      }
    })
  }, [canInteract, formData.category, categoryRequiresSubcategory])

  const isFormValid = () => {
    const requiredFields = ['name', 'description', 'category', 'brand', 'price', 'totalStock']
    if (categoryRequiresSubcategory(formData.category)) requiredFields.push('subcategory')

    const hasRequiredFields = requiredFields.every((field) => {
      const value = formData[field]
      return typeof value === 'string' ? value.trim() !== '' : value !== '' && value != null
    })

    const hasValidSpecifications = (formData.specifications || []).every((specification) => {
      const hasName = typeof specification?.name === 'string' ? specification.name.trim() !== '' : false
      const hasValue = typeof specification?.value === 'string' ? specification.value.trim() !== '' : false
      return hasName && hasValue
    })

    return hasRequiredFields && (formData.specifications?.length ? hasValidSpecifications : true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!canInteract) {
      toast.error('Please upload an image first before filling the product details.')
      return
    }
    if (!isFormValid()) {
      toast.error('Please complete all required product fields before submitting.')
      return
    }

    const sanitizedSpecifications = (formData.specifications || [])
      .filter((specification) => specification?.name?.trim() || specification?.value?.trim())
      .map((specification) => ({
        name: specification.name?.trim() || 'Specification',
        value: specification.value?.trim() || ''
      }))

    const payload = {
      ...formData,
      images: imageUrls.slice(0, 5),
      specifications: sanitizedSpecifications,
      keyFeatures: sanitizedSpecifications.length > 0
        ? sanitizedSpecifications.map((item) => `${item.name}: ${item.value}`)
        : []
    }

    setIsSubmitting(true)
    const submitAction = isEdit
      ? dispatch(editProduct({ id, formData: payload }))
      : dispatch(addNewProduct(payload))

    submitAction
      .then((data) => {
        if (data.payload?.success) {
          toast.success(data.payload.message || 'Product saved successfully.')
          navigate('/vendor/products')
        } else {
          toast.error(data.payload?.message || 'Unable to save the product right now.')
        }
      })
      .catch(() => {
        toast.error('Something went wrong while saving the product.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const fieldClasses = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

  const renderControl = (control) => {
    const value = formData[control.name] || ''
    switch (control.componentType) {
      case 'textarea':
        return (
          <Textarea
            id={control.name}
            placeholder={control.placeholder}
            value={value}
            disabled={control.disabled}
            onChange={(event) => setFormData((prev) => ({ ...prev, [control.name]: event.target.value }))}
            className='min-h-[140px] w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
          />
        )
      case 'select':
        return (
          <Select
            value={value || undefined}
            onValueChange={(next) => {
              if (typeof control.customOnChange === 'function') control.customOnChange(next)
              else setFormData((prev) => ({ ...prev, [control.name]: next }))
            }}
            disabled={control.disabled}
          >
            <SelectTrigger className={`${fieldClasses} data-[placeholder]:text-slate-400`}>
              <SelectValue placeholder={control.placeholder} />
            </SelectTrigger>
            <SelectContent className='w-full rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg'>
              {control.options?.length > 0
                ? control.options.map((option) => (
                    <SelectItem key={option.id} value={option.value} className='cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-slate-100'>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            id={control.name}
            type={control.type}
            list={control.list}
            placeholder={control.placeholder}
            value={value}
            disabled={control.disabled}
            onChange={(event) => {
              if (typeof control.customOnChange === 'function') control.customOnChange(event.target.value)
              else setFormData((prev) => ({ ...prev, [control.name]: event.target.value }))
            }}
            className={fieldClasses}
          />
        )
    }
  }

  const detailControls = formControls
  const primaryControls = detailControls.filter((c) => c.name === 'name' || c.name === 'description')
  const secondaryControls = detailControls.filter((c) => c.name !== 'name' && c.name !== 'description')

  if (isLoadingProduct) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-3 text-slate-400'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <p className='text-sm'>Loading product details…</p>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-10'>
          <button
            type='button'
            onClick={() => navigate('/vendor/products')}
            className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900'
          >
            <ArrowLeft className='h-4 w-4' /> Back to products
          </button>
          <div className='flex items-center gap-3'>
            <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white'>
              <Sparkles className='h-5 w-5' />
            </span>
            <div>
              <h1 className='text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl'>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className='mt-1 text-sm text-slate-500'>
                {isEdit
                  ? 'Update the details, media, and pricing for this listing.'
                  : 'Create a new listing by adding media and product details.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* Media */}
          <div className='lg:col-span-5'>
            <div className='lg:sticky lg:top-8'>
              <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
                <div className='mb-6'>
                  <h2 className='text-base font-semibold text-slate-900'>Product Images</h2>
                  <p className='mt-1 text-sm text-slate-500'>The first image will be used as the cover.</p>
                </div>
                <ProductImageUpload
                  key={isEdit ? id : 'new'}
                  initialImages={imageUrls}
                  onChange={setImageUrls}
                  onBusyChange={setIsUploading}
                  maxImages={5}
                />
              </section>
            </div>
          </div>

          {/* Details + Specifications */}
          <div className='space-y-8 lg:col-span-7'>
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
              <div className='mb-6'>
                <h2 className='text-base font-semibold text-slate-900'>Product Details</h2>
                <p className='mt-1 text-sm text-slate-500'>Basic information shoppers will see.</p>
              </div>

              {guidance ? (
                <div className='mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'>
                  {guidance}
                </div>
              ) : null}

              <datalist id='product-brands'>
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>

              <div className='space-y-5'>
                {primaryControls.map((control) => (
                  <div key={control.name} className='space-y-2'>
                    <label htmlFor={control.name} className='block text-sm font-medium text-slate-700'>
                      {control.label}
                    </label>
                    {renderControl(control)}
                  </div>
                ))}

                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                  {secondaryControls.map((control) => (
                    <div key={control.name} className='space-y-2'>
                      <label htmlFor={control.name} className='block text-sm font-medium text-slate-700'>
                        {control.label}
                      </label>
                      {renderControl(control)}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
              <div className='mb-6 flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-base font-semibold text-slate-900'>Specifications</h2>
                  <p className='mt-1 text-sm text-slate-500'>Add details like RAM, size, color, or processor.</p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addSpecificationRow}
                  disabled={!canInteract}
                  className='rounded-full border-slate-300 text-sm text-slate-700 hover:bg-slate-50'
                >
                  <Plus className='mr-1 h-4 w-4' /> Add spec
                </Button>
              </div>

              {formData.specifications?.length > 0 ? (
                <div className='space-y-3'>
                  {formData.specifications.map((specification, index) => (
                    <div key={`specification-row-${index}`} className='grid grid-cols-[1fr_1fr_auto] gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3'>
                      <Input
                        placeholder='Name (e.g. RAM)'
                        value={specification.name || ''}
                        onChange={(event) => updateSpecificationRow(index, 'name', event.target.value)}
                        disabled={!canInteract}
                        className='h-10 rounded-xl border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100'
                      />
                      <Input
                        placeholder='Value (e.g. 8GB)'
                        value={specification.value || ''}
                        onChange={(event) => updateSpecificationRow(index, 'value', event.target.value)}
                        disabled={!canInteract}
                        className='h-10 rounded-xl border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeSpecificationRow(index)}
                        disabled={!canInteract}
                        className='h-10 w-10 text-slate-400 hover:text-red-600'
                      >
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Remove specification</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-500'>
                  No specifications added yet. Add a few to help shoppers understand the product better.
                </p>
              )}
            </section>
          </div>
        </form>
      </div>

      {/* Sticky action bar */}
      <div className='sticky bottom-0 z-20 border-t border-slate-200 bg-white/80 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8'>
          <p className='hidden text-sm text-slate-500 sm:block'>
            {canInteract ? 'Ready when you are.' : 'Add an image to continue.'}
          </p>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/vendor/products')}
              className='rounded-xl border-slate-200 px-5 text-sm text-slate-700 hover:bg-slate-50'
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting || isUploading}
              className='inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' /> Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className='h-4 w-4' /> {isEdit ? 'Save Changes' : 'Publish Product'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default VendorProductForm
