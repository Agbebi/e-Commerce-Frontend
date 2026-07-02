import React, { useEffect, useState } from 'react'
import { ArrowRight, Activity, Baby, Cpu, Gift, Home, ShoppingCart, Smartphone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import ProductDetailsDialog from '@/components/product-details'
import { GrHp } from 'react-icons/gr'
import { SiAdidas, SiLenovo, SiNike } from 'react-icons/si'
import { PiHandbagLight, PiLampPendantLight } from 'react-icons/pi'
import { GiBlackBook, GiMicrochip } from 'react-icons/gi'
import LoadingState from '@/components/ui/loading-state'

const categoriesWithIcons = [
  { id: 'electronics', value: 'electronics', label: 'Electronics', icon: GiMicrochip },
  { id: 'computers', value: 'computers', label: 'Computers', icon: Cpu },
  { id: 'phones-tablets', value: 'phones-tablets', label: 'Phones & Tablets', icon: Smartphone },
  { id: 'home-appliances', value: 'home-appliances', label: 'Home Appliances', icon: Home },
  { id: 'fashion', value: 'fashion', label: 'Fashion', icon: PiHandbagLight },
  { id: 'beauty', value: 'beauty', label: 'Beauty', icon: Gift },
  { id: 'baby', value: 'baby', label: 'Baby', icon: Baby },
  { id: 'sports', value: 'sports', label: 'Sports', icon: Activity },
  { id: 'groceries', value: 'groceries', label: 'Groceries', icon: ShoppingCart },
  { id: 'books', value: 'books', label: 'Books', icon: GiBlackBook },
  { id: 'accessories', value: 'accessories', label: 'Accessories', icon: Gift },
]

const BrandWithIcons = [
  { value: 'nike', id: 'nike', label: 'Nike', icon: SiNike },
  { value: 'hp', id: 'hp', label: 'HP', icon: GrHp },
  { value: 'adidas', id: 'adidas', label: 'Adidas', icon: SiAdidas },
  { value: 'lenovo', id: 'lenovo', label: 'Lenovo', icon: SiLenovo },
]


function ShoppingHome() {

  // const slides = [bannerOne, bannerTwo]

  const slides = ['https://picsum.photos/1080?random=1', 'https://picsum.photos/1080?random=2', 'https://picsum.photos/1080?random=3', 'https://picsum.photos/1080?random=4', 'https://picsum.photos/1080?random=5']

  const [currentSlide, setCurrentSlide] = useState(0)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth)
  const { productList, productDetails, isLoading } = useSelector(state => state.shopProducts)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()


  function handleNavigateToCategory(getCurrentItem, section) {
    sessionStorage.removeItem('filters')
    navigate('/shop/listing')

    const currentFilter = {
      [section]: [getCurrentItem.id]
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
  }

  function handleAddToCart(getCurrentProduct) {

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProduct._id,
        quantity: 1,
        description: getCurrentProduct.description,
        name: getCurrentProduct.name,
        imageUrl: getCurrentProduct.images?.[0] || getCurrentProduct.image,
        price: getCurrentProduct.salesPrice > 0 ? getCurrentProduct.salesPrice : getCurrentProduct.price,
        vendorId: getCurrentProduct.vendorId
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        // show success toast
        toast.success("Product added to cart successfully")
        dispatch(fetchCartItems({ userId: user.id }))
      }
    }).catch((error) => {
      toast.error("An error occurred while adding to cart");
      console.error(error);
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
      dispatch(fetchProductDetails(getCurrentProductId));
    }



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 10000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price:low-to-high' }))
  }, [dispatch])

  useEffect(() => {
      if (productDetails !== null) {
        setOpenDetailsDialog(true);
      }
    }, [productDetails]);        

  return (
    <div className='flex flex-col min-h-screen p-4 py-2'>
      <div className='relative w-full h-[50vh] md:h-[70vh] rounded-lg overflow-hidden'>
        {
          slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
        }

        <div className='absolute py-6 inset-0 bg-black/65' />
        <div className='absolute inset-0 flex flex-col justify-center items-center sm:items-start px-6 md:px-16 lg:px-24 text-white'>
          {/* <div className='mb-8 inline-flex items-center justify-center rounded-full border border-orange-300/30 bg-orange-500/10 p-3 text-orange-200 shadow-sm shadow-orange-200/20'>
            <Sparkles className='h-5 w-5' />
          </div> */}
          <h1 className='max-w-3xl text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight'>Discover the <span className='text-orange-300'>best products</span> from <span className='text-orange-300'>trusted vendors</span>, all in one place.</h1>
          <p className='mt-2 max-w-2xl text-sm sm:text-lg leading-7 text-slate-200/90'>Browse fresh arrivals, shop top brands, and enjoy easy checkout with <span className='text-orange-300'>fast delivery</span> and friendly support.</p>
          <div className='mt-8 text-xs flex items-center gap-4'>
            <Button onClick={() => navigate('/shop/listing')} className='inline-flex will-change-transform items-center gap-2 rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-white/15'>
              Start shopping
              <ArrowRight className='h-4 w-4' />
            </Button>
            <Button onClick={() => navigate('/shop/orders')} className='inline-flex will-change-transform items-center gap-2 rounded-full border border-orange-300/70 bg-orange-500/15 px-6 py-3 text-sm font-semibold text-orange-100 shadow-lg shadow-orange-200/20 transition hover:bg-orange-500/25'>
              View orders
              <ShoppingCart className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <section className='py-2'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col gap-2 mb-6 text-center md:text-left'>
            <span className='text-sm uppercase tracking-[0.15em] text-orange-400'>Featured brands</span>
            <h2 className='text-2xl font-semibold'>Shop products by favorite brands</h2>
            <p className='max-w-3xl text-sm sm:text-base text-slate-600'>Use brand filters to narrow down your search and find the exact vendor collection you want.</p>
          </div>

          <div className='flex gap-4 overflow-x-auto hide-scrollbar pb-3 scroll-smooth snap-x snap-mandatory'>
            {
              BrandWithIcons.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => handleNavigateToCategory(brand, 'Brand')}
                  className='snap-start min-w-[140px] flex-shrink-0 rounded-2xl border border-slate-200 bg-white/90 px-5 py-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-slate-700 mb-4'>
                    <brand.icon className='h-6 w-6' />
                  </div>
                  <h3 className='text-sm font-semibold text-slate-900'>{brand.label}</h3>
                  {/* <p className='mt-1 text-sm text-slate-500'>Top vendor label</p> */}
                </button>
              ))
            }
          </div>
        </div>
      </section>
      <section className=' bg-slate-50 py-2'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col gap-2 mb-6 text-center md:text-left'>
            <span className='text-sm uppercase tracking-[0.1em] text-orange-400'>Shop by department</span>
            <h2 className='text-2xl w-60 sm:w-full mx-auto font-semibold'>Explore vendor categories</h2>
            <p className='max-w-3xl text-sm sm:text-base text-gray-500'>We selected the top categories where vendors are selling the latest deals. Tap any category to shop vendor products filtered just for you.</p>
          </div>

          <div className='flex md:grid-cols-3 justify-start py-2 gap-4 overflow-x-auto hide-scrollbar pb-3 scroll-smooth snap-x snap-mandatory'>
            {
              categoriesWithIcons.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleNavigateToCategory(category, 'Category')}
                  className='snap-start min-w-[140px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white/90 px-5 py-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-gray-700 mb-4'>
                    <category.icon className='h-6 w-6' />
                  </div>
                  <h3 className='text-sm font-semibold text-slate-900'>{category.label}</h3>
                  {/* <p className='mt-1 text-xs text-slate-500'>Popular vendor picks</p> */}
                </button>
              ))
            }
          </div>
        </div>
      </section>



      <section className='bg-white p-1'>
        <div className='container mx-auto px-1'>
          <h2 className='text-2xl font-bold text-center mb-8'>Featured Products</h2>

          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6'>
            {
              isLoading && !productList.length ? (
                <div className='col-span-full'>
                  <LoadingState
                    title='Loading featured products'
                    description='We are preparing the latest picks from our vendors.'
                    className='min-h-[220px]'
                  />
                </div>
              ) : productList && productList.length > 0 ? productList.slice(0, 4).map((product) => (
                <ShoppingProductTile
                  handleAddToCart={handleAddToCart}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  key={product.id}/>
              )) : null
            }
       {productDetails && <ProductDetailsDialog
        productDetails={productDetails}
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
      />}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShoppingHome