import { Router, Request, Response } from "express";

const router = Router();

// In-memory "About Us" content object
// This simulates static content for the website and can be updated via PUT request
let aboutContent = {
  heroTitle: "מי אנחנו",
  heroText: "מערכת חדשנית לגיוס תרומות בשילוב טכנולוגיית בלוקצ'יין ובינה מלאכותית — למען עתיד חברתי חכם, מאובטח ושקוף יותר",
  visionTitle: "החזון שלנו",
  visionText: "אנו שואפים לשנות את הדרך שבה אנשים תורמים – להפוך כל תרומה לחוויה שקופה, אמינה ומבוססת נתונים. שילוב של טכנולוגיה מתקדמת עם ערכים חברתיים הוא הלב של הפרויקט שלנו",
  features: [
    { title: "שקיפות וביטחון", text: "באמצעות טכנולוגיית הבלוקצ'יין, כל תרומה נרשמת ומאומתת בצורה מאובטחת ובלתי ניתנת לשינוי" },
    { title: "בינה מלאכותית חכמה", text: "המערכת מנתחת טקסטים וממליצה לתורמים על פרויקטים שמתאימים לערכים ולתחומי העניין שלהם" },
    { title: "חיבור אמיתי", text: "יצירת מערכת יחסים מבוססת אמון בין תורמים לארגונים – מתוך מטרה משותפת להשפעה חברתית חיובית" },
    { title: "השפעה עולמית", text: "חזון גלובלי שמחבר בין טכנולוגיה וקהילה, ומאפשר לתרום מכל מקום בעולם בצורה פשוטה ושקופה" },
  ],
  closingText: "אנו מאמינים שטכנולוגיה יכולה להפוך כל תרומה לסיפור של אמון, השפעה ונתינה. הצטרפו אלינו למסע אל עתיד של שקיפות, אחריות וחדשנות חברתית",
};


router.get("/", (req: Request, res: Response) => {
  res.json(aboutContent);
});


router.put("/", (req: Request, res: Response) => {
  const updates = req.body;
  aboutContent = { ...aboutContent, ...updates };
  res.json(aboutContent);
});

export default router;
