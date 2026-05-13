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

export const getAllOrders = createAsyncThunk('order/getAllOrders', async (userID) => {  
    const response = await API.get(`/api/shop/order/list/${userID}`)

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
            state.isLoading = false,
            state.orderList = action.payload.data
        }).addCase(getAllOrders.rejected, (state) =>{
            state.isLoading = false,
            state.orderList = []
        }).addCase(getOrderDetails.pending, (state) =>{
            state.isLoading = true
        }).addCase(getOrderDetails.fulfilled, (state, action) =>{
            state.isLoading = false,
            state.orderDetails = action.payload.data
        }).addCase(getOrderDetails.rejected, (state) =>{
            state.isLoading = false,
            state.orderDetails = null
        })
    }
})

export default shoppingOrderSlice.reducer;
