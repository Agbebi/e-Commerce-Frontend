import React from 'react'
import { Link } from 'react-router-dom'
import { CiUser } from 'react-icons/ci'
import { BsShopWindow } from 'react-icons/bs'
import { GiDutchBike } from 'react-icons/gi'
import { ArrowRight, Sparkles } from 'lucide-react'

function FirstPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://picsum.photos/1920/1080?random=1')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-orange-300" />
            Premium Shopping Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Tim Marketplace</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your one-stop shop for all your needs. Explore our wide range of products and enjoy a seamless shopping experience.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <Link 
            to="/auth/login" 
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 hover:border-white/40 hover:shadow-2xl hover:shadow-orange-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                <CiUser className="w-8 h-8 text-white group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Customer</h3>
              <p className="text-slate-300 text-sm mb-6">Shop from thousands of products</p>
              <div className="inline-flex items-center gap-2 text-orange-300 text-sm font-medium group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Vendor Card */}
          <Link 
            to="/auth/login-vendor" 
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 hover:border-white/40 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                <BsShopWindow className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Vendor</h3>
              <p className="text-slate-300 text-sm mb-6">Sell your products to millions</p>
              <div className="inline-flex items-center gap-2 text-blue-300 text-sm font-medium group-hover:gap-3 transition-all">
                Start Selling <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Dispatcher Card */}
          <Link 
            to="/auth/login-dispatch" 
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 hover:border-white/40 hover:shadow-2xl hover:shadow-green-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                <GiDutchBike className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dispatcher</h3>
              <p className="text-slate-300 text-sm mb-6">Deliver packages efficiently</p>
              <div className="inline-flex items-center gap-2 text-green-300 text-sm font-medium group-hover:gap-3 transition-all">
                Start Delivering <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm">
            By continuing, you agree to our{' '}
            <Link to="#" className="text-orange-300 hover:text-orange-200 underline underline-offset-4">Terms of Service</Link>
            {' '}and{' '}
            <Link to="#" className="text-orange-300 hover:text-orange-200 underline underline-offset-4">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FirstPage
