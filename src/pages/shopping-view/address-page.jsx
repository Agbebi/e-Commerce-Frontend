import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IoLocation } from "react-icons/io5";
import Address from "@/components/shopping-view/address";

function ShoppingAddressPage() {
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-[0.03]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <IoLocation className="text-slate-700" size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Manage Addresses
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Add and manage your delivery addresses for faster checkout.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Address Content */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
        >
          <Address
            currentSelectedAddress={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default ShoppingAddressPage;
