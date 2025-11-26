
import { useState } from "react";
import { Link } from "react-router-dom";
import { search } from "../services/aiApi";

import "../css/general/AISearch.css";



// Type for a single NGO search result item
type SearchNgoResult = {
  _id: string;
  name: string;
  logoUrl: string;
};

// Base URL for images (fallback to localhost if env variable missing)
const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

export default function AISearchBar() {
  // Search text entered by the user
  const [text, setText] = useState("");

  // AI search results (top 5)
  const [results, setResults] = useState<SearchNgoResult[]>([]);

  // Controls modal visibility
  const [showResults, setShowResults] = useState(false);

  // Loading state while waiting for API response
  const [loading, setLoading] = useState(false);

  // Handles AI search logic
  const handleSearch = async () => {
    if (!text.trim()) return; // Prevent empty search

    try {
      setLoading(true);

      const data = await search(text); // Call backend AI API

      // Take only the first 5 results
      const ngos: SearchNgoResult[] = (data as SearchNgoResult[])?.slice(0, 5);

      setResults(ngos);
      setShowResults(true);
    } catch (err) {
      console.error("AI search error:", err);

      // Show empty state if error occurred
      setResults([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Close the modal window
  const closeModal = () => setShowResults(false);

  return (
    <>
      <div className="smart-search-wrapper" dir="rtl">
        <h1 className="search-title">מצא את העמותה המדויקת לך.</h1>
        <p className="search-subtitle">מנוע חיפוש חכם - הטקסט עליך, החיפוש עלינו.</p>

        <div className="smart-search-container">
          <input
            className="search-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="תאר מה אתה מחפש בעמותה, לדוגמה: אני אוהב בעלי חיים ומחפש עמותה שתומכת בהם"
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "מחפש..." : "חפש"}
          </button>
        </div>
      </div>

      {showResults && (
        <div className="ai-search-modal-backdrop" onClick={closeModal}>
          <div
            className="ai-search-modal"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="ai-search-modal-header">
              <h2>העמותות הכי מתאימות עבורך</h2>
              <button
                className="ai-search-close"
                type="button"
                onClick={closeModal}
                aria-label="סגירת חלונית תוצאות"
              >
                ×
              </button>
            </div>

            {loading ? (
              <div className="ai-search-loading">
                <div className="ai-search-spinner" />
                <span>טוען תוצאות...</span>
              </div>
            ) : results.length === 0 ? (
              <p className="ai-search-empty">
                לא נמצאו עמותות מתאימות לטקסט שחיפשת. נסה לנסח אחרת 😊
              </p>
            ) : (
              <div className="ai-search-results-grid">
                {results.map((ngo) => (
                  <article key={ngo._id} className="ai-search-ngo-card">
                    <div className="ai-search-ngo-logo-wrapper">
                      <img
                        src={`${IMAGE_URL}/${ngo.logoUrl}`}
                        alt={ngo.name}
                        className="ai-search-ngo-logo"
                      />
                    </div>
                    <h3 className="ai-search-ngo-name">{ngo.name}</h3>

                    <div className="ai-search-actions">
                      <Link
                        to={`/ngos/${ngo._id}`} 
                        className="ai-search-btn primary"
                        onClick={closeModal}
                      >
                        לדף העמותה
                      </Link>
                      <Link
                        to={`/campaigns?ngo=${ngo._id}`} 
                        className="ai-search-btn secondary"
                        onClick={closeModal}
                      >
                        לקמפייני העמותה
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
