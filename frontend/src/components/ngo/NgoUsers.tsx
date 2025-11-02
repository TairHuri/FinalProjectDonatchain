
import type { User } from "../../models/User";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useMemo, useState } from "react"
import { approveUserApi, deleteUserApi, getUsers } from "../../services/api";
import UserItem from "../UserItem";

import "../../css/NgoUsers.css";
import { setUserRoleApi } from "../../services/userApi";
import AlertDialog from "../gui/AlertDialog";
import type { Message } from "../../models/Message";
import { getMessagesByNgoId, saveMessage } from "../../services/messageApi";


// ----- טיפוסים בסיסיים -----

type Tab = "members" | "pending" | "board";

const NgoUsers = () => {
    const { user } = useAuth();
    if (!user) return null;

    const defaultMessage = useMemo(() => ({ ngoId: user.ngoId!, text: '', authorName: user.name!, createdBy: user._id! }), [user])
    const [users, setUsers] = useState<User[]>([])
    // דאטה  להודעות עמותה
    const [messages, setMessages] = useState<Message[]>([]);

    // state של טאב
    const [activeTab, setActiveTab] = useState<Tab>("members");

    // הודעה חדשה (וירטואלי)
    const [newMessage, setNewMessage] = useState<Message>(defaultMessage);
    console.log("all users=", users);
    console.log("user=", user);


    const loadMesaages = async () => {
        if (!user || !user.ngoId || !user.token) return;

        try {
            const messages = await getMessagesByNgoId(user?.ngoId, user?.token);
            setMessages(messages)
        } catch (error) {
            setMessage('שגיאה בטעינת הודעות')
            console.log(error);
        }
    }

    const createMessage = async () => {
        try {
            const res = await saveMessage(newMessage, user.token!)
            if (res) {
                setMessages([...messages, res])
                setNewMessage(defaultMessage)
            }
        } catch (error) {
            setMessage('שגיאה בשליחת הודעה')
            console.log(error);
        }
    }

    const loadUsers = async () => {

        if (!user) return;

        const users = await getUsers(user?.ngoId)
        setUsers(users.items)
    }
    useEffect(() => {
        loadUsers();
        loadMesaages();
    }, [])

    const [message, setMessage] = useState<string>('')

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


    // חיתוכים לטאבים
    const activeMembers = users.filter(u => u.approved == true);
    const pendingMembers = users.filter(u => u.approved == false);
    const isCurrentManager = user?.role == 'manager';
    if (!user) return null;
    return (
        <div className={'container'}>
            <AlertDialog show={message != ""} isFailure={true} message={message} failureOnClose={() => setMessage("")} />

            {/* טאבים */}
            {/* TABS */}
            <div className='tabsRow'>
                <button
                    className={`tabBtn ${activeTab === "pending" ? 'tabActive' : ""}`}
                    onClick={() => setActiveTab("members")}
                >
                    חברי עמותה
                    <span className='tabCount'>{activeMembers.length}</span>
                </button>

                {/* טאב בקשות — מנהל בלבד */}
                {isCurrentManager && (
                    <button
                        className={`tabBtn ${activeTab === "pending" ? 'tabActive' : ""}`}
                        onClick={() => setActiveTab("pending")}
                    >
                        בקשות הצטרפות
                        <span className='tabCount'>{pendingMembers.length}</span>
                    </button>
                )}

                <button
                    className={`tabBtn ${activeTab === "board" ? 'tabActive' : ""}`}
                    onClick={() => setActiveTab("board")}
                >
                    לוח הודעות
                    <span className='tabCount'>{messages.length}</span>
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className='tabContentCard'>
                {activeTab === "members" && (
                    <MembersTable members={activeMembers} loggedinUser={user} changeUserRole={changeUserRole} declineUser={declineUser} isCurrentManager={isCurrentManager} />
                )}

                {activeTab === "pending" && isCurrentManager && (
                    <PendingTable requests={pendingMembers} approveUser={approveUser} declineUser={declineUser} />
                )}

                {activeTab === "board" && (
                    <MessageBoard
                        messages={messages}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        createMessage={createMessage}
                    />
                )}
            </div>
        </div>

    );
};

export default NgoUsers;

// ------------------------------------------------------------------
// subcomponents (ויזואלי בלבד, בלי קריאות לשרת)
// ------------------------------------------------------------------

function MembersTable({ members, loggedinUser, changeUserRole, declineUser, isCurrentManager }: { members: User[], loggedinUser: User, changeUserRole: (userId: string, role: string) => void, declineUser: (userId: string) => void, isCurrentManager: boolean }) {
    const canDemote = members.find(m => m._id != loggedinUser._id && m.role == 'manager')

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
                                {loggedinUser._id == m._id && <span className={'roleBadgeManager'}>{" (את/ה)"}</span>}
                            </td>
                            <td>
                                <div className={'rowActions'}>

                                    {isCurrentManager && m.role != 'manager' && loggedinUser._id != m._id &&
                                        <button
                                            className={'smallBtn'}
                                            onClick={() => changeUserRole(m._id!, 'Manager')}>הפוך למנהל
                                        </button>}

                                    {isCurrentManager && m.role == 'manager' && canDemote && loggedinUser._id != m._id &&
                                        <button
                                            className={'smallGhostBtn'}
                                            onClick={() => changeUserRole(m._id!, 'member')}                                    >
                                            הורד מניהול
                                        </button>}
                                    {(isCurrentManager && loggedinUser._id != m._id) && <button
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
type MessageBoardProps = {
    messages: Message[];
    newMessage: Message;
    setNewMessage: (msg: Message) => void;
    createMessage: () => void;
};

function MessageBoard({ messages, newMessage, setNewMessage,createMessage }: MessageBoardProps) {
    return (
        <div className={'boardWrapper'}>
            <div className={'messagesList'}>
                {messages.length === 0 && (
                    <div className={'emptyState'}>
                        אין הודעות עדיין. תהיי הראשונה לכתוב משהו
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
                                    msg.createdAt!
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
                    value={newMessage.text}
                    onChange={e => setNewMessage({ ...newMessage, text: e.target.value })}
                />

                <button
                    className={'primaryBtn'}
                    onClick={createMessage}
                >
                    פרסום הודעה
                </button>
            </div>
        </div>
    );
}

