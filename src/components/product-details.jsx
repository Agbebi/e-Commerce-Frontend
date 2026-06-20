import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
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

function ProductDetailsDialog({ productDetails, open, setOpen }) {

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { items: cartItems = [] } = useSelector((state) => state.shopCart ?? {});
    const [tab, setTab] = useState('description')

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

    if (productDetails == null) {
        productDetails = {}
    }

    const isOutOfStock = availableStock === 0;
    const isMaxInCart = currentCartQuantity >= availableStock;


    return (
        <Dialog open={open} onOpenChange={handleDialogClose} className='p-0'>
            <DialogContent className='overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 p-0 sm:p-4 max-w-[90vw] max-h-[80vh] sm:max-w-[80vw] lg:max-w-[70vw] bg-white border-gray-200'>
                <div className='relative overflow-hidden rounded-lg rounded-b-none sm:rounded-b-lg'>
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
                                        className='min-w-full max-h-[300px] sm:max-h-[400px] object-cover snap-center'
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
                <div className='p-4 sm:py-0'>
                    <div className=' mb-4' >
                        <span className='text-gray-600 text-md'>{productDetails.category.charAt(0).toUpperCase() + productDetails.category.slice(1)}</span>
                        <h1 className='text-3xl font-extrabold'>{productDetails.name}</h1>
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <span className={`${productDetails.salesPrice > 0 ? 'line-through font-bold text-gray-400' : 'font-bold'} flex items-center text-2xl`}><TbCurrencyNaira />{productDetails.price}</span>
                        <span className={`${productDetails.salesPrice > 0 ? 'text-2xl font-bold' : 'hidden'} flex items-center`}><TbCurrencyNaira />{productDetails.salesPrice}</span>
                    </div>
                    <div className='flex justify-around px-4 mt-8 sm:gap-2'>
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
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#333',
                                        }
                                    } : {}}

                                />
                            )

                        }
                    </div>

                    <div className='flex my-2 w-full h-[150px] overflow-y-auto max-h[400px]'>
                        {tab === 'description' && <div className='min-h-20 p-2 w-full flex items-start text-left'> <p className='text-gray-600 text-sm w-full'>{productDetails.description}</p></div>}
                        {tab === 'reviews' && <div className='min-h-20 p-2 w-full  flex items-center justify-center text-center'> <p className='text-gray-600 text-sm w-full'>No Reviews yet.</p></div>}
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
