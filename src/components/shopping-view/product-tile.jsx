import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DollarSign, Icon } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddToCart,
}) {
    return (
        <Card className="w-full bg-white max-w-sm mx-auto gap-4 py-0 rounded-lg shadow-sm border-gray-200">
            <div
                onClick={() => handleGetProductDetails(product._id)}
                className="cursor-pointer"
            >
                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-[150px] md:h-[200px] object-cover rounded-t-lg"
                    />
                    {product.salesPrice > 0 ? (
                        <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                            Sale
                        </Badge>
                    ) : null}
                </div>
                <CardContent className="p-2 sm:p-4 text-sm md:text-base">
                    <h2 className="text-md font-bold mb-1">{product.name}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 capitalize">
                            {product.category}
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
                            <TbCurrencyNaira />{product.price}
                        </span>
                        <span
                            className={`flex items-center ${product.salesPrice > 0 ? "text-sm font-bold" : "hidden"
                                }`}
                        >
                            <TbCurrencyNaira />{product.salesPrice}
                        </span>
                    </div>
                </CardContent>
            </div>
            <CardFooter className='p-2 mb-0'>
                <Button
                    onClick={() => {
                        handleAddToCart(product);
                    }}
                    className="w-full h-8 text-xs bg-black text-white"
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;
