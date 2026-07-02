import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TbCurrencyNaira } from "react-icons/tb";
import { formatPriceDisplay } from "@/lib/utils";
import { CiBellOn } from "react-icons/ci";

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddToCart,
}) {
    const isOut = product.totalStock === 0;
    return (
        <Card className="w-full h-fit bg-white max-w-sm mx-auto gap-4 py-0 rounded-lg shadow-sm border-gray-200">
            <div
                onClick={() => handleGetProductDetails(product._id)}
                className="cursor-pointer"
            >
                <div className="relative">
                    <img
                        src={product.images?.[0] || product.image}
                        alt={product.title}
                        className="w-full h-[150px] md:h-[200px] object-cover rounded-t-lg"
                    />
                    {product.salesPrice > 0 || product.totalStock <= 5 ? (
                        <Badge className={`absolute top-2 left-2 flex justify-between items-center bg-amber-400  hover:bg-amber-600`}>
                            {product.totalStock === 0 ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <CiBellOn className="" />
                                    <span>
                                        {product.totalStock <= 5 ? ` ${product.totalStock} items left ` : 'Sale'}
                                    </span>
                                </>
                            )}
                        </Badge>
                    ) : null}
                </div>
                <CardContent className="p-2 sm:p-4 text-sm md:text-base">
                    <h2 className="text-md font-bold mb-1">{product.name}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 capitalize">
                            {product.subcategory ? `${product.subcategory} • ${product.category}` : product.category}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                            {product.brand}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span
                            className={`${product.salesPrice > 0
                                ? "line-through font-normal text-sm text-gray-600"
                                : "font-bold"
                                } items-center justify-around flex`}
                        >
                            <TbCurrencyNaira />{formatPriceDisplay(product.price)}
                        </span>
                        <span
                            className={`flex items-center ${product.salesPrice > 0 ? "text-sm font-bold" : "hidden"
                                }`}
                        >
                            <TbCurrencyNaira />{formatPriceDisplay(product.salesPrice)}
                        </span>
                    </div>
                </CardContent>
            </div>
            <CardFooter className='p-2 mb-0'>
                <Button
                    onClick={() => {
                        if (!isOut) handleAddToCart(product);
                    }}
                    disabled={isOut}
                    className={`w-full h-8 text-xs ${isOut ? 'bg-gray-400 text-gray-700' : 'bg-black text-white'}`}
                >
                    {isOut ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;
