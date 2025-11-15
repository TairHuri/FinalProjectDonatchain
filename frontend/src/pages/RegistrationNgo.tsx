import { useEffect, useState } from "react";
import { getNgoList, registerUserExistingNgo, registerUserNewNgo } from "../services/api";
import { Building2, Mail, Lock, Phone, IdCard } from "lucide-react";
import type { User, UserRoleType } from "../models/User";
import type { Ngo, NgoMediaType } from "../models/Ngo";

import NewNgo from "../components/NewNgo";
import { useNavigate } from 'react-router-dom';
import "../css/RegistrationNgo.css";
import AlertDialog, { useAlertDialog } from "../components/gui/AlertDialog";
import { getNgoTags } from "../services/ngoApi";

//export type NgoMediaType = { logoUrl: File | null, certificate: File | null }

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

  const [idNumber, setIdNumber] = useState<string>("");

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


  // בדיקת תקינות תעודת זהות
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
    const clean = account.replace(/\D/g, "");
    if (clean.length < 6 || clean.length > 10) return false;
    if (/^(\d)\1+$/.test(clean)) return false;
    return true;
  };

  const isValidCryptoWallet = (wallet: string) => {
    if (!wallet) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(wallet.trim());
  };
  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // בדיקת ת"ז
    if (!isValidIsraeliID(idNumber)) {
      setAlert("תעודת זהות אינה תקינה", true);
      return;
    }

    // בדיקות שדות חובה למשתמש
    if (!user.name || !user.email || !user.password || !user.phone) {
      setAlert("יש למלא את כל שדות המשתמש: שם, אימייל, טלפון וסיסמה", true);
      return;
    }
    if (!isValidPassword(user.password)) {
      setAlert("הסיסמה חייבת להכיל לפחות 8 תווים, כולל אות גדולה, אות קטנה, ספרה ותו מיוחד", true);
      return;
    }
    if (newNgo) {
      // בדיקות חובה לעמותה חדשה (למעט website ולוגו)
      const requiredNgoFields: (keyof Ngo)[] = [
        "name",
        "description",
        "bankAccount",
        "wallet",
        "address",
        "phone",
        "email",
        "ngoNumber",
      ];

      for (const field of requiredNgoFields) {
        if (!ngo[field]) {
          setAlert("יש למלא את כל שדות העמותה (למעט אתר ולוגו)", true);
          return;
        }
      }

      const existingNgo = ngoList.find(
        (n) =>
          n.name.trim() === ngo.name.trim() ||
          (n.ngoNumber && n.ngoNumber.trim() === ngo.ngoNumber.trim())
      );

      if (existingNgo) {
        setAlert("עמותה בשם זה או עם מספר עמותה זה כבר קיימת במערכת.", true);
        return;
      }

      // בדיקת תעודה חובה
      if (!media.certificate) {
        setAlert("יש להעלות תעודת רישום עמותה (קובץ אישור).", true);
        return;
      }

      // בדיקת תקינות חשבון בנק
      if (!isValidBankAccount(ngo.bankAccount || "")) {
        setAlert("מספר חשבון הבנק אינו תקין. יש להזין בין 6 ל-10 ספרות בלבד.", true);
        return;
      }

      if (!isValidIsraeliID(idNumber)) {
        setAlert("תעודת זהות אינה תקינה", true);
        return;
      }

      if (newNgo && (!ngo.wallet || !isValidCryptoWallet(ngo.wallet))) {
        setAlert("כתובת ארנק הקריפטו אינה תקינה. ודאי שהיא מתחילה ב-0x ומכילה 42 תווים.", true);
        return;
      }

    } else {
      // עמותה קיימת — חובה לבחור אחת
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
