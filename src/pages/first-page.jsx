import React from 'react'
import { BsShopWindow } from 'react-icons/bs'
import { CiAirportSign1, CiUser } from 'react-icons/ci'
import { FaShop } from 'react-icons/fa6'
import { GiDutchBike } from 'react-icons/gi'

function FirstPage() {
    return (
        <div className='flex items-center justify-center h-screen w-full p-4 bg-gray-100'  style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),  url('https://picsum.photos/1920/1080?random=1')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className='text-center w-[90%] flex flex-col md:w-[80%] lg:w-[60%] bg-white p-8 rounded-lg shadow-md'>
                {/* <FaShop className='mx-auto mb-4 text-gray-500' size={50} /> */}
                <h1 className='text-2xl font-semibold text-gray-800 py-8'>Welcome to Tim Marketplace</h1>
                <p className='text-gray-600 text-sm pb-4 text-center'>Your one-stop shop for all your needs. Explore our wide range of products and enjoy seamless shopping experience.</p>
                <p className='py-4'> Select user type</p>
                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                    <a href='/auth/login' className='px-6 py-3 flex items-center gap-3 sm:flex-col justify-center bg-white border border-gray-300 shadow-sm text-gray-800 rounded-md hover:shadow-md transition'>
                        <CiUser size={20} />
                    <span className='text-gray-600'>Customer</span>
                    </a>
                    <a href='/auth/login-vendor' className='px-6 py-3 flex items-center gap-3 sm:flex-col justify-center bg-white border border-gray-300 shadow-sm text-gray-800 rounded-md hover:shadow-md transition'>
                        <BsShopWindow size={20} />
                        <span className='text-gray-600'>Vendor</span>
                    </a>
                    <a href='/auth/login-dispatch' className='px-6 py-3 flex items-center gap-3 sm:flex-col justify-center bg-white border border-gray-300 shadow-sm text-gray-800 rounded-md hover:shadow-md transition'>
                        <GiDutchBike size={20} />
                        <span className='text-gray-600'>Dispatcher</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default FirstPage