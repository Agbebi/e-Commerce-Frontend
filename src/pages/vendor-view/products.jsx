import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllProducts, deleteProduct } from '../../store/vendor/product-slice'
import { toast } from 'sonner'
import VendorProductTile from './product-tile'
import { IoAddSharp } from 'react-icons/io5'
import { CiSearch } from 'react-icons/ci'
import LoadingState from '@/components/ui/loading-state'
import { Package } from 'lucide-react'
import HeroCarousel from '../../components/vendor-view/hero-carousel'
import { addProductFormElements } from '../../config/index'

function VendorProducts() {
  const { user } = useSelector((state) => state.auth)
  const { productList, isLoading: productListLoading } = useSelector((state) => state.vendorProducts)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const categoryOptions = useMemo(() => {
    const control = addProductFormElements.find((item) => item.name === 'category')
    return control?.options || []
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    let result = productList.filter((product) => {
      const matchesCategory = categoryFilter && categoryFilter !== 'all' ? product.category === categoryFilter : true
      const matchesSearch = normalizedSearch === ''
        ? true
        : [
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
      result = [...result].sort((a, b) => (Number(a.salesPrice) || Number(a.price)) - (Number(b.salesPrice) || Number(a.price)))
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

  useEffect(() => {
    if (user?.id) dispatch(fetchAllProducts(user.id))
  }, [dispatch, user?.id])

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllProducts(user.id))
        toast.success(`${data.payload.message}`)
      }
    })
  }

  return (
    <Fragment>
      <div className='space-y-6'>
        {/* Header */}
        <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10'>
          <div className='grid items-center gap-6 md:grid-cols-2'>
            <div className='space-y-6 sm:space-y-5'>
              <p className='text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-slate-500'>Catalog</p>
              <h1 className='mt-1.5 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight'>
                Products
              </h1>
              <p className='mt-1.5 text-xs sm:text-sm text-slate-500'>
                Add new items, update pricing, and keep your collection fresh.
              </p>
              <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-center'>
                <span className='inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700'>
                  {productList.length} products
                </span>
                <Button onClick={() => navigate('/vendor/products/new')} className='bg-slate-900 text-white hover:bg-slate-800' size='sm'>
                  <IoAddSharp className='mr-2 h-4 w-4' /> Add New Product
                </Button>
              </div>
            </div>
            <div className='hidden md:flex items-center justify-center'>
              <HeroCarousel interval={4000} className='max-w-sm lg:max-w-md' />
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
           <div className='grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-6'>
            {filteredProducts.map((product) => (
              <VendorProductTile
                handleDelete={handleDelete}
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
    </Fragment>
  )
}

export default VendorProducts
