
import React, { useEffect, useState } from "react";
import type { Ngo } from "../../models/Ngo";
import { useNavigate, useParams } from "react-router-dom";
import { getNgoById } from "../../services/ngoApi";
import Spinner, { useSpinner } from "../gui/Spinner";

import "../../css/ngo/NgoPageForUsers.css";
import AlertDialog, { useAlertDialog } from "../gui/AlertDialog";

const CERTIFICATE_URL = import.meta.env.VITE_CERTIFICATES_URL || "http://localhost:4000/certificates";

const NgoPageForUsers: React.FC = () => {
    const nav = useNavigate();
    const params = useParams();
    const { isLoading, start, stop } = useSpinner();
    const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

    const [ngo, setNgo] = useState<Ngo | null>(null);
    const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();

    const loadNgo = async (ngoId: string) => {
        try {
            start();
            const ngo = await getNgoById(ngoId);
            setNgo(ngo);
        } catch (error) {
            setAlert("error loading ngo", true);
        } finally {
            stop();
        }
    };

    useEffect(() => {
        if (params.id) loadNgo(params.id);
    }, [params]);

    if (isLoading) return <Spinner />;
    if (!ngo) return <>שגיאה בטעינת העמותה, אנא נסו שנית מאוחר יותר</>;

    return (
            <div dir="rtl"className="ngo-card">
                {/* Header */}
                <header className="ngo-header">
                    <div className="ngo-logo">
                        {ngo.logoUrl ? (
                            <img
                                src={`${IMAGE_URL}/${ngo.logoUrl}`}
                                alt={ngo.name}
                                className="ngo-logo-img"
                            />
                        ) : (
                            <span className="ngo-logo-fallback">אין לוגו</span>
                        )}
                    </div>

                    <div className="ngo-headings">
                        <h1 className="ngo-title">{ngo.name}</h1>
                        <p className="ngo-sub">
                            עמותה רשומה מס' {ngo.ngoNumber}
                            <br />
                            פעילה באתר מתאריך {new Date(ngo.createdAt).toLocaleDateString("he")}
                        </p>
                    </div>

                    <div className="ngo-actions">
                        <button
                            className="btn-our-campaigns"
                            onClick={() => nav(`/campaigns/${ngo._id}`)}
                        >
                            הקמפיינים שלנו
                        </button>
                    </div>
                </header>

                {/* Description */}
                <section className="section">
                    <h2 className="section-title">מי אנחנו ולמה אנחנו כאן</h2>
                    <p className="section-text">
                        {ngo.description || "העמותה טרם הוסיפה תיאור מפורט."}
                    </p>
                </section>

                {/* Trust / Certificate */}
                <section className="section">
                    <h2 className="section-title">אמינות ובקרה ציבורית</h2>
                    <div className="row soft">
                        <div>
                            <p className="row-title">אישור עמותה רשמית</p>
                            {ngo.certificate ? (
                                <div className="row-value">
                                    <a
                                        href={`${CERTIFICATE_URL}/${ngo.certificate}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-link"
                                    >
                                        הצגת אישור העמותה
                                    </a>

                                </div>
                            ) : (
                                <p className="row-value">טרם עלה מסמך האישור הציבורי לעיון.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Transparent / Payment */}
                <section className="section">
                    <h2 className="section-title">שקיפות ואמצעי תרומה</h2>
                    <div className="grid-lines">
                        <div className="line">
                            <span className="line-label">חשבון בנק</span>
                            <span className="line-value">
                                {ngo.bankAccount ? ngo.bankAccount : "לא פורסם עדיין לחשיפה פומבית"}
                            </span>
                        </div>
                        <div className="line">
                            <span className="line-label">ארנק קריפטו</span>
                            <span className="line-value">
                                {ngo.wallet ? ngo.wallet : "לא פורסם עדיין לחשיפה פומבית"}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-title">צרו קשר</h2>
                    <div className="contact-grid">
                        {ngo.website && (
                            <div className="contact-item">
                                <span className="contact-label">אתר</span>
                                <a
                                    href={ngo.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link"
                                    title={ngo.website}
                                >
                                    {ngo.website}
                                </a>
                            </div>
                        )}
                        {ngo.email && (
                            <div className="contact-item">
                                <span className="contact-label">דוא"ל</span>
                                <a
                                    href={`mailto:${ngo.email}`}
                                    className="contact-link"
                                >
                                    {ngo.email}
                                </a>
                            </div>
                        )}
                        {ngo.phone && (
                            <div className="contact-item">
                                <span className="contact-label">טלפון</span>
                                <span className="contact-value">{ngo.phone}</span>
                            </div>
                        )}
                        {ngo.address && (
                            <div className="contact-item">
                                <span className="contact-label">כתובת</span>
                                <span className="contact-value">{ngo.address}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer note */}
                <footer className="ngo-footer">
                    <div className="footer-title">אנחנו מאמינים בשקיפות מלאה.</div>
                    <div className="footer-sub">
                        כל תרומה נרשמת במערכת ומתועדת בבלוקצ'יין לצורך ביקורת ושקיפות.
                    </div>
                </footer>
                 <AlertDialog
                        show={showAlert}
                        failureTitle="שגיאה"
                        successTitle=""
                        message={message}
                        failureOnClose={clearAlert}
                        isFailure={isFailure}
                      />
            </div>

    );
};

export default NgoPageForUsers;
