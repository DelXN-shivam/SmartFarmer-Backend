// cron/expiredCropJob.js
import cron from 'node-cron';
import { runExpiredCropMigration } from '../controllers/expiredCropController.js'; 

// Schedule: every 2 minutes
cron.schedule('*/2 * * * *', async () => {
  console.log('Running expired crop migration job...');
  await runExpiredCropMigration(); // call the function directly
});
