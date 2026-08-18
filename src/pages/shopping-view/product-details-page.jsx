import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, setProductDetails } from '@/store/shop/product-slice'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarIcon, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react'
import { TbCurrencyNaira } from 'react-icons/tb'
import API from '@/api/axios'
import { formatPriceDisplay } from '@/lib/utils'

function ProductDetailsPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { productDetails, isLoading } = useSelector(state => state.shopProducts)
  const { user } = useSelector(state => state.auth)
  const { items: cartItems = [] } = useSelector(state => state.shopCart ?? {})

  const [tab, setTab] = useState('description')
  const [reviews, setReviews] = useState([])
  const [reviewMessage, setReviewMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const imageCarouselRef = useRef(null)

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId))
    }
    return () => {
      dispatch(setProductDetails())
    }
  }, [dispatch, productId])

  useEffect(() => {
    setActiveImageIndex(0)
    setQuantity(1)
  }, [productDetails?._id])

  useEffect(() => {
    async function fetchReviews() {
      if (!productDetails?._id) {
        setReviews([])
        return
      }
      try {
        const response = await API.get(`/api/shop/reviews/${productDetails._id}`)
        if (response?.data?.success) {
          setReviews(response.data.data || [])
        }
      } catch (error) {
        console.error('Failed to load reviews:', error)
      }
    }
    fetchReviews()
  }, [productDetails?._id])

  const availableStock = productDetails?.totalStock ?? 0
  const currentCartQuantity = cartItems.reduce((sum, item) => {
    return item.productId === productDetails?._id ? sum + item.quantity : sum
  }, 0)

  const handleCarouselScroll = () => {
    const container = imageCarouselRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const children = Array.from(container.children)
    const widths = children.map(child => child.clientWidth)

    let accumulated = 0
    for (let idx = 0; idx < widths.length; idx += 1) {
      accumulated += widths[idx]
      if (scrollLeft + container.clientWidth / 2 < accumulated) {
        setActiveImageIndex(idx)
        break
      }
    }
  }

  const scrollToImage = (index) => {
    const container = imageCarouselRef.current
    if (!container) return
    const target = container.children[index]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  }

  function handleAddToCart() {
    if (availableStock === 0) {
      toast.error('Product is out of stock')
      return
    }
    if (currentCartQuantity + quantity > availableStock) {
      toast.error('Cannot add more than available stock')
      return
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: productDetails._id,
        quantity,
        description: productDetails.description,
        name: productDetails.name,
        imageUrl: productDetails.images?.[0] || productDetails.image,
        price: productDetails.salesPrice > 0 ? productDetails.salesPrice : productDetails.price,
        vendorId: productDetails.vendorId
      }),
    ).then(data => {
      if (data?.payload?.success) {
        toast.success('Product added to cart successfully')
        dispatch(fetchCartItems({ userId: user.id }))
      }
    }).catch(error => {
      toast.error('An error occurred while adding to cart')
      console.error(error)
    })
  }

  async function handleSubmitReview() {
    if (!user?.id) {
      setReviewError('Please log in to submit a review.')
      return
    }
    if (!reviewMessage.trim()) {
      setReviewError('Please add your review text.')
      return
    }

    setIsSubmittingReview(true)
    setReviewError('')

    try {
      const response = await API.post('/api/shop/reviews/add', {
        productId: productDetails._id,
        userId: user.id,
        userName: user.userName,
        rating,
        reviewMessage,
      })

      if (response?.data?.success) {
        setReviews(current => [response.data.data, ...current])
        setReviewMessage('')
        setRating(5)
        toast.success('Review submitted successfully')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to submit review.'
      setReviewError(message)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const normalizedSpecifications = Array.isArray(productDetails?.specifications) && productDetails.specifications.length > 0
    ? productDetails.specifications.filter(specification => specification?.name?.trim() || specification?.value?.trim())
    : Array.isArray(productDetails?.keyFeatures)
      ? productDetails.keyFeatures.map((feature, idx) => ({ name: `Feature ${idx + 1}`, value: feature }))
      : typeof productDetails?.keyFeatures === 'string'
        ? productDetails.keyFeatures.split(/\r?\n/).map(item => item.trim()).filter(Boolean).map((feature, idx) => ({ name: `Feature ${idx + 1}`, value: feature }))
        : []

  const descriptionParagraphs = typeof productDetails?.description === 'string'
    ? productDetails.description.split(/\r?\n/).map(item => item.trim()).filter(Boolean)
    : []

  const isOutOfStock = availableStock === 0
  const isMaxInCart = currentCartQuantity + quantity > availableStock

  if (isLoading || !productDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    )
  }

  const images = productDetails.images?.length > 0 ? productDetails.images : [productDetails.image]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isWishlisted ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied to clipboard')
                }}
                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left - Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-slate-50 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100">
              <img
                src={images[activeImageIndex]}
                alt={productDetails.name}
                className="w-full h-full object-cover"
              />
              {productDetails.salesPrice > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0">
                  Sale
                </Badge>
              )}
              {availableStock === 0 && (
                <Badge className="absolute top-4 left-4 bg-slate-900 text-white border-0">
                  Out of Stock
                </Badge>
              )}
            </div>

            {images.length > 1 && (
              <div className="relative">
                <div
                  ref={imageCarouselRef}
                  onScroll={handleCarouselScroll}
                  className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2"
                >
                  {images.slice(0, 5).map((image, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-slate-900 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="flex flex-col">
            {/* Category & Brand */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
              {productDetails.category && <span className="capitalize">{productDetails.category}</span>}
              {productDetails.subcategory && <span>• {productDetails.subcategory}</span>}
              {productDetails.brand && <span>• {productDetails.brand}</span>}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {productDetails.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {productDetails.salesPrice > 0 ? (
                <>
                  <span className="text-3xl font-bold text-slate-900 flex items-center">
                    <TbCurrencyNaira size={24} />
                    {formatPriceDisplay(productDetails.salesPrice)}
                  </span>
                  <span className="text-lg text-slate-400 line-through flex items-center">
                    <TbCurrencyNaira size={18} />
                    {formatPriceDisplay(productDetails.price)}
                  </span>
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    Save {Math.round(((productDetails.price - productDetails.salesPrice) / productDetails.price) * 100)}%
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-slate-900 flex items-center">
                  <TbCurrencyNaira size={24} />
                  {formatPriceDisplay(productDetails.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${availableStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-sm text-slate-600">
                {availableStock > 0 ? (
                  <>
                    In Stock ({availableStock} available)
                    {currentCartQuantity > 0 && (
                      <span className="text-slate-400"> • {currentCartQuantity} in cart</span>
                    )}
                  </>
                ) : (
                  'Out of Stock'
                )}
              </span>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-slate-700">Quantity</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-slate-900 border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock - currentCartQuantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isMaxInCart}
                className={`flex-1 h-12 rounded-xl font-semibold text-sm ${
                  isOutOfStock || isMaxInCart
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <ShoppingCart size={18} className="mr-2" />
                {isOutOfStock ? 'Out of Stock' : isMaxInCart ? 'Max Quantity Reached' : 'Add to Cart'}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Truck className="text-slate-600" size={20} />
                <span className="text-xs text-slate-600 text-center">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Shield className="text-slate-600" size={20} />
                <span className="text-xs text-slate-600 text-center">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <RefreshCw className="text-slate-600" size={20} />
                <span className="text-xs text-slate-600 text-center">Easy Returns</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex gap-1 mb-6 bg-slate-50 p-1 rounded-xl">
                {['description', 'reviews', 'How to Use'].map(tabItem => (
                  <button
                    key={tabItem}
                    onClick={() => setTab(tabItem)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      tab === tabItem
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tabItem === 'How to Use' ? 'How to Use' : tabItem.charAt(0).toUpperCase() + tabItem.slice(1)}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {tab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {descriptionParagraphs.length > 0 ? (
                      descriptionParagraphs.map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-slate-600 leading-7">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600">No description available.</p>
                    )}

                    {normalizedSpecifications.length > 0 && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Specifications</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {normalizedSpecifications.map((specification, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                              <span className="block text-xs font-semibold text-slate-900 mb-1">
                                {specification.name || `Specification ${idx + 1}`}
                              </span>
                              <p className="text-sm text-slate-600">{specification.value || '—'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Write Review */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Write a review</p>
                          <p className="text-xs text-slate-500">Share your experience with this product.</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`rounded-full p-1 transition-colors ${
                                star <= rating ? 'bg-slate-900 text-white' : 'bg-white text-slate-300 hover:text-slate-400'
                              }`}
                            >
                              <StarIcon className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewMessage}
                        onChange={e => setReviewMessage(e.target.value)}
                        placeholder="Write what you liked or what we can improve..."
                        rows={4}
                        disabled={!user?.id}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500 resize-none"
                      />
                      {reviewError && <p className="mt-2 text-xs text-red-600">{reviewError}</p>}
                      {!user?.id && (
                        <p className="mt-2 text-xs text-slate-500">Login to submit a review.</p>
                      )}
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview || !user?.id}
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-6 text-sm"
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map(review => (
                          <div key={review._id} className="rounded-2xl border border-slate-200 bg-white p-6">
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{review.userName || 'Anonymous'}</p>
                                <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-0.5 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <StarIcon key={idx} className={`${idx < review.rating ? 'fill-current' : 'text-slate-200'} h-4 w-4`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm leading-6 text-slate-700">{review.reviewMessage}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                        <p className="text-sm text-slate-500">No reviews yet. Be the first to review this product.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === 'How to Use' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                      <RefreshCw className="text-slate-400" size={24} />
                    </div>
                    <p className="text-sm text-slate-600">We are still working on this section... Coming soon</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
