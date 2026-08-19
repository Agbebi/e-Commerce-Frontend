import React, { useEffect, useState } from 'react'
import { ArrowRight, Activity, Baby, Cpu, Gift, Home, ShoppingCart, Smartphone, Sparkles, Star, Shield, Truck, HeadphonesIcon, HelpCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { GrHp } from 'react-icons/gr'
import { SiAdidas, SiLenovo, SiNike } from 'react-icons/si'
import { PiHandbagLight, PiLampPendantLight } from 'react-icons/pi'
import { GiBlackBook, GiMicrochip } from 'react-icons/gi'
import LoadingState from '@/components/ui/loading-state'
import { motion, AnimatePresence } from 'framer-motion'
import LogoLoop from '@/components/ui/logo-loop'

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
  const [openFaq, setOpenFaq] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { user } = useSelector((state) => state.auth)
  const { productList, isLoading } = useSelector(state => state.shopProducts)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'Simply browse our categories, add items to your cart, and proceed to checkout. You can pay securely using Opay or other available payment methods.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept Opay, bank transfers, and other secure payment options. All transactions are encrypted and protected.'
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 1-3 business days depending on your location. You can track your order in real-time through the orders page.'
    },
    {
      id: 4,
      question: 'Can I return or exchange products?',
      answer: 'Yes, we offer a 7-day return policy for most items. Products must be in their original condition. Contact our support team to initiate a return.'
    },
    {
      id: 5,
      question: 'How do I become a vendor?',
      answer: 'Click on "Vendor Login" and select "Sign up" to create a vendor account. Fill in your store details and start listing products immediately.'
    },
    {
      id: 6,
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal data and payment information.'
    }
  ]

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
        toast.success("Product added to cart successfully")
        dispatch(fetchCartItems({ userId: user.id }))
      }
    }).catch((error) => {
      toast.error("An error occurred while adding to cart")
      console.error(error)
    })
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`)
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price:low-to-high' }))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] md:h-[90vh] md:min-h-[600px] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-bg.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-float animation-delay-300"></div>
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float animation-delay-600"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-8 sm:px-8 lg:px-8 h-full flex items-center py-8 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8 md:space-y-8">
              {/* Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm text-white/90">
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span className="font-medium">Premium Shopping Experience</span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up animation-delay-100 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Discover the
                <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                  Best Products
                </span>
              </h1>

              {/* Subtitle */}
              <p className="animate-fade-in-up animation-delay-200 text-sm md:text-base text-slate-300 max-w-lg leading-relaxed">
                Browse fresh arrivals, shop top brands, and enjoy easy checkout with fast delivery and friendly support.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up animation-delay-300 flex flex-wrap gap-6 md:gap-4">
                <Button
                  onClick={() => navigate('/shop/listing')}
                  className="h-10 md:h-12 px-5 md:px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium text-xs md:text-sm shadow-lg shadow-black/10 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  Start shopping
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/shop/orders')}
                   className="h-10 md:h-12 px-5 md:px-6 border-white/30 text-white hover:bg-white/10 rounded-full font-semibold text-xs md:text-sm backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  View orders
                </Button>
              </div>

              {/* Stats Row */}
              <div className="animate-fade-in-up animation-delay-400 flex items-center gap-10 md:gap-8 pt-6 md:pt-4">
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">10K+</p>
                  <p className="text-xs md:text-sm text-slate-400">Products</p>
                </div>
                <div className="w-px h-8 md:h-10 bg-white/20"></div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">4.8</p>
                  <p className="text-xs md:text-sm text-slate-400">Rating</p>
                </div>
                <div className="w-px h-8 md:h-10 bg-white/20"></div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">24/7</p>
                  <p className="text-xs md:text-sm text-slate-400">Support</p>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative animate-float">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
                      <ShoppingCart className="w-8 h-8 text-orange-300 mb-3" />
                      <p className="text-white font-semibold">10K+ Products</p>
                      <p className="text-white/60 text-sm">Curated selection</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
                      <Star className="w-8 h-8 text-yellow-300 mb-3" />
                      <p className="text-white font-semibold">4.8 Rating</p>
                      <p className="text-white/60 text-sm">Customer reviews</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
                      <Truck className="w-8 h-8 text-green-300 mb-3" />
                      <p className="text-white font-semibold">Fast Delivery</p>
                      <p className="text-white/60 text-sm">Same day shipping</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
                      <HeadphonesIcon className="w-8 h-8 text-blue-300 mb-3" />
                      <p className="text-white font-semibold">24/7 Support</p>
                      <p className="text-white/60 text-sm">Always here for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-600">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="relative max-w-7xl mx-auto py-6 sm:py-8">
          <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-900">Free Shipping</p>
                <p className="text-[10px] sm:text-xs text-slate-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-900">Secure Payment</p>
                <p className="text-[10px] sm:text-xs text-slate-500">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <HeadphonesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-900">24/7 Support</p>
                <p className="text-[10px] sm:text-xs text-slate-500">Dedicated support</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Star className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-900">Trusted Vendors</p>
                <p className="text-[10px] sm:text-xs text-slate-500">Verified sellers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-0 sm:px-8 lg:px-8">
           <div className="text-center mb-12 md:mb-18 px-4 sm:px-6 lg:px-0">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 text-xs font-medium mb-3">
              Shop by Department
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Explore Categories
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              Browse through our curated collection and find exactly what you need.
            </p>
          </div>
          <div className="relative px-6 sm:px-6 lg:px-0">
            <LogoLoop
              logos={categoriesWithIcons.slice(0, isMobile ? 6 : 10).map((category) => ({
                node: (
                    <button
                      onClick={() => handleNavigateToCategory(category, 'Category')}
                      className="group flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 md:p-6 text-center transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/10"
                    >
                      <div className="relative mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-white shadow-lg shadow-black/10">
                          <category.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="text-xs md:text-sm font-semibold text-white/90 whitespace-nowrap">
                        {category.label}
                      </h3>
                    </button>
                ),
                ariaLabel: category.label,
              }))}
              speed={60}
              direction="left"
              width="100%"
              logoHeight={120}
              gap={24}
              pauseOnHover
            />
          </div>
         </div>
      </section>

      {/* Brands Section */}
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/3 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium mb-3">
              Trusted Partners
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Featured Brands
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Shop from your favorite brands and discover premium quality products.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
            {BrandWithIcons.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleNavigateToCategory(brand, 'Brand')}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-200 hover:border-orange-200"
              >
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 mb-3 md:mb-4 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300">
                  <brand.icon className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-slate-900">{brand.label}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-50/40 to-slate-50/40 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium mb-3">
                Handpicked for You
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Featured Products
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/shop/listing')}
              className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {isLoading && !productList.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-[350px] animate-pulse"></div>
              ))}
            </div>
          ) : productList && productList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 lg:gap-6">
              {productList.slice(0, 5).map((product) => (
                <ShoppingProductTile
                  handleAddToCart={handleAddToCart}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  key={product.id}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium mb-3">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about shopping with us. Can't find the answer? Contact our support team.
            </p>
          </div>

          <div className="space-y-2 md:space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 text-left"
                  >
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center"
                    >
                      <ChevronDown size={16} className="text-slate-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-0 md:px-6 md:pb-5">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to start shopping?
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and discover the best products from trusted vendors.
          </p>
          <Button
            onClick={() => navigate('/shop/listing')}
            className="h-10 md:h-12 px-6 md:px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium text-sm hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            Browse all products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ShoppingHome
