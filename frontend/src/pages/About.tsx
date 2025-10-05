import { motion } from "framer-motion"
import { ShieldCheck, Brain, HeartHandshake, Globe } from "lucide-react"

export default function About() {
  return (
    <div className="bg-white min-h-screen text-right">
      {/* Hero Section */}
      <section className="relative text-center py-20 bg-blue-700 text-white overflow-hidden shadow-md">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-4"
        >
          מי אנחנו
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="text-lg max-w-2xl mx-auto"
        >
          מערכת חדשנית לגיוס תרומות בשילוב טכנולוגיית בלוקצ'יין ובינה מלאכותית —
          למען עתיד חברתי חכם, מאובטח ושקוף יותר
        </motion.p>
      </section>

      {/* Vision Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-blue-700 mb-6 text-center"
        >
          החזון שלנו
        </motion.h2>
        <p className="text-lg leading-relaxed text-gray-700 mb-10 text-center">
          אנו שואפים לשנות את הדרך שבה אנשים תורמים – להפוך כל תרומה לחוויה שקופה,
          אמינה ומבוססת נתונים. שילוב של טכנולוגיה מתקדמת עם ערכים חברתיים הוא
          הלב של הפרויקט שלנו
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {[
            {
              icon: <ShieldCheck size={40} className="text-blue-600 mb-3" />,
              title: "שקיפות וביטחון",
              text: "באמצעות טכנולוגיית הבלוקצ'יין, כל תרומה נרשמת ומאומתת בצורה מאובטחת ובלתי ניתנת לשינוי",
            },
            {
              icon: <Brain size={40} className="text-blue-600 mb-3" />,
              title: "בינה מלאכותית חכמה",
              text: "המערכת מנתחת טקסטים וממליצה לתורמים על פרויקטים שמתאימים לערכים ולתחומי העניין שלהם",
            },
            {
              icon: <HeartHandshake size={40} className="text-blue-600 mb-3" />,
              title: "חיבור אמיתי",
              text: "יצירת מערכת יחסים מבוססת אמון בין תורמים לארגונים – מתוך מטרה משותפת להשפעה חברתית חיובית",
            },
            {
              icon: <Globe size={40} className="text-blue-600 mb-3" />,
              title: "השפעה עולמית",
              text: "חזון גלובלי שמחבר בין טכנולוגיה וקהילה, ומאפשר לתרום מכל מקום בעולם בצורה פשוטה ושקופה",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition"
            >
              {feature.icon}
              <h3 className="font-semibold text-xl mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Closing Message */}
      <section className="py-16 text-center px-6 bg-white">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-xl text-gray-700 max-w-3xl mx-auto"
        >
         . אנו מאמינים שטכנולוגיה יכולה להפוך כל תרומה לסיפור של אמון, השפעה ונתינה
         . הצטרפו אלינו למסע אל עתיד של שקיפות, אחריות וחדשנות חברתית
        </motion.p>
      </section>
    </div>
  )
}
