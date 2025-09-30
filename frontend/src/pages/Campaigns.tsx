import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { Link } from "react-router-dom";
import { getCampaigns } from "../services/api";


export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [view, setView] = useState<"grid" | "list">("grid");

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getCampaigns();
      console.log("🔍 נתונים שחזרו מה־API:", data);

      // תמיד נוודא שמה ששמים זה מערך
      if (Array.isArray(data)) {
        setCampaigns(data);
      } else if (data && Array.isArray(data.campaigns)) {
        setCampaigns(data.campaigns);
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error("שגיאה בטעינת הקמפיינים:", err);
      setCampaigns([]);
    }
  };
  fetchData();
}, []);


const filtered = (Array.isArray(campaigns) ? campaigns : [])
  .filter((c) => c.title?.toLowerCase().includes(query.toLowerCase()))
  .sort((a, b) =>
    sortBy === "title" ? a.title.localeCompare(b.title) : b.raised - a.raised
  );


  return (
    <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* כותרת */}
      <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#374151" }}>רשימת קמפיינים</h1>

      {/* חיפוש + מיון */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* מיון */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "8px",
          }}
        >
          <option value="title">מיין לפי שם</option>
          <option value="raised">מיין לפי סכום שגויס</option>
        </select>

        {/* חיפוש */}
        <input
          type="text"
          placeholder="חיפוש..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "8px",
          }}
        />

        {/* כפתורי תצוגה */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setView("list")}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: view === "list" ? "#e5e7eb" : "white",
              cursor: "pointer",
            }}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setView("grid")}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: view === "grid" ? "#e5e7eb" : "white",
              cursor: "pointer",
            }}
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {/* תצוגת קמפיינים */}
      {view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {filtered.map((c) => {
            const percent = Math.min((c.raised / c.goal) * 100, 100);

            return (
              <Link
                to={`/campaign/${c.id}`}
                key={c.id}
                style={{
                  display: "block",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={c.image}
                  alt={c.title}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={c.ngoLogo}
                      alt="ngo logo"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        borderRadius: "50%",
                      }}
                    />
                    <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>{c.title}</h2>
                  </div>
                  <p style={{ fontSize: "14px", color: "#4b5563" }}>
                    {c.raised.toLocaleString()} ₪ מתוך {c.goal.toLocaleString()} ₪
                  </p>

                  {/* פס התקדמות */}
                  <div style={{ width: "100%", background: "#e5e7eb", borderRadius: "10px", height: "12px" }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "12px",
                        background: "#22c55e",
                        borderRadius: "10px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((c) => {
            const percent = Math.min((c.raised / c.goal) * 100, 100);

            return (
              <Link
                to={`/campaign/${c.id}`}
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={c.image}
                  alt={c.title}
                  style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>{c.title}</h2>
                  <p style={{ fontSize: "14px", color: "#4b5563" }}>
                    {c.raised.toLocaleString()} ₪ מתוך {c.goal.toLocaleString()} ₪
                  </p>
                  <div style={{ width: "100%", background: "#e5e7eb", borderRadius: "10px", height: "12px" }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "12px",
                        background: "#22c55e",
                        borderRadius: "10px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
