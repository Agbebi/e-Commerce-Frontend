import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../../api/axios'
import { toast } from "sonner";


const initialState = {
    approvalUrl : null,
    isLoading : false,
    orderID : null,
    orderList : [],
    orderDetails : null
}


export const createNewOrder = createAsyncThunk('/order/createNewOrder', async (orderData) => {    
    const response = await API.post(`/api/shop/order/create-order`, orderData)

    return response.data
})

export const capturePayment = createAsyncThunk('order/capturePayment', async ({opayReference, cartId}) => {      
    const response = await API.post(`/api/shop/order/capture-order/${opayReference}`, {cartID : cartId})

    return response.data
})


export const queryPaymentStatus = createAsyncThunk('order/queryPaymentStatus', async ({opayReference, cartId, productList}) => { 
    const response = await API.post(`/api/shop/order/payment-status/${opayReference}`, {cartID : cartId, productList})

    return response.data
})


export const getAllOrders = createAsyncThunk('order/getAllOrders', async (payload) => {
    const { userID, filterParams, sortParams } = typeof payload === 'object' && payload !== null
        ? payload
        : { userID: payload }

    const params = {
        ...(filterParams || {})
    }

    if (sortParams) {
        params.sortBy = sortParams
    }

    const queryString = new URLSearchParams(params).toString()
    const response = await API.get(`/api/shop/order/list/${userID}${queryString ? `?${queryString}` : ''}`)

    return response.data
})

export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (id) => {  
    
    const response = await API.get(`/api/shop/order/details/${id}`)

    return response.data
})


const shoppingOrderSlice = createSlice({
    name : 'shoppingOrderSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(createNewOrder.pending, (state) =>{
            state.isLoading = true
        })
        .addCase(createNewOrder.fulfilled, (state, action) =>{
            if (action.payload.data.code === '00000') {
                state.approvalUrl = action.payload.data.data.cashierUrl
                state.orderID = action.payload.data.data.reference
                state.isLoading = false    
                sessionStorage.setItem('orderID', action.payload.data.data.reference)
            }else if(action.payload.data.code === '00001'){
                toast.error(action.payload.data.message || 'There was an error creating the order!')
                console.log('Error creating order:', action.payload);
            }else{
                toast.error('There was an error creating the order!')
                console.log('Error creating order:', action.payload);
            }  
        }).addCase(createNewOrder.rejected, (state) =>{
            state.isLoading = false,
            state.orderID = null,
            state.approvalUrl = null
        }).addCase(capturePayment.pending, (state) =>{
            state.isLoading = false
        }).addCase(capturePayment.fulfilled, (state, action) =>{
            state.isLoading = false
            toast.success(action.payload.message || 'Payment captured successfully!')
        }).addCase(capturePayment.rejected, (state) =>{
            state.isLoading = false,
            state.orderID = null,
            state.approvalUrl = null
        }).addCase(getAllOrders.pending, (state) =>{
            state.isLoading = true
        }).addCase(getAllOrders.fulfilled, (state, action) =>{
            state.isLoading = false
            state.orderList = action.payload?.data || []
        }).addCase(getAllOrders.rejected, (state) =>{
            state.isLoading = false
            state.orderList = []
        }).addCase(getOrderDetails.pending, (state) =>{
            state.isLoading = true
        }).addCase(getOrderDetails.fulfilled, (state, action) =>{
            state.isLoading = false
            state.orderDetails = action.payload?.data || null
        }).addCase(getOrderDetails.rejected, (state) =>{
            state.isLoading = false
            state.orderDetails = null
        }).addCase(queryPaymentStatus.pending, (state) =>{
            state.isLoading = true
        }).addCase(queryPaymentStatus.fulfilled, (state, action) =>{
            state.isLoading = false
            toast.success(action.payload.message || 'Payment captured successfully!')
        }).addCase(queryPaymentStatus.rejected, (state) =>{
            state.isLoading = false
            toast.error('Failed to query payment status!')
        })
    }
})

export default shoppingOrderSlice.reducer;
