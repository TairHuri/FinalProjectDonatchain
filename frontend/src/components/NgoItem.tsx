import { Link } from "react-router-dom";
import type { Ngo } from "../models/Ngo";
import "../css/NgoItem.css";

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

export default function NgoItem({ ngo, view }: { ngo: Ngo; view: "grid" | "list" }) {
  const campaignsCount = (ngo as any).ngoCampaignsCount ?? 0;

  return (
    <Link to={`/ngos/${ngo._id}`} className="ngo-link_item" aria-label={`צפייה בעמותה ${ngo.name}`}>
      <article className={`ngo-card ${view === "list" ? "is-list" : "is-grid"}`}>
        {/* Badge קמפיינים */}
        {campaignsCount > 0 && <span className="ngo-badge">{campaignsCount} קמפיינים</span>}

        {/* לוגו */}
        <div className="ngo-media">
          {ngo.logoUrl ? (
            <img
              src={`${IMAGE_URL}/${ngo.logoUrl}`}
              alt={ngo.name}
              className="ngo-logo"
              loading="lazy"
            />
          ) : (
            <div className="ngo-logo-placeholder">ללא<br />לוגו</div>
          )}
        </div>

        {/* תוכן */}
        <div className="ngo-content">
          <h3 className="ngo-name">{ngo.name}</h3>

          {(ngo.website || ngo.address) && (
            <div className="ngo-meta">
              {ngo.website && (
                <div className="ngo-line">
                  <span className="ngo-key">אתר:</span>
                  <span className="ngo-value">{ngo.website}</span>
                </div>
              )}
              {ngo.address && (
                <div className="ngo-line">
                  <span className="ngo-key">כתובת:</span>
                  <span className="ngo-value">{ngo.address}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

