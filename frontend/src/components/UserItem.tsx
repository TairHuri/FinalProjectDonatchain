
import type { User } from "../models/User"

// This component renders a single user row inside a table.
// It receives a `user` object (from the User model) and optional
// callback functions `approveUser` and `declineUser` for handling 
// approval or rejection of the user.  

// If `approveUser` and `declineUser` are provided, an extra cell
// is rendered with action buttons:
// - "Approve" button calls `approveUser` with the user's ID.
// - "Decline/Delete" button calls `declineUser` with the user's ID.

// Each row displays the following user info:
// - Name
// - Email
// - Phone
// - Role (e.g., admin, NGO, donor)

// Usage example:
// <UserItem user={someUser} approveUser={handleApprove} declineUser={handleDecline} />

const UserItem = ({ user, approveUser, declineUser }: { user: User, approveUser?: (userId: string) => void, declineUser?: (userId: string) => void }) => {
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