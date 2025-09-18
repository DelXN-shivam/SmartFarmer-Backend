import Verifier from '../models/Verifier.js';
import Farmer from '../models/Farmer.js';
import Crop from '../models/Crop.js';

/**
 * Assigns a crop to verifiers based on farmer's district and taluka
 * @param {Object} farmer - The farmer object containing district and taluka
 * @param {String} cropId - The crop ID to be assigned
 * @returns {Object} - Assignment result with verifier IDs and update details
 */
export const assignCropToVerifiers = async (farmer, cropId) => {
  try {
    if (!farmer.district || !farmer.taluka) {
      return {
        success: false,
        message: "Farmer district or taluka is missing",
        verifierIds: [],
        updateDetails: null
      };
    }

    // Find verifiers in the same district with allocated taluka matching farmer's taluka
    const matchingVerifiers = await Verifier.find({
      district: farmer.district.toLowerCase(),
      allocatedTaluka: { $in: [farmer.taluka.toLowerCase()] }
    }, { _id: 1 });

    if (matchingVerifiers.length === 0) {
      return {
        success: true,
        message: "No matching verifiers found for assignment",
        verifierIds: [],
        updateDetails: null
      };
    }

    const verifierIds = matchingVerifiers.map(verifier => verifier._id);

    // Update matching verifiers with the crop ID
    const updateDetails = await Verifier.updateMany(
      {
        district: farmer.district.toLowerCase(),
        allocatedTaluka: { $in: [farmer.taluka.toLowerCase()] }
      },
      { $addToSet: { cropId: cropId } }
    );

    // Update crop with the first matching verifier ID
    if (verifierIds.length > 0) {
      await Crop.findByIdAndUpdate(cropId, {
        verifierId: verifierIds[0]
      });
    }

    return {
      success: true,
      message: `Crop assigned to ${verifierIds.length} verifier(s)`,
      verifierIds,
      updateDetails
    };

  } catch (error) {
    console.error('Error in assignCropToVerifiers:', error);
    return {
      success: false,
      message: "Error assigning crop to verifiers",
      error: error.message,
      verifierIds: [],
      updateDetails: null
    };
  }
};

/**
 * Removes a crop from verifiers
 * @param {String} cropId - The crop ID to be removed
 * @returns {Object} - Removal result
 */
export const removeCropFromVerifiers = async (cropId) => {
  try {
    const updateDetails = await Verifier.updateMany(
      { cropId: cropId },
      { $pull: { cropId: cropId } }
    );

    // Clear verifierId from crop
    await Crop.findByIdAndUpdate(cropId, {
      $unset: { verifierId: 1 }
    });

    return {
      success: true,
      message: "Crop removed from verifiers",
      updateDetails
    };

  } catch (error) {
    console.error('Error in removeCropFromVerifiers:', error);
    return {
      success: false,
      message: "Error removing crop from verifiers",
      error: error.message,
      updateDetails: null
    };
  }
};

/**
 * Assigns existing crops to a verifier based on their district and allocated talukas
 * @param {String} verifierId - The verifier ID
 * @param {String} district - The verifier's district
 * @param {Array} allocatedTalukas - Array of allocated talukas
 * @returns {Object} - Assignment result
 */
export const assignExistingCropsToVerifier = async (verifierId, district, allocatedTalukas) => {
  try {
    if (!district || !allocatedTalukas || allocatedTalukas.length === 0) {
      return {
        success: false,
        message: "District or allocated talukas missing",
        assignedCrops: []
      };
    }

    // Find farmers in the same district and matching talukas
    const matchingFarmers = await Farmer.find({
      district: district.toLowerCase(),
      taluka: { $in: allocatedTalukas.map(t => t.toLowerCase()) }
    }, { _id: 1 });

    if (matchingFarmers.length === 0) {
      return {
        success: true,
        message: "No matching farmers found",
        assignedCrops: []
      };
    }

    const farmerIds = matchingFarmers.map(farmer => farmer._id);

    // Find crops belonging to these farmers
    const matchingCrops = await Crop.find({
      farmerId: { $in: farmerIds }
    }, { _id: 1 });

    if (matchingCrops.length === 0) {
      return {
        success: true,
        message: "No matching crops found",
        assignedCrops: []
      };
    }

    const cropIds = matchingCrops.map(crop => crop._id);

    // Update the verifier with all matching crop IDs
    const updateResult = await Verifier.findByIdAndUpdate(
      verifierId,
      { $addToSet: { cropId: { $each: cropIds } } },
      { new: true }
    );

    // Update all matching crops with this verifier ID
    await Crop.updateMany(
      { _id: { $in: cropIds } },
      { verifierId: verifierId }
    );

    return {
      success: true,
      message: `${cropIds.length} crops assigned to verifier`,
      assignedCrops: cropIds,
      updateResult
    };

  } catch (error) {
    console.error('Error in assignExistingCropsToVerifier:', error);
    return {
      success: false,
      message: "Error assigning existing crops to verifier",
      error: error.message,
      assignedCrops: []
    };
  }
};