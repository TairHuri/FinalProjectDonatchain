import { useAuth } from "../../contexts/AuthContext"
import { cardStyle } from "../../css/dashboardStyles"

import NgoView from "./NgoView";
import NgoEdit from "./NgoEdit";


const NgoDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit") => void }) => {
    const { ngo, user, updateNgo } = useAuth()

    if (!user || !ngo) return <p>לא בוצעה התחברות לעמותה</p>
    const { token } = user;

    return (
        <div style={cardStyle}>
            {editMode === "view" ? (
                <NgoView ngo={ngo} setEditMode={setEditMode} userRole={user.role} />
            ) : (
                <NgoEdit token={token!} ngoDetails={ngo} setEditMode={setEditMode} updateNgo={updateNgo} />
            )}
        </div >
    )

}


export default NgoDetails;