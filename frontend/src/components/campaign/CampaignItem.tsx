import type { Campaign } from "../../models/Campaign";
import { useNavigate } from "react-router-dom";
import type { Ngo } from "../../models/Ngo";
import type { ReactNode } from "react";

import styles from "../../css/campaign/CampaignItem.module.css";

// Base URL for campaign / NGO images
const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

// Returns a Date object set to the end of the given day (23:59:59)
function endOfDay(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Single campaign card component
const CampaignItem = ({
  c,
  showButtons = false,
  edit = () => {},
  view = "grid",
}: {
  c: Campaign;
  showButtons?: boolean;
  edit?: (id: string) => void;
  view?: "grid" | "list";
}) => {
  const nav = useNavigate();

  // Calculate donation progress percentage (limit to 100%)
  const percent = Math.min(((c.totalRaised!) / c.goal) * 100, 100);

  // Determine whether the campaign has ended
  const isEnded = (() => {
    const end = endOfDay(c.endDate);
    return end ? end < new Date() : false;
  })();

  return (
    <div
      className={`${view === "grid" ? styles["grid_container_grid"] : styles["grid_container_flex"]} 
      ${styles["campaign-card"]}`}
    >
      {/* Display badge if campaign has ended */}
      {isEnded && <span className={styles["campaign-badge"]}>הסתיים</span>}

      {/* Campaign image section */}
      <div className={styles["campaign-media"]}>
        <img
          src={`${IMAGE_URL}/${c.mainImage ||
            (c.ngo && (c.ngo as unknown as Ngo).logoUrl) ||
            "default-logo.png"}`}
          alt={c.title}
          className={styles["campaign-img"]}
        />
      </div>

      {/* Main content container */}
      <FlexContainer isGrid={view === "grid"}>
        {/* Title size changes based on layout */}
        {view === "grid" ? (
          <h3 className={styles["title-grid"]}>{c.title}</h3>
        ) : (
          <h2 className={styles["title-flex"]}>{c.title}</h2>
        )}

        {/* Campaign dates */}
        <p className={styles.meta}>
          <span>מתחיל: {new Date(c.startDate).toLocaleDateString("he")}</span> •{" "}
          <span>מסתיים: {new Date(c.endDate).toLocaleDateString("he")}</span>
        </p>

        {/* Donation progress row */}
        <div className={styles["amount-row"]}>
          <div className={styles.amount}>
            {(c.totalRaised!).toLocaleString()} ₪
            <span className={styles.muted}>
              {" "}
              מתוך {c.goal.toLocaleString()} ₪
            </span>
          </div>

          {/* Percentage display */}
          <div className={styles.percent}>{Math.round(percent)}%</div>
        </div>

        {/* Progress bar */}
        <div className={styles.prohress}>
          <div
            className={styles["progress-bar"]}
            style={{ width: `${percent}%` }}
          />
        </div>
      </FlexContainer>

      {/* Admin / action buttons (only in grid view) */}
      {view === "grid" && showButtons && (
        <div className={styles["card-actions"]}>
          {/* Edit campaign */}
          <button
            className={styles["btn-primary"]}
            disabled={!c._id}
            onClick={() => edit(c._id!)}
          >
            פרטי הקמפיין
          </button>

          {/* Navigate to campaign page */}
          <button
            className={styles["btn-primary"]}
            onClick={() => nav(`/campaign/${c._id}`)}
          >
            דף הקמפיין
          </button>
        </div>
      )}
    </div>
  );
};

// Wrapper component that changes layout depending on view mode
export const FlexContainer = ({
  isGrid,
  children,
}: {
  isGrid: boolean;
  children: ReactNode[] | ReactNode;
}) =>
  isGrid ? <>{children}</> : <div className={styles["flex-container_flex"]}>{children}</div>;

export default CampaignItem;
