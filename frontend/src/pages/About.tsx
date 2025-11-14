import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Brain, HeartHandshake, Globe } from "lucide-react";
import axios from "axios";

export default function About() {
 
  const [about, setAbout] = useState<{
    heroTitle: string;
    heroText: string;
    visionTitle: string;
    visionText: string;
    features: { title: string; text: string }[];
    closingText: string;
  } | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/about`);
        setAbout(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת עמוד עלינו:", err);
      }
    };
    fetchAbout();
  }, []);

  if (!about) return <p className="text-center mt-10">טוען תוכן...</p>;

  return (
    <div className="bg-white text-right">
      {/* Hero Section */}
      <section className="relative text-center py-20 bg-blue-700 text-white overflow-hidden shadow-md">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-4"
        >
          {about.heroTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="text-lg max-w-2xl mx-auto"
        >
          {about.heroText}
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
          {about.visionTitle}
        </motion.h2>
        <p className="text-lg leading-relaxed text-gray-700 mb-10 text-center">
          {about.visionText}
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {about.features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition"
            >
              {i === 0 && <ShieldCheck size={40} className="text-blue-600 mb-3" />}
              {i === 1 && <Brain size={40} className="text-blue-600 mb-3" />}
              {i === 2 && <HeartHandshake size={40} className="text-blue-600 mb-3" />}
              {i === 3 && <Globe size={40} className="text-blue-600 mb-3" />}
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
          {about.closingText}
        </motion.p>
      </section>
    </div>
  );
}
