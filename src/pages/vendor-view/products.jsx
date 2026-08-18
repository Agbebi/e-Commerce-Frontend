import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { Fragment, useState, useEffect, useMemo } from 'react'
import CommonForm from '../../components/common/form'
import { addProductFormElements, categorySubcategoryMap, specificationTemplatesByCategory, specificationTemplatesBySubcategory } from '../../config/index'
import ProductImageUpload from '../../components/vendor-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '../../store/vendor/product-slice'
import { toast } from 'sonner'
import VendorProductTile from './product-tile'
import API from '../../api/axios'
import { IoAddSharp } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import LoadingState from '@/components/ui/loading-state'
import { Package } from 'lucide-react'
import HeroCarousel from '../../components/vendor-view/hero-carousel'


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
  const [sortBy, setSortBy] = useState('newest')
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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    let result = productList.filter((product) => {
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

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (Number(a.salesPrice) || Number(a.price)) - (Number(b.salesPrice) || Number(b.price)))
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => (Number(b.salesPrice) || Number(b.price)) - (Number(a.salesPrice) || Number(a.price)))
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortBy === 'stock-asc') {
      result = [...result].sort((a, b) => (Number(a.totalStock) || 0) - (Number(b.totalStock) || 0))
    } else if (sortBy === 'stock-desc') {
      result = [...result].sort((a, b) => (Number(b.totalStock) || 0) - (Number(a.totalStock) || 0))
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }

    return result
  }, [productList, categoryFilter, searchQuery, sortBy])

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
  }, [canInteractWithDetails, formData.category, categoryRequiresSubcategory])

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
        dispatch(fetchAllProducts(user.id))
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
        dispatch(fetchAllProducts(user.id))
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
      <div className='space-y-6'>
        {/* Header */}
        <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6'>
          <div className='grid items-center gap-6 md:grid-cols-2'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.15em] text-slate-500'>Catalog</p>
              <h1 className='mt-1.5 text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight'>
                Products
              </h1>
              <p className='mt-1.5 max-w-2xl text-sm text-slate-500'>
                Add new items, update pricing, and keep your collection fresh.
              </p>
              <div className='mt-3 flex flex-col gap-2 sm:flex-row sm:items-center'>
                <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700'>
                  {productList.length} products
                </span>
                <Button onClick={() => setOpenProductSheet(true)} className='bg-slate-900 text-white hover:bg-slate-800' size='sm'>
                  <IoAddSharp className='mr-2 h-4 w-4' /> Add New Product
                </Button>
              </div>
            </div>
            <div className='hidden md:flex items-center justify-center'>
              <HeroCarousel interval={4000} className="max-w-sm lg:max-w-md" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='rounded-2xl border border-slate-200 bg-white p-6 sm:p-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div className='flex-1 space-y-4'>
              <div className='relative'>
                <CiSearch className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder='Search by name, brand, category, or ID'
                  className='rounded-xl border-slate-200 bg-slate-50 pl-10 text-xs focus:border-slate-300 focus:ring-slate-200'
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <Select value={categoryFilter || undefined} onValueChange={(value) => setCategoryFilter(value)}>
                    <SelectTrigger className='w-full rounded-xl border-slate-200 bg-slate-50 text-xs'>
                      <SelectValue placeholder='Filter by category' />
                    </SelectTrigger>
                    <SelectContent className='w-full bg-white border-slate-200 text-xs'>
                      <SelectItem key='all' value='all'>All Categories</SelectItem>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.id} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className='w-full rounded-xl border-slate-200 bg-slate-50 text-xs'>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent className='w-full bg-white border-slate-200 text-xs'>
                      <SelectItem value='newest'>Newest first</SelectItem>
                      <SelectItem value='price-asc'>Price: Low to High</SelectItem>
                      <SelectItem value='price-desc'>Price: High to Low</SelectItem>
                      <SelectItem value='name-asc'>Name: A to Z</SelectItem>
                      <SelectItem value='stock-asc'>Stock: Low to High</SelectItem>
                      <SelectItem value='stock-desc'>Stock: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                size='sm'
                className='rounded-xl border-slate-200 text-xs text-slate-700 hover:bg-slate-50'
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('')
                  setSortBy('newest')
                }}
              >
                Clear filters
              </Button>
              <div className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-700 whitespace-nowrap'>
                Showing {filteredProducts.length} of {productList.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {productListLoading && !productList.length ? (
          <LoadingState
            title='Loading your catalog'
            description='Fetching your latest inventory updates before you continue.'
            className='min-h-[220px]'
          />
        ) : filteredProducts.length > 0 ? (
           <div className='grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center'>
            <div className='flex flex-col items-center justify-center gap-3'>
              <div className='p-3 rounded-full bg-white border border-slate-100 text-slate-400'>
                <Package className='h-6 w-6' />
              </div>
              <div>
                <p className='text-sm font-medium text-slate-900'>No products yet</p>
                <p className='text-xs text-slate-500 mt-1'>Click “Add New Product” to start building your catalog.</p>
              </div>
            </div>
          </div>
        )}
      </div>

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
            <SheetTitle className='text-xl font-semibold text-slate-900'>{currentEditedId != null ? 'Edit Product' : 'Add New Product'}</SheetTitle>
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
                    <p className='text-xs font-semibold uppercase tracking-[0.15em] text-slate-600'>Specifications</p>
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
                          className='border-slate-200 rounded-lg text-xs placeholder:text-xs'
                        />
                        <Input
                          placeholder='Value (e.g. 8GB)'
                          value={specification.value || ''}
                          onChange={(event) => updateSpecificationRow(index, 'value', event.target.value)}
                          disabled={!canInteractWithDetails}
                          className='border-slate-200 rounded-lg text-xs placeholder:text-xs'
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
