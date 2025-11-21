import { useEffect, useState } from "react";
import { getNgoList, registerUserExistingNgo, registerUserNewNgo } from "../services/api";
import { Building2, Mail, Lock, Phone } from "lucide-react";
import type { User, UserRoleType } from "../models/User";
import type { Ngo, NgoMediaType } from "../models/Ngo";

import NewNgo from "../components/NewNgo";
import { useNavigate } from 'react-router-dom';
import "../css/RegistrationNgo.css";
import AlertDialog, { useAlertDialog } from "../components/gui/AlertDialog";
import { validateNgo, validateUser } from "../validations/registration.validation";



export default function RegistrationNgo() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
  const [newNgo, setNewNgo] = useState<boolean>(false);
  const [ngoList, setNgoList] = useState<Ngo[]>([]);
  const [media, setMedia] = useState<NgoMediaType>({ logoUrl: null, certificate: null });

  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();

  const [user, setUser] = useState<User>({
    name: "",
    ngoId: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    approved: false,
  });


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

  const handleChangeUser = (field: string, value: string | number) => {
    setUser({ ...user, [field]: value });
  };
  const handleChangeNgo = (field: string, value: string | number | string[]) => {
    setNgo({ ...ngo, [field]: value });
  };
  const handleChangeMedia = (field: keyof NgoMediaType, value: FileList | null) => {
    setMedia({ ...media, [field]: value ? value[0] : null });
  };

  const handleChangeData = (field: string, value: string | number) => {
    const n = ngoList.find(
      (x) =>
        x.name === value ||
        (x.ngoNumber && x.ngoNumber.toString() === value.toString())
    );
    if (!n) return;
    setUser({ ...user, ngoId: n._id });
  };


  const loadNgoList = async () => {
    const res = await getNgoList();
    setNgoList(res.items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // בדיקות שדות חובה למשתמש
    const validUser = validateUser(user)
    if (!validUser.status) {
      setAlert(validUser.message, true);
    }
    if (newNgo) {
      // בדיקות חובה לעמותה חדשה (למעט website ולוגו)
      const validNgo = validateNgo(ngo, ngoList, media)
      if (!validNgo.status) {
        setAlert(validNgo.message, true);
      }
    } else {

      if (!user.ngoId) {
        setAlert("יש לבחור עמותה קיימת מהרשימה", true);
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
              <div className="input-group">
                <Building2 className="input-icon" />
                <input
                  type="text"
                  list="ngoList"
                  placeholder="חפשי ובחרי עמותה קיימת…"
                  onChange={(e) => handleChangeData("ngoId", e.target.value)}
                  className="input-field"
                />
                <datalist id="ngoList">
                  {ngoList.map((n) => (
                    <option
                      key={n._id}
                      value={n.name}
                      label={n.ngoNumber ? `(${n.ngoNumber})` : ""}
                    />
                  ))}
                </datalist>

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
