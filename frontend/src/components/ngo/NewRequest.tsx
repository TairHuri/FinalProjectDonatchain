import { useEffect, useState } from "react";
import { categoryLabel, type AdminRequestByUser, type RequestCategoryType } from "../../models/Request";
import { useAuth } from "../../contexts/AuthContext";
import { createRequest, getTemplates } from "../../services/requestApi";



const NewRequest = ({ setActiveTab }: { setActiveTab: (tab: 'new' | 'list') => void }) => {
    const { user } = useAuth()
    const [templates, setTemplates] = useState<AdminRequestByUser[]>([]);

    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState<RequestCategoryType>("general");
    const [body, setBody] = useState("");
    const [charLimit] = useState(1200);

    const remaining = charLimit - body.length;
    const isInvalid = subject.trim().length < 3 || body.trim().length < 10 || remaining < 0;

    useEffect(() => {
        getTemplates(user!.token!).then(templates => setTemplates(templates))
    }, [])

    const onPickTemplate = (tpl: AdminRequestByUser) => {
        setSubject(tpl.subject);
        setBody(tpl.body);
        setCategory(tpl.category);
        setActiveTab("new");
    };

    const handleSubmit = async(e: React.FormEvent) => {
        if(!user || !user._id || !user.token)return;

        e.preventDefault();
        if (isInvalid) return;
        const request: AdminRequestByUser = {subject, category, body, userId:user?._id, ngoId:user.ngoId, status:'pending', adminComment:'' }
           const res = await  createRequest(request, user.token)
        // כאן בעתיד תחברי ל־API
        
        setSubject("");
        setBody("");
        setCategory("general");
    };

    return (
        <div className="rq-grid">
            {/* טופס בקשה */}
            <section className="rq-section">
                <h3 className="rq-section-title">יצירת בקשה</h3>
                <form onSubmit={handleSubmit} className="rq-form">
                    <label className="rq-label">נושא הבקשה</label>
                    <input
                        className="rq-input"
                        placeholder="למשל: בקשה למחיקת עמותה"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        maxLength={140}
                    />

                    <div className="rq-row2">
                        <div className="rq-field">
                            <label className="rq-label">קטגוריה</label>
                            <label
                                className="rq-input">
                                {categoryLabel[category]}
                            </label>
                        </div>

                        <div className="rq-field rq-counter-wrap">
                            <label className="rq-label">תווים נשארו</label>
                            <div className={`rq-counter ${remaining < 0 ? "is-over" : ""}`}>
                                {remaining}/{charLimit}
                            </div>
                        </div>
                    </div>

                    <label className="rq-label">תוכן הבקשה</label>
                    <textarea
                        className="rq-textarea"
                        placeholder="לפחות עשרה תווים, פירוט מלא, קישורים, פרטים מזהים וכד׳…"
                        rows={10}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />

                    <div className="rq-actions">
                        <button className="rq-submit" type="submit" disabled={isInvalid}>
                            שליחה
                        </button>
                        <button
                            className="rq-secondary"
                            type="button"
                            onClick={() => { setSubject(""); setBody(""); setCategory("general"); }}
                        >
                            ניקוי טופס
                        </button>
                    </div>
                </form>
            </section>

            {/* תבניות מהירות */}
            <aside className="rq-section rq-templates">
                <h3 className="rq-section-title">בקשות מוגדרות</h3>
                <div className="rq-templates-grid">
                    {templates.map((tpl) => (
                        <button
                            type="button"
                            key={tpl._id}
                            className="rq-template"
                            onClick={() => onPickTemplate(tpl)}
                            title="החלת תבנית ומילוי אוטומטי"
                        >
                            <div className="rq-template-title">{tpl.subject}</div>
                            <div className="rq-template-meta">{categoryLabel[tpl.category]}</div>
                        </button>
                    ))}
                </div>
                <p className="rq-hint">
                    בחירה בתבנית תמלא עבורך נושא ותוכן התחלתיים — אפשר לערוך לפני שליחה.
                </p>
            </aside>
        </div>
    )
}

export default NewRequest;