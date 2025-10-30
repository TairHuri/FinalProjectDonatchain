
import type { User } from "../../models/User";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react"
import { approveUserApi, deleteUserApi, getUsers } from "../../services/api";
import UserItem from "../UserItem";

import "../../css/NgoUsers.css";
import { setUserRoleApi } from "../../services/userApi";
import AlertDialog from "../gui/AlertDialog";


// ----- טיפוסים בסיסיים -----

type NgoMessage = {
    _id: string;
    authorName: string;
    text: string;
    createdAt: string;
};

type Tab = "members" | "pending" | "board";

const NgoAdminUser = ({ users, loadUsers }: { users: User[], loadUsers: () => void }) => {
    const [message, setMessage] = useState<string>('')
    const { user } = useAuth();
    console.log("user=", user);

    const approveUser = async (userId: string) => {
        const res = await approveUserApi(userId)
        if (!res.success) {
            alert('עדכון המשתמש נכשל')
        } else {
            loadUsers()
        }
    }
    const declineUser = async (userId: string) => {
        const res = await deleteUserApi(userId);
        if (!res.success) {
            setMessage('מחיקת המשתמש נכשל')
        } else {
            loadUsers()
        }
    }
    const changeUserRole = async (userId: string, role: string) => {
        const res = await setUserRoleApi(userId, role);
        if (!res.success) {
            setMessage('שינוי התפקיד נכשל')
        } else {
            loadUsers()
        }
    }


    // דאטה דמיוני להודעות עמותה
    const [messages] = useState<NgoMessage[]>([
        {
            _id: "m1",
            authorName: "דנה לוי",
            text: "הי כולם 👋 מחר (רביעי) ב-20:00 יש לייב בוידאו על הקמפיין החדש. חובה למי שאחראי על שיווק.",
            createdAt: "2025-10-28T21:15:00Z",
        },
        {
            _id: "m2",
            authorName: "רועי כהן",
            text: "עדכנתי את הפלייר עם הסכום המעודכן, בבקשה אל תשלחו את הגרסה הקודמת 🙏",
            createdAt: "2025-10-27T10:03:00Z",
        },
    ]);

    // state של טאב
    const [activeTab, setActiveTab] = useState<Tab>("members");




    // הודעה חדשה (וירטואלי)
    const [newMessage, setNewMessage] = useState("");

    // חיתוכים לטאבים
    const activeMembers = users.filter(u => u.approved == true);
    const pendingMembers = users.filter(u => u.approved == false);
    if (!user) return null;
    return (
        <div className={'container'}>
            <AlertDialog show={message != ""} message={message} failureOnClose={() => setMessage("")} />

            {/* טאבים */}
            <div className={'tabsRow'}>
                <button
                    className={`${'tabBtn'} ${activeTab === "members" ? 'tabActive' : ""
                        }`}
                    onClick={() => setActiveTab("members")}
                >
                    חברי עמותה
                    <span className={'tabCount'}>
                        {activeMembers.length}
                    </span>
                </button>

                <button
                    className={`${'tabBtn'} ${activeTab === "pending" ? 'tabActive' : ""
                        }`}
                    onClick={() => setActiveTab("pending")}
                >
                    בקשות הצטרפות
                    <span className={'tabCount'}>
                        {pendingMembers.length}
                    </span>
                </button>

                <button
                    className={`${'tabBtn'} ${activeTab === "board" ? 'tabActive' : ""
                        }`}
                    onClick={() => setActiveTab("board")}
                >
                    לוח הודעות
                    <span className={'tabCount'}>{messages.length}</span>
                </button>
            </div>

            {/* תוכן של הטאב הנבחר */}
            <div className={'tabContentCard'}>
                {activeTab === "members" && (
                    <MembersTable members={activeMembers} loggedinUser={user} changeUserRole={changeUserRole} declineUser={declineUser} />
                )}

                {activeTab === "pending" && (
                    <PendingTable requests={pendingMembers} approveUser={approveUser} declineUser={declineUser} />
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

export default NgoAdminUser;

// ------------------------------------------------------------------
// subcomponents (ויזואלי בלבד, בלי קריאות לשרת)
// ------------------------------------------------------------------

function MembersTable({ members, loggedinUser, changeUserRole, declineUser }: { members: User[], loggedinUser: User, changeUserRole: (userId: string, role: string) => void, declineUser: (userId: string) => void }) {
    const canDemote = members.find(m => m._id != loggedinUser._id && m.role == 'admin')
    return (
        <div className={'tableWrapper'}>
            <table className={'table'}>
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>אימייל</th>
                        <th>טלפון</th>
                        <th>תפקיד</th>
                        {<th>ניהול</th>}
                    </tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m._id}>
                            <td>{m.name || "—"}</td>
                            <td>{m.email}</td>
                            <td>{m.phone}</td>
                            <td>
                                <span className="user-role">{m.role}</span><br />
                                {loggedinUser._id == m._id && <span className={'roleBadgeAdmin'}>{" (את/ה)"}</span>}
                            </td>
                            <td>
                                <div className={'rowActions'}>

                                    {m.role != 'admin' && loggedinUser._id != m._id &&
                                        <button
                                            className={'smallBtn'}
                                            onClick={() => changeUserRole(m._id!, 'admin')}>הפוך למנהל
                                        </button>}

                                    {m.role == 'admin' && canDemote && loggedinUser._id != m._id && 
                                    <button
                                        className={'smallGhostBtn'}
                                        onClick={() => changeUserRole(m._id!, 'member')}                                    >
                                        הורד מניהול
                                    </button>}
                                    {(canDemote || loggedinUser._id != m._id) && <button
                                        className={'smallDangerBtn'}
                                        onClick={() => declineUser(m._id!)}
                                    >
                                        מחק משתמש
                                    </button>}
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PendingTable({
    approveUser,
    declineUser,
    requests,
}: {
    approveUser: (userId: string) => void,
    declineUser: (userId: string) => void,
    requests: User[];
}) {
    if (!requests.length) { return (<div className={'emptyState'}>אין בקשות חדשות כרגע </div>); }

    return (
        <div className={'tableWrapper'}>
            <table className={'table'}>
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>אימייל</th>
                        <th>פעולה</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(user => (
                        <UserItem key={user._id} user={user} approveUser={approveUser} declineUser={declineUser} />
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
                        אין הודעות עדיין. תהיי הראשונה לכתוב משהו ✍️
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
                    onClick={() => alert("כאן יהיה פרסום הודעה")}
                >
                    פרסום הודעה
                </button>
            </div>
        </div>
    );
}

