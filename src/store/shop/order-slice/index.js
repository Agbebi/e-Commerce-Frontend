import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../api/axios'


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

export const capturePayment = createAsyncThunk('order/capturePayment', async ({orderID, userId}) => {  

    const response = await API.post(`/api/shop/order/capture-order/${orderID}`, {userID : userId})

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
            const result = action.payload.result;           

            state.isLoading = false
            state.approvalUrl = result.links[1]
            state.orderID = result.id
            sessionStorage.setItem('orderID', result.id)
        }).addCase(createNewOrder.rejected, (state) =>{
            state.isLoading = false,
            state.orderID = null,
            state.approvalUrl = null
        }).addCase(capturePayment.pending, (state) =>{
            state.isLoading = false
        }).addCase(capturePayment.fulfilled, (state, action) =>{
            state.isLoading = false  
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
