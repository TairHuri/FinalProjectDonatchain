// import { useEffect, useState } from "react";
// import { Grid, List } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { getCampaigns } from "../services/api";
// import CampaignItem from "../components/CampaignItem";

// import '../css/Campaigns.css'
// import type { Campaign } from "../models/Campaign";


// type SortByType = "title"|"raised"|"goalLowToHigh"|"goalHighToLow"|"creationDateOldToNew" | "creationDateNewToOld" | "endDateOldToNew" | "endDateNewToOld";
// export default function Campaigns() {
//   const [campaigns, setCampaigns] = useState<any[]>([]);
//   const [query, setQuery] = useState("");
//   const [sortBy, setSortBy] = useState<SortByType>("title");
//   const [view, setView] = useState<"grid" | "list">("grid");
//   const params = useParams();
//   const fetchData = async () => {
//     try {
//       const data = await getCampaigns();
//       console.log("🔍 נתונים שחזרו מה־API:", data);

//       // תמיד נוודא שמה ששמים זה מערך
//       if (data && Array.isArray(data.campaigns)) {
//         setCampaigns(data.campaigns);
//       } else if (data && Array.isArray(data.items)) {
//         setCampaigns(data.items);
//       }
//     } catch (err) {
//       console.error("שגיאה בטעינת הקמפיינים:", err);
//       setCampaigns([]);
//     }
//   };
//   const loadNgoCampaigns = async (ngoId: string) => {
//     const data = await getCampaigns(ngoId);
//     setCampaigns(data.items)
//   }
//   useEffect(() => {
//     if (params.ngoId) {
//       loadNgoCampaigns(params.ngoId)
//     } else {
//       fetchData();
//     }
//   }, [params]);
//   const sortMap:Record<SortByType, (a:Campaign, b:Campaign) =>number>= {
//     title: (a:Campaign, b:Campaign)=>a.title.localeCompare(b.title),
//     raised:(a:Campaign, b:Campaign)=>b.raised - a.raised,
//     goalLowToHigh:(a:Campaign, b:Campaign)=> a.goal - b.goal,
//     goalHighToLow:(a:Campaign, b:Campaign)=> b.goal - a.goal,
//     creationDateOldToNew:(a:Campaign, b:Campaign)=> (b.createdAt||"").toString().localeCompare((a.createdAt||"").toString()),
//     creationDateNewToOld:(a:Campaign, b:Campaign)=> (a.createdAt||"").toString().localeCompare((b.createdAt||"").toString()),
//     endDateOldToNew:(a:Campaign, b:Campaign)=> (b.endDate||"").toString().localeCompare((a.endDate||"").toString()),
//     endDateNewToOld:(a:Campaign, b:Campaign)=> (a.endDate||"").toString().localeCompare((b.endDate||"").toString()),
    
//   }
  
//   const filtered = (Array.isArray(campaigns) ? campaigns : [])
//     .filter((c) => c.title?.toLowerCase().includes(query.toLowerCase()))
//     .sort((a, b) =>sortMap[sortBy](a,b));


//   return (
//     <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//       {/* כותרת */}
//       <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#374151" }}>רשימת קמפיינים</h1>

//       {/* חיפוש + מיון */}
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         {/* מיון */}
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value as SortByType)}
//           style={{
//             border: "1px solid #d1d5db",
//             borderRadius: "8px",
//             padding: "8px",
//           }}
//         >
//           <option value="title">מיין לפי שם</option>
//           <option value="raised">מיין לפי סכום שגויס</option>
//           <option value="goalLowToHigh">מיין לפי יעד - נמוך לגבוה</option>
//           <option value="goalHighToLow">מיין לפי יעד - גבוה לנמוך</option>
//           <option value="creationDateOldToNew">מיין לפי תאריך יצירה מהישן לחדש</option>
//           <option value="creationDateNewToOld">מיין לפי יצירה מהחדש לישן</option>
//           <option value="endDateOldToNew">מיין לפי תאריך סיום - מהישן לחדש</option>
//           <option value="endDateNewToOld">מיין לפי תאריך סיום - מהחדש לישן</option>
//         </select>

//         {/* חיפוש */}
//         <input
//           type="text"
//           placeholder="חיפוש..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           style={{
//             flex: 1,
//             border: "1px solid #d1d5db",
//             borderRadius: "8px",
//             padding: "8px",
//           }}
//         />

//         {/* כפתורי תצוגה */}
//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             onClick={() => setView("list")}
//             style={{
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #d1d5db",
//               background: view === "list" ? "#e5e7eb" : "white",
//               cursor: "pointer",
//             }}
//           >
//             <List size={20} />
//           </button>
//           <button
//             onClick={() => setView("grid")}
//             style={{
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #d1d5db",
//               background: view === "grid" ? "#e5e7eb" : "white",
//               cursor: "pointer",
//             }}
//           >
//             <Grid size={20} />
//           </button>
//         </div>
//       </div>

//       {/* תצוגת קמפיינים */}

