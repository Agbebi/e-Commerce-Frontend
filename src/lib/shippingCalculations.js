/**
 * Shipping Calculation Utilities
 * Handles weight, dimensions, and shipping fee calculations
 */

/**
 * Calculate volumetric weight from dimensions
 * @param {number} length - Length in specified unit
 * @param {number} width - Width in specified unit
 * @param {number} height - Height in specified unit
 * @param {string} unit - Unit of measurement ('cm' or 'inch')
 * @returns {number} Volumetric weight in kg
 */
export const calculateVolumetricWeight = (
  length,
  width,
  height,
  unit = "cm",
) => {
  if (!length || !width || !height) return 0;

  // Convert to cm if needed
  const lengthCm = unit === "inch" ? length * 2.54 : length;
  const widthCm = unit === "inch" ? width * 2.54 : width;
  const heightCm = unit === "inch" ? height * 2.54 : height;

  // DIM weight formula: (length × width × height) ÷ 5000
  const volumetricWeight = (lengthCm * widthCm * heightCm) / 5000;
  return volumetricWeight;
};

/**
 * Calculate weight multiplier based on total cart weight
 * Light: ≤ 1kg = 1.0x (base rate)
 * Medium: 1-5kg = 1.2x (20% surcharge)
 * Heavy: 5-20kg = 1.5x (50% surcharge)
 * Very Heavy: > 20kg = 2.0x (100% surcharge)
 * @param {number} weight - Total weight in kg
 * @returns {number} Multiplier to apply to base shipping fee
 */
export const calculateWeightMultiplier = (weight) => {
  if (weight <= 1) return 1.0;
  if (weight <= 5) return 1.2;
  if (weight <= 20) return 1.5;
  return 2.0;
};

/**
 * Get weight category description
 * @param {number} weight - Total weight in kg
 * @returns {string} Description of weight category
 */
export const getWeightCategory = (weight) => {
  if (weight <= 1) return "Light shipment - standard rate";
  if (weight <= 5) return "Medium shipment - 20% weight surcharge";
  if (weight <= 20) return "Heavy shipment - 50% weight surcharge";
  return "Very heavy shipment - 100% weight surcharge";
};

/**
 * Calculate base shipping fee based on distance
 * @param {number} distanceValue - Distance in meters
 * @returns {number} Base shipping fee in naira
 */
export const calculateBaseShippingFee = (distanceValue) => {
  const distanceKm = distanceValue / 1000;

  if (distanceKm <= 5) return 1000;
  if (distanceKm <= 10) return 1500;
  if (distanceKm <= 20) return 2000;
  if (distanceKm <= 50) return 3000;
  if (distanceKm <= 100) return 4000;
  if (distanceKm <= 200) return 5000;
  return 7000;
};

/**
 * Calculate final shipping fee with weight multiplier
 * @param {number} distanceValue - Distance in meters
 * @param {number} weightMultiplier - Weight-based multiplier
 * @returns {number} Final shipping fee in naira
 */
export const calculateShippingFee = (distanceValue, weightMultiplier = 1) => {
  const baseFee = calculateBaseShippingFee(distanceValue);
  return Math.ceil(baseFee * weightMultiplier);
};

/**
 * Calculate effective weight (max of actual weight vs volumetric weight)
 * @param {number} actualWeight - Actual weight in kg
 * @param {number} length - Length for volumetric calculation
 * @param {number} width - Width for volumetric calculation
 * @param {number} height - Height for volumetric calculation
 * @param {string} unit - Unit of dimensions
 * @returns {number} Effective weight in kg
 */
export const getEffectiveWeight = (
  actualWeight,
  length,
  width,
  height,
  unit = "cm",
) => {
  if (!actualWeight) return 0;

  const volumetricWeight = calculateVolumetricWeight(
    length,
    width,
    height,
    unit,
  );
  return Math.max(actualWeight, volumetricWeight);
};

/**
 * Get shipping fee breakdown for display
 * @param {number} distanceValue - Distance in meters
 * @param {number} totalWeight - Total weight in kg
 * @param {number} weightMultiplier - Weight multiplier
 * @returns {object} Breakdown of shipping calculation
 */
export const getShippingBreakdown = (
  distanceValue,
  totalWeight,
  weightMultiplier,
) => {
  const baseFee = calculateBaseShippingFee(distanceValue);
  const finalFee = calculateShippingFee(distanceValue, weightMultiplier);
  const weightSurcharge = finalFee - baseFee;

  return {
    distanceKm: (distanceValue / 1000).toFixed(1),
    baseFee,
    weightMultiplier: weightMultiplier.toFixed(1),
    weightSurcharge: Math.max(0, weightSurcharge),
    totalWeight: totalWeight.toFixed(2),
    finalFee,
    category: getWeightCategory(totalWeight),
  };
};
