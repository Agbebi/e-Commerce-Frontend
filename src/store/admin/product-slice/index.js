import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


 const initialState = {
        isLoading : false,
        productList : [],
        error : null
    }



export const addNewProduct = createAsyncThunk(
    '/products/addNewProduct',
   async (formData) => {
        const result = await axios.post('/api/admin/products/add', formData, {
            headers : {
                "Content-Type" : 'application/json'
            }
        })

        return result.data;
    }
)

export const fetchAllProducts = createAsyncThunk(
    '/products/fetchAllProducts',
   async () => {    
        const result = await axios.get('/api/admin/products/get', {
            headers : {
                "Content-Type" : 'application/json'
            }
        })

        return result.data;
    }
)

export const editProduct = createAsyncThunk(
    '/products/editProduct',
   async ({id, formData}) => {
        const result = await axios.put(`/api/admin/products/edit/${id}`, formData, {
            headers : {
                "Content-Type" : 'application/json'
            }
        })

        return result.data;
    }
)

export const deleteProduct = createAsyncThunk(
    '/products/deleteProduct',
   async (id) => {
        const result = await axios.delete(`/api/admin/products/delete/${id}`)

        return result.data;
    }
)


const AdminProductSlice = createSlice({
    name : 'adminProducts',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {            
            state.isLoading = false;            
            state.productList = action.payload.data;            
        })
        builder.addCase(fetchAllProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
   
})

export default AdminProductSlice.reducer;