import express from 'express'
import { runExpiredCropMigration } from '../controllers/expiredCropController.js';
export const expiredCropRouter = express.Router();


expiredCropRouter.post('/cron', async (req, res) => {
  try {
    const result = await runExpiredCropMigration();
    return res.status(200).json({
      message: `✅ Cron job completed: ${result.message}`,
      moved: result.moved,
    });
  } catch (error) {
    console.error("❌ Cron job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});