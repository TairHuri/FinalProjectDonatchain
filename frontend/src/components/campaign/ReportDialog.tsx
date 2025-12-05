import { useState } from "react";
import "../../css/campaign/ReportDialog.css";
import { getCampaignReport } from "../../services/campaignApi";
import Spinner, { useSpinner } from "../gui/Spinner";

type Props = {
  token: string;
  campaignId: string;
  close: () => void;
};

export default function ReportDialog({ token, campaignId, close }: Props) {
  // Loading spinner handler
  const { start, stop, isLoading } = useSpinner();

  // Report options state (checkbox selections)
  const [options, setOptions] = useState({
    includeDonations: false,
    includeComments: false,
  });

  /**
   * Handles checkbox changes for report options.
   * Business logic:
   * - Comments can only be included if donations are included
   * - If user disables donations, we must also disable comments automatically
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // Prevent enabling comments without donations
    if (name === "includeComments") {
      if (checked && !options.includeDonations) return;
      setOptions((prev) => ({ ...prev, includeComments: checked }));
      return;
    }

    // Handle donations checkbox logic
    if (name === "includeDonations") {
      if (!checked) {
        // If donations unchecked → reset both
        setOptions({ includeDonations: false, includeComments: false });
      } else {
        // Enable donations only
        setOptions((prev) => ({ ...prev, includeDonations: true }));
      }
    }
  };

  /**
   * Creates a campaign report request.
   * Sends selected options as numeric flags required by API.
   * After the process, the modal is closed.
   */
  const handleCreate = async () => {
    start();
    await getCampaignReport(
      token,
      campaignId,
      options.includeDonations ? "1" : "0",
      options.includeComments ? "1" : "0"
    );
    stop();
    close();
  };

  // Closes the dialog without generating a report
  const handleCancel = () => close();

  // Show spinner during loading
  if (isLoading) return <Spinner />;

  return (
    <div className="report-dialog" dir="rtl" role="dialog" aria-labelledby="report-title">
      <h3 id="report-title" className="report-title">ייצוא דו״ח קמפיין</h3>
      <p className="report-sub">
        הדו"ח יכלול את פרטי הקמפיין. בחר/י אם הינך מעוניין שיופיעו גם הפרטים הבאים
      </p>

      {/* Report options */}
      <div className="options">
        {/* Donations option */}
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

        {/* Donor comments: disabled until donations are selected */}
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

        {/* Hint for better UX */}
        {!options.includeDonations && (
          <p className="hint">כדי לכלול הערות תורמים יש לסמן קודם ״כלול תרומות״.</p>
        )}
      </div>

      {/* Dialog action buttons */}
      <div className="button-row-report">
        <button className="button-report button-report-primary" onClick={handleCreate}>
          יצירת דו״ח
        </button>
        <button className="button-report button-report-ghost" onClick={handleCancel}>
          ביטול
        </button>
      </div>
    </div>
  );
}
