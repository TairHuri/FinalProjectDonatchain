import { useEffect, useMemo, useState } from "react";
import { getRequestsByNgoId } from "../../services/requestApi";
import { useAuth } from "../../contexts/AuthContext";
import {
  categoryLabel,
  statusLabel,
  type IAdminRequestByUser,
  type RequestCategoryType,
  type RequestStatusType,
} from "../../models/Request";
import "../../css/ngo/AdminRequest.css";

// Helper function to format ISO date to readable HH:MM DD/MM format
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });

export default function LastRequest() {
  const { user } = useAuth();
  const [rows, setRows] = useState<IAdminRequestByUser[]>([]);// Fetched requests
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer visibility
  const [active, setActive] = useState<IAdminRequestByUser | null>(null); // Selected request for detailed view

  // ---- NEW: filters ----
  const [statusFilter, setStatusFilter] = useState<"" | RequestStatusType>("");// Filter by status
  const [categoryFilter, setCategoryFilter] = useState<"" | RequestCategoryType>("");// Filter by category
  const [query, setQuery] = useState(""); // Filter by text search

   // Fetch all requests for the logged NGO user once on mount
  useEffect(() => {
    if (!user || !user.token) return;
    getRequestsByNgoId(user.ngoId, user.token).then((data) => setRows(data));
  }, []);

  // Open drawer with selected request details
  const openDrawer = (req: IAdminRequestByUser) => {
    setActive(req);
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setActive(null);
  };

 // Extract available categories dynamically from fetched data
  const categoryOptions = useMemo(() => {
    const set = new Set<RequestCategoryType>();
    rows.forEach((r) => set.add(r.category));
    return Array.from(set);
  }, [rows]);

    // Extract available statuses dynamically from fetched data
  const statusOptions = useMemo(() => {
    const set = new Set<RequestStatusType>();
    rows.forEach((r) => set.add(r.status));
    return Array.from(set);
  }, [rows]);

// Client-side filtering logic for requests list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const okStatus = !statusFilter || r.status === statusFilter;
      const okCat = !categoryFilter || r.category === categoryFilter;
      const okQuery =
        !q ||
        r.subject.toLowerCase().includes(q) ||
        r.requester.name.toLowerCase().includes(q) ||
        r.requester.email.toLowerCase().includes(q);
      return okStatus && okCat && okQuery;
    });
  }, [rows, query, statusFilter, categoryFilter]);

  return (
    <>
      <section className="rq-section" dir="rtl">
        <h3 className="rq-section-title">בקשות אחרונות</h3>

        {/* ===== NEW: Filters bar ===== */}
        <div className="rq-filters">
          <input
            className="rq-input"
            placeholder="חיפוש לפי נושא / שם / אימייל…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="חיפוש"
          />

          <select
            className="rq-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatusType | "")}
            aria-label="סינון לפי סטטוס"
          >
            <option value="">סטטוס: הכל</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </select>

          <select
            className="rq-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as RequestCategoryType | "")}
            aria-label="סינון לפי קטגוריה"
          >
            <option value="">קטגוריה: הכל</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {categoryLabel[c]}
              </option>
            ))}
          </select>

          {(statusFilter || categoryFilter || query) && (
            <button
              type="button"
              className="rq-btn rq-btn-clear"
              onClick={() => {
                setQuery("");
                setStatusFilter("");
                setCategoryFilter("");
              }}
            >
              נקה סינון
            </button>
          )}
        </div>

        {/* ===== List ===== */}
        <ul className="rq-list">
          {filtered.map((r) => (
            <li key={r._id} className="rq-item">
              <button
                type="button"
                className="rq-item-main rq-linklike"
                onClick={() => openDrawer(r)}
                aria-label={`פתח בקשה: ${r.subject}`}
              >
                <div className="rq-item-title">{r.subject}</div>
                <div className="rq-item-sub">
                  {categoryLabel[r.category]} • {new Date(r.createdAt).toLocaleDateString("he-IL")}
                </div>
              </button>

              <span className={`rq-badge rq-badge--${r.status}`}>
                {statusLabel[r.status]}
              </span>
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="rq-empty">אין תוצאות תואמות</li>
          )}
        </ul>
      </section>

       {/* ===== Read-Only Drawer Request View ===== */}
      <div
        className={`rq-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="פירוט בקשה"
        dir="rtl"
      >
        <div className="rq-drawer-header">
          <div className="rq-drawer-title">
            <div className="rq-drawer-subject">{active?.subject}</div>
            {active && (
              <span className={`rq-badge rq-badge--${active.status}`}>
                {statusLabel[active.status]}
              </span>
            )}
          </div>
          <button className="rq-close" onClick={closeDrawer} aria-label="סגירה">
            ✕
          </button>
        </div>

        {active && (
          <>
            <div className="rq-drawer-body">
              <div className="rq-drawer-row">
                <div>
                  <strong>קטגוריה:</strong> {categoryLabel[active.category]}
                </div>
                <div>
                  <strong>תאריך:</strong> {formatDate(active.createdAt)}
                </div>
              </div>

              <label className="rq-label">תוכן הבקשה</label>
              <pre className="rq-body">{active.body}</pre>

              {active.status === "done" && (
                <>
                  <label className="rq-label">הודעת מנהל</label>
                  <div className="rq-note">{active.adminComment}</div>
                </>
              )}
            </div>

            <div className="rq-drawer-footer">
              <button className="rq-btn" onClick={closeDrawer}>
                סגירה
              </button>
            </div>
          </>
        )}
      </div>

      {drawerOpen && <div className="rq-overlay" onClick={closeDrawer} aria-hidden />}
    </>
  );
}
