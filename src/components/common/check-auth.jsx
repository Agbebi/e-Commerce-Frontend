import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function CheckAuth( {isAuthenticated, user, children} ) {

    const location = useLocation()

    if (
        !isAuthenticated && 
        !(location.pathname.includes('login') || location.pathname.includes('register') || location.pathname.includes('forgot-password') || location.pathname.includes('reset-password')))
    {
        return(
            <Navigate to='/' />
        )
    }

    else if(isAuthenticated && ((location.pathname.includes('login')) || (location.pathname.includes('register')))){
        if (user?.role === 'vendor') {
            return <Navigate to='/vendor/dashboard' />
        }

        else if (user?.role === 'dispatch') {
            return <Navigate to='/dispatch/dashboard' />
        }
        else {
            return <Navigate to='/shop/home' />
        }
    }

    if (isAuthenticated && user?.role !== 'vendor' && (location.pathname.includes('vendor'))){
        return <Navigate to='/unauth-page'/>          
    } else if (isAuthenticated && user?.role !== 'dispatch' && (location.pathname.includes('dispatch'))){
        return <Navigate to='/unauth-page'/>          
    }

    if (isAuthenticated && (user?.role === 'vendor') && (location.pathname.includes('shop'))){
        return <Navigate to='/vendor/dashboard'/>
    };

    return <>{children}</>;
}

export default CheckAuth