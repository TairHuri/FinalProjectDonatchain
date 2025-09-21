import { useState } from "react";
import { Grid, List } from "lucide-react"; // אייקונים

interface Ngo {
  id: number;
  name: string;
  category: string;
  city: string;
  logo: string;
}

const ngos: Ngo[] = [
  { id: 1, name: "יד עזרא ושולמית", category: "רווחה", city: "ירושלים", logo: "/ezra.png" },
  { id: 2, name: "טנא ירושלמי", category: "חינוך", city: "ירושלים", logo: "/tene.png" },
  { id: 3, name: "עמותת ישיבת קרית שמונה", category: "חינוך", city: "קרית שמונה", logo: "/kiryatshmona.png" },
  { id: 4, name: "עמותת פעמונים", category: "חברה וקהילה", city: "פתח תקווה", logo: "/paamonim.png" },
  { id: 5, name: "עלה", category: "ילדים ונוער", city: "בני ברק", logo: "/aleh.png" },
];

export default function DonorsNgo() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [view, setView] = useState<"grid" | "list">("grid"); // מצב תצוגה

  const filteredNgos = ngos
    .filter((ngo) => ngo.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "name" ? a.name.localeCompare(b.name) : a.city.localeCompare(b.city)
    );

  return (
    <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* כותרת */}
      <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#374151" }}>רשימת עמותות</h1>

      {/* חיפוש + מיון */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "8px",
          }}
        >
          <option value="name">מיין לפי שם</option>
          <option value="city">מיין לפי עיר</option>
        </select>

        <input
          type="text"
          placeholder="חיפוש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      {/* רשימת עמותות */}
      {view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 בעמודה
            gap: "20px",
          }}
        >
          {filteredNgos.map((ngo) => (
            <div
              key={ngo.id}
              style={{
                background: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <img
                src={ngo.logo}
                alt={ngo.name}
                style={{ height: "80px", objectFit: "contain", marginBottom: "12px" }}
              />
              <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>{ngo.name}</h2>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>{ngo.category}</p>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>📍 {ngo.city}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredNgos.map((ngo) => (
            <div
              key={ngo.id}
              style={{
                background: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src={ngo.logo}
                alt={ngo.name}
                style={{ height: "64px", width: "64px", objectFit: "contain" }}
              />
              <div>
                <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>{ngo.name}</h2>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>{ngo.category}</p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>📍 {ngo.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
