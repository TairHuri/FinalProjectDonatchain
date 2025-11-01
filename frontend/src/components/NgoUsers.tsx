import { useEffect, useState } from "react"
import type { User } from "../models/User"
import { getUsers } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import NgoMembers from "./ngo/NgoMembers"



const NgoUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    console.log("all users=",users);
    const { user } = useAuth();
    console.log("user=",user);
    
 
    const loadUsers = async () => {

        if (!user) return;

        const users = await getUsers(user?.ngoId)
        setUsers(users.items)
    }
    useEffect(() => {
        loadUsers()
    }, [])

    return  <NgoMembers users={users} loadUsers={loadUsers}/>

}
        

export default NgoUsers

