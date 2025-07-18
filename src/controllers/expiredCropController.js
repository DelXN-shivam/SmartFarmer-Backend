import ExpiredCrop from "../models/ExpiredCrops.js";
import Crop from '../models/Crop.js';

export const runExpiredCropMigration = async () => {
  try {
    const now = new Date();

    // Get all expired crops
    const expiredCrops = await Crop.find({
      expectedLastHarvestDate: { $lt: now },
    });

    if (expiredCrops.length === 0) {
      return { moved: 0, message: "No expired crops found" };
    }

    // Filter out crops already moved (by checking their _id in ExpiredCrop)
    const alreadyMovedIds = await ExpiredCrop.find({
      _id: { $in: expiredCrops.map(crop => crop._id) }
    }).distinct('_id');

    const newCrops = expiredCrops.filter(
      crop => !alreadyMovedIds.includes(crop._id)
    );

    if (newCrops.length === 0) {
      return { moved: 0, message: "All expired crops already migrated" };
    }

    // Remove _id before insert to avoid conflict
    const cropsToInsert = newCrops.map(crop => {
      const { _id, ...rest } = crop.toObject();
      return rest;
    });

    // Insert into ExpiredCrop
    await ExpiredCrop.insertMany(cropsToInsert, { ordered: false });

    // Delete from Crop collection
    await Crop.deleteMany({ _id: { $in: newCrops.map(c => c._id) } });

    return {
      moved: cropsToInsert.length,
      message: "Crops moved to ExpiredCrop collection successfully",
    };
  } catch (error) {
    console.error("Error moving expired crops:", error);
    throw error;
  }
};
