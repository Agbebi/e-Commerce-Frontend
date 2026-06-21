import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { StarIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { setProductDetails } from '@/store/shop/product-slice'
import Chip from '@mui/material/Chip'
import { TbCurrencyNaira } from 'react-icons/tb'
import { MdErrorOutline } from 'react-icons/md'
import API from '@/api/axios'

function ProductDetailsDialog({ productDetails, open, setOpen }) {

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { items: cartItems = [] } = useSelector((state) => state.shopCart ?? {});
    const [tab, setTab] = useState('description')
    const [reviews, setReviews] = useState([])
    const [reviewMessage, setReviewMessage] = useState('')
    const [rating, setRating] = useState(5)
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [reviewError, setReviewError] = useState('')

    const availableStock = productDetails?.totalStock ?? 0;
    const currentCartQuantity = cartItems.reduce((sum, item) => {
        return item.productId === productDetails?._id ? sum + item.quantity : sum;
    }, 0);

    const tabs = ['description', 'reviews', 'How to Use']
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const imageCarouselRef = useRef(null)

    function handleAddToCart(getCurrentProductId) {
        if (currentCartQuantity + 1 > availableStock) {
            toast.error("Cannot add more than available stock");
            return;
        }

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

    useEffect(() => {
        setActiveImageIndex(0)
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

    const handleCarouselScroll = () => {
        const container = imageCarouselRef.current
        if (!container) return

        const scrollLeft = container.scrollLeft
        const children = Array.from(container.children)
        const widths = children.map((child) => child.clientWidth)

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

    function handleDialogClose() {
        dispatch(setProductDetails());
        setOpen(false);
    }

    const canSubmitReview = Boolean(user?.id);

    async function handleSubmitReview() {
        if (!canSubmitReview) {
            setReviewError('Please log in to submit a review.');
            return;
        }

        if (!reviewMessage.trim()) {
            setReviewError('Please add your review text.');
            return;
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
                setReviews((current) => [response.data.data, ...current])
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

    if (productDetails == null) {
        productDetails = {}
    }

    const isOutOfStock = availableStock === 0;
    const isMaxInCart = currentCartQuantity >= availableStock;

    const normalizedKeyFeatures = Array.isArray(productDetails.keyFeatures)
        ? productDetails.keyFeatures
        : typeof productDetails.keyFeatures === 'string'
            ? productDetails.keyFeatures.split(/\r?\n/).map(item => item.trim()).filter(Boolean)
            : []

    const descriptionParagraphs = typeof productDetails.description === 'string'
        ? productDetails.description.split(/\r?\n/).map(item => item.trim()).filter(Boolean)
        : []

    return (
        <Dialog open={open} onOpenChange={handleDialogClose} className='p-0'>
            <DialogContent className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 p-0 sm:p-4 max-w-[90vw] max-h-[85vh] sm:max-w-[80vw] lg:max-w-[70vw] bg-white border-gray-200'>
                <div className='relative overflow-hidden rounded-lg rounded-b-none sm:rounded-b-lg h-full'>
                    {Array.isArray(productDetails.images) && productDetails.images.length > 0 ? (
                        <div className='relative w-full overflow-hidden'>
                            <div
                                ref={imageCarouselRef}
                                onScroll={handleCarouselScroll}
                                className='flex snap-x snap-mandatory overflow-x-auto hide-scrollbar'
                            >
                                {productDetails.images.slice(0, 5).map((image, idx) => (
                                    <img
                                        key={`${image}-${idx}`}
                                        src={image}
                                        alt={`${productDetails.name} image ${idx + 1}`}
                                        className='min-w-full max-h-[200px] sm:max-h-[400px] object-cover snap-center'
                                    />
                                ))}
                            </div>
                            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                                {productDetails.images.slice(0, 5).map((_, idx) => (
                                    <button
                                        key={idx}
                                        type='button'
                                        aria-label={`Show image ${idx + 1}`}
                                        onClick={() => scrollToImage(idx)}
                                        className={`h-2 w-2 rounded-full border border-white/80 shadow-sm transition-colors ${activeImageIndex === idx ? 'bg-white/90' : 'bg-white/40 hover:bg-white/70'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <img src={productDetails.image} alt={productDetails.name} className='w-full max-h-[300px] sm:max-h-[400px] object-cover' />
                    )}
                </div>
                <div className='flex flex-col p-4 sm:py-0 h-full'>
                    <div className=''>
                        <div className='flex flex-wrap items-center gap-2 text-xs text-gray-500'>
                            {productDetails.category ? <span className='capitalize'>{productDetails.category}</span> : null}
                            {productDetails.subcategory ? <span className='capitalize'>• {productDetails.subcategory}</span> : null}
                            {productDetails.brand ? <span className='capitalize'>• {productDetails.brand}</span> : null}
                        </div>
                        <h1 className='text-3xl font-extrabold'>{productDetails.name}</h1>
                    </div>
                    <div className='flex items-center justify-between my-2'>
                        <span className={`${productDetails.salesPrice > 0 ? 'line-through font-bold text-gray-400' : 'font-bold'} flex items-center text-2xl`}><TbCurrencyNaira />{productDetails.price}</span>
                        <span className={`${productDetails.salesPrice > 0 ? 'text-2xl font-bold' : 'hidden'} flex items-center`}><TbCurrencyNaira />{productDetails.salesPrice}</span>
                    </div>
                    <div className='flex justify-around px-4 mt-2 sm:gap-2'>
                        {
                            tabs.map(tabItem =>
                                <Chip
                                    key={tabItem}
                                    label={tabItem.charAt(0).toUpperCase() + tabItem.slice(1)}
                                    clickable
                                    variant={tabItem === tab ? 'filled' : 'outlined'}
                                    component='a'
                                    onClick={() => setTab(tabItem)}
                                    sx={tabItem === tab ? {
                                        backgroundColor: '#000',
                                        // margin: '2px',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#333',
                                        }
                                    } : {}}

                                />
                            )

                        }
                    </div>

                    <div className='flex my-2 w-full flex-1 h-[260px] sm:max-h-37 max-h-[200px] overflow-hidden'>
                        {tab === 'description' && (
                            <div className='min-h-20 p-4 w-full space-y-6 text-left overflow-y-auto pr-2'>
                                <div className='space-y-4'>
                                    {descriptionParagraphs.length > 0 ? descriptionParagraphs.map((paragraph, idx) => (
                                        <p key={idx} className='text-gray-600 text-sm leading-7 first-letter:text-3xl first-letter:font-semibold first-letter:text-slate-900 first-letter:mr-2 first-letter:float-left'>
                                            {paragraph}
                                        </p>
                                    )) : (
                                        <p className='text-gray-600 text-sm leading-7'>No description available.</p>
                                    )}
                                </div>

                                {normalizedKeyFeatures.length > 0 ? (
                                    <div className='rounded-lg border border-gray-200 bg-slate-50 p-4'>
                                        <h2 className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700'>What makes it special</h2>
                                        <div className='grid gap-3 sm:grid-cols-2'>
                                            {normalizedKeyFeatures.map((feature, idx) => (
                                                <div key={idx} className='rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-sm'>
                                                    <span className='block font-semibold text-slate-900 mb-1'>Feature {idx + 1}</span>
                                                    <p className='leading-6'>{feature}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        {tab === 'reviews' && (
                            <div className='min-h-20 p-4 w-full overflow-y-auto space-y-4'>
                                <div className='rounded-xl border border-gray-200 bg-slate-50 p-4'>
                                    <div className='flex items-center justify-between gap-3'>
                                        <div>
                                            <p className='text-sm font-semibold text-slate-900'>Write a review</p>
                                            <p className='text-xs text-gray-500'>Share your experience with this product.</p>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type='button'
                                                    onClick={() => setRating(star)}
                                                    className={`rounded-full p-1 ${star <= rating ? 'bg-black text-white' : 'bg-white text-gray-400'}`}
                                                >
                                                    <StarIcon className='h-4 w-4' />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={reviewMessage}
                                        onChange={(event) => setReviewMessage(event.target.value)}
                                        placeholder='Write what you liked or what we can improve...'
                                        rows={4}
                                        disabled={!canSubmitReview}
                                        className='mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-black focus:outline-none disabled:bg-gray-100 disabled:text-gray-500'
                                    />
                                    {reviewError ? <p className='mt-2 text-xs text-red-600'>{reviewError}</p> : null}
                                    {!canSubmitReview ? (
                                        <p className='mt-2 text-xs text-gray-500'>Login to submit a review.</p>
                                    ) : null}
                                    <div className='mt-3 flex justify-end'>
                                        <Button
                                            onClick={handleSubmitReview}
                                            disabled={isSubmittingReview || !canSubmitReview}
                                            className='bg-black text-white'
                                        >
                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                        </Button>
                                    </div>
                                </div>

                                {reviews.length > 0 ? (
                                    <div className='space-y-3'>
                                        {reviews.map((review) => (
                                            <div key={review._id} className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                                                <div className='flex items-center justify-between gap-2'>
                                                    <div>
                                                        <p className='font-semibold text-slate-900'>{review.userName || 'Anonymous'}</p>
                                                        <p className='text-xs text-gray-500'>{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className='flex items-center gap-1 text-yellow-500'>
                                                        {Array.from({ length: 5 }).map((_, idx) => (
                                                            <StarIcon key={idx} className={`${idx < review.rating ? 'fill-current' : 'text-gray-300'} h-4 w-4`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className='mt-3 text-sm leading-6 text-gray-700'>{review.reviewMessage}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='rounded-xl border border-dashed border-gray-300 bg-white/80 p-6 text-center text-sm text-gray-500'>No reviews yet. Be the first to review this product.</div>
                                )}
                            </div>
                        )}
                        {tab === 'How to Use' && <div className='min-h-20 p-8 w-full flex flex-col items-center justify-center text-center'><MdErrorOutline /> <p className='text-gray-800 text-sm w-full'>We are still working on this section... Coming soon</p></div>}
                    </div>

                    <div className='mt-5'>
                        <Button
                            onClick={() => handleAddToCart(productDetails._id)}
                            disabled={isOutOfStock || isMaxInCart}
                            className={`w-full ${(isOutOfStock || isMaxInCart) ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-black text-white'}`}
                        >
                            {isOutOfStock ? 'Out of Stock' : isMaxInCart ? 'Max Quantity Reached' : 'Add to Cart'}
                        </Button>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog