// src/components/SimpleGallery.tsx
import { useRef, useState, useEffect } from "react";

type Props = {
  images: string[];
  imageBaseUrl?: string;     
  movie?: string | null;     
  rtl?: boolean;           
};

export default function SimpleGallery({ images, imageBaseUrl = "", movie, rtl = true }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const full = (p: string) => (imageBaseUrl ? `${imageBaseUrl}/${p}` : p);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = (el.firstElementChild as HTMLElement | null)?.clientWidth ?? 220;
    const gap = 12;
    const delta = (cardW + gap) * 2;
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  // סגירה עם ESC כשזום פתוח
  useEffect(() => {
    if (!zoomSrc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomSrc(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomSrc]);

  return (
    <section style={{ display: "grid", gap: 12, }}>
      {/* קרוסלה */}
      <div style={{ position: "relative", display:'flex', justifyContent:'center', width:'80vw'}}>
        {/* חץ שמאל */}
        <button
          onClick={() => scroll(rtl ? "right" : "left")}
          aria-label={rtl ? "גלילה ימינה" : "גלילה שמאלה"}
          style={arrowStyle(rtl ? "start" : "start")}
        >
          {rtl ? "›" : "‹"}
        </button>

        {/* המסילה */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: 12,
            overflowX: "hidden",
            scrollSnapType: "x mandatory",
            padding: "4px 40px",
            direction: rtl ? "rtl" : "ltr",
          }}
        >
          {images.map((img) => (
            <img
              key={img}
              src={full(img)}
              alt="תמונת קמפיין"
              onClick={() => setZoomSrc(full(img))}
              style={cardStyle}
            />
          ))}
        </div>

        {/* חץ ימין */}
        <button
          onClick={() => scroll(rtl ? "left" : "right")}
          aria-label={rtl ? "גלילה שמאלה" : "גלילה ימינה"}
          style={arrowStyle(rtl ? "end" : "end")}
        >
          {rtl ? "‹" : "›"}
        </button>
      </div>

      {/* וידאו מתחת (אופציונלי) */}
      {movie && (
        <div style={videoFrameStyle}>
          <video src={full(movie)} controls preload="metadata" style={videoElStyle} />
        </div>
      )}

      {/* Lightbox (תצוגה מוגדלת) */}
      {zoomSrc && (
        <div
          onClick={() => setZoomSrc(null)}
          style={lightboxBackdropStyle}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={zoomSrc}
            alt="תמונה מוגדלת"
            onClick={(e) => e.stopPropagation()}
            style={lightboxImgStyle}
          />
          <button onClick={() => setZoomSrc(null)} aria-label="סגירה" style={lightboxCloseStyle}>
            ×
          </button>
        </div>
      )}
    </section>
  );
}

/* ——— styles ——— */
const cardStyle: React.CSSProperties = {
  flex: "0 0 auto",
  width: 220,
  height: 140,
  borderRadius: 10,
  objectFit: "cover",
  scrollSnapAlign: "start",
  boxShadow: "0 6px 18px rgba(0,0,0,.12)",
  cursor: "zoom-in",
};

const arrowStyle = (side: "start" | "end"): React.CSSProperties => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  ...(side === "start" ? { insetInlineStart: 6 } : { insetInlineEnd: 6 }),
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  background: "#fff",
  boxShadow: "0 2px 12px rgba(0,0,0,.12)",
  zIndex: 2,
  cursor: "pointer",
  fontSize: 20,
  color: "#374151",
});

const videoFrameStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: '8 2',
  background: "#fff",
  boxShadow: "0 6px 18px rgba(0,0,0,.06)",
  marginTop: 8,
  width:'100%',
};

const videoElStyle: React.CSSProperties = {
  width: "100%",
  maxHeight: "50vh",
  borderRadius: 8,
  display: "block",
};

const lightboxBackdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.6)",
  display: "grid",
  placeItems: "center",
  padding: 24,
  zIndex: 1000,
  backdropFilter: "blur(2px)",
};

const lightboxImgStyle: React.CSSProperties = {
  maxWidth: "min(1000px, 92vw)",
  maxHeight: "88vh",
  borderRadius: 12,
  boxShadow: "0 20px 60px rgba(0,0,0,.4)",
};

const lightboxCloseStyle: React.CSSProperties = {
  position: "fixed",
  top: 16,
  right: 16,
  width: 40,
  height: 40,
  border: "none",
  borderRadius: 999,
  background: "#fff",
  color: "#111827",
  fontSize: 22,
  cursor: "pointer",
  boxShadow: "0 8px 30px rgba(0,0,0,.25)",
};

