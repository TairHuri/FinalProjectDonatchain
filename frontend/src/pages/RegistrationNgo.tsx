import { useEffect, useState, type ReactNode } from "react";
import { getNgoList, registerUserExistingNgo, registerUserNewNgo } from "../services/api";
import { Building2, Mail, Lock, Phone } from "lucide-react";
import type { User } from "../models/User";
import type { Ngo } from "../models/Ngo";
import { Input, InputWithIcon } from "../components/gui/InputText";
import NewNgo from "../components/NewNgo";
import {useNavigate} from 'react-router-dom'
import { buttonStyle, iconLogin, ngoListStyle, toggleGroup, toggleOff, toggleOn } from "../css/dashboardStyles";

export type NgoMediaType={logoUrl:File|null, certificate:File|null}
export default function RegistrationNgo() {
  const nav = useNavigate();
  const [agree, setAgree] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    ngoId: "",
    email: "",
    phone: "",
    password: "",
    roles: [],
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
    //token: "",
    ngoNumber: "",
    certificate:'',
  });
  const [media, setMedia] = useState<NgoMediaType>({logoUrl: null, certificate:null})
  const [ngoList, setNgoList] = useState<Ngo[]>([])

  const [newNgo, setNewNgo] = useState<boolean>(false)


  const handleChangeUser = (field: string, value: string | number) => {
    setUser({ ...user, [field]: value });
  };
  const handleChangeNgo = (field: string, value: string | number) => {
    setNgo({ ...ngo, [field]: value });
  };
  const handleChangeMedia = (field: keyof NgoMediaType, value: FileList|null) => {
    setMedia({ ...media, [field]: value?value[0]:null });
  };
  const handleChangeData = (
   field: string, value: string | number
  ) => {
    const ngo = ngoList.find(n => n.name == value)
    if (!ngo) {
      //TODO optionally create new NGO
      return;
    }
    setUser({ ...user, ngoId: ngo._id });
    console.log(field, value);

  };

  const loadNgoList = async () => {
    const ngoList = await getNgoList()
    setNgoList(ngoList.items)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.email || !user.password || !user.name) {
      alert("אנא מלאי שם, אימייל וסיסמה");
      return;
    }

    try {
      let res;
      if (newNgo) {
        res = await registerUserNewNgo(user, ngo, media);
      } else {
        res = await registerUserExistingNgo(user);
      }

      if (res.success) {
        alert("עמותה נרשמה בהצלחה!");
        nav('/login/ngo')
      } else {
        alert(res.message || "שגיאה בהרשמה");
      }
    } catch (err) {
      alert("שגיאת שרת");
    }
  };
  useEffect(() => {
    loadNgoList()
  }, [])
  return (
    <div>
      <div>
        <h1 className="text-center"> 
          הרשמת עמותה
        </h1>
        <p>
          הצטרפי אלינו והשאירי חותם חיובי בעולם ✨</p>

        <form onSubmit={handleSubmit}>
          {/* שם עמותה */}
          <InputWithIcon
            label="שם חבר העמותה"
            field="name"
            onChange={handleChangeUser}
            value={user.name}
            Icon={<Building2 style={iconLogin}/>} />
          <InputWithIcon
            label="אימייל"
            field="email"
            type="email"
            onChange={handleChangeUser}
            value={user.email || ""}
            Icon={<Mail style={iconLogin}/>} />
          <InputWithIcon
            label="טלפון"
            field="phone"
            onChange={handleChangeUser}
            value={user.phone || ""}
            Icon={<Phone style={iconLogin}/>} />
          <InputWithIcon
            label="סיסמה"
            field="password"
            type="password"
            onChange={handleChangeUser}
            value={user.password}
            Icon={<Lock style={iconLogin}/>} />

          <ToggleButton state={newNgo} labelOn="צור עמותה" labelOff="התחבר לעמותה קיימת" onToggle={() => setNewNgo(!newNgo)} />
          {newNgo ? <NewNgo ngo={ngo} media={media} handleChangeNgo={handleChangeNgo} handleChangeMedia={handleChangeMedia}/>
            :
            <div>
              <Input type="text" list="ngoList" onChange={handleChangeData} label="" field="ngoId" value={user.ngoId} disabled={ngoList.length == 0} required={true} />
              <datalist id="ngoList" >
                {ngoList.map(n => <option key={n._id} value={n.name} />)}
              </datalist>
            </div>}
          
          <div dir="rtl">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        אני מאשר/ת את <a href="/about/rules" target="_blank" rel="noopener noreferrer">תקנון האתר</a>
      </label>
            <button
             disabled={!agree}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
              style={buttonStyle}
            >
              צור חשבון
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ToggleButton = ({ state, labelOn, labelOff, onToggle }: { state: boolean, labelOn: string, labelOff: string, onToggle: () => void }) => {

  return (
    <div className="md:col-span-2" style={toggleGroup}>
      <span onClick={onToggle} style={state ? toggleOn : toggleOff}>{labelOn}</span>
      <span onClick={onToggle} style={state ? toggleOff : toggleOn}>{labelOff}</span>
    </div>
  )
}