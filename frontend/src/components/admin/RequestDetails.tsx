import { useEffect, useState } from "react";
import { categoryLabel, type IAdminRequestByUser, type RequestStatusType, statusLabel } from "../../models/Request";

// Formats ISO date into a readable local date and time string
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });

type RequestDetailsType = {
  request: IAdminRequestByUser | null;                         // Selected request data to display in the drawer
  changeStatus: (id: string[], status: RequestStatusType, adminComment: string) => void; // Callback for updating request status
  drawerOpen: boolean;                                         // Sidebar open/close state
  setDrawerOpen: (b: boolean) => void;                         // Setter to control drawer visibility
};

const RequestDetails = ({ drawerOpen, setDrawerOpen, request, changeStatus }: RequestDetailsType) => {
  // Stores the currently selected status for update
  const [selectedStatus, setSelectedStatus] = useState<RequestStatusType>("pending");

  // Stores the admin comment that may be added to the request
  const [adminComment, setAdminComment] = useState("");

  // Load status and comment when drawer opens or request changes
  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
      setAdminComment(request.adminComment || "");
    }
  }, [request, drawerOpen]);

  // Show comment field only when status becomes "done"
  const showNote = selectedStatus === "done";

  // Defines valid state transitions for the request lifecycle
  const statusRules: Record<RequestStatusType, RequestStatusType[]> = {
    pending: ["inprogress", "done"],
    inprogress: ["done"],
    done: []
  };

  // Update the request (only if an ID exists) and close the drawer afterward
  const onUpdate = () => {
    if (!request?._id) return;
    changeStatus([request._id], selectedStatus, adminComment);
    // If additional API call for saving notes is needed, it can be added here
    setDrawerOpen(false);
  };

  return (
    <div
      className={`ar-drawer ${drawerOpen ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="פירוט בקשה"
      dir="rtl"
    >
      {/* Drawer header showing subject, status, and close button */}
      <div className="ar-drawer-header sticky-top">
        <div className="ar-drawer-title">
          <div className="ar-drawer-subject">{request?.subject}</div>
          {request && (
            <span className={`ar-badge ar-badge--${request.status}`}>
              {statusLabel[request.status]}
            </span>
          )}
        </div>
        <button className="ar-close" onClick={() => setDrawerOpen(false)} aria-label="Close Drawer">
          ✕
        </button>
      </div>

      {/* Drawer body only appears once a request is loaded */}
      {request && (
        <>
          <div className="ar-drawer-body">

            {/* Request metadata section (requester, NGO, date, category) */}
            <div className="ar-drawer-row">
              <div><strong>קטגוריה:</strong> {categoryLabel[request.category]}</div>
              <div><strong>עמותה:</strong> {request.ngo.name} {request.ngo.ngoNumber}</div>
              <div><strong>פונה:</strong> {request.requester.name} ({request.requester.email})</div>
              <div><strong>תאריך:</strong> {formatDate(request.createdAt)}</div>
            </div>

            {/* Request content (full body text) */}
            <label className="ar-label">תוכן הבקשה</label>
            <pre className="ar-body">{request.body}</pre>

            {/* Status update radio buttons */}
            <label className="ar-label">עדכון סטטוס הבקשה</label>
            <div className="ar-status-group" role="radiogroup" aria-label="Update Request Status">
              {/* Pending option */}
              <label className="ar-radio">
                <input
                  type="radio"
                  name="rq-status"
                  value="pending"
                  checked={selectedStatus === "pending"}
                  disabled={!statusRules[selectedStatus].includes("pending")}
                  onChange={() => setSelectedStatus("pending")}
                />
                <span className="ar-radio-chip ar-badge ar-badge--pending">בהמתנה</span>
              </label>

              {/* In Progress option */}
              <label className="ar-radio">
                <input
                  type="radio"
                  name="rq-status"
                  value="inprogress"
                  checked={selectedStatus === "inprogress"}
                  disabled={!statusRules[selectedStatus].includes("inprogress")}
                  onChange={() => setSelectedStatus("inprogress")}
                />
                <span className="ar-radio-chip ar-badge ar-badge--inprogress">בטיפול</span>
              </label>

              {/* Done option */}
              <label className="ar-radio">
                <input
                  type="radio"
                  name="rq-status"
                  value="done"
                  checked={selectedStatus === "done"}
                  disabled={!statusRules[selectedStatus].includes("done")}
                  onChange={() => setSelectedStatus("done")}
                />
                <span className="ar-radio-chip ar-badge ar-badge--done">סגור בקשה</span>
              </label>
            </div>

            {/* Optional admin note (shown only when closing request) */}
            <div
              className="ar-collapsible"
              data-open={showNote ? "true" : "false"}
              aria-hidden={!showNote}
            >
              <label className="ar-label">הוספת הערת מנהל (אופציונלי)</label>
              <textarea
                className="ar-textarea"
                rows={3}
                placeholder="סיכום טיפול / קישור לטיקט / פרטים רלוונטיים…"
                value={adminComment}
                disabled={request.status === "done"}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>
          </div>

          {/* Drawer footer with buttons: cancel and update */}
          <div className="ar-drawer-footer">
            <button className="ar-btn" onClick={() => setDrawerOpen(false)}>בטל</button>
            {request.status !== "done" && (
              <button className="ar-btn primary" onClick={onUpdate}>
                עדכן בקשה
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RequestDetails;
