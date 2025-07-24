// cron/expiredCropJob.js
import cron from 'node-cron';
import { runExpiredCropMigration } from '../controllers/expiredCropController.js'; 

// Schedule: Twice a day—once at 12:00 AM and once at 12:00 PM
cron.schedule('0 0,12 * * *', async () => {
  console.log('Running expired crop migration job...');
  await runExpiredCropMigration();
});
