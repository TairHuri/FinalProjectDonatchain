
import type { User } from "../models/User"

const UserItem = ({ user, approveUser, declineUser }: { user: User, approveUser?: (userId: string) => void, declineUser?: (userId: string) => void }) => {
    // const {user:loggedinUser} = useAuth()

    return (
        <tr >
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.role}</td>
            {approveUser && declineUser && <td>
                <div className={'rowActions'}>
                    <button
                        className={'smallBtn'}
                        onClick={() => approveUser(user._id!)
                        }
                    >
                        אשר
                    </button>
                    <button
                        className={'smallDangerBtn'}
                        onClick={() =>
                            declineUser(user._id!)
                        }
                    >
                        מחק / דחה
                    </button>
                </div>
            </td>}
        </tr>
    )
}


export default UserItem;