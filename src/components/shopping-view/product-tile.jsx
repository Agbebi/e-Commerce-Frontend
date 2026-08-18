import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TbCurrencyNaira } from "react-icons/tb";
import { formatPriceDisplay } from "@/lib/utils";
import { ShoppingCart } from 'lucide-react'

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddToCart,
}) {
    const isOut = product.totalStock === 0;
    const hasDiscount = product.salesPrice > 0 && product.salesPrice < product.price

    return (
        <Card className="group py-0 w-full overflow-hidden border border-slate-200 bg-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300">
            <div className="flex flex-col">
                {/* Image Section */}
                <div 
                    className="relative aspect-[4/3] overflow-hidden bg-slate-50 cursor-pointer"
                    onClick={() => handleGetProductDetails(product._id)}
                >
                    <img 
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {isOut && (
                            <Badge className='text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-white border-0 shadow-sm'>
                                Out of stock
                            </Badge>
                        )}
                        {!isOut && product.totalStock <= 5 && (
                            <Badge className='text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-900 border border-slate-200 shadow-sm'>
                                {product.totalStock} left
                            </Badge>
                        )}
                        {hasDiscount && (
                            <Badge className='text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-900 border border-slate-200 shadow-sm'>
                                {Math.round(((product.price - product.salesPrice) / product.price) * 100)}% off
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 px-3.5 py-3 cursor-pointer" onClick={() => handleGetProductDetails(product._id)}>
                    <div className="space-y-2">
                        <h2 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[2rem]">
                            {product.name}
                        </h2>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider capitalize">
                                {product.subcategory || product.category}
                            </span>
                            {hasDiscount && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    -{Math.round(((product.price - product.salesPrice) / product.price) * 100)}%
                                </span>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                            <span className="text-sm font-bold text-slate-900 flex items-center gap-0.5">
                                <TbCurrencyNaira className="h-3.5 w-3.5" />
                                {formatPriceDisplay(product.salesPrice > 0 ? product.salesPrice : product.price)}
                            </span>
                            {hasDiscount && (
                                <span className="text-[11px] text-slate-400 line-through font-medium">
                                    ₦{formatPriceDisplay(product.price)}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>

                {/* Actions Section */}
                <CardFooter className="px-3.5 pb-3.5 pt-0">
                    <Button
                        onClick={() => {
                            if (!isOut) handleAddToCart(product);
                        }}
                        disabled={isOut}
                        className={`w-full rounded-xl border text-xs font-semibold transition-all duration-200 ${
                            isOut 
                                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:shadow-sm'
                        }`}
                        size="sm"
                    >
                        {isOut ? (
                            'Out of Stock'
                        ) : (
                            <>
                                <ShoppingCart className="mr-1.5 h-3.5 w-3.5 hidden md:block" />
                                Add to Cart
                            </>
                        )}
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
}

export default ShoppingProductTile;
