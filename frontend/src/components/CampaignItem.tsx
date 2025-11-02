import type { Campaign } from "../models/Campaign";
import { buttonStyle, labelStyle, primaryBtnStyle } from "../css/dashboardStyles";
import { useNavigate } from 'react-router-dom'
import type { Ngo } from "../models/Ngo";
import '../css/CampaignItem.css'
import type { ReactNode } from "react";

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
  view = 'grid'
}: {
  c: Campaign,
  showButtons?: boolean,
  edit?: (id: string) => void,
  view?: 'grid' | 'list'
}) => {
  const nav = useNavigate();
  const percent = Math.min((c.raised / c.goal) * 100, 100);

  const isEnded = (() => {
    const end = endOfDay(c.endDate);
    return end ? end < new Date() : false;
  })();

  const FlexContainer = ({isGrid, children}:{isGrid:boolean, children:ReactNode[]}) =>
    isGrid ? <>{children}</> : <div className='flex-container_flex'>{children}</div>;

  return (
    <div className={`${view == 'grid' ? 'grid_container_grid' : 'grid_container_flex'} campaign-card`}>
      {/* תגית "הסתיים" */}
      {isEnded && <span className="campaign-badge">הסתיים</span>}

      <img
        src={`${IMAGE_URL}/${c.mainImage || (c.ngo && (c.ngo as unknown as Ngo).logoUrl) || 'default-logo.png'}`}
        alt="קמפיין"
        className={view == 'grid' ? 'image-grid' : 'image-flex'}
      />

      <FlexContainer isGrid={view == 'grid'}>
        {view == 'grid' ? (
          <h3 className='title-grid'>{c.title}</h3>
        ) : (
          <h2 className='title-flex'>{c.title}</h2>
        )}

        <p>תאריך תחילת הקמפיין: {c.startDate?.split("T")[0]}</p>
        <p>תאריך סיום הקמפיין: {c.endDate?.split("T")[0]}</p>

        <p className={view == 'grid' ? '' : 'amount-flex'}>
          {c.raised.toLocaleString()} ₪ מתוך {c.goal.toLocaleString()} ₪
        </p>

        <div className={view == 'grid' ? '.progress-grid' : '.progress-flex'}>
          <div
            style={{ width: `${percent}%` }}
            className={view == 'grid' ? 'progress-grid_bar' : 'progress-flex_bar'}
          />
        </div>
      </FlexContainer>

      {view == 'grid' && showButtons && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button style={{ ...primaryBtnStyle, width: '18vw' }} disabled={!c._id} onClick={() => edit(c._id!)}>
            עריכה
          </button>
          <button style={{ ...primaryBtnStyle, width: '18vw' }} onClick={() => nav(`/campaign/${c._id}`)}>
            צפייה
          </button>
        </div>
      )}
    </div>
  );
};

export const CampaignDonors = ({ campaign, onClick }: { campaign: Campaign, onClick: () => Promise<void> }) => {
  return (<p>{campaign.title} <button type="button" onClick={onClick} style={buttonStyle}>תורמי הקמפיין</button></p>)
};

export default CampaignItem;
