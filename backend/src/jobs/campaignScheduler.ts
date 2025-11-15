import cron from "node-cron";
import Campaign from "../models/campaign.model";


export const startCampaignStatusJob = () => {
  
  cron.schedule("0 0 0 * * *", async () => {
    console.log("🔄 מריץ עדכון סטטוס קמפיינים לפי תאריך סיום...");

    try {
      const now = new Date();
      const result = await Campaign.updateMany(
        { endDate: { $lt: now }, isActive: true },
        { $set: { isActive: false } }
      );

      if (result.modifiedCount > 0) {
        console.log(` עודכנו ${result.modifiedCount} קמפיינים שפג תוקפם.`);
      } else {
        console.log(" לא נמצאו קמפיינים שפג תוקפם.");
      }
    } catch (err) {
      console.error(" שגיאה בהרצת עדכון קמפיינים:", err);
    }
  });

  console.log("🕒 מתזמן הקמפיינים הופעל בהצלחה!");
};
