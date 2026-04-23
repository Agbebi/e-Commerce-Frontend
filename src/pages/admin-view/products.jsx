import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { Fragment, useState, useEffect } from 'react'
import CommonForm from '../../components/common/form'
import { addProductFormElements } from '../../config/index'
import ProductImageUpload from '../../components/admin-view/image-upload'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '../../store/admin/product-slice'
import { toast } from 'sonner'
import AdminProductTile from './product-tile'



function AdminProducts() {

  const initialFormData = {
    image: null,
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salesPrice: '',
    totalStock: ''
  }

  const [openProductSheet, setOpenProductSheet] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImgUrl, setUploadedImgUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)

  const productList = useSelector((state) => state.AdminProducts.productList)

  const dispatch = useDispatch()

  function isFormValid() {
    return Object.keys(formData).map((key) => formData[key] !== '').every((value) => value === true) 
  }

  function handleDelete(productId) {

    console.log(productId, 'product id');
    
    dispatch(deleteProduct(productId)).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllProducts())
        toast.success(`${data.payload.message}`)
      }
    })
}


  function onSubmit(event) {
    event.preventDefault()


    currentEditedId != null ?     
      dispatch(editProduct({ id : currentEditedId, formData })).then((data) => {
        if (data.payload.success){
          dispatch(fetchAllProducts())
          setFormData(initialFormData)
          setUploadedImgUrl('')
          setImageFile(null)
          toast.success(`${data.payload.message}`)
          setOpenProductSheet(false)
          setCurrentEditedId(null)
        }
      })
      :

      dispatch(addNewProduct({ ...formData, image: uploadedImgUrl }
      )).then((data) => {
        if (data.payload.success) {

          dispatch(fetchAllProducts())
          setFormData(initialFormData)
          setUploadedImgUrl('')
          setImageFile(null)
          toast.success(`${data.payload.message}`)
          setOpenProductSheet(false)
        }
      })

  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  return (
    <Fragment>
      <div className='mb-5 flex w-full justify-end'>
        <Button onClick={() => { setOpenProductSheet(true) }} className='bg-black text-white cursor-pointer'>Add New Product</Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {
          productList.length > 0 ?
            productList.map((product) => {
              return <AdminProductTile
                setOpenProductSheet={setOpenProductSheet}
                setCurrentEditedId={setCurrentEditedId}
                handleDelete={handleDelete}
                setFormData={setFormData}
                key={product._id}
                product={product} />
            })
            : null}
      </div>
      <Sheet open={openProductSheet} onOpenChange={
        () => {
          setOpenProductSheet(false)
          setCurrentEditedId(null)
          setFormData(initialFormData)
          setImageFile(null)
          setUploadedImgUrl('')
        }
      }>
        <SheetContent side='right' className='overflow-auto w-full sm:w-[400px] px-4 py-4 bg-white'>
          <SheetHeader>
            <SheetTitle className='text-2xl font-bold'>{currentEditedId != null ? 'Edit Product' : 'Add New Product'}</SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImgUrl={uploadedImgUrl}
            setUploadedImgUrl={setUploadedImgUrl}
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

export default AdminProducts