import API from '../../../api/axios'

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"


const initialState = {
    cartItems : [],
    isLoading : false
}

export const addToCart = createAsyncThunk('cart/addToCart',  async ({userId, productId, quantity}) => {
    

    const response = await API.post(`/api/shop/cart/add/`, {
        userId, productId, quantity
    })

    return response.data
} 

)

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems',  async ({ userId }) => {

    const response = await API.get(`/api/shop/cart/get/${userId}`)

    return response.data
})

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem',  async ({userId, productId}) => {
    

    const response = await API.delete(`/api/shop/cart/delete-cart/${userId}/${productId}`)

    return response.data
})


export const updateCartItems = createAsyncThunk('cart/updateCartItems',  async ({userId, productId, quantity}) => {
    

    const response = await API.put(`/api/shop/cart/update-cart`, {
        userId, productId, quantity
    })

    return response.data
} 

)

const shoppingCartSlice = createSlice({
    name : 'shoppingCart',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true
        }).addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false,
            state.cartItems = action.payload.data
        }).addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false,
            state.cartItems = []
        })

         builder.addCase(fetchCartItems.pending, (state) => {
            state.isLoading = true
        }).addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false,
            state.cartItems = action.payload.data
        }).addCase(fetchCartItems.rejected, (state, action) => {
            state.isLoading = false,
            state.cartItems = []
        })

         builder.addCase(updateCartItems.pending, (state) => {
            state.isLoading = true
        }).addCase(updateCartItems.fulfilled, (state, action) => {
            state.isLoading = false,
            state.cartItems = action.payload.data
        }).addCase(updateCartItems.rejected, (state, action) => {
            state.isLoading = false,
            state.cartItems = []
        })

         builder.addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true
        }).addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false,
            state.cartItems = action.payload.data
        }).addCase(deleteCartItem.rejected, (state, action) => {
            state.isLoading = false,
            state.cartItems = []
        })
    }
})


export default shoppingCartSlice.reducer
