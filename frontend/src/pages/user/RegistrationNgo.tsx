import { useEffect, useState } from "react";
import { getNgoList, registerUserExistingNgo, registerUserNewNgo } from "../../services/ngoApi";
import { Building2, Mail, Lock, Phone } from "lucide-react";
import type { User, UserRoleType } from "../../models/User";
import type { Ngo, NgoMediaType } from "../../models/Ngo";

import NewNgo from "../../components/ngo/NewNgo";
import { useNavigate } from 'react-router-dom';
import AlertDialog, { useAlertDialog } from "../../components/gui/AlertDialog";
import { validateNgo, validateUser } from "../../validations/registration.validation";
import { verifyNgoNumber } from "../../services/ngoApi";
import PickerList, { usePickerList } from "../../components/gui/PickerList";

import "../../css/ngo/RegistrationNgo.css";


export default function RegistrationNgo() {
  const nav = useNavigate();
  
  // Indicates whether user is registering a new NGO or joining an existing one
  const [agree, setAgree] = useState(false);
  // Indicates whether user is registering a new NGO or joining an existing one
  const [newNgo, setNewNgo] = useState<boolean>(false);
   // List of existing NGOs fetched from API
  const [ngoList, setNgoList] = useState<Ngo[]>([]);
   // Holds uploaded media (logo + certificate)
  const [media, setMedia] = useState<NgoMediaType>({ logoUrl: null, certificate: null });
   // Picker state for selecting an existing NGO
  const { openPicker, setOpenPicker, selectedItemId, setSelectedItemId } = usePickerList();
    // Alert dialog state and handlers
  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();

   // New user details (common in both flows: new NGO or existing NGO)
  const [user, setUser] = useState<User>({
    name: "",
    ngoId: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    approved: false,
  });


    // New NGO details (used only when creating new NGO)
  const [ngo, setNgo] = useState<Ngo>({
    _id: "",
    name: "",
    description: "",
    website: "",
    bankAccount: "",
    wallet: "",
    address: "",
    phone: "",
    email: "",
    logoUrl: "",
    createdBy: "",
    createdAt: new Date(),
    ngoNumber: "",
    certificate: "",
    isActive: true,
    tags: [],
  });

   // Update user values dynamically by field
  const handleChangeUser = (field: string, value: string | number) => {
    setUser({ ...user, [field]: value });
  }; // Update NGO details dynamically
  const handleChangeNgo = (field: string, value: string | number | string[]) => {
    setNgo({ ...ngo, [field]: value });
  };  // Update uploaded files (logo / certificate)
  const handleChangeMedia = (field: keyof NgoMediaType, value: FileList | null) => {
    setMedia({ ...media, [field]: value ? value[0] : null });
  };

   // Automatically bind selected NGO ID from picker to user state
useEffect(() => {
  if (!selectedItemId) {
    setUser(prev => ({ ...prev, ngoId: "" }));
    return;
  }

  setUser(prev => ({ ...prev, ngoId: selectedItemId }));
}, [selectedItemId]);


 // Fetch existing NGOs for registration list
  const loadNgoList = async () => {
    const res = await getNgoList();
    setNgoList(res.items);
  };
// Form submission handler (validations + API calls)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validUser = validateUser(user)
    if (!validUser.status) {
      setAlert(validUser.message, true);
      return;
    }
    if (newNgo) {

      const validNgo = validateNgo(ngo, ngoList, media)
      if (!validNgo.status) {
        setAlert(validNgo.message, true);
        return;
      }
      const result = await verifyNgoNumber(ngo.ngoNumber)
      if (!result.status) {
        setAlert(result.message, true);
        return;
      }
    } else {

if (!user.ngoId && !newNgo) {
  setAlert("יש לבחור עמותה קיימת מהרשימה בלבד. אין להקליד ידנית.", true);
  return;
}

    }

    try {
      let res;
      if (newNgo) {
        const u = { ...user, role: "manager" as UserRoleType };
        res = await registerUserNewNgo(u, ngo, media);
      } else {
        res = await registerUserExistingNgo(user);
      }

      if (res.success) {
        setAlert("ההרשמה בוצעה בהצלחה!", false);
      } else {
        setAlert(res.message || "שגיאה בהרשמה", true);
      }
    } catch (err) {
      setAlert("שגיאת שרת", true);
    }
  };

  useEffect(() => {
    loadNgoList();
  }, []);

  return (
    <>
      <div className="login-page" dir="rtl">
        <div className="login-card">
          <h1 className="login-title">הרשמת עמותה</h1>

          <div className="segmented" dir="rtl">
            <button
              type="button"
              className={`seg-item ${newNgo ? "active" : ""}`}
              onClick={() => setNewNgo(true)}
            >
              צור עמותה חדשה
            </button>
            <button
              type="button"
              className={`seg-item ${!newNgo ? "active" : ""}`}
              onClick={() => setNewNgo(false)}
            >
              הצטרף לעמותה קיימת
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <Building2 className="input-icon" />
              <input
                type="text"
                placeholder="שם חבר/ת העמותה"
                value={user.name}
                onChange={(e) => handleChangeUser("name", e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="אימייל"
                value={user.email || ""}
                onChange={(e) => handleChangeUser("email", e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <Phone className="input-icon" />
              <input
                type="tel"
                placeholder="טלפון"
                value={user.phone || ""}
                onChange={(e) => handleChangeUser("phone", e.target.value)}
                className="input-field"
                required
                dir="rtl"
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type="password"
                placeholder="סיסמה"
                value={user.password}
                onChange={(e) => handleChangeUser("password", e.target.value)}
                className="input-field"
                required
              />
            </div>

            {newNgo ? (
              <>
                <div className="section-divider"><span>פרטי עמותה חדשה</span></div>
                <NewNgo
                  ngo={ngo}
                  media={media}
                  handleChangeNgo={handleChangeNgo}
                  handleChangeMedia={handleChangeMedia}
                />
              </>
            ) : (
              <div className="input-group input-existing-ngo">

                <Building2 className="input-icon" />
                <PickerList useNgo={true} openPicker={openPicker} setOpenPicker={setOpenPicker} selectedItemId={selectedItemId} setSelectedItemId={setSelectedItemId} list={ngoList.map(c => ({ _id: c._id, name: `${c.name} | ${c.ngoNumber}` }))} />
              </div>
            )}

            <label className="agree-inline">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              אני מאשר/ת את{" "}
              <a href="/about/rules" target="_blank" rel="noopener noreferrer">
                תקנון האתר
              </a>
            </label>

            <button type="submit" className="login-btn" disabled={!agree}>
              צור חשבון
            </button>
          </form>
        </div>
      </div>

      <AlertDialog
        show={showAlert}
        failureTitle="שגיאה"
        successTitle=""
        message={message}
        failureOnClose={clearAlert}
        successOnClose={() => nav("/login/ngo")}
        isFailure={isFailure}
      />
    </>
  );
}
