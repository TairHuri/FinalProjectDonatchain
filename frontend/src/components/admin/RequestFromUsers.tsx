import { useEffect, useMemo, useState } from "react";

import RequestDetails from "./RequestDetails";
import { categoryLabel, statusLabel, type IAdminRequestByUser, type RequestCategoryType, type RequestStatusType } from "../../models/Request";
import { getRequests, updateRequest } from "../../services/requestApi";
import { useAuth } from "../../contexts/AuthContext";

import "../../css/admin/RequestFromUsers.css";

export default function RequestFromUsers() {
  // Current logged-in admin (includes access token for API requests)
  const { user } = useAuth();

  // Table rows (request list returned from server)
  const [rows, setRows] = useState<IAdminRequestByUser[]>([]);

  // Search/Filter controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | RequestStatusType>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Selected rows for bulk actions (stores request IDs)
  const [selected, setSelected] = useState<string[]>([]);

  // Drawer state and currently opened request
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<IAdminRequestByUser | null>(null);

  /**
   * Fetches all requests when component mounts and only when a user is present.
   * Protects API access using the user's token.
   */ 
  useEffect(() => {
    if(!user || !user.token)return ;
    getRequests(true, user.token).then(requests => setRows(requests));
  }, [])

    /**
   * Computes filtered results based on search text, category and status.
   * useMemo ensures recalculation only when dependencies change.
   * Improves performance on large datasets and avoids unnecessary re-renders.
   */
  const filtered = useMemo(() => {
    return rows.filter(r => {
      const okStatus = !statusFilter || r.status === statusFilter;
      const okCat = !categoryFilter || r.category === categoryFilter;
      const q = search.trim().toLowerCase();
      const okSearch =
        !q ||
        r.subject.toLowerCase().includes(q) ||
        r.requester.name.toLowerCase().includes(q) ||
        r.requester.email.toLowerCase().includes(q);
      return  okStatus && okCat && okSearch;
    });
  }, [rows, search, statusFilter, categoryFilter]);

   // Determines whether all visible rows are selected
  const allChecked = filtered.length > 0 && filtered.every(r => selected.includes(r._id));
 
 // Toggle select/deselect all filtered rows
  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(filtered.map(r => r._id));
  };

  // Toggle selection for a single row
  const toggleOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

    /**
   * Opens request details drawer and sets the active row.
   * Using `stopPropagation()` on table prevents row-click conflicts.
   */
  const openDrawer = (row: IAdminRequestByUser) => {
    setActive(row);
    setDrawerOpen(true);
  };

    /**
   * Updates request locally and sends changes to server.
   * Also removes updated rows from bulk selection to prevent duplicate actions.
   */
  const changeStatus = (ids: string[], status: RequestStatusType, adminComment:string) => {
    setRows(prev => prev.map(request => ids.includes(request._id) ? { ...request, status, adminComment } : request));
    console.log(active, active && ids.includes(active._id));
    
    // If currently opened request was updated, sync it as well
    if (active && ids.includes(active._id)) {
      setActive({ ...active, status, adminComment });
      console.log('updateRequestOnServer', { ...active, status, adminComment });
      
      updateRequestOnServer({ ...active, status, adminComment })
    }
    // Remove from selection after update
    setSelected(prev => prev.filter(id => !ids.includes(id))); 
  };

  
  /**
   * Persists the request update to the database.
   * This is separated from the UI update for cleaner logic and better testability.
   */
  const updateRequestOnServer = async(request: IAdminRequestByUser) => {
    if(!user || !user.token)return;

    await updateRequest(request._id, request, user?.token)
  }

  // Bulk actions to update multiple requests at once
  const bulkClose = () => changeStatus(selected, "done", '');
  const bulkProgress = () => changeStatus(selected, "inprogress", '');
  const bulkPending = () => changeStatus(selected, "pending", '');

   // Utility for formatted timestamps (consistent UI formatting)
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });

  return (
    <div dir="rtl" role="region">
     {/* Section Title */}
      <div>
        <h2 style={{ color: "#059669", fontFamily: 'calibri', fontSize: "28px", fontWeight: "bolder", marginBottom: "16px" }}>ניהול בקשות</h2>
      </div>

      {/* Filters */}
      <section className="ar-filters">
        <input
          className="ar-input"
          placeholder="חיפוש לפי נושא / פונה / אימייל…"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
        <select
          className="ar-input"
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value as RequestStatusType | "")}
          aria-label="סינון לפי סטטוס"
        >
          <option value="">סטטוס: הכל</option>
          {
            Object.keys(statusLabel).map( (status) => <option key={status} value={status}>{statusLabel[status as RequestStatusType]}</option>)
          }
        </select>
        <select
          className="ar-input"
          value={categoryFilter}
          onChange={(e)=>setCategoryFilter(e.target.value)}
          aria-label="סינון לפי קטגוריה"
        >
          <option value="">קטגוריה: הכל</option>
          {Object.keys(categoryLabel).map(c => <option key={c} value={c}>{categoryLabel[c as RequestCategoryType]}</option>)}
        </select>
      </section>

      {/* Bulk Selection Actions */}
      <section className="ar-bulk">
        <div className="ar-bulk-left">
          <label className="ar-check">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              aria-label="בחר הכל"
            />
            <span>בחר הכל</span>
          </label>
          {selected.length>0 && <span className="ar-selected-count">{selected.length} נבחרו</span>}
        </div>
        {selected.length > 0 && <div className="ar-bulk-right">
          <button className="ar-btn" disabled={!selected.length} onClick={bulkPending}>סמן כ־בהמתנה</button>
          <button className="ar-btn" disabled={!selected.length} onClick={bulkProgress}>סמן כ־בטיפול</button>
          <button className="ar-btn danger" disabled={!selected.length} onClick={bulkClose}>סגור נבחרים</button>
        </div>}
      </section>

      {/* Table / List */}
      <div className="ar-table-wrap">
        <table className="ar-table">
          <thead>
            <tr>
              <th style={{width: 40}}>
                
              </th>
              <th>נושא</th>
              <th className="hide-sm">קטגוריה</th>
              <th>סטטוס</th>
              <th className="hide-md">עמותה</th>
              <th className="hide-md">פונה</th>
              <th className="hide-md">תאריך</th>
              <th style={{width: 110}}>פרטים</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(request=>(
              <tr key={request._id} >
                <td onClick={(e)=>e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(request._id)}
                    onChange={()=>toggleOne(request._id)}
                    aria-label={`בחר בקשה ${request._id}`}
                  />
                </td>
                <td>
                  <div className="ar-subject">{request.subject}</div>
                </td>
                <td className="hide-sm">{categoryLabel[request.category]}</td>
                <td>
                  <span className={`ar-badge ar-badge--${request.status}`}>{statusLabel[request.status]}</span>
                </td>
                
                <td className="hide-md">{request.ngo.name}</td>
                <td className="hide-md">{request.requester.name}</td>
                <td className="hide-md">{formatDate(request.createdAt)}</td>
                <td onClick={(e)=>e.stopPropagation()}>
                  <div className="ar-row-actions">
                    <button className="ar-btn tiny" onClick={()=>openDrawer(request)}>פרטים</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr>
                <td colSpan={8} style={{textAlign:"center", color:"#6b7a76", padding:"1rem"}}>אין תוצאות תואמות</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <RequestDetails request={active} changeStatus={changeStatus} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>

       {/* Background overlay when drawer is open */}
      {drawerOpen && <div className="ar-overlay" onClick={()=>setDrawerOpen(false)} aria-hidden />}
    </div>
  );
}
