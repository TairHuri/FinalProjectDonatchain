// import { useState } from "react";
// import { getCampaignReport } from "../../services/campaignApi";
// import { primaryBtnStyle } from "../../css/dashboardStyles";



// const ReportDialog = ({token, campaignId,close }: {token:string, campaignId: string, close: () => void }) => {
//   const [options, setOptions] = useState({ includeDonations: false, includeComments: false });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     if (name == 'includeComments') {
//       if (checked && !options.includeDonations) {
//         return;
//       }
//     } else if (name == 'includeDonations' && !checked) {
//       setOptions({ includeDonations: false, includeComments: false })
//     } else {
//       setOptions({ ...options, [name]: checked })
//     }
//   }
//   const handleClick = () => {
//     getCampaignReport(token, campaignId, options.includeDonations?'1':'0', options.includeComments?'1':'0');
//     close();
//   }
//   return (
//     <div>
//       <label style={{ fontWeight: 700 }}>כלול תרומות:</label>
//       <input type='checkbox' name='includeDonations' style={{ ...primaryBtnStyle }} onChange={handleChange} />
//       <label style={{ fontWeight: 700 }}>כלול הערות תורמים:</label>
//       <input type='checkbox' name='includeComments' style={{ ...primaryBtnStyle }} onChange={handleChange} />
//       <div>
//       <button style={{ ...primaryBtnStyle }} onClick={handleClick}>
//         יצירת דו״ח
//       </button>
//       <button style={{ ...primaryBtnStyle }} onClick={handleClick}>
//        ביטול
//       </button>
//       </div>
//     </div>
//   )
// }

// export default ReportDialog;

import { useState } from "react";
import "../../css/campaign/ReportDialog.css";
import { getCampaignReport } from "../../services/campaignApi";

type Props = {
  token: string;
  campaignId: string;
  close: () => void;
};

export default function ReportDialog({ token, campaignId, close }: Props) {
  const [options, setOptions] = useState({
    includeDonations: false,
    includeComments: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name === "includeComments") {
      if (checked && !options.includeDonations) return; // לא מאפשר אם תרומות לא מסומן
      setOptions((prev) => ({ ...prev, includeComments: checked }));
      return;
    }

    if (name === "includeDonations") {
      if (!checked) {
        setOptions({ includeDonations: false, includeComments: false });
      } else {
        setOptions((prev) => ({ ...prev, includeDonations: true }));
      }
    }
  };

  const handleCreate = () => {
    getCampaignReport(
      token,
      campaignId,
      options.includeDonations ? "1" : "0",
      options.includeComments ? "1" : "0"
    );
    close();
  };

  const handleCancel = () => close();

  return (
    <div className="report-dialog" dir="rtl" role="dialog" aria-labelledby="report-title">
      <h3 id="report-title" className="report-title">ייצוא דו״ח קמפיין</h3>
      <p className="report-sub">הדו"ח יכלול את פרטי הקמפיין. בחר/י אם הינך מעוניין שיופיעו גם הפרטים הבאים</p>

      <div className="options">
        <div className="option-row">
          <label className="option-label" htmlFor="includeDonations">כלול תרומות</label>
          <input
            id="includeDonations"
            type="checkbox"
            name="includeDonations"
            checked={options.includeDonations}
            onChange={handleChange}
            className="option-checkbox"
          />
        </div>

        <div
          className={`option-row ${!options.includeDonations ? "disabled" : ""}`}
          title={!options.includeDonations ? 'יש לבחור "כלול תרומות" תחילה' : ""}
        >
          <label className="option-label" htmlFor="includeComments">כלול הערות תורמים</label>
          <input
            id="includeComments"
            type="checkbox"
            name="includeComments"
            checked={options.includeComments}
            onChange={handleChange}
            className="option-checkbox"
            disabled={!options.includeDonations}
          />
        </div>

        {!options.includeDonations && (
          <p className="hint">כדי לכלול הערות תורמים יש לסמן קודם ״כלול תרומות״.</p>
        )}
      </div>

      <div className="button-row-report">
        <button className="button-report button-report-primary" onClick={handleCreate}>יצירת דו״ח</button>
        <button className="button-report button-report-ghost" onClick={handleCancel}>ביטול</button>
      </div>
    </div>
  );
}
