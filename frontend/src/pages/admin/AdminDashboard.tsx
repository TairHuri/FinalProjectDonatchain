import React, { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  usersCount: number;
  ngosCount: number;
  campaignsCount: number;
  donationsCount: number;
  totalRaised: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err: any) {
        setError("שגיאה בטעינת הנתונים");
      }
    };

    fetchStats();
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!stats) return <p className="text-center mt-10">טוען נתונים...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">דשבורד מנהל מערכת</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title="משתמשים" value={stats.usersCount} />
        <StatCard title="עמותות" value={stats.ngosCount} />
        <StatCard title="קמפיינים" value={stats.campaignsCount} />
        <StatCard title="תרומות" value={stats.donationsCount} />
        <StatCard
          title="סכום כולל שגויס"
          value={`${stats.totalRaised.toLocaleString()} ₪`}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-2xl text-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
