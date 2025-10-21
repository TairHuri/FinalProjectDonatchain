// src/components/CampaignGallery.tsx
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  images: string[];
  imageBaseUrl?: string; // אופציונלי אם את שומרת רק שמות קובץ
  movie?: string | null;
  title?: string;
};

function CampaignGallery({ images, imageBaseUrl = "", movie, title }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const fullSrc = (img: string) => (imageBaseUrl ? `${imageBaseUrl}/${img}` : img);

  const scrollByCards = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement | null)?.clientWidth ?? 240;
    const gap = 12;
    const delta = (cardWidth + gap) * 2; // גלילה של 2 קלפים
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  return (
    <div className="gallery">
      {/* כותרת קטנה (אופציונלי) */}
      {title && <h3 className="gallery__title">{title}</h3>}

      <div className="carousel">
        <button className="carousel__arrow carousel__arrow--left" onClick={() => scrollByCards("left")} aria-label="גלילה שמאלה">
          ‹
        </button>

        <div className="carousel__track" ref={trackRef}>
          {images.map((img) => (
            <button
              key={img}
              className="carousel__slide"
              onClick={() => setLightboxSrc(fullSrc(img))}
              aria-label="הגדלת תמונה"
            >
              <img src={fullSrc(img)} alt="תמונת קמפיין" className="carousel__img" />
            </button>
          ))}
        </div>

        <button className="carousel__arrow carousel__arrow--right" onClick={() => scrollByCards("right")} aria-label="גלילה ימינה">
          ›
        </button>
      </div>

      {/* וידאו מתחת לקרוסלה */}
      {movie && (
        <div className="gallery__video">
          <video src={movie} controls preload="metadata" className="gallery__videoEl" />
        </div>
      )}

      {/* Lightbox (הגדלת תמונה) */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            className="lightbox__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
          >
            <motion.img
              src={lightboxSrc}
              alt="תמונה מוגדלת"
              className="lightbox__img"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="lightbox__close" onClick={() => setLightboxSrc(null)} aria-label="סגירה">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CampaignGallery