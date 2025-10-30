import { useState } from "react";
import  "../../css/NgoUsers.css";
import type { User } from "../../models/User";
import UserItem from "../UserItem";

type NgoMessage = {
    _id: string;
    authorName: string;
    text: string;
    createdAt: string;
};

type Tab = "members" | "board";

const NgoUsersMemberView = ({users}:{users: User[]}) => {
    // משתמש נוכחי - שם חשוב שה-role יהיה "member"
    const currentUser = {
        _id: "u2",
        fullName: "רועי כהן",
        role: "member" as const,
        ngoId: "ngo123",
    };

    // const isCurrentAdmin = currentUser.role === "admin"; // פה זה false
    const isCurrentAdmin =false; // פה זה false

    // דמו לרשימת משתמשים
   

    // דמו להודעות
    const [messages] = useState<NgoMessage[]>([
        {
            _id: "m1",
            authorName: "דנה לוי",
            text: "תזכורת ✅ ביום חמישי מגיע צוות צילום. מי שחתם על טופס צילום - להגיע ב-18:30.",
            createdAt: "2025-10-28T21:15:00Z",
        },
        {
            _id: "m2",
            authorName: "רועי כהן",
            text: "הכנתי עותק חדש של הפלאייר באנגלית. מי שצריך רוסים / אמהרית תגידו לי 🙌",
            createdAt: "2025-10-27T10:03:00Z",
        },
    ]);

    // state לטאב
    const [activeTab, setActiveTab] = useState<Tab>("members");

    // הודעה חדשה (ויזואלי בלבד)
    const [newMessage, setNewMessage] = useState("");

    // פרטי עמותה (ללא עריכה)
    const [ngoDraft] = useState({
        name: "עמותת לב פתוח",
        description:
            "אנחנו מלווים משפחות במצבי קיצון, גיוס חירום שקוף ופרסום מלא של שימוש בכסף.",
        website: "https://open-heart.example.org",
    });

    return (
        <div className={'container'}>
            <div className={'tabsRow'}>
                <button
                    className={`${'tabBtn'} ${
                        activeTab === "members" ? 'tabActive' : ""
                    }`}
                    onClick={() => setActiveTab("members")}
                >
                    חברי עמותה
                    <span className={'tabCount'}>{users.length}</span>
                </button>

                <button
                    className={`${'tabBtn'} ${
                        activeTab === "board" ? 'tabActive' : ""
                    }`}
                    onClick={() => setActiveTab("board")}
                >
                    לוח הודעות
                    <span className={'tabCount'}>{messages.length}</span>
                </button>
            </div>

            {/* התוכן בהתאם לטאב */}
            <div className={'tabContentCard'}>
                {activeTab === "members" && (
                    <MembersTable
                        currentUserId={currentUser._id}
                        isCurrentAdmin={isCurrentAdmin}
                        members={users}
                    />
                )}

                {activeTab === "board" && (
                    <MessageBoard
                        messages={messages}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                    />
                )}
            </div>
        </div>
    );
};

export default NgoUsersMemberView;

// ------------------------------------------------------
// תתי קומפוננטות — אותן תתי קומפוננטות כמעט בדיוק
// ------------------------------------------------------

function MembersTable({
    isCurrentAdmin,
    members,
}: {
    currentUserId: string;
    isCurrentAdmin: boolean;
    members: User[];
}) {
    return (
        <div className={'tableWrapper'}>
            <table className={'table'}>
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>אימייל</th>
                        <th>טלפון</th>
                        <th>תפקיד</th>

                        {/* אם המשתמש הנוכחי הוא לא אדמין - לא נוסיף עמודת "ניהול" בכלל */}
                        {isCurrentAdmin && <th>ניהול</th>}
                    </tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <UserItem key={m._id} user={m}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function MessageBoard({
    messages,
    newMessage,
    setNewMessage,
}: {
    messages: NgoMessage[];
    newMessage: string;
    setNewMessage: (val: string) => void;
}) {
    return (
        <div className={'boardWrapper'}>
            <div className={'messagesList'}>
                {messages.length === 0 && (
                    <div className={'emptyState'}>
                        אין הודעות עדיין. 
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg._id} className={'messageCard'}>
                        <div className={'messageHeader'}>
                            <span className={'messageAuthor'}>
                                {msg.authorName}
                            </span>
                            <span className={'messageTime'}>
                                {new Date(
                                    msg.createdAt
                                ).toLocaleString("he-IL")}
                            </span>
                        </div>
                        <div className={'messageBody'}>{msg.text}</div>
                    </div>
                ))}
            </div>

            <div className={'messageComposer'}>
                <textarea
                    className={'textarea'}
                    placeholder="להשאיר הודעה לחברי העמותה..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                />

                <button
                    className={'primaryBtn'}
                    onClick={() =>
                        alert("כאן החבר הרגיל מפרסם הודעה פנימית")
                    }
                >
                    פרסום הודעה
                </button>
            </div>
        </div>
    );
}
