import { useState } from "react";
import NewRequest from "./NewRequest";
import LastRequest from "./LastRequest";

import "../../css/ngo/AdminRequest.css";

export default function AdmninRequest() {

  // State for controlling which tab is active: "new" request form or "list" of requests
  const [activeTab, setActiveTab] = useState<"new" | "list">("list");

  return (
    <div className="rq-card" dir="rtl">
      
      {/* Page header with title and navigation tabs */}
      <header className="rq-header">
        <h2 className="rq-title">בקשות למערכת</h2>

        {/* Tab navigation buttons */}
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

      {/* Conditionally render: form for new request or list of existing requests */}
      {activeTab === "new" ? (
        <NewRequest setActiveTab={setActiveTab}/>
      ) : (
        // List of recent requests (visual demo inside LastRequest component)
        <LastRequest />
      )}
    </div>
  );
}
