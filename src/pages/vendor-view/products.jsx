import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { Fragment, useState, useEffect } from 'react'
import CommonForm from '../../components/common/form'
import { addProductFormElements } from '../../config/index'
import ProductImageUpload from '../../components/vendor-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '../../store/vendor/product-slice'
import { toast } from 'sonner'
import VendorProductTile from './product-tile'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoAddSharp } from 'react-icons/io5'
import { Separator } from 'radix-ui'




function VendorProducts() {

  const { user } = useSelector((state) => state.auth)  

  const initialFormData = {
    image: null,
    name: '',
    description: '',
    category: '',
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

  const productList = useSelector((state) => state.vendorProducts.productList)

  const dispatch = useDispatch()

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
      {productList.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {productList.map((product) => (
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
              formControls={addProductFormElements}
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