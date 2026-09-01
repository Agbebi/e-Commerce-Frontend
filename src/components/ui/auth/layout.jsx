import React from "react";
import { Outlet } from "react-router-dom";
import { Sparkles, Shield, Truck, HeadphonesIcon, Star } from "lucide-react";

function AuthLayout() {
  const features = [
    { icon: Shield, text: "Secure & Trusted" },
    { icon: Truck, text: "Fast Delivery" },
    { icon: HeadphonesIcon, text: "24/7 Support" },
    { icon: Star, text: "Top Rated" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-blue-600/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMnYyaDJ2MmgtMnYyaC0ydi0yaC0ydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

        {/* Decorative orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 px-12 py-16 max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Tim Marketplace
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Your Gateway to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Premium Commerce
            </span>
          </h1>
          <p className="text-slate-300 text-lg mb-12 leading-relaxed">
            Join thousands of vendors and dispatchers building the future of
            marketplace commerce.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-sm text-slate-300 font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 py-8 lg:py-0 relative">
        {/* Mobile Background Decoration */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Tim Marketplace
            </span>
          </div>

          <div className="lg:hidden mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Premium Shopping Experience
            </h2>
            <p className="text-sm text-slate-500">Secure • Fast • Reliable</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