//       <div className={view == 'grid' ? 'items-container_grid' : 'items-container_flex'}>
//         {filtered.map((c) => {
//           return (
//             <Link
//               to={`/campaign/${c._id}`}
//               key={c._id}
//               className={view == 'grid' ? 'item-link_grid' : 'item-link_flex'}
//             >
//               <CampaignItem c={c} view={view} />
//             </Link>
//           )
//         })}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useMemo } from "react";
import { Grid, List, Search } from "lucide-react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getCampaigns } from "../services/api";
import CampaignItem from "../components/CampaignItem";
import type { Campaign } from "../models/Campaign";
import "../css/Campaigns.css";

type SortByType =
  | "title"
  | "raised"
  | "goalLowToHigh"
  | "goalHighToLow"
  | "creationDateOldToNew"
  | "creationDateNewToOld"
  | "endDateOldToNew"
  | "endDateNewToOld";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortByType>("title");
  const [view, setView] = useState<"grid" | "list">("grid");
  const params = useParams();
  const [queryTag, setQueryTag] = useSearchParams();


  const fetchData = async () => {
    try {
      const data = await getCampaigns();
      if (data && Array.isArray(data.campaigns)) setCampaigns(data.campaigns);
      else if (data && Array.isArray(data.items)) setCampaigns(data.items);
      else setCampaigns([]);
    } catch {
      setCampaigns([]);
    }
  };

  const loadNgoCampaigns = async (ngoId: string) => {
    const data = await getCampaigns(ngoId);
    setCampaigns(Array.isArray(data?.items) ? data.items : []);
  };

  useEffect(() => {
    if (params.ngoId) loadNgoCampaigns(params.ngoId);
    else fetchData();
  }, [params]);

  const sortMap: Record<SortByType, (a: Campaign, b: Campaign) => number> = {
    title: (a, b) => a.title.localeCompare(b.title),
    raised: (a, b) => b.raised - a.raised,
    goalLowToHigh: (a, b) => a.goal - b.goal,
    goalHighToLow: (a, b) => b.goal - a.goal,
    creationDateOldToNew: (a, b) =>
      (b.createdAt || "").toString().localeCompare((a.createdAt || "").toString()),
    creationDateNewToOld: (a, b) =>
      (a.createdAt || "").toString().localeCompare((b.createdAt || "").toString()),
    endDateOldToNew: (a, b) =>
      (b.endDate || "").toString().localeCompare((a.endDate || "").toString()),
    endDateNewToOld: (a, b) =>
      (a.endDate || "").toString().localeCompare((b.endDate || "").toString()),
    
  };

  const filtered = useMemo(
    () =>
      (Array.isArray(campaigns) ? campaigns : [])
        .filter((c) => queryTag.has("tag")? c.tags.includes( queryTag.get("tag")!) : c.title?.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => sortMap[sortBy](a, b)),
    [campaigns, query, sortBy]
  );

  return (
    <div className="camps-page" dir="rtl">
      {/* Header */}
      <header className="camps-header">
        <div className="camps-title-wrap">
          <h1 className="camps-title">רשימת קמפיינים</h1>
          <span className="camps-count">{filtered.length} קמפיינים</span>
        </div>

        {/* Filters Bar */}
        <div className="camps-filters">
          <div className="camps-input-wrap">
            <Search size={18} />
            <input
              type="text"
              className="camps-input"
              placeholder="חיפוש לפי שם קמפיין…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="חיפוש"
            />
          </div>

          <select
            className="camps-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortByType)}
            aria-label="מיון"
          >
            <option value="title">שם (א׳→ת׳)</option>
            <option value="raised">סכום שגויס (גבוה→נמוך)</option>
            <option value="goalLowToHigh">יעד (נמוך→גבוה)</option>
            <option value="goalHighToLow">יעד (גבוה→נמוך)</option>
            <option value="creationDateNewToOld">יצירה (חדש→ישן)</option>
            <option value="creationDateOldToNew">יצירה (ישן→חדש)</option>
            <option value="endDateNewToOld">סיום (חדש→ישן)</option>
            <option value="endDateOldToNew">סיום (ישן→חדש)</option>
          </select>

          <div className="camps-view">
            <button
              type="button"
              className={`view-btn ${view === "list" ? "is-active" : ""}`}
              onClick={() => setView("list")}
              aria-label="תצוגת רשימה"
            >
              <List size={18} />
            </button>
            <button
              type="button"
              className={`view-btn ${view === "grid" ? "is-active" : ""}`}
              onClick={() => setView("grid")}
              aria-label="תצוגת גריד"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="camps-empty">
          לא נמצאו קמפיינים תואמים. נסו לשנות את החיפוש או המיון.
        </div>
      ) : (
        <div className={view === "grid" ? "items-container_grid" : "items-container_flex"}>
          {filtered.map((c) => (
            <Link
              to={`/campaign/${c._id}`}
              key={c._id}
              className={view === "grid" ? "item-link_grid" : "item-link_flex"}
            >
              <CampaignItem c={c} view={view} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
