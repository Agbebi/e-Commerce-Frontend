// import ShoppingProductTile from '@/components/shopping-view/product-tile'
// import SearchBar from '@/components/common/search-bar'
// import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
// import { fetchSearchResults, resetSearchResults } from '@/store/shop/search-slice'
// import { fetchProductDetails } from '@/store/shop/product-slice'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Sparkles, Search, TrendingUp, ShoppingBag } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { toast } from 'sonner'

// function SearchPage() {

//     const [keyword, setKeyword] = useState('')
//     const [searchParams] = useSearchParams()
//     const navigate = useNavigate()

//     const dispatch = useDispatch()
//     let { searchResults, isLoading } = useSelector((state) => state.shopSearch)
//     const { user } = useSelector((state) => state.auth)

//     useEffect(() => {
//         const urlKeyword = searchParams.get('keyword')
//         if (urlKeyword) {
//             setKeyword(urlKeyword)
//             dispatch(fetchSearchResults(urlKeyword))
//         }
//     }, [searchParams, dispatch])

//     useEffect(() => {
//         if (keyword && keyword.trim() !== '') {
//             const timeoutId = setTimeout(() => {
//                 dispatch(fetchSearchResults(keyword))
//             }, 300)
//             return () => clearTimeout(timeoutId)
//         } else {
//             dispatch(resetSearchResults())
//         }
//     }, [keyword, dispatch])

//     function handleGetProductDetails(getCurrentProductId) {
//         navigate(`/shop/product/${getCurrentProductId}`)
//         dispatch(fetchProductDetails(getCurrentProductId))
//     }

//     function handleAddToCart(getCurrentProduct) {
//         dispatch(
//             addToCart({
//                 userId: user.id,
//                 productId: getCurrentProduct._id,
//                 quantity: 1,
//                 description: getCurrentProduct.description,
//                 name: getCurrentProduct.name,
//                 imageUrl: getCurrentProduct.images?.[0] || getCurrentProduct.image,
//                 price: getCurrentProduct.salesPrice > 0 ? getCurrentProduct.salesPrice : getCurrentProduct.price,
//                 vendorId: getCurrentProduct.vendorId
//             }),
//         ).then((data) => {
//             if (data?.payload?.success) {
//                 toast.success("Product added to cart successfully")
//                 dispatch(fetchCartItems({ userId: user.id }))
//             }
//         }).catch((error) => {
//             toast.error("An error occurred while adding to cart")
//             console.error(error)
//         })
//     }

import ShoppingProductTile from '@/components/shopping-view/product-tile'
import SearchBar from '@/components/common/search-bar'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { fetchSearchResults, resetSearchResults } from '@/store/shop/search-slice'
import { fetchProductDetails } from '@/store/shop/product-slice'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Search, TrendingUp, ShoppingBag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

function SearchPage() {

    const [keyword, setKeyword] = useState('')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const dispatch = useDispatch()
    let { searchResults, isLoading } = useSelector((state) => state.shopSearch)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        const urlKeyword = searchParams.get('keyword')
        if (urlKeyword) {
            setKeyword(urlKeyword)
            dispatch(fetchSearchResults(urlKeyword))
        }
    }, [searchParams, dispatch])

    useEffect(() => {
        if (keyword && keyword.trim() !== '') {
            const timeoutId = setTimeout(() => {
                dispatch(fetchSearchResults(keyword))
            }, 300)
            return () => clearTimeout(timeoutId)
        } else {
            dispatch(resetSearchResults())
        }
    }, [keyword, dispatch])

    function handleGetProductDetails(getCurrentProductId) {
        navigate(`/shop/product/${getCurrentProductId}`)
        dispatch(fetchProductDetails(getCurrentProductId))
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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="/search-bg.jpg"
                        alt="Search background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/90 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                            <span className="font-medium">Find What You Love</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                            Search Products
                        </h1>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                            Discover amazing deals from our trusted vendors. Type a keyword and explore thousands of products.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <SearchBar
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search for products..."
                                fullWidth
                                expandable={false}
                            />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <div className="flex items-center gap-2 text-white/80">
                                <TrendingUp className="w-4 h-4 text-orange-300" />
                                <span className="text-sm">Trending searches</span>
                            </div>
                            <div className="w-px h-4 bg-white/20"></div>
                            <div className="flex items-center gap-2 text-white/80">
                                <ShoppingBag className="w-4 h-4 text-blue-300" />
                                <span className="text-sm">10K+ Products</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-12 h-12 mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-slate-900 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Searching products...</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{searchResults.length}</span> result{searchResults.length !== 1 ? 's' : ''} for "<span className="font-medium text-slate-900">{keyword}</span>"
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.map((product) => (
                                <ShoppingProductTile
                                    key={product._id}
                                    product={product}
                                    handleGetProductDetails={handleGetProductDetails}
                                    handleAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    </div>
                ) : keyword.trim().length > 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No results found</h3>
                        <p className="text-slate-500 max-w-md">
                            We couldn't find anything matching "<span className="font-medium text-slate-700">{keyword}</span>". Try adjusting your search or browse our categories.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Start searching</h3>
                        <p className="text-slate-500 max-w-md">
                            Type a product name or keyword to see results here.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default SearchPage
