import React from "react";

type NgoDetailsProps = {
  ngo: {
    name: string;
    ngoNumber: string;
    description: string;
    website?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
};

const NgoDetailsCard: React.FC<NgoDetailsProps> = ({ ngo }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 16px 32px rgba(0,0,0,0.05)",
        padding: "20px 24px",
        fontFamily: "calibri, sans-serif",
        color: "#1f2937",
        lineHeight: 1.5,
        boxSizing: "border-box",
      }}
      dir="rtl"
    >
      {/* כותרת עליונה: שם העמותה ומספר עמותה */}
      <div
        style={{
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.3,
          }}
        >
          {ngo.name}
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginTop: "4px",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontWeight: 600,
              color: "#374151",
              padding: "2px 8px",
              fontSize: "0.75rem",
              lineHeight: 1.3,
            }}
          >
            עמותה מס' {ngo.ngoNumber}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
            גוף מפוקח ומאושר
          </span>
        </div>
      </div>

      {/* מי אנחנו / תיאור */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#111827",
            marginBottom: "6px",
          }}
        >
          מי אנחנו
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            color: "#374151",
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px 14px",
            lineHeight: 1.5,
            whiteSpace: "pre-line",
          }}
        >
          {ngo.description}
        </div>
      </div>

      {/* פרטי התקשרות */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 16px rgba(0,0,0,0.03)",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#111827",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              backgroundColor: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #6ee7b7",
              borderRadius: "6px",
              fontSize: "0.7rem",
              lineHeight: 1.2,
              fontWeight: 700,
              padding: "4px 8px",
              boxShadow: "0 6px 12px rgba(16,185,129,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            צור קשר
          </span>
          <span>אנחנו כאן בשבילכם</span>
        </div>

        <div
          style={{
            fontSize: "0.85rem",
            color: "#374151",
            display: "grid",
            rowGap: "8px",
          }}
        >
          {ngo.website && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#6b7280" }}>אתר:</span>
              <a
                href={ngo.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#065f46",
                  fontWeight: 600,
                  textDecoration: "none",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #6ee7b7",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                  padding: "4px 8px",
                  boxShadow: "0 4px 8px rgba(16,185,129,0.15)",
                  direction: "ltr",
                }}
              >
                {ngo.website}
              </a>
            </div>
          )}

          {ngo.email && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#6b7280" }}>אימייל:</span>
              <a
                href={`mailto:${ngo.email}`}
                style={{
                  color: "#1d4ed8",
                  fontWeight: 600,
                  textDecoration: "none",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                  padding: "4px 8px",
                  boxShadow: "0 4px 8px rgba(29,78,216,0.15)",
                  direction: "ltr",
                }}
              >
                {ngo.email}
              </a>
            </div>
          )}

          {ngo.phone && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#6b7280" }}>טלפון:</span>
              <a
                href={`tel:${ngo.phone}`}
                style={{
                  color: "#111827",
                  fontWeight: 600,
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                  padding: "4px 8px",
                  textDecoration: "none",
                  direction: "ltr",
                }}
              >
                {ngo.phone}
              </a>
            </div>
          )}

          {ngo.address && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <span style={{ color: "#6b7280" }}>כתובת:</span>
              <span
                style={{
                  color: "#111827",
                  fontWeight: 500,
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                  padding: "4px 8px",
                  textAlign: "right",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                {ngo.address}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* חותמת אמון קטנה */}
      <div
        style={{
          marginTop: "16px",
          fontSize: "0.7rem",
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        התרומות לעמותה זו מתועדות בבלוקצ'יין וניתנות למעקב ציבורי.
      </div>
    </div>
  );
};

export default NgoDetailsCard;
