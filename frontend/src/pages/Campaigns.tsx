
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
  const [showActiveOnly, setShowActiveOnly] = useState(true);
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
    raised: (a, b) => b.totalRaised! - a.totalRaised!,
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

  const filtered = useMemo(() => {
    const now = new Date();

    // בדיקה האם הסתיים
    const isEnded = (c: Campaign) =>
      c.endDate ? new Date(c.endDate) < now : false;

    // חיפוש
    let result = (Array.isArray(campaigns) ? campaigns : []).filter((c) =>
      queryTag.has("tag")
        ? c.tags.includes(queryTag.get("tag")!)
        : c.title?.toLowerCase().includes(query.toLowerCase())
    );

    //  סינון פעילים בלבד אם המשתמש בחר
    if (showActiveOnly) {
      result = result.filter((c) => !isEnded(c));
    }

    //  מיון כך שפעילים למעלה והסתיימים למטה
    result = result.sort((a, b) => {
      const aEnded = isEnded(a);
      const bEnded = isEnded(b);
      if (aEnded !== bEnded) return aEnded ? 1 : -1; // פעילים קודם
      return sortMap[sortBy](a, b);
    });

    return result;
  }, [campaigns, query, sortBy, showActiveOnly]);

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

          {/**/}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
            הצג רק פעילים
          </label>
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
