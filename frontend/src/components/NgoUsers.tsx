import { useEffect, useState } from "react"
import type { User } from "../models/User"
import { getUsers } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import NgoAdminUser from "./ngo/NgoAdminUser"
import NgoMemberUser from "./ngo/NgoMemberUser"


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

    // return (
    //     <div>
    //         <h3>חברי העמותה</h3>
    //         <div>
    //             {users.map(user => <UserItem key={user._id!} user={user} approveUser={approveUser} declineUser={declineUser} />)}

    //         </div>
    //     </div>
    // )
    return user?.role == "admin" ?  <NgoAdminUser users={users} loadUsers={loadUsers}/>: <NgoMemberUser users={users.filter(u => u.approved)}/>

}
        

export default NgoUsers

