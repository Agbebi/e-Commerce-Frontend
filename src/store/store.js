import { configureStore } from "@reduxjs/toolkit"
import authReducer from './auth-slice'
import AdminProductSlice from './admin/product-slice'
import adminOrderSlice from './admin/order-slice'
import shopProductsSlice from './shop/product-slice'
import shoppingCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import shopSearchSlice from './shop/search-slice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        
        AdminProducts : AdminProductSlice,
        adminOrders : adminOrderSlice,

        shopProducts : shopProductsSlice,
        shopCart : shoppingCartSlice,
        shopAddress : shopAddressSlice,
        shopOrder : shopOrderSlice,
        shopSearch : shopSearchSlice
    }
})

export default store;