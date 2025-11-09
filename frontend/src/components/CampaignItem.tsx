
import type { Campaign } from "../models/Campaign";
import { useNavigate } from "react-router-dom";
import type { Ngo } from "../models/Ngo";
import type { ReactNode } from "react";

import styles from "../css/CampaignItem.module.css";

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

function endOfDay(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d;
}

const CampaignItem = ({
  c,
  showButtons = false,
  edit = (id: string) => {},
  view = "grid",
}: {
  c: Campaign;
  showButtons?: boolean;
  edit?: (id: string) => void;
  view?: "grid" | "list";
}) => {
  const nav = useNavigate();
  const percent = Math.min((c.raised / c.goal) * 100, 100);

  const isEnded = (() => {
    const end = endOfDay(c.endDate);
    return end ? end < new Date() : false;
  })();

  const FlexContainer = ({
    isGrid,
    children,
  }: {
    isGrid: boolean;
    children: ReactNode[] | ReactNode;
  }) => (isGrid ? <>{children}</> : <div className={styles['flex-container_flex']}>{children}</div>);

  return (
    <div className={`${view === "grid" ? styles['grid_container_grid']:styles["grid_container_flex"]} ${styles['campaign-card']}` }>
      {isEnded && <span className={styles['campaign-badge']}>הסתיים</span>}

      <div className={styles['campaign-media']}>
        <img
          src={`${IMAGE_URL}/${c.mainImage || (c.ngo && (c.ngo as unknown as Ngo).logoUrl) || "default-logo.png"}`}
          alt={c.title}
          className={styles['campaign-img']}
        />
      </div>

      <FlexContainer isGrid={view === "grid"}>
        {view === "grid" ? (
          <h3 className={styles['title-grid']}>{c.title}</h3>
        ) : (
          <h2 className={styles['title-flex']}>{c.title}</h2>
        )}

        <p className={styles.meta}>
          <span>מתחיל: {c.startDate?.split("T")[0]}</span> •{" "}
          <span>מסתיים: {c.endDate?.split("T")[0]}</span>
        </p>

        <div className={styles['amount-row']}>
          <div className={styles.amount}>
            {c.raised.toLocaleString()} ₪
            <span className={styles.muted}> מתוך {c.goal.toLocaleString()} ₪</span>
          </div>
          <div className={styles.percent}>{Math.round(percent)}%</div>
        </div>

        <div className={styles.prohress}>
          <div className={styles['progress-bar']} style={{ width: `${percent}%` }} />
        </div>
      </FlexContainer>

      {view === "grid" && showButtons && (
        <div className={styles['card-actions']}>
          <button className={styles['btn-primary']} disabled={!c._id} onClick={() => edit(c._id!)}>
            עריכה
          </button>
          <button className={styles['btn-primary']} onClick={() => nav(`/campaign/${c._id}`)}>
            צפייה
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignItem;
