import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { Fragment, useState, useEffect } from 'react'
import CommonForm from '../../components/common/form'
import { addProductFormElements, categorySubcategoryMap, specificationTemplatesByCategory, specificationTemplatesBySubcategory } from '../../config/index'
import ProductImageUpload from '../../components/vendor-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '../../store/vendor/product-slice'
import { toast } from 'sonner'
import VendorProductTile from './product-tile'
import API from '../../api/axios'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoAddSharp } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import LoadingState from '@/components/ui/loading-state'


function VendorProducts() {

  const { user } = useSelector((state) => state.auth)  

  const initialFormData = {
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
    vendorId: user.id
  }
  

  const [openProductSheet, setOpenProductSheet] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFiles, setImageFiles] = useState([])
  const [uploadedImgUrls, setUploadedImgUrls] = useState([])
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [availableBrands, setAvailableBrands] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { productList, isLoading: productListLoading } = useSelector((state) => state.vendorProducts)

  const dispatch = useDispatch()

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
      nextSpecifications[index] = {
        ...nextSpecifications[index],
        [field]: value
      }
      return {
        ...prev,
        specifications: nextSpecifications
      }
    })
  }

  const removeSpecificationRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const categoryOptions = React.useMemo(() => {
    const control = addProductFormElements.find((item) => item.name === 'category')
    return control?.options || []
  }, [])

  const canInteractWithDetails = currentEditedId != null || uploadedImgUrls.some(Boolean)
  const uploadGuidanceText = currentEditedId != null
    ? ''
    : imageLoadingState
      ? 'Picture is uploading. Please wait before filling the rest of the form.'
      : !uploadedImgUrls.some(Boolean)
        ? 'Upload at least one image first to start filling the product details.'
        : ''

  const categoryRequiresSubcategory = React.useCallback((selectedCategory) => {
    const options = categorySubcategoryMap[selectedCategory] || []
    return Array.isArray(options) && options.length > 0
  }, [])

  const filteredProducts = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    return productList.filter((product) => {
      const matchesCategory = categoryFilter && categoryFilter !== 'all' ? product.category === categoryFilter : true
      const matchesSearch = normalizedSearch === '' ? true : [
        product._id,
        product.id,
        product.name,
        product.description,
        product.brand,
        product.category,
        product.subcategory
      ]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(normalizedSearch))
      return matchesCategory && matchesSearch
    })
  }, [productList, categoryFilter, searchQuery])

  const formControls = React.useMemo(() => {
    return addProductFormElements.map((control) => {
      if (control.name !== 'subcategory') {
        if (control.name === 'category') {
          return {
            ...control,
            disabled: !canInteractWithDetails || control.disabled,
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

        return {
          ...control,
          disabled: !canInteractWithDetails || control.disabled
        }
      }

      const options = categorySubcategoryMap[formData.category] || []
      return {
        ...control,
        options,
        disabled: !canInteractWithDetails || !formData.category || options.length === 0,
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
  }, [canInteractWithDetails, formData.category])

  function isFormValid() {
    const requiredFields = [
      'name',
      'description',
      'category',
      'brand',
      'price',
      'totalStock'
    ]

    if (categoryRequiresSubcategory(formData.category)) {
      requiredFields.push('subcategory')
    }

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

  function handleDelete(productId) {
    
    dispatch(deleteProduct(productId)).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllProducts())
        toast.success(`${data.payload.message}`)
      }
    })
}


  function onSubmit(event) {
    event.preventDefault()

    const imagePayload = uploadedImgUrls.length > 0 ? { images: uploadedImgUrls.slice(0, 5) } : {}
    const sanitizedSpecifications = (formData.specifications || [])
      .filter((specification) => specification?.name?.trim() || specification?.value?.trim())
      .map((specification) => ({
        name: specification.name?.trim() || 'Specification',
        value: specification.value?.trim() || ''
      }))

    if (!canInteractWithDetails && currentEditedId == null) {
      toast.error('Please upload an image first before filling the product details.')
      return
    }

    if (!isFormValid()) {
      toast.error('Please complete all required product fields before submitting.')
      return
    }

    const payload = {
      ...formData,
      ...imagePayload,
      specifications: sanitizedSpecifications,
      keyFeatures: sanitizedSpecifications.length > 0
        ? sanitizedSpecifications.map((item) => `${item.name}: ${item.value}`)
        : []
    }

    setIsSubmitting(true)

    const submitAction = currentEditedId != null
      ? dispatch(editProduct({ id: currentEditedId, formData: payload }))
      : dispatch(addNewProduct(payload))

    submitAction.then((data) => {
      if (data.payload?.success) {
        dispatch(fetchAllProducts())
        setFormData(initialFormData)
        setUploadedImgUrls([])
        setImageFiles([])
        toast.success(`${data.payload.message}`)
        setOpenProductSheet(false)
        setCurrentEditedId(null)
      } else {
        toast.error(data.payload?.message || 'Unable to save the product right now.')
      }
    }).catch(() => {
      toast.error('Something went wrong while saving the product.')
    }).finally(() => {
      setIsSubmitting(false)
    })

  }

  useEffect(() => {
    dispatch(fetchAllProducts(user.id))
  }, [dispatch,user.id])

  useEffect(() => {
    async function loadBrands() {
      try {
        const response = await API.get('/api/shop/products/brands')
        if (response?.data?.success) {
          setAvailableBrands(response.data.data || [])
        }
      } catch (error) {
        console.error('Failed to load brands:', error)
      }
    }

    loadBrands()
  }, [])

  return (
    <Fragment>
      <div className='mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>catalog</p>
            <h1 className='mt-2 text-3xl font-semibold text-slate-900'>Your storefront inventory</h1>
            <p className='mt-3 max-w-2xl text-sm text-gray-600'>Add new items, update pricing, and keep your collection fresh for customers browsing your store.</p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700'>
              {productList.length} products
            </span>
            <Button onClick={() => setOpenProductSheet(true)} className='justify-center text-xs text-gray-600 border-gray-300' variant='outline' size='sm'>
              <IoAddSharp /> Add New Product
            </Button>
          </div>
        </div>
      </div>
      <div className='mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-3'>
            <div className='relative'>
              <CiSearch className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search by name, brand, category, or ID'
                className='rounded-full border-gray-300 pl-12 text-xs focus:border-black focus:ring-black'
              />
            </div>
            <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
              <div>
                <Select value={categoryFilter || undefined} onValueChange={(value) => setCategoryFilter(value)}>
                  <SelectTrigger className='w-full rounded-full border-gray-300 text-xs'>
                    <SelectValue placeholder='Filter by category' />
                  </SelectTrigger>
                  <SelectContent className='w-full bg-white px-0 py-0 border text-xs border-gray-300'>
                    <SelectItem key='all' value='all'>All Categories</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='rounded-full border-gray-300 text-xs text-gray-700'
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('')
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
          <div className='rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-700'>
            Showing {filteredProducts.length} of {productList.length} products
          </div>
        </div>
      </div>
      {productListLoading && !productList.length ? (
        <LoadingState
          title='Loading your catalog'
          description='Fetching your latest inventory updates before you continue.'
          className='min-h-[220px]'
        />
      ) : filteredProducts.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {filteredProducts.map((product) => (
            <VendorProductTile
              setOpenProductSheet={setOpenProductSheet}
              setCurrentEditedId={setCurrentEditedId}
              handleDelete={handleDelete}
              setFormData={setFormData}
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className='rounded-3xl border border-dashed border-gray-200 bg-slate-50 p-10 text-center text-sm text-gray-600'>
          No products yet. Click “Add New Product” to start building your catalog and showcase your best items.
        </div>
      )}
      <Sheet open={openProductSheet} onOpenChange={
        () => {
          setOpenProductSheet(false)
          setCurrentEditedId(null)
          setFormData(initialFormData)
          setImageFiles([])
          setUploadedImgUrls([])
        }
      }>
        <SheetContent side='right' className='overflow-auto w-full sm:w-[400px] px-4 py-4 bg-white'>
          <SheetHeader>
            <SheetTitle className='text-2xl font-bold'>{currentEditedId != null ? 'Edit Product' : 'Add New Product'}</SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImgUrls={uploadedImgUrls}
            setUploadedImgUrls={setUploadedImgUrls}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId != null}
          />

          <div className='py-4 px-2'>
            <CommonForm
              formControls={formControls}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={currentEditedId != null ? 'Edit Product' : 'Add Product'}
              buttonDisabled={!isFormValid()}
              isSubmitting={isSubmitting}
            >
              <datalist id='product-brands'>
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>
              {uploadGuidanceText ? (
                <div className='mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700'>
                  {uploadGuidanceText}
                </div>
              ) : null}
              <div className='mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <div className='mb-3 flex items-center justify-between gap-2'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-600'>Specifications</p>
                    <p className='text-xs text-slate-500'>Add details like RAM, size, color, picture quality, or processor.</p>
                  </div>
                  <Button type='button' variant='outline' size='sm' onClick={addSpecificationRow} disabled={!canInteractWithDetails} className='rounded-full border-slate-300 text-xs'>Add spec</Button>
                </div>
                <div className='space-y-3'>
                  {(formData.specifications || []).length > 0 ? (
                    (formData.specifications || []).map((specification, index) => (
                      <div key={`specification-row-${index}`} className='grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_1fr_auto]'>
                        <Input
                          placeholder='Name (e.g. RAM)'
                          value={specification.name || ''}
                          onChange={(event) => updateSpecificationRow(index, 'name', event.target.value)}
                          disabled={!canInteractWithDetails}
                          className='border-gray-200 rounded-none text-xs placeholder:text-xs'
                        />
                        <Input
                          placeholder='Value (e.g. 8GB)'
                          value={specification.value || ''}
                          onChange={(event) => updateSpecificationRow(index, 'value', event.target.value)}
                          disabled={!canInteractWithDetails}
                          className='border-gray-200 rounded-none text-xs placeholder:text-xs'
                        />
                        <Button type='button' variant='ghost' size='sm' onClick={() => removeSpecificationRow(index)} disabled={!canInteractWithDetails} className='justify-self-end text-xs text-red-600 hover:text-red-700'>Remove</Button>
                      </div>
                    ))
                  ) : (
                    <p className='text-xs text-slate-500'>No specifications added yet. Add a few to help shoppers understand the product better.</p>
                  )}
                </div>
              </div>
            </CommonForm>
          </div>

        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default VendorProducts