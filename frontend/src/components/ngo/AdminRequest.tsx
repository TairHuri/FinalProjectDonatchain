import {  useState } from "react";
import NewRequest from "./NewRequest";
import LastRequest from "./LastRequest";

import "../../css/ngo/AdminRequest.css";

export default function AdmninRequest() {

  const [activeTab, setActiveTab] = useState<"new" | "list">("list");
  return (
    <div className="rq-card" dir="rtl">
      <header className="rq-header">
        <h2 className="rq-title">בקשות למערכת</h2>
        <nav className="rq-tabs">
          <button
            className={`rq-tab ${activeTab === "new" ? "is-active" : ""}`}
            onClick={() => setActiveTab("new")}
            type="button"
          >
            בקשה חדשה
          </button>
          <button
            className={`rq-tab ${activeTab === "list" ? "is-active" : ""}`}
            onClick={() => setActiveTab("list")}
            type="button"
          >
            בקשות אחרונות
          </button>
        </nav>
      </header>

      {activeTab === "new" ? (
        <NewRequest setActiveTab={setActiveTab}/>
      ) : (
        // רשימת בקשות (דמו חזותי)
        <LastRequest />
      )}
    </div>
  );
}
