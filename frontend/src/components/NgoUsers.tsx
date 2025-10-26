import { useEffect, useState } from "react"
import type { User } from "../models/User"
import { approveUserApi, deleteUserApi, getUsers } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import UserItem from "./UserItem"


const NgoUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    console.log("all users=",users);
    const { user } = useAuth();
    console.log("user=",user);
    
    const approveUser = async (userId: string) => {
        const res = await approveUserApi(userId)
        if (!res.success) {
            alert('עדכון המשתמש נכשל')
        }else{
            loadUsers()
        }
    }
    const declineUser = async (userId: string) => {
        const res = await deleteUserApi(userId);
        if (!res.success) {
            alert('מחיקת המשתמש נכשל')
        }else{
            loadUsers()
        }
    }
    const loadUsers = async () => {

        if (!user) return;
        const users = await getUsers(user?.ngoId)
        setUsers(users.items)
    }
    useEffect(() => {
        loadUsers()
    }, [])
    return (
        <div>
            <h3>חברי העמותה</h3>
            <div>
                {users.map(user => <UserItem key={user._id!} user={user} approveUser={approveUser} declineUser={declineUser} />)}

            </div>
        </div>
    )
}

export default NgoUsers