import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'

function SearchResultCard({ product, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{product.name}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-0.5">
          <TbCurrencyNaira style={{ fontSize: '0.65rem' }} />
          {formatPriceDisplay(product.salesPrice > 0 ? product.salesPrice : product.price)}
        </p>
      </div>
    </motion.div>
  )
}

function SearchResultsDropdown({ results, searchQuery, onResultClick, onClose }) {
  const navigate = useNavigate()

  if (!results || results.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-3 z-50"
    >
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-1.5 max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.15) transparent' }}>
        <AnimatePresence mode="popLayout">
          {results.map((product, index) => (
            <SearchResultCard
              key={product._id}
              product={product}
              index={index}
              onClick={() => onResultClick(product)}
            />
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          onClose()
          navigate(`/shop/search?keyword=${encodeURIComponent(searchQuery)}`)
        }}
        className="w-full mt-2.5 py-2 text-xs font-semibold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-colors"
      >
        View all results
      </button>
    </motion.div>
  )
}

export default SearchResultsDropdown
