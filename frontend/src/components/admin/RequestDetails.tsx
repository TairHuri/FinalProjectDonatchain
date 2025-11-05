
import { useEffect, useState } from "react";
import { categoryLabel, type IAdminRequestByUser, type RequestStatusType, statusLabel } from "../../models/Request";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });

type RequestDetailsType = {
  request: IAdminRequestByUser | null;
  changeStatus: (id: string[], status: RequestStatusType, adminComment:string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (b: boolean) => void;
};

const RequestDetails = ({ drawerOpen, setDrawerOpen, request, changeStatus }: RequestDetailsType) => {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatusType>("pending");
  const [adminComment, setAdminComment] = useState("");

  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
      setAdminComment(request.adminComment||"");
    }
  }, [request, drawerOpen]);

  const showNote = selectedStatus === "done";

  const statusRules :Record<RequestStatusType, RequestStatusType[]> = {
    pending:['inprogress', 'done'],
    inprogress:['done'],
    done:[]
  }

  const onUpdate = () => {
    if (!request?._id) return;
    changeStatus([request._id], selectedStatus, adminComment);
    // אם תרצי לשמור גם את ההערה - קראי כאן ל-API נוסף
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

      <div className="ar-drawer-header sticky-top">
        <div className="ar-drawer-title">
          <div className="ar-drawer-subject">{request?.subject}</div>
          {request && (
            <span className={`ar-badge ar-badge--${request.status}`}>
              {statusLabel[request.status]}
            </span>
          )}
        </div>
        <button className="ar-close" onClick={() => setDrawerOpen(false)} aria-label="סגירה">
          ✕
        </button>
      </div>

      {request && (
        <>

          <div className="ar-drawer-body">

            <div className="ar-drawer-row">
              <div><strong>קטגוריה:</strong> {categoryLabel[request.category]}</div>
              <div><strong>עמותה:</strong> {request.ngo.name} {request.ngo.ngoNumber}</div>
              <div><strong>פונה:</strong> {request.requester.name} ({request.requester.email})</div>
              <div><strong>תאריך:</strong> {formatDate(request.createdAt)}</div>
            </div>

            {/* גוף בקשה */}
            <label className="ar-label">תוכן הבקשה</label>
            <pre className="ar-body">{request.body}</pre>

            {/* עדכון סטטוס (לפני ההערה) */}
            <label className="ar-label">עדכון סטטוס הבקשה</label>
            <div className="ar-status-group" role="radiogroup" aria-label="עדכון סטטוס">
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
                disabled={request.status==='done'}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>
          </div>


          <div className="ar-drawer-footer">
            <button className="ar-btn" onClick={() => setDrawerOpen(false)}>בטל</button>
            {request.status !== 'done' && <button 
              className="ar-btn primary" 
              onClick={onUpdate} 
              >עדכן בקשה</button>}
          </div>
        </>
      )}
    </div>
  );
};

export default RequestDetails;

