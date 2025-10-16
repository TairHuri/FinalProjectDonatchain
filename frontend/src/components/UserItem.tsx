import { useAuth } from "../contexts/AuthContext";
import type { User } from "../models/User"

const UserItem = ({ user, approveUser, declineUser }: { user: User, approveUser: (userId: string) => void, declineUser: (userId: string) => void }) => {
    const {user:loggedinUser} = useAuth()
    if(!loggedinUser)return <p>Please login</p>
    return (
        <div key={user._id}>
            <label>{user.name}</label>
            {user._id != loggedinUser._id && !user.approved && <>
                <button type="button" onClick={() => approveUser(user._id!)}>אשר</button>
                <button type="button" onClick={() => declineUser(user._id!)}>דחה</button>
            </>}
        </div>
    )
}

export default UserItem;