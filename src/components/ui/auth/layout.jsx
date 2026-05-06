import React from "react";
import { Outlet } from "react-router-dom";
import img from '../../../assets/authImg.jpg'

function AuthLayout() {    
    return (
        <div className={`flex bg-gray-500 min-h-screen max-h-screen w-full`}>
            <div className="hidden  lg:flex items-center py-4 justify-center w-1/2">


                <div className={`max-w-md relative bg-gray-800 text-white justify-center p-4 shadow flex items-center space-y-6 text-center w-full h-full rounded-2xl`} >
                    <h1 className="text-4xl tracking-tight text-center">
                        Welcome to our <br /> e-Marketplace</h1>
                </div>
            </div>

            <div className="flex flex-1 w-1/2 max-h-screen items-center justify-center bg-background py-4 px-4 lg:px-4">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout;