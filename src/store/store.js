import { configureStore } from "@reduxjs/toolkit"
import authReducer from './auth-slice'
import VendorProductSlice from './vendor/product-slice'
import VendorOrderSlice from './vendor/order-slice'
import dispatchOrderSlice from './dispatch/order-slice'
import shopProductsSlice from './shop/product-slice'
import shoppingCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import shopSearchSlice from './shop/search-slice'
import notificationReducer from './notification-slice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        vendorProducts: VendorProductSlice,
        vendorOrders: VendorOrderSlice,
        
        dispatchOrders: dispatchOrderSlice,
        
        shopProducts: shopProductsSlice,
        shopCart: shoppingCartSlice,
        shopAddress : shopAddressSlice,
        shopOrder : shopOrderSlice,
        shopSearch : shopSearchSlice,
        notifications: notificationReducer
    }
})

export default store;