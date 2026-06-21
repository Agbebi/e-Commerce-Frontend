import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { Fragment, useState, useEffect } from 'react'
import CommonForm from '../../components/common/form'
import { addProductFormElements, categorySubcategoryMap } from '../../config/index'
import ProductImageUpload from '../../components/vendor-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '../../store/vendor/product-slice'
import { toast } from 'sonner'
import VendorProductTile from './product-tile'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoAddSharp } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'




function VendorProducts() {

  const { user } = useSelector((state) => state.auth)  

  const initialFormData = {
    image: null,
    name: '',
    description: '',
    category: '',
    subcategory: '',
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

  const productList = useSelector((state) => state.vendorProducts.productList)

  const dispatch = useDispatch()

  const categoryOptions = React.useMemo(() => {
    const control = addProductFormElements.find((item) => item.name === 'category')
    return control?.options || []
  }, [])

  const filteredProducts = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    return productList.filter((product) => {
      const matchesCategory = categoryFilter && categoryFilter !== 'all' ? product.category === categoryFilter : true
      const matchesSearch = normalizedSearch === '' ? true : [
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
            customOnChange: (value) => {
              setFormData((prev) => ({
                ...prev,
                category: value,
                subcategory: ''
              }))
            }
          }
        }

        return control
      }

      const options = categorySubcategoryMap[formData.category] || []
      return {
        ...control,
        options,
        disabled: !formData.category || options.length === 0,
        placeholder: formData.category ? 'Select a subcategory' : 'Select a category first'
      }
    })
  }, [formData.category])

  function isFormValid() {
    return Object.keys(formData).map((key) => formData[key] !== '').every((value) => value === true) 
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

    currentEditedId != null ?     
      dispatch(editProduct({ id : currentEditedId, formData: { ...formData, ...imagePayload } })).then((data) => {
        if (data.payload.success){
          dispatch(fetchAllProducts())
          setFormData(initialFormData)
          setUploadedImgUrls([])
          setImageFiles([])
          toast.success(`${data.payload.message}`)
          setOpenProductSheet(false)
          setCurrentEditedId(null)
        }
      })
      :

      dispatch(addNewProduct({ ...formData, ...imagePayload })).then((data) => {
        if (data.payload.success) {

          dispatch(fetchAllProducts())
          setFormData(initialFormData)
          setUploadedImgUrls([])
          setImageFiles([])
          toast.success(`${data.payload.message}`)
          setOpenProductSheet(false)
        }
      })

  }

  useEffect(() => {
    dispatch(fetchAllProducts(user.id))
  }, [dispatch,user.id])

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
                placeholder='Search your products'
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
      {filteredProducts.length > 0 ? (
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
            />
          </div>

        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default VendorProducts