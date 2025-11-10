import { useEffect, useState } from "react";
import { getNgoList, registerUserExistingNgo, registerUserNewNgo } from "../services/api";
import { Building2, Mail, Lock, Phone, Wallet, IdCard } from "lucide-react";
import type { User, UserRoleType } from "../models/User";
import type { Ngo } from "../models/Ngo";
import NewNgo from "../components/NewNgo";
import { useNavigate } from 'react-router-dom';
import "../css/RegistrationNgo.css"; 
import AlertDialog, { useAlertDialog } from "../components/gui/AlertDialog";

export type NgoMediaType = { logoUrl: File | null, certificate: File | null }

export default function RegistrationNgo() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
  const [newNgo, setNewNgo] = useState<boolean>(false);
  const [ngoList, setNgoList] = useState<Ngo[]>([]);
  const [media, setMedia] = useState<NgoMediaType>({ logoUrl: null, certificate: null });

  const { message, setMessage, showAlert, setShowAlert, isFailure, setIsFailure } = useAlertDialog();

  const [user, setUser] = useState<User>({
    name: "",
    ngoId: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    approved: false,
  });

  const [idNumber, setIdNumber] = useState<string>(""); // 🆔 ת"ז

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
  });

  const handleChangeUser = (field: string, value: string | number) => {
    setUser({ ...user, [field]: value });
  };
  const handleChangeNgo = (field: string, value: string | number) => {
    setNgo({ ...ngo, [field]: value });
  };
  const handleChangeMedia = (field: keyof NgoMediaType, value: FileList | null) => {
    setMedia({ ...media, [field]: value ? value[0] : null });
  };

  const handleChangeData = (field: string, value: string | number) => {
    const n = ngoList.find((x) => x.name === value);
    if (!n) return;
    setUser({ ...user, ngoId: n._id });
  };

  const loadNgoList = async () => {
    const res = await getNgoList();
    setNgoList(res.items);
  };

  //  פונקציה לבדוק תעודת זהות תקינה לפי ספרת ביקורת
  const isValidIsraeliID = (id: string) => {
    id = String(id).trim();
    if (id.length > 9 || isNaN(Number(id))) return false;
    id = id.padStart(9, "0");
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = Number(id[i]) * ((i % 2) + 1);
      if (num > 9) num -= 9;
      sum += num;
    }
    return sum % 10 === 0;
  };

    const isValidBankAccount = (account: string) => {
    if (!account) return false;
    const clean = account.replace(/\D/g, ""); // מסיר תווים לא מספריים
    if (clean.length < 6 || clean.length > 10) return false; // רוב החשבונות בישראל באורך 6-10 ספרות
    if (/^(\d)\1+$/.test(clean)) return false; // כל הספרות זהות (כמו 000000)
    return true;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  בדיקת ת"ז לפני שליחה
    if (!isValidIsraeliID(idNumber)) {
      setIsFailure(true);
      setMessage("תעודת זהות אינה תקינה");
      setShowAlert(true);
      return;
    }

if (newNgo && (!ngo.bankAccount || !isValidBankAccount(ngo.bankAccount))) {
  setIsFailure(true);
  setMessage("מספר חשבון הבנק אינו תקין");
  setShowAlert(true);
  return;
}

    if (!user.email || !user.password || !user.name) {
      setIsFailure(true);
      setMessage("אנא מלאי שם, אימייל וסיסמה");
      setShowAlert(true);
      return;
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
        setIsFailure(false);
        setMessage("עמותה נרשמה בהצלחה");
        setShowAlert(true);
      } else {
        setIsFailure(true);
        setMessage("שגיאה בהרשמה");
        setShowAlert(true);
        alert(res.message);
      }
    } catch (err) {
      setIsFailure(true);
      setMessage("שגיאת שרת");
      setShowAlert(true);
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
            {/* שם משתמש */}
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

            {/* תעודת זהות 🆔 */}
            <div className="input-group">
              <IdCard className="input-icon" />
              <input
                type="text"
                placeholder="תעודת זהות"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="input-field"
                maxLength={9}
                required
              />
            </div>

            {/* אימייל */}
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

            {/* טלפון */}
            <div className="input-group">
              <Phone className="input-icon" />
              <input
                type="tel"
                placeholder="טלפון"
                value={user.phone || ""}
                onChange={(e) => handleChangeUser("phone", e.target.value)}
                className="input-field"
              />
            </div>

            {/* סיסמה */}
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
                    <option key={n._id} value={n.name} />
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
        failureOnClose={() => setShowAlert(false)}
        successOnClose={() => nav("/login/ngo")}
        isFailure={isFailure}
      />
    </>
  );
}
