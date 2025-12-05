import { useEffect, useState } from "react";
import { categoryLabel, type AdminRequestByUser, type RequestCategoryType } from "../../models/Request";
import { useAuth } from "../../contexts/AuthContext";
import { createRequest, getTemplates } from "../../services/requestApi";


// Component to create a new admin request + choose predefined templates
const NewRequest = ({ setActiveTab }: { setActiveTab: (tab: 'new' | 'list') => void }) => {
    const { user } = useAuth()

    // Holds predefined request templates fetched from the server
    const [templates, setTemplates] = useState<AdminRequestByUser[]>([]);

    // Controlled form inputs
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState<RequestCategoryType>("general");
    const [body, setBody] = useState("");

    // Maximum characters allowed in the message body
    const [charLimit] = useState(1200);

    // Live validation values
    const remaining = charLimit - body.length;
    const isInvalid = subject.trim().length < 3 || body.trim().length < 10 || remaining < 0;

    // Load request templates on component mount
    useEffect(() => {
        getTemplates(user!.token!).then(templates => setTemplates(templates))
    }, [])

    // Fill form with data from the selected template
    const onPickTemplate = (tpl: AdminRequestByUser) => {
        setSubject(tpl.subject);
        setBody(tpl.body);
        setCategory(tpl.category);
        setActiveTab("new");
    };

    // Handle form submit and send request to server
    const handleSubmit = async (e: React.FormEvent) => {
        if (!user || !user._id || !user.token) return;

        e.preventDefault();
        if (isInvalid) return;

        // Construct request payload for API
        const request: AdminRequestByUser = {
            subject,
            category,
            body,
            userId: user._id,
            ngoId: user.ngoId,
            status: 'pending',
            adminComment: ''
        };

        // Send request to backend
        await createRequest(request, user.token);

        // Reset form after success
        setSubject("");
        setBody("");
        setCategory("general");
    };


    return (
        <div className="rq-grid">

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