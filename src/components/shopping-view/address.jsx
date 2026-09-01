import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IoLocation, IoAdd, IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useApiIsLoaded } from "@vis.gl/react-google-maps";

const initialFormData = {
  address: "",
  city: "",
  phoneNumber: "",
  state: "",
  postalCode: "",
  country: "",
  notes: "",
  location: {
    coordinates: [],
  },
};

function Address({ currentSelectedAddress, setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [addAddress, setAddAddress] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const location = useLocation();
  const dispatch = useDispatch();
  const addressRef = useRef(null);

  const isLoaded = useApiIsLoaded();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialFormData);
      toast.error(
        "You can only have 3 addresses. Please delete an existing address to add a new one.",
      );
      return;
    }

    if (
      !formData.location?.coordinates ||
      formData.location.coordinates.length !== 2
    ) {
      toast.error("Address could not be found", {
        description: (
          <span className="text-gray-600">
            Please use a nearest landmark to describe your location.
          </span>
        ),
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editAddress({
            userId: user.id,
            addressId: currentEditedId,
            formData: formData,
          }),
        ).then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllAddresses(user.id));
            setFormData(initialFormData);
            setCurrentEditedId(null);
            setAddAddress(false);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user.id,
          }),
        ).then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllAddresses(user.id));
            setFormData(initialFormData);
            setAddAddress(false);
            toast.success("Address added successfully");
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user.id, addressId: getCurrentAddress._id }),
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllAddresses(user.id));
        toast.success("Address deleted successfully");
        setFormData(initialFormData);
        setCurrentEditedId(null);
        setAddAddress(false);
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress._id);
    setAddAddress(true);
    setFormData({
      ...formData,
      address: getCurrentAddress.address,
      city: getCurrentAddress.city,
      phoneNumber: getCurrentAddress.phoneNumber,
      state: getCurrentAddress.state,
      postalCode: getCurrentAddress.postalCode,
      country: getCurrentAddress.country,
      notes: getCurrentAddress.notes,
      location: getCurrentAddress.location || { coordinates: [] },
    });
  }

  function isFormValid() {
    const requiredFields = [
      "address",
      "city",
      "state",
      "country",
      "phoneNumber",
    ];
    return requiredFields
      .map((key) => formData[key] !== "")
      .every((item) => item === true);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user.id));
  }, [dispatch, user.id]);

  useEffect(() => {
    if (!addressRef.current || !isLoaded) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      addressRef.current,
      {
        componentRestrictions: { country: "ng" },
      },
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.warn("No geometry available for this place");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      console.log("Latitude:", lat, "Longitude:", lng);

      if (place.name) {
        const addressParts = place.name.split(", ");
        setFormData((prevData) => ({
          ...prevData,
          address: addressParts[0] || "",
          city: addressParts[1] || "",
          state: addressParts[2] || "",
          country: addressParts[3] || "",
          location: {
            coordinates: [lng, lat],
          },
        }));
      }

      if (place.address_components) {
        const addressComponents = place.address_components;
        setFormData((prevData) => {
          const updatedData = { ...prevData };

          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes("postal_code")) {
              updatedData.postalCode = component.long_name;
            }
            if (types.includes("country")) {
              updatedData.country = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              updatedData.state = component.long_name;
            }
            if (types.includes("locality")) {
              updatedData.city = component.long_name.split(" ")[0];
            }
          });

          return updatedData;
        });
      }
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [isLoaded, addAddress]);

  return (
    <div className="space-y-6">
      {/* Address Cards Grid */}
      {addressList && addressList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressList.map((address, index) => (
            <motion.div
              key={address._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 ${
                currentSelectedAddress?._id === address._id
                  ? "border-slate-900 shadow-md"
                  : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
              }`}
            >
              {currentSelectedAddress?._id === address._id && (
                <div className="absolute top-4 right-4">
                  <IoCheckmarkCircle className="text-slate-900" size={20} />
                </div>
              )}

              <div
                onClick={() =>
                  setCurrentSelectedAddress &&
                  setCurrentSelectedAddress(address)
                }
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <IoLocation className="text-slate-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {address.state}, {address.country}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {address.address}, {address.city}
                    </p>
                    {address.postalCode && (
                      <p className="text-xs text-slate-500 mt-1">
                        {address.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {address.phoneNumber && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Phone:</span>
                    <span className="text-xs font-medium text-slate-900">
                      {address.phoneNumber}
                    </span>
                  </div>
                )}
              </div>

              {location.pathname.includes("checkout") ? null : (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                  >
                    <MdOutlineEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    <AiOutlineDelete size={14} />
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
            <IoLocation className="text-slate-400" size={28} />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            No addresses found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            You haven't added any addresses yet. Add your first address to get
            started.
          </p>
        </motion.div>
      )}

      {/* Add/Edit Address Form */}
      {(addAddress ||
        currentEditedId !== null ||
        location.pathname.includes("account") ||
        location.pathname.includes("address")) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {currentEditedId ? "Edit Address" : "Add New Address"}
              </h3>
              <p className="text-sm text-slate-500">
                {currentEditedId
                  ? "Update your address details below."
                  : "Fill in the details to add a new address."}
              </p>
            </div>
            {location.pathname.includes("checkout") && !currentEditedId && (
              <button
                type="button"
                onClick={() => {
                  setAddAddress(false);
                  setFormData(initialFormData);
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <form onSubmit={handleManageAddress} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Address *
                </label>
                <input
                  ref={addressRef}
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="address-city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="state"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="address-state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200"
                  placeholder="State"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="address-country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200"
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="address-postal"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200"
                  placeholder="Postal code"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="address-phone"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Notes{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="address-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 focus:bg-white transition-all duration-200 resize-none"
                placeholder="Delivery instructions, gate codes, etc."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={!isFormValid()}
                className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {currentEditedId ? "Update Address" : "Add Address"}
              </button>
              {currentEditedId && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                    setAddAddress(false);
                  }}
                  className="px-6 py-3 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* Add Address Button (when form is not shown) */}
      {!addAddress &&
        currentEditedId === null &&
        !location.pathname.includes("account") &&
        !location.pathname.includes("address") && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAddAddress(true)}
            className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <IoAdd size={18} />
            Add New Address
          </motion.button>
        )}
    </div>
  );
}

export default Address;
