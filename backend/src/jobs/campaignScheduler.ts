import cron from "node-cron";
import Campaign from "../models/campaign.model";

// Starts a scheduled cron job that updates campaign statuses daily

export const startCampaignStatusJob = () => {
 // Schedule job to run every day at midnight (00:00:00) 
  cron.schedule("0 0 0 * * *", async () => {
    try {
      const now = new Date();
      const result = await Campaign.updateMany(
        { endDate: { $lt: now }, isActive: true },
        { $set: { isActive: false } }
      );

      if (result.modifiedCount > 0) {
      } else {
        console.log("No expired campaigns found.");
      }
    } catch (err) {
      console.error("Error running campaign update:", err);
    }
  });
};
