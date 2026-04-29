import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DollarSign, Icon } from "lucide-react";

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddToCart,
}) {
    return (
        <Card className="w-full max-w-sm mx-auto py-0 rounded-lg shadow-sm border-gray-200 pb-4">
            <div
                onClick={() => handleGetProductDetails(product._id)}
                className="cursor-pointer"
            >
                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-[200px] object-cover rounded-t-lg"
                    />
                    {product.salesPrice > 0 ? (
                        <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                            Sale
                        </Badge>
                    ) : null}
                </div>
                <CardContent className="p-4">
                    <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 capitalize">
                            {product.category}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                            {product.brand}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${product.salesPrice > 0
                                    ? "line-through font-normal text-sm text-gray-600"
                                    : "font-bold"
                                } items-center justify-around flex`}
                        >
                            ${product.price}
                        </span>
                        <span
                            className={`${product.salesPrice > 0 ? "text-lg font-bold" : "hidden"
                                }`}
                        >
                            ${product.salesPrice}
                        </span>
                    </div>
                </CardContent>
            </div>
            <CardFooter>
                <Button
                    onClick={() => {
                        handleAddToCart(product._id);
                    }}
                    className="w-full bg-black text-white"
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;
