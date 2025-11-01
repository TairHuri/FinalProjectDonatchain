
import { useEffect, useState } from "react";
import { getNgoList, registerUserExistingNgo, registerUserNewNgo } from "../services/api";
import { Building2, Mail, Lock, Phone } from "lucide-react";
import type { User } from "../models/User";
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


  const {message, setMessage, showAlert, setShowAlert, isFailure, setIsFailure} = useAlertDialog()
  const [user, setUser] = useState<User>({
    name: "",
    ngoId: "",
    email: "",
    phone: "",
    password: "",
    role: 'member',
    approved: false
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
    certificate: '',
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
    const n = ngoList.find(x => x.name === value);
    if (!n) return;
    setUser({ ...user, ngoId: n._id });
  };

  const loadNgoList = async () => {
    const res = await getNgoList();
    setNgoList(res.items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email || !user.password || !user.name) {
      setIsFailure(true);
      setMessage("אנא מלאי שם, אימייל וסיסמה");
      setShowAlert(true);
      return;
    }
    try {
      let res;
      if (newNgo) {
        const u = { ...user, role: 'manger' as 'manger'|'member'};
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

  useEffect(() => { loadNgoList(); }, []);

  return (
    <>
      <div className="login-page" dir="rtl">{/* 📌 שימוש באותה עטיפה כמו ההתחברות */}
        <div className="login-card">{/* 📌 אותו כרטיס כמו בהתחברות */}
          <h1 className="login-title">הרשמת עמותה</h1>{/* 📌 אותו סטייל כותרת */}

          {/* 📌 טוגל בסגנון פשוט ונקי, כמו שני כפתורי צ'יפס */}
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

          <form onSubmit={handleSubmit} className="login-form">{/* 📌 אותה מחלקה של טופס כמו בהתחברות */}
            {/* שם משתמש */}
            <div className="input-group">{/* 📌 אותו מבנה כמו ההתחברות */}
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

            {/* בחירת מצב */}
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
              <div className="input-group">{/* 📌 שורת בחירת עמותה קיימת בסגנון ההתחברות */}
                <Building2 className="input-icon" />
                <input
                  type="text"
                  list="ngoList"
                  placeholder="חפשי ובחרי עמותה קיימת…"
                  onChange={(e) => handleChangeData("ngoId", e.target.value)}
                  className="input-field"
                />
                <datalist id="ngoList">
                  {ngoList.map(n => (
                    <option key={n._id} value={n.name} />
                  ))}
                </datalist>
              </div>
            )}

            {/* תקנון + כפתור */}
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
        successOnClose={() => nav('/login/ngo')}
        isFailure={isFailure}
      />
    </>
  );


}
