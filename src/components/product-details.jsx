import React from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { StarIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'sonner'
import { setProductDetails } from '@/store/shop/product-slice'

function ProductDetailsDialog({ productDetails, open, setOpen }) {

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

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

function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
}

    if (productDetails == null) {
        productDetails = {}
    }


    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white border-gray-200'>
                <div className='relative overflow-hidden rounded-lg'>
                    <img src={productDetails.image} alt={productDetails.name} className='aspect-square w-full object-cover' width={600} height={600} />
                </div>
                <div className=''>
                    <div>
                        <h1 className='text-3xl font-extrabold'>{productDetails.name}</h1>
                        <p className='text-gray-600 mb-5 mt-4 text-2xl'>{productDetails.description}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className={`${productDetails.salesPrice > 0 ? 'line-through font-bold text-gray-400' : 'font-bold'} text-2xl`}>${productDetails.price}</span>
                        <span className={`${productDetails.salesPrice > 0 ? 'text-2xl font-bold' : 'hidden'}`}>${productDetails.salesPrice}</span>
                    </div>
                    <div className='flex items-center gap-2 mt-2'>
                        <div className='flex items-center gap-0.5'>
                            <StarIcon className='w-5 h-5  fill-gray-800' />
                            <StarIcon className='w-5 h-5 fill-gray-800' />
                            <StarIcon className='w-5 h-5 fill-gray-800' />
                            <StarIcon className='w-5 h-5 fill-gray-800' />
                            <StarIcon className='w-5 h-5 fill-gray-800' />
                        </div>
                        <span className='text-gray-500'>(4.5)</span>
                    </div>
                    <div className='mt-5'>
                        <Button onClick={() => handleAddToCart(productDetails._id)} className='bg-black text-white w-full '>Add to Cart</Button>
                    </div>
                    <Separator className='bg-gray-200 mt-4 mb-4 shadow' />

                    <div className='max-h-[300px] overflow-auto'>
                        <h2 className=' text-2xl font-bold mb-4'>Reviews</h2>
                        <div className='grid gap-6'>
                            <div className='flex gap-4'>
                                <Avatar className='w-10 h-10 border border-gray-200'>
                                    <AvatarFallback>AT</AvatarFallback>
                                </Avatar>

                                <div className='grid gap-1'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-bold'>Agbebi Timothy</h3>
                                    </div>
                                    <div className='flex items-center gap-0.5'>
                                        <StarIcon className='w-5 h-5 fill-gray-800' />
                                        <StarIcon className='w-5 h-5 fill-gray-800' />
                                        <StarIcon className='w-5 h-5 fill-gray-800' />
                                        <StarIcon className='w-5 h-5 fill-gray-800' />
                                        <StarIcon className='w-5 h-5 fill-gray-800' />
                                    </div>
                                    <p className='text-gray-500'>This is an awesome product</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog