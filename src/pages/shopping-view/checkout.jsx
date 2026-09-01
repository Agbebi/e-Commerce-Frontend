import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import checkoutImg from "../../assets/checkoutImg.jpg";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import { createNewOrder } from "@/store/shop/order-slice";
import { deleteCartItem, updateCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { TbCurrencyNaira } from "react-icons/tb";
import { formatPriceDisplay } from "@/lib/utils";
import {
  calculateVolumetricWeight,
  calculateWeightMultiplier,
  getWeightCategory,
  calculateShippingFee as calculateShippingFeeWithWeight,
} from "@/lib/shippingCalculations";
import LoadingState from "@/components/ui/loading-state";
import { Loader2, X } from "lucide-react";
import {
  IoLocationOutline,
  IoBagOutline,
  IoCardOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import API from "@/api/axios";

function ShoppingCheckout() {
  const dispatch = useDispatch();

  const { cartItems, isLoading: cartLoading } = useSelector(
    (state) => state.shopCart,
  );
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [vendorLandmarks, setVendorLandmarks] = useState({});
  const [shippingFee, setShippingFee] = useState(0);
  const [distances, setDistances] = useState([]);
  const [productDetails, setProductDetails] = useState({}); // Store full product details
  const [totalWeight, setTotalWeight] = useState(0); // Total weight in kg
  const [weightMultiplier, setWeightMultiplier] = useState(1); // Weight-based fee multiplier
  const { approvalUrl, isLoading: orderLoading } = useSelector(
    (state) => state.shopOrder,
  );

  // New state for promo codes and discounts
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [bulkDiscount, setBulkDiscount] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const totalPrice =
    cartItems && cartItems.items
      ? cartItems.items.reduce((total, item) => {
          const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
          return total + itemPrice * item.quantity;
        }, 0)
      : 0;

  const handleCartItemQuantityChange = (cartItem, action) => {
    const nextQuantity =
      action === "plus" ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (nextQuantity < 1) return;

    dispatch(
      updateCartItems({
        userId: user.id,
        productId: cartItem.productId,
        quantity: nextQuantity,
        description: cartItem.description,
        name: cartItem.name,
        imageUrl: cartItem.images?.[0] || cartItem.image,
        price: cartItem.salesPrice > 0 ? cartItem.salesPrice : cartItem.price,
      }),
    );
  };

  const handleCartItemDelete = (cartItem) => {
    dispatch(
      deleteCartItem({
        userId: user.id,
        productId: cartItem.productId,
      }),
    );
  };

  // Calculate bulk discount based on quantity
  useEffect(() => {
    const totalQuantity =
      cartItems?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    let discount = 0;
    if (totalQuantity >= 10) discount = 10;
    else if (totalQuantity >= 5) discount = 5;
    else if (totalQuantity >= 3) discount = 3;

    setBulkDiscount(discount);
  }, [cartItems]);

  const calculateDeliveryFee = (distanceValue) =>
    calculateShippingFeeWithWeight(distanceValue, weightMultiplier);

  // Calculate volumetric weight from dimensions (utility function)
  const calcVolumetricWeight = (length, width, height, unit = "cm") => {
    return calculateVolumetricWeight(length, width, height, unit);
  };

  // Calculate weight multiplier (utility function)
  const calcWeightMultiplier = (weight) => {
    return calculateWeightMultiplier(weight);
  };

  // Fetch product details to get weight and dimensions
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cartItems?.items?.length) return;

      try {
        const productIds = cartItems.items.map((item) => item.productId);
        const details = {};
        let totalWeight_temp = 0;

        // Fetch details for each product
        for (const productId of productIds) {
          try {
            const response = await API.get(
              `/api/shop/products/get/${productId}`,
            );

            if (response.data?.success && response.data?.data) {
              const product = response.data.data;
              details[productId] = {
                weight: product.weight || 0,
                dimensions: product.dimensions || null,
              };

              // Calculate total weight considering quantity
              const item = cartItems.items.find(
                (i) => i.productId === productId,
              );
              if (item) {
                const productWeight = product.weight || 0;
                const volumetricWeight = product.dimensions
                  ? calcVolumetricWeight(
                      product.dimensions.length,
                      product.dimensions.width,
                      product.dimensions.height,
                      product.dimensions.unit,
                    )
                  : 0;

                // Use heavier of actual vs volumetric weight
                const effectiveWeight = Math.max(
                  productWeight,
                  volumetricWeight,
                );
                totalWeight_temp += effectiveWeight * item.quantity;
              }
            }
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
          }
        }

        setProductDetails(details);
        setTotalWeight(totalWeight_temp);
        setWeightMultiplier(calcWeightMultiplier(totalWeight_temp));
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  // Calculate discounts
  const bulkDiscountAmount = (totalPrice * bulkDiscount) / 100;
  const totalDiscount = bulkDiscountAmount + promoDiscount;
  const subtotalAfterDiscount = totalPrice - totalDiscount;
  const shipping = totalPrice > 0 ? shippingFee : 0;
  const tax = totalPrice * 0.0;
  const grandTotal = subtotalAfterDiscount + shipping + tax;

  // Apply promo code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    if (!user?.id) {
      setPromoError("User not found");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError("");

    try {
      const response = await API.post("/api/shop/cart/apply-promo", {
        userId: user.id,
        promoCode: promoCode.trim(),
      });

      if (response.data.success) {
        setAppliedPromo({
          code: response.data.data.promoCode.code,
          discountAmount: response.data.data.promoCode.discountAmount,
          discountType: response.data.data.promoCode.discountType,
          discountPercentage: response.data.data.promoCode.discountPercentage,
        });
        setPromoDiscount(response.data.data.discountAmount);
        setPromoCode("");
        toast.success("Promo code applied successfully!");
      } else {
        setPromoError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to apply promo code";
      setPromoError(message);
      toast.error(message);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Remove promo code
  const handleRemovePromo = async () => {
    if (!user?.id) return;

    try {
      const response = await API.post("/api/shop/cart/remove-promo", {
        userId: user.id,
      });

      if (response.data.success) {
        setAppliedPromo(null);
        setPromoDiscount(0);
        setPromoError("");
        toast.success("Promo code removed");
      }
    } catch (error) {
      console.error("Error removing promo code:", error);
    }
  };

  useEffect(() => {
    async function fetchVendorLandmarks() {
      if (cartItems?.items?.length) {
        const vendorIds = [
          ...new Set(cartItems.items.map((item) => item.vendorId)),
        ];
        const landmarks = {};
        for (const vendorId of vendorIds) {
          try {
            const response = await API.get(
              `/api/auth/vendor/${vendorId}/landmark`,
            );
            if (response.data.success) {
              landmarks[vendorId] = response.data.data;
            }
          } catch (error) {
            console.error(
              `Failed to fetch landmark for vendor ${vendorId}:`,
              error,
            );
          }
        }
        console.log("Vendor Landmarks:", landmarks);
        setVendorLandmarks(landmarks);
      }
    }
    fetchVendorLandmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  useEffect(() => {
    if (currentSelectedAddress) {
      console.log(
        "Selected Address Coordinates:",
        currentSelectedAddress.location?.coordinates || [],
      );

      const addressCoords = currentSelectedAddress.location?.coordinates;
      const hasValidAddressCoords = addressCoords && addressCoords.length === 2;

      const validVendorLandmarks = Object.values(vendorLandmarks).filter(
        (landmark) => landmark.nearestLandmark?.coordinates?.length === 2,
      );

      if (
        hasValidAddressCoords &&
        validVendorLandmarks.length > 0 &&
        window.google
      ) {
        const service = new window.google.maps.DistanceMatrixService();

        const request = {
          origins: [
            {
              lat: addressCoords[1],
              lng: addressCoords[0],
            },
          ],
          destinations: validVendorLandmarks.map((landmark) => ({
            lat: landmark.nearestLandmark.coordinates[1],
            lng: landmark.nearestLandmark.coordinates[0],
          })),
          travelMode: "DRIVING",
        };

        service.getDistanceMatrix(request, (response, status) => {
          if (status === "OK") {
            const distanceResults = response.rows[0].elements.map(
              (element, index) => ({
                vendorId: validVendorLandmarks[index].vendorId,
                shopName: validVendorLandmarks[index].shopName,
                distanceText: element.distance?.text,
                distanceValue: element.distance?.value,
                durationText: element.duration?.text,
                durationValue: element.duration?.value,
              }),
            );
            setDistances(distanceResults);

            const maxDistance = Math.max(
              ...distanceResults.map((d) => d.distanceValue || 0),
            );
            const calculatedFee = calculateDeliveryFee(maxDistance);
            setShippingFee(calculatedFee);

            console.log("Distances:", distanceResults);
            console.log("Max Distance (m):", maxDistance);
            console.log("Shipping Fee:", calculatedFee);
          } else {
            console.error("Error fetching distance matrix:", status);
            setShippingFee(0);
          }
        });
      } else {
        console.log("Missing coordinates for address or vendor landmarks");
      }
    }
  }, [currentSelectedAddress, vendorLandmarks]);

  function handleOpayPayment() {
    if (currentSelectedAddress === null) {
      toast.error("Address is required!", {
        description: (
          <span className="text-red-700">
            Click on an address card to select it.
          </span>
        ),
      });
      return;
    }

    const orderData = {
      userInfo: {
        userEmail: user.email,
        userId: user.id,
        userMobile: user.phoneNumber,
        userName: user.userName,
        name: user.name,
      },
      cartId: cartItems._id,
      productList: cartItems.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        description: item.description,
        imageUrl: item.images?.[0] || item.image,
        price: item.salesPrice > 0 ? item.salesPrice : item.price,
        quantity: item.quantity,
        vendorId: item.vendorId,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        postalCode: currentSelectedAddress.postalCode,
        phoneNumber: currentSelectedAddress.phoneNumber,
        notes: currentSelectedAddress.notes,
        country: currentSelectedAddress.country,
        state: currentSelectedAddress.state,
      },
      shippingFee: shippingFee,
      distances: distances,
      orderStatus: "pending",
      paymentMethod: "Opay",
      paymentStatus: "pending",
      subtotal: totalPrice,
      bulkDiscount: bulkDiscountAmount,
      promoCode: appliedPromo
        ? {
            code: appliedPromo.code,
            discountAmount: promoDiscount,
            discountType: appliedPromo.discountType,
          }
        : null,
      totalDiscount: totalDiscount,
      totalAmount: grandTotal,
      // Weight and shipping information
      totalWeight: totalWeight,
      weightMultiplier: weightMultiplier,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
      deliveryStatus: "pending",
    };

    dispatch(createNewOrder(orderData));
  }

  if (approvalUrl) {
    window.location.href = approvalUrl;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-[0.03]"></div>
        <div className="relative h-[200px] sm:h-[240px]">
          <img
            src={checkoutImg}
            className="w-full h-full object-cover"
            alt="Checkout"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                  Checkout
                </h1>
                <p className="text-sm text-white/80">
                  Complete your order and get it delivered
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Address & Cart */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6 mt-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <IoLocationOutline className="text-slate-700" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Delivery Address
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select where you want your order delivered
                  </p>
                </div>
              </div>
              <Address
                currentSelectedAddress={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </motion.div>

            {/* Cart Items Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <IoBagOutline className="text-slate-700" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Order Summary
                  </h2>
                  <p className="text-xs text-slate-500">
                    {cartItems?.items?.length || 0} items in your cart
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                  cartItems.items.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {item.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                handleCartItemQuantityChange(item, "minus")
                              }
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-xs font-semibold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCartItemQuantityChange(item, "plus")
                              }
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-0.5">
                          <TbCurrencyNaira style={{ fontSize: "0.75rem" }} />
                          {formatPriceDisplay(
                            (item.salesPrice > 0
                              ? item.salesPrice
                              : item.price) * item.quantity,
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCartItemDelete(item)}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500">Your cart is empty</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <IoCardOutline className="text-slate-700" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Order Summary
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review your order details
                  </p>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Promo Code
                </label>
                {appliedPromo ? (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-900">
                        {appliedPromo.code}
                      </p>
                      <p className="text-xs text-emerald-700">
                        â‚¦{formatPriceDisplay(appliedPromo.discountAmount)} off
                      </p>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="p-1 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      <X size={16} className="text-emerald-700" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || !promoCode.trim()}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isApplyingPromo ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-xs text-red-600 mt-2">{promoError}</p>
                )}
              </div>

              {/* Weight & Shipping Calculation Display */}
              {totalWeight > 0 && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-blue-900">
                        Total Weight
                      </span>
                      <span className="text-xs font-semibold text-blue-900">
                        {totalWeight.toFixed(2)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-blue-900">
                        Shipping Multiplier
                      </span>
                      <span className="text-xs font-semibold text-blue-900">
                        {weightMultiplier.toFixed(1)}x
                        {weightMultiplier > 1 && (
                          <span className="text-blue-700 ml-1">
                            (+{((weightMultiplier - 1) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 pt-1">
                      {getWeightCategory(totalWeight)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Subtotal</span>
                  <span className="text-sm font-semibold text-slate-900 flex items-center gap-0.5">
                    <TbCurrencyNaira style={{ fontSize: "0.75rem" }} />
                    {formatPriceDisplay(totalPrice)}
                  </span>
                </div>

                {/* Bulk Discount */}
                {bulkDiscount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex justify-between items-center text-emerald-600"
                  >
                    <span className="text-sm">
                      Bulk Discount ({bulkDiscount}%)
                    </span>
                    <span className="text-sm font-semibold flex items-center gap-0.5">
                      -{formatPriceDisplay(bulkDiscountAmount)}
                    </span>
                  </motion.div>
                )}

                {/* Promo Discount */}
                {promoDiscount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex justify-between items-center text-emerald-600"
                  >
                    <span className="text-sm">Promo Discount</span>
                    <span className="text-sm font-semibold flex items-center gap-0.5">
                      -{formatPriceDisplay(promoDiscount)}
                    </span>
                  </motion.div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Shipping</span>
                  <span
                    className={`text-sm font-semibold ${shipping > 0 ? "text-slate-900" : "text-emerald-600"}`}
                  >
                    {shipping > 0 ? (
                      <span className="flex items-center gap-0.5">
                        <TbCurrencyNaira style={{ fontSize: "0.75rem" }} />
                        {formatPriceDisplay(shipping)}
                      </span>
                    ) : currentSelectedAddress ? (
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex items-center gap-1"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </motion.div>
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
                {distances.length > 0 && (
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                    <p className="font-medium text-slate-700 mb-1">
                      Delivery To:
                    </p>
                    <p>
                      {currentSelectedAddress.address},{" "}
                      {currentSelectedAddress.city}
                    </p>
                    <p>
                      {currentSelectedAddress.state},{" "}
                      {currentSelectedAddress.country}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tax</span>
                  <span className="text-sm font-semibold text-slate-900">
                    -
                  </span>
                </div>
                <div className="h-px bg-slate-200 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-base font-bold text-slate-900 flex items-center gap-0.5">
                    <TbCurrencyNaira style={{ fontSize: "0.85rem" }} />
                    {formatPriceDisplay(grandTotal)}
                  </span>
                </div>
              </div>

              {orderLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <LoadingState
                    title="Preparing your order"
                    description="We are setting up checkout and redirecting you to payment."
                    compact
                    className="border-none bg-transparent shadow-none"
                  />
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpayPayment}
                  disabled={cartLoading || !cartItems?.items?.length}
                  className="w-full py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-2xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 flex items-center justify-center gap-2"
                >
                  <IoShieldCheckmarkOutline size={18} />
                  {cartLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating cart...
                    </span>
                  ) : (
                    `Pay ${formatPriceDisplay(grandTotal)}`
                  )}
                </motion.button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <IoShieldCheckmarkOutline size={14} />
                <span>Secure checkout powered by Opay</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
