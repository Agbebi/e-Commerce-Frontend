import API from '../../../api/axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    isLoading: false,
    searchResults: []
}

export const fetchSearchResults = createAsyncThunk(
    '/search/fetchResults',
    async (keyword) => {
        const result = await API.get(`/api/shop/search/${keyword}`);
        return result.data;
    }
);


const searchSlice = createSlice({
    name: 'search',
    initialState, 
    reducers: {resetSearchResults: (state) => {
        state.searchResults = [];
    }},
    extraReducers: (builder) => {
        builder.addCase(fetchSearchResults.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchSearchResults.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchResults = action.payload.data;
        }).addCase(fetchSearchResults.rejected, (state) => {
            state.isLoading = false;
            state.searchResults = [];
        });
    }
})

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;