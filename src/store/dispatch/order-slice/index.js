import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../../api/axios'
import { toast } from "sonner";


const initialState = {
    isLoading : false,
    orderID : null,
    orderList : [],
    orderDetails : null
}

export const getAllOrders = createAsyncThunk('order/getAllOrders', async (payload) => {  
    const { userId, filterParams, sortParams } = typeof payload === 'object' && payload !== null
        ? payload
        : { userId: payload }

    const params = {
        ...(filterParams || {})
    }

    if (sortParams) {
        params.sortBy = sortParams
    }

    const queryString = new URLSearchParams(params).toString()
    const response = await API.get(`/api/dispatch/orders/${userId}/all${queryString ? `?${queryString}` : ''}`, {
        headers: {
            "Content-Type": "application/json"
        }
    })

    return response.data
})

export const getOrderDetails = createAsyncThunk('orders/getOrderDetails', async ({ id, childOrders }) => {

    const response = await API.post(`/api/dispatch/orders/details/${id}`, { childOrders })

    return response.data
})

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ orderId, updatedStatus }) => {
    const response = await API.put(`/api/dispatch/orders/update-status/${orderId}`, { updatedStatus })

    return response.data
})

export const deliverOrder = createAsyncThunk('orders/deliverOrder', async (orderId) => {
    const response = await API.put(`/api/dispatch/orders/deliver/${orderId}`)
    return response.data
})

export const deliverOrderConfirmed = createAsyncThunk('orders/deliverOrder', async (orderId) => {
    const response = await API.put(`/api/dispatch/orders/deliver/${orderId}/confirmed`)
    return response.data
})


const dispatchOrderSlice = createSlice({
    name : 'dispatchOrderSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(getAllOrders.pending, (state) =>{
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
        }).addCase(updateOrderStatus.fulfilled, (state, action) =>{
            state.isLoading = false,
            state.orderDetails = action.payload.data
        }).addCase(updateOrderStatus.rejected, (state) =>{
            state.isLoading = false,
            toast.error('Failed to update order status')
        }).addCase(updateOrderStatus.pending, (state) =>{
            state.isLoading = true
        }).addCase(deliverOrder.pending, (state) =>{
            state.isLoading = true
        }).addCase(deliverOrder.fulfilled, (state, action) =>{
            state.isLoading = false,
            state.orderDetails = action.payload.data
        }).addCase(deliverOrder.rejected, (state) =>{
            state.isLoading = false,
            toast.error('Failed to mark order as delivered')
        })
        // .addCase(deliverOrderConfirmed.pending, (state) =>{
        //     state.isLoading = true
        // // })
        // .addCase(deliverOrderConfirmed.fulfilled, (state, action) =>{
        //     state.isLoading = false,
        //     state.orderDetails = action.payload.data
        // }).addCase(deliverOrderConfirmed.rejected, (state) =>{
        //     state.isLoading = false,
        //     toast.error('Failed to mark order as delivered')
        // })
    }
})

export default dispatchOrderSlice.reducer;
