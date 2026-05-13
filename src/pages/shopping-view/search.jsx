import ProductDetailsDialog from '@/components/product-details'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Input } from '@/components/ui/input'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { fetchProductDetails } from '@/store/shop/product-slice'
import { fetchSearchResults, resetSearchResults } from '@/store/shop/search-slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

function SearchPage() {

    const [keyword, setKeyword] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const dispatch = useDispatch()
    let { searchResults } = useSelector((state) => state.shopSearch)
    const { productDetails } = useSelector((state) => state.shopProducts);
    const { user } = useSelector((state) => state.auth)


    useEffect(() => {
        if (keyword && keyword.trim() !== '' && keyword.length > 2) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`keyword=${keyword}`))
                dispatch(fetchSearchResults(keyword))
            }, 1000)
        } else {
            setSearchParams(new URLSearchParams(``))
            dispatch(resetSearchResults())
        }
    }, [keyword, dispatch, setSearchParams])

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddToCart(getCurrentProduct) {
        dispatch(
            addToCart({
                userId: user.id,
                productId: getCurrentProduct._id,
                quantity: 1,
                description: getCurrentProduct.description,
                name: getCurrentProduct.name,
                imageUrl: getCurrentProduct.image,
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


    useEffect(() => {
        if (productDetails !== null) {
            setOpenDetailsDialog(true);
        }
    }, [productDetails]);

    return (
        <div className='mx-auto md:px-6 px-4 py-8'>
            <div className='flex justify-center mb-8'>
                <div className='flex items-center w-full'>
                    <Input
                        placeholder='Search for products...'
                        className='rounded-full text-xs border-gray-300 focus:ring-gray-400 focus:border-transparent focus:outline-none w-full'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        name={keyword}
                    />
                </div>
            </div>

            {
                searchResults.length > 0 ? (
                    <div className='grid grid-cols-1 border border-gray-200 p-2 shadow-sm bg-white rounded-2xl sm:grid-cols-2 md:grid-cols-3 gap-6'>
                        {searchResults.map((product) => (
                            <ShoppingProductTile key={product._id} product={product} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart} />
                        ))}
                    </div>


                ) : (
                    <div className='flex flex-col items-center justify-center mt-20'>
                        <h2 className='text-2xl font-semibold text-gray-600'>No products found</h2>
                        <p className='text-gray-500 mt-2'>Try searching with a different keyword.</p>
                    </div>)
            }


            <ProductDetailsDialog
                productDetails={productDetails}
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
            />

        </div>
    )
}

export default SearchPage