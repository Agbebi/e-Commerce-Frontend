import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import { ArrowUpDown, SlidersHorizontal, X, ChevronDown, Sparkles, TrendingUp, Shield, Truck, Check } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "@/api/axios";
import LoadingState from "@/components/ui/loading-state";
import { motion, AnimatePresence } from "framer-motion";

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { productList, isLoading } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('price:low-to-high');
  const [searchParams, setSearchParams] = useSearchParams();
  const [availableBrands, setAvailableBrands] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const categorySearchParams = searchParams.get('category');
  const hasActiveFilters = filters && Object.keys(filters).length > 0;

  function handleSort(value) {
    setSort(value);
  }

  function handleFilters(getSectionId, getCurrentOptions) {
    let cpyFilters = filters ? { ...filters } : {};

    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOptions],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions);
      if (indexOfCurrentOption === -1) {
        cpyFilters = {
          ...cpyFilters,
          [getSectionId]: [...cpyFilters[getSectionId], getCurrentOptions],
        };
      } else {
        const updatedSectionOptions = cpyFilters[getSectionId].filter(
          (option) => option !== getCurrentOptions,
        );

        if (updatedSectionOptions.length > 0) {
          cpyFilters = {
            ...cpyFilters,
            [getSectionId]: updatedSectionOptions,
          };
        } else {
          const { [getSectionId]: removed, ...rest } = cpyFilters;
          cpyFilters = rest;
        }
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [keys, values] of Object.entries(filterParams || {})) {
      if (Array.isArray(values) && values.length > 0) {
        const paramValue = values.join(",");
        queryParams.push(`${keys}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  }

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
        vendorId: getCurrentProduct.vendorId,
      }),
    )
      .then((data) => {
        if (data?.payload?.success) {
          toast.success("Product added to cart successfully");
          dispatch(fetchCartItems({ userId: user.id }));
        }
      })
      .catch((error) => {
        toast.error("An error occurred while adding to cart");
        console.error(error);
      });
  }

  function handleClearFilters() {
    setFilters({});
    setSearchParams("");
    sessionStorage.removeItem("filters");
  }

  useEffect(() => {
    const currentFilters = JSON.parse(sessionStorage.getItem("filters"));

    if (currentFilters && Object.keys(currentFilters).length > 0) {
      setFilters(currentFilters);
    } else if (categorySearchParams) {
      setFilters({ Category: [categorySearchParams] });
      sessionStorage.setItem("filters", JSON.stringify({ Category: [categorySearchParams] }));
    } else {
      setFilters({});
    }
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(queryString).toString());
    } else {
      setSearchParams('');
      sessionStorage.removeItem('filters');
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }),
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const response = await API.get('/api/shop/products/brands')
        if (response?.data?.success) {
          setAvailableBrands(response.data.data || [])
        }
      } catch (error) {
        console.error('Failed to load brands:', error)
      }
    }

    loadBrands()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt="Shopping background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-slate-900/60"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 text-xs text-slate-900 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-semibold">Premium Shopping</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg tracking-tight">
                Discover the Best Products
              </h1>
              <p className="text-sm text-white/90 drop-shadow-md max-w-xl">
                Browse fresh arrivals, shop top brands, and enjoy easy checkout with fast delivery and friendly support.
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <p className="text-lg font-bold text-white drop-shadow">{productList.length}+</p>
                  <p className="text-xs text-white/80 drop-shadow-sm">Products</p>
                </div>
                <div className="w-px h-8 bg-white/30"></div>
                <div>
                  <p className="text-lg font-bold text-white drop-shadow">4.8</p>
                  <p className="text-xs text-white/80 drop-shadow-sm">Rating</p>
                </div>
                <div className="w-px h-8 bg-white/30"></div>
                <div>
                  <p className="text-lg font-bold text-white drop-shadow">24/7</p>
                  <p className="text-xs text-white/80 drop-shadow-sm">Support</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden border-white/30 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    {Object.values(filters).flat().length}
                  </span>
                )}
              </Button>
              <div className="relative" ref={sortDropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline capitalize">
                    {sort ? sort.replace(':', ' • ') : "Sort by"}
                  </span>
                  <span className="sm:hidden capitalize">
                    {sort ? sort.split(':')[0] : "Sort"}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {sortDropdownOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSortDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden hidden lg:block"
                      >
                        <div className="p-2">
                          {sortOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                handleSort(option.id);
                                setSortDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                sort === option.id
                                  ? 'bg-slate-900 text-white'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{option.label}</span>
                              {sort === option.id && <Check className="h-4 w-4" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                      {/* Mobile sort dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="fixed left-4 right-4 top-[100px] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 lg:hidden overflow-hidden"
                      >
                        <div className="p-2">
                          {sortOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                handleSort(option.id);
                                setSortDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${
                                sort === option.id
                                  ? 'bg-slate-900 text-white'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{option.label}</span>
                              {sort === option.id && <Check className="h-4 w-4" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex flex-wrap items-center gap-2"
              >
                <span className="text-xs font-medium text-white/90 drop-shadow-sm">Active filters:</span>
                {Object.entries(filters).flatMap(([section, values]) =>
                  values.map((value) => (
                    <Badge
                      key={`${section}-${value}`}
                      variant="outline"
                      className="capitalize border-white/30 bg-white/90 text-slate-700 hover:bg-white backdrop-blur-sm"
                    >
                      {value}
                      <button
                        onClick={() => handleFilters(section, value)}
                        className="ml-1.5 rounded-full hover:bg-slate-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-medium text-orange-300 hover:text-orange-200 ml-2 drop-shadow-sm"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ProductFilter
                filters={filters}
                handleFilters={handleFilters}
                clearFilters={handleClearFilters}
                brandOptions={availableBrands}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="fixed left-4 right-4 top-[100px] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 lg:hidden max-h-[70vh] overflow-y-auto"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
                    <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
                    >
                      <X className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <ProductFilter
                      filters={filters}
                      handleFilters={handleFilters}
                      clearFilters={handleClearFilters}
                      brandOptions={availableBrands}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div>
            {isLoading && !productList.length ? (
              <div className="min-h-[400px]">
                <LoadingState
                  title="Loading products"
                  description="We are gathering the latest items for your selection."
                  className="min-h-[400px]"
                />
              </div>
            ) : productList && productList.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {productList.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                  >
                    <ShoppingProductTile
                      handleAddToCart={handleAddToCart}
                      product={product}
                      handleGetProductDetails={handleGetProductDetails}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 max-w-md mb-6">
                  We couldn't find any products matching your filters. Try adjusting your search or browse our categories.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-6 text-sm"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
