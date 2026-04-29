import API from '../../../api/axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}


export const fetchAllFilteredProducts = createAsyncThunk(
    '/products/fetchAllProducts',
    async ({ filterParams, sortParams }) => {

        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams
        });


        const result = await API.get(`/api/shop/products/get?${query}`, {
            headers: {
                "Content-Type": 'application/json'
            }
        })

        return result.data;
    }
)


export const fetchProductDetails = createAsyncThunk(
    '/products/fetchProductDetails',
    async (id) => {

        const result = await API.get(`/api/shop/products/get/${id}`, {
            headers: {
                "Content-Type": 'application/json'
            }
        })

        return result.data;
    }
)


const shopProductsSlice = createSlice({
    name: 'shopProducts',
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {

            state.isLoading = false;
            state.productList = action.payload.data;
        })
        builder.addCase(fetchAllFilteredProducts.rejected, (state) => {
            state.isLoading = false;
            state.productList = [];
        }).addCase(fetchProductDetails.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productDetails = action.payload.data;
        }).addCase(fetchProductDetails.rejected, (state) => {
            state.isLoading = false;
            state.productDetails = null;
        })

    }
})
     
export const { setProductDetails } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;
