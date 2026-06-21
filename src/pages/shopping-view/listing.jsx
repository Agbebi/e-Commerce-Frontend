import ProductDetailsDialog from "@/components/product-details";
import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";




function ShoppingListing() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('price:low-to-high');
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const categorySearchParams = searchParams.get('category');

  function handleSort(value) {
    setSort(value);
  }

  function handleFilters(getSectionId, getCurrentOptions) {
    let cpyFilters = filters ? { ...filters } : {};

    // Check if the section already exists in the filters object.
    //  indexOf will return -1 if the section does not exist in the filters object
    // or it will return the index of the section if it exists in the filters object
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

  //fetch products from backend and display here. Implement filters and sorting as well

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }),
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 bg-gray-50 md:grid-cols-[300px_1fr] gap-6 md:p-6 p-4">
      <div className="flex flex-col gap-4 md:sticky md:top-6">
        <ProductFilter filters={filters} handleFilters={handleFilters} clearFilters={handleClearFilters} />
      </div>
      <div className="w-full rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">All Products</h2>
              <p className="text-sm text-gray-500">
                Browse products and refine your list using the filter panel.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-500">{productList.length} products</span>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                  <span className="md:inline text-gray-600 capitalize">
                    {sort ? sort : "Sort by"}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-[200px] bg-white rounded-md shadow-lg p-1 border-gray-100"
              >
                <DropdownMenuRadioGroup sort={sort} onValueChange={handleSort}>
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      value={option.id}
                      className="font-normal"
                      key={option.id}
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {productList && productList.length > 0 ? (
            productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                handleAddToCart={handleAddToCart}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-gray-300 bg-slate-50 p-12 text-center">
              <p className="text-lg font-semibold text-slate-700">No products found</p>
              <p className="mt-2 text-sm text-gray-500">Try clearing filters or selecting a different category.</p>
            </div>
          )}
        </div>
      </div>
      {productDetails && (
        <ProductDetailsDialog
          productDetails={productDetails}
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
        />
      )}
    </div>
  );
}
export default ShoppingListing;
