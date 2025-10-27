import React, { useEffect, useState } from "react";
import type { Ngo } from "../models/Ngo";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getNgoById } from "../services/ngoApi";
import Spinner, { useSpinner } from "./Spinner";

const NgoPublicProfile: React.FC = () => {
    const nav = useNavigate()
    const params = useParams();
    const { isLoading, start, stop } = useSpinner();
    const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
    // עיצוב בסיסי לשימוש חוזר
    const cardStyle: React.CSSProperties = {
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
        padding: "24px",
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        border: "1px solid #e5e7eb",
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: "1rem",
        fontWeight: 600,
        color: "#374151", // slate-700
        margin: "0 0 8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    };

    const valueStyle: React.CSSProperties = {
        margin: 0,
        fontSize: "0.95rem",
        color: "#111827",
        lineHeight: 1.5,
        wordBreak: "break-word",
    };

    const rowStyle: React.CSSProperties = {
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
    };

    const grid2col: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
    };

    const [ngo, setNgo] = useState<Ngo | null>(null)

    const loadNgo = async (ngoId: string) => {
        try {
            start()
            const ngo = await getNgoById(ngoId);
            setNgo(ngo);
        } catch (error) {
            console.log(error);
            alert('error loading ngo')
        } finally {
            stop()
        }
    }

    useEffect(() => {
        if (params.id) {
            loadNgo(params.id)
        }
    }, [params])

    if (isLoading) return (<Spinner />)
    if (!ngo) return <>שגיאה בטעינת העמותה, אנא נסו שנית מאוחר יותר</>
    return (
        <div dir="rtl" style={{ padding: "24px", background: "#f3f4f6", minHeight: "100vh" }}>
            {/* כרטיס מרכזי */}
            <div style={cardStyle}>
                {/* ראש העמותה: לוגו + שם + מספר עמותה */}
                <header
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "16px",
                        alignItems: "center",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "16px",
                        marginBottom: "24px",
                    }}
                >
                    {/* לוגו */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "16px",
                            background: "#f3f4f6",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            fontSize: "0.8rem",
                            color: "#6b7280",
                            textAlign: "center",
                        }}
                    >
                        {ngo.logoUrl ? (
                            <img
                                src={`${IMAGE_URL}/${ngo.logoUrl}`}
                                alt={ngo.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <span>אין לוגו</span>
                        )}
                    </div>

                    {/* שם + תת פרטים */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1
                            style={{
                                fontSize: "1.5rem",
                                lineHeight: 1.2,
                                fontWeight: 700,
                                color: "#111827",
                                margin: 0,
                                wordBreak: "break-word",
                                textAlign: "right",
                            }}
                        >
                            {ngo.name}
                        </h1>
                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "0.9rem",
                                color: "#6b7280",
                                lineHeight: 1.4,
                            }}
                        >
                            עמותה רשומה מס' {ngo.ngoNumber}
                            <br />
                            פעילה משנת{" "}
                            {new Date(ngo.createdAt).getFullYear()}
                        </p>
                    </div>

                    {/* כפתור תרומה עכשיו (ויזואלית בלבד כאן) */}
                    <button
                        style={{
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 16px",
                            cursor: "pointer",
                            transition: "filter .15s ease, transform .15s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget.style.filter = "brightness(0.95)");
                            (e.currentTarget.style.transform = "scale(1.03)");
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget.style.filter = "");
                            (e.currentTarget.style.transform = "");
                        }}
                    >
                        לתרומה מיידית
                    </button>

                    <button
                        style={{
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 16px",
                            cursor: "pointer",
                            transition: "filter .15s ease, transform .15s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget.style.filter = "brightness(0.95)");
                            (e.currentTarget.style.transform = "scale(1.03)");
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget.style.filter = "");
                            (e.currentTarget.style.transform = "");
                        }}
                        onClick={() => nav(`/campaigns/${ngo._id}`)}
                    >
                        הקמפיינים שלנו
                    </button>
                </header>

                {/* תיאור העמותה / למה לתרום */}
                <section style={{ marginBottom: "24px" }}>
                    <h2 style={sectionTitleStyle}>מי אנחנו ולמה אנחנו כאן</h2>
                    <p
                        style={{
                            margin: 0,
                            color: "#1f2937",
                            lineHeight: 1.6,
                            fontSize: "1rem",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {ngo.description || "העמותה טרם הוסיפה תיאור מפורט."}
                    </p>
                </section>
                {/* ✅ חדש: הוכחת אמינות / מסמך אישור עמותה */}
                <section style={{ marginBottom: "24px" }}>
                    <h2 style={sectionTitleStyle}>
                        אמינות ובקרה ציבורית {/* כותרת לסקשן החדש */}
                    </h2>

                    <div style={grid2col}>
                        {/* בלוק תעודת רישום */}
                        <div style={rowStyle}>
                            <p
                                style={{
                                    ...sectionTitleStyle,
                                    marginBottom: 4,
                                    fontSize: "0.9rem",
                                }}
                            >
                                אישור עמותה רשמית {/* ✅ חדש */}
                            </p>

                            {ngo.certificate ? (
                                <p style={valueStyle}>
                                    {/* קישור למסמך */}
                                    <a
                                        href={ngo.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-block",
                                            backgroundColor: "#2563eb",
                                            color: "#fff",
                                            fontWeight: 500,
                                            fontSize: "0.85rem",
                                            textDecoration: "none",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                                        }}
                                    >
                                        הצגת אישור העמותה
                                    </a>
                                    <div
                                        style={{
                                            marginTop: "8px",
                                            fontSize: "0.8rem",
                                            color: "#6b7280",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        זהו המסמך הרשמי שמאשר את הרישום של העמותה ברשויות,
                                        כדי שתוכלו לדעת שאתם תורמים לגוף מוכר ומפוקח.
                                    </div>
                                </p>
                            ) : (
                                <p style={valueStyle}>
                                    טרם עלה מסמך האישור הציבורי לעיון.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* פרטי אמון / שקיפות כספית */}
                <section style={{ marginBottom: "24px" }}>
                    <h2 style={sectionTitleStyle}>שקיפות ואמצעי תרומה</h2>

                    <div style={grid2col}>
                        <div style={rowStyle}>
                            <p style={{ ...sectionTitleStyle, marginBottom: 4, fontSize: "0.9rem" }}>
                                חשבון בנק
                            </p>
                            <p style={valueStyle}>
                                {ngo.bankAccount
                                    ? ngo.bankAccount
                                    : "לא פורסם עדיין לחשיפה פומבית"}
                            </p>
                        </div>

                        <div style={rowStyle}>
                            <p style={{ ...sectionTitleStyle, marginBottom: 4, fontSize: "0.9rem" }}>
                                ארנק קריפטו
                            </p>
                            <p style={valueStyle}>
                                {ngo.wallet
                                    ? ngo.wallet
                                    : "לא פורסם עדיין לחשיפה פומבית"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* פרטי יצירת קשר / אתר / מיקום */}
                <section style={{ marginBottom: "24px" }}>
                    <h2 style={sectionTitleStyle}>צרו קשר</h2>

                    <div style={{ display: "grid", gap: "12px" }}>
                        {ngo.website && (
                            <div style={rowStyle}>
                                <p style={{ ...sectionTitleStyle, marginBottom: 4, fontSize: "0.9rem" }}>
                                    אתר רשמי
                                </p>
                                <p style={valueStyle}>
                                    <a
                                        href={ngo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: "#2563eb",
                                            textDecoration: "none",
                                            fontWeight: 500,
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {ngo.website}
                                    </a>
                                </p>
                            </div>
                        )}

                        {ngo.email && (
                            <div style={rowStyle}>
                                <p style={{ ...sectionTitleStyle, marginBottom: 4, fontSize: "0.9rem" }}>
                                    דוא"ל
                                </p>
                                <p style={valueStyle}>
                                    <a
                                        href={`mailto:${ngo.email}`}
                                        style={{ color: "#111827", textDecoration: "none", fontWeight: 500 }}
                                    >
                                        {ngo.email}
                                    </a>
                                </p>
                            </div>
                        )}

                        {ngo.phone && (
                            <div style={rowStyle}>
                                <p style={{ ...sectionTitleStyle, marginBottom: 4, fontSize: "0.9rem" }}>
                                    טלפון
                                </p>
                                <p style={valueStyle}>{ngo.phone}</p>
                            </div>
                        )}

                        {ngo.address && (
                            <div style={rowStyle}>
                                <p style={{ ...sectionTitleStyle, marginBottom: 4, fontSize: "0.9rem" }}>
                                    כתובת
                                </p>
                                <p style={valueStyle}>{ngo.address}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* חותמת אמון קטנה בתחתית */}
                <footer
                    style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "16px",
                        lineHeight: 1.4,
                    }}
                >
                    <div style={{ marginBottom: "4px", fontWeight: 500, color: "#374151" }}>
                        אנחנו מאמינים בשקיפות מלאה.
                    </div>
                    <div>
                        כל תרומה נרשמת במערכת ומתועדת בבלוקצ'יין לצורך ביקורת ושקיפות.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default NgoPublicProfile;
