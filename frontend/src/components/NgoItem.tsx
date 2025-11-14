// import { Link } from "react-router-dom";
// import type { Ngo } from "../models/Ngo";
// import "../css/NgoItem.css";

// const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

// export default function NgoItem({ ngo, view }: { ngo: Ngo; view: "grid" | "list" }) {
//   const campaignsCount = (ngo as any).ngoCampaignsCount ?? 0;

//   return (
//     <Link to={`/ngos/${ngo._id}`} className="ngo-link_item" aria-label={`צפייה בעמותה ${ngo.name}`}>
//       <article className={`ngo-card ${view === "list" ? "is-list" : "is-grid"}`}>
//         {/* Badge קמפיינים */}
//         {campaignsCount > 0 && <span className="ngo-badge">{campaignsCount} קמפיינים</span>}

//         {/* לוגו */}
//         <div className="ngo-media">
//           {ngo.logoUrl ? (
//             <img
//               src={`${IMAGE_URL}/${ngo.logoUrl}`}
//               alt={ngo.name}
//               className="ngo-logo"
//               loading="lazy"
//             />
//           ) : (
//             <div className="ngo-logo-placeholder">ללא<br />לוגו</div>
//           )}
//         </div>

//         {/* תוכן */}
//         <div className="ngo-content">
//           <h3 className="ngo-name">{ngo.name}</h3>

//           {(ngo.website || ngo.address) && (
//             <div className="ngo-meta">
//               {ngo.website && (
//                 <div className="ngo-line">
//                   <span className="ngo-key">אתר:</span>
//                   <span className="ngo-value">{ngo.website}</span>
//                 </div>
//               )}
//               {ngo.address && (
//                 <div className="ngo-line">
//                   <span className="ngo-key">כתובת:</span>
//                   <span className="ngo-value">{ngo.address}</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </article>
//     </Link>
//   );
// }



import { Link } from "react-router-dom";
import type { Ngo } from "../models/Ngo";
import styles from "../css/NgoItem.module.css";
import { FlexContainer } from "./CampaignItem";

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

function host(url?: string) {
  if (!url) return "";
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function NgoItem({ ngo, view }: { ngo: Ngo; view: "grid" | "list" }) {
  const campaignsCount = (ngo as any).ngoCampaignsCount ?? 0;

  return (
    <Link to={`/ngos/${ngo._id}`} className={`${view === "grid" ? styles['grid_container_grid'] : styles["grid_container_flex"]} ${styles['card']}`} aria-label={`צפייה בעמותה ${ngo.name}`} dir="rtl">
      {/* <article className={`${styles.card} ${view === "grid" ? styles.grid : styles.list}`}> */}
      {/* Media / Logo */}
      <div className={styles['ngo-media']}>
        {ngo.logoUrl ? (
          <img
            src={`${IMAGE_URL}/${ngo.logoUrl}`}
            alt={ngo.name}
            className={styles['ngo-img']}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={`${styles.logo} ${styles.logoPlaceholder}`}>ללא לוגו</div>
        )}
      </div>

      {/* Content */}
      <FlexContainer isGrid={view === "grid"}>
        {/* <div className={styles.content}> */}
        {view === "grid" ? (
          <h3 className={styles['title-grid']}>{ngo.name}</h3>
        ) : (
          <h2 className={styles['title-flex']}>{ngo.name}</h2>
        )}
        <div className={styles.meta}>
          {ngo.website && (
            <div className={styles.line} title={ngo.website}>
              <span className={styles.key}>אתר:</span>
              <span className={`${styles.value} ${styles.url}`}>{host(ngo.website)}</span>
            </div>
          )}
          {ngo.address && (
            <div className={styles.line} title={ngo.address}>
              <span className={styles.key}>כתובת:</span>
              <span className={styles.value}>{ngo.address}</span>
            </div>
          )}
        </div>

        {campaignsCount > 0 && (
          <div className={styles.footer}>
            <span className={styles.chip}>{campaignsCount} קמפיינים</span>
          </div>
        )}
        {/* </div> */}
      </FlexContainer>
      {/* </article> */}
    </Link>
  );
}
