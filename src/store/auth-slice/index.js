import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import API from '../../api/axios'




const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
};

//Register user, vendor or dispatch agent based on the role provided in formData

export const registerUser = createAsyncThunk('/auth/register',

    async (formData) => {
        const response = await API.post("/api/auth/register", formData, {
            withCredentials: true
        })
    
        return response.data
    }
    
)

export const registerVendor = createAsyncThunk('/auth/vendor/register',

    async (formData) => {
        const response = await API.post("/api/auth/vendor/register", formData, {
            withCredentials: true
        })
    
        return response.data
    }
    
)

export const registerDispatchAgent = createAsyncThunk('/auth/dispatch/register',

    async (formData) => {
        const response = await API.post("/api/auth/dispatch/register", formData, {
            withCredentials: true
        })
    
        return response.data
    }
    
)


//Login user, vendor or dispatch agent based on the role provided in formData

export const loginUser = createAsyncThunk('/auth/login',

    async (formData) => {
        const response = await API.post("/api/auth/login", formData, {
            withCredentials: true
        })            
        return response.data    
    }
)

export const loginVendor = createAsyncThunk('/auth/vendor/login',

    async (formData) => {
        const response = await API.post("/api/auth/vendor/login", formData, {
            withCredentials: true
        })            
        return response.data    
    }
)

export const loginDispatchAgent = createAsyncThunk('/auth/dispatch/login',

    async (formData) => {
        const response = await API.post("/api/auth/dispatch/login", formData, {
            withCredentials: true
        })            
        return response.data    
    }
)

//Logout user, vendor or dispatch agent based on the role provided in formData

export const logoutUser = createAsyncThunk('/auth/logout',

    async () => {
        const response = await API.post("/api/auth/logout", {}, {
            withCredentials: true
        })            
        return response.data   
    }
)

export const logoutVendor = createAsyncThunk('/auth/vendor/logout',

    async () => {
        const response = await API.post("/api/auth/vendor/logout", {}, {
            withCredentials: true
        })            
        return response.data   
    }
)

export const logoutDispatchAgent = createAsyncThunk('/auth/dispatch/logout',

    async () => {
        const response = await API.post("/api/auth/dispatch/logout", {}, {
            withCredentials: true
        })            
        return response.data   
    }
)

//Check if user, vendor or dispatch agent is authenticated based on the role provided in formData

export const checkAuth = createAsyncThunk('/auth/check-auth',

    async () => {     
        const response = await API.get("/api/auth/check-auth", {
            withCredentials: true,
            headers : {
                'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate',
            }            
        })             
        
        return response.data

    }
)

export const checkVendorAuth = createAsyncThunk('/auth/vendor/check-auth',

    async () => {     
        const response = await API.get("/api/auth/vendor/check-auth", {
            withCredentials: true,
            headers : {
                'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate',
            }            
        })             
        
        return response.data

    }
)

export const checkDispatchAgentAuth = createAsyncThunk('/auth/dispatch/check-auth',

    async () => {     
        const response = await API.get("/api/auth/dispatch/check-auth", {
            withCredentials: true,
            headers : {
                'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate',
            }            
        })             
        
        return response.data

    }
)



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
        }},
    extraReducers : (builder)=>{
        builder.addCase(registerUser.pending, (state)=>{
            state.isLoading = true
        }).addCase(registerUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = false
        }).addCase(registerUser.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(loginUser.pending, (state)=>{
            state.isLoading = true
        }).addCase(loginUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.success
        }).addCase(loginUser.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(checkAuth.pending, (state)=>{
            state.isLoading = true
        }).addCase(checkAuth.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.success
        }).addCase(checkAuth.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(logoutUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(loginDispatchAgent.pending, (state)=>{
            state.isLoading = true
        }).addCase(loginDispatchAgent.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.success
        }).addCase(loginDispatchAgent.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(checkDispatchAgentAuth.pending, (state)=>{
            state.isLoading = true
        }).addCase(checkDispatchAgentAuth.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.success
        }).addCase(checkDispatchAgentAuth.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(logoutDispatchAgent.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(loginVendor.pending, (state)=>{
            state.isLoading = true
        }).addCase(loginVendor.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.success
        }).addCase(loginVendor.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(checkVendorAuth.pending, (state)=>{
            state.isLoading = true
        }).addCase(checkVendorAuth.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.success
        }).addCase(checkVendorAuth.rejected, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false
        }).addCase(logoutVendor.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })}
})


export const { setUser } = authSlice.actions
export default authSlice.reducer
