import React, { useEffect, useState } from 'react'
import { Book, ChevronLeftCircleIcon, ChevronRightCircleIcon, LampFloor, Microchip } from 'lucide-react'
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
import { FaShoppingBag } from 'react-icons/fa'

const categoriesWithIcons = [
  { id: 'electronics', value: 'electronics', label: 'Electronics', icon: Microchip },
  { id: 'fashion', value: 'fashion', label: 'Fashion', icon: FaShoppingBag },
  { id: 'home-appliances', value: 'home-appliances', label: 'Home Appliances', icon: LampFloor },
  { id: 'books', value: 'books', label: 'Books', icon: Book },

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
  const { productList, productDetails } = useSelector(state => state.shopProducts)
  
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

  function handleAddToCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
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
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[600px] overflow-hidden'>
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

        <Button onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))} variant='' size='icon' className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/70'>
          <ChevronLeftCircleIcon className='w-4 h-4' />
        </Button>

        <Button onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))} variant='' size='icon' className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/70'>
          <ChevronRightCircleIcon size={20} className='w-4 h-4' />
        </Button>
      </div>

      <section className='py-2 bg-gray-50'>
        <div className='container mx-auto px-4 py-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>Browse by Category</h2>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {
              categoriesWithIcons.map(category => (<Card onClick={() => handleNavigateToCategory(category, 'Category')} className='cursor-pointer border-gray-200 hover:shadow-lg transition-shadow' key={category.id} icon={category.icon}>
                <CardContent className='flex items-center justify-center p-6 flex-col'>
                  <category.icon className='w-12 h-12 mb-4 text-gray-600' />
                  <span className='text-md text-center font-medium text-gray-800'>{category.label}</span>
                </CardContent>
              </Card>))
            }
          </div>
        </div>
      </section>

      <section className='py-2 bg-gray-50'>
        <div className='container mx-auto px-4 py-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>Browse by Brands</h2>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {
              BrandWithIcons.map(brand => (<Card onClick={() => handleNavigateToCategory(brand, 'Brand')} className='cursor-pointer border-gray-200 hover:shadow-lg transition-shadow' key={brand.id} icon={brand.icon}>
                <CardContent className='flex items-center justify-center p-6 flex-col'>
                  <brand.icon className='w-12 h-12 mb-4 text-gray-600' />
                  <span className='text-md text-center font-medium text-gray-800'>{brand.label}</span>
                </CardContent>
              </Card>))
            }
          </div>
        </div>
      </section>


      <section className='py-12 '>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>Featured Products</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {
              productList && productList.length > 0 ? productList.map((product) => (
                <ShoppingProductTile
                  handleAddToCart={handleAddToCart}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  key={product.id}/>
              )) : null
            }
       <ProductDetailsDialog
        productDetails={productDetails}
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
      />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShoppingHome