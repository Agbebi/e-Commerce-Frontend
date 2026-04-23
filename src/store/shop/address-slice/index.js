import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const initialState = {
    isLoading: false,
    addressList: [],
}

export const addNewAddress = createAsyncThunk('/adresses/addNewAddress', async (formData) => {
    const response = await axios.post(`/api/shop/address/add`, formData)

    return response.data
})

export const fetchAllAddresses = createAsyncThunk('/adresses/fetchAllAddresses', async (userId) => {
    const response = await axios.get(`/api/shop/address/get/${userId}`)

    return response.data
})

export const editAddress = createAsyncThunk('/adresses/editAddress', async ({ userId, addressId, formData }) => {
    const response = await axios.put(`/api/shop/address/update/${userId}/${addressId}`, formData)

    return response.data
})

export const deleteAddress = createAsyncThunk('/adresses/deleteAddress', async ({ userId, addressId }) => {
    const response = await axios.delete(`/api/shop/address/delete/${userId}/${addressId}`)

    return response.data
})

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addNewAddress.pending, (state) => {
            state.isLoading = true
        }).addCase(addNewAddress.fulfilled, (state, action) => {
            state.isLoading = false
            state.addressList = action.payload.data
        }).addCase(addNewAddress.rejected, (state) => {
            state.isLoading = false
            state.addressList = []
        }).addCase(fetchAllAddresses.pending, (state) => {
            state.isLoading = true
        }).addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.isLoading = false
            state.addressList = action.payload.data
        }).addCase(fetchAllAddresses.rejected, (state) => {
            state.isLoading = false
            state.addressList = []
        })
    }
})

export default addressSlice.reducer