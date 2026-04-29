import ProductDetailsDialog from "@/components/product-details";
import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
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
  const [filters, setFilters] = useState(null);
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const categorySearchParams = searchParams.get('category')

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
        // Dynamically set the section as a key in the filters object and assign the current option as its value in an array
        [getSectionId]: [getCurrentOptions],
      };
    } else {
      // If the section already exists in the filters object, check if the current option is already present in the section's array of options.
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOptions);
      // If the current option is not present in the section's array of options, add it to the array. Otherwise, remove it from the array.
      if (indexOfCurrentOption === -1) {
        cpyFilters = {
          ...cpyFilters,
          [getSectionId]: [...cpyFilters[getSectionId], getCurrentOptions],
        };
      } else {
        cpyFilters = {
          ...cpyFilters,
          [getSectionId]: cpyFilters[getSectionId].filter(
            (option) => option !== getCurrentOptions,
          ),
        };
      }
    }

    setFilters(cpyFilters);

    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [keys, values] of Object.entries(filterParams)) {
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

  function handleAddToCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if(data?.payload?.success){
        // show success toast
         toast.success("Product added to cart successfully")
         dispatch(fetchCartItems({userId : user.id}))
      }
    }).catch((error) => {
      toast.error("An error occurred while adding to cart");
      console.error(error);
    });
  }

  useEffect(() => {
    setSort("price:Low-To-High");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || null);
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(queryString).toString());
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
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 md:p-6 p-4">
      <ProductFilter filters={filters} handleFilters={handleFilters} />
      <div className="w-full rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold hidden sm:block">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {productList.length} products
            </span>
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
                className="w-[200px] bg-white rounded-md shadow-lg p-1 border-gray-200"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {productList ? (
            productList.map((product) => (
              <ShoppingProductTile
                handleAddToCart={handleAddToCart}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products found
            </p>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        productDetails={productDetails}
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
      />
    </div>
  );
}
export default ShoppingListing;
