// import { iconLogin } from "../css/dashboardStyles";
// import type { Ngo } from "../models/Ngo"
// import type { NgoMediaType } from "../pages/RegistrationNgo";
// import { Input, InputFileWithIcon, InputWithIcon } from "./gui/InputText"
// import { Mail, MapPin, Phone, CreditCard, Wallet, Building2 } from "lucide-react";


// const NewNgo = ({ ngo, media, handleChangeNgo, handleChangeMedia }: { ngo: Ngo, media:NgoMediaType, handleChangeNgo: (field: string, value: string | number) => void, handleChangeMedia:(field: keyof NgoMediaType, value: FileList|null)=>void }) => {

//   return (
//     <>
//       <InputWithIcon
//         label="שם העמותה"
//         field="name"
//         onChange={handleChangeNgo}
//         value={ngo.name}
//         Icon={<Building2 style={iconLogin} />} />
//       <InputWithIcon
//         label="מספר העמותה"
//         field="ngoNumber"
//         onChange={handleChangeNgo}
//         value={ngo.ngoNumber} />
//       <InputWithIcon
//         label="אימייל עמותה"
//         field="email"
//         type="email"
//         onChange={handleChangeNgo}
//         value={ngo.email || ""}
//         Icon={<Mail style={iconLogin} />} />

//       <InputWithIcon
//         label="כתובת"
//         field="address"
//         onChange={handleChangeNgo}
//         value={ngo.address || ""}
//         Icon={<MapPin style={iconLogin} />} />

//       <InputWithIcon
//         label="טלפון עמותה"
//         field="phone"
//         onChange={handleChangeNgo}
//         value={ngo.phone || ""}
//         Icon={<Phone style={iconLogin} />} />


//       <InputWithIcon
//         label="חשבון בנק עמותה"
//         field="bankAccount"
//         onChange={handleChangeNgo}
//         value={ngo.bankAccount || ""}
//         Icon={<CreditCard style={iconLogin} />} />

//       <InputWithIcon
//         label="ארנק קריפטו עמותה"
//         field="wallet"
//         onChange={handleChangeNgo}
//         value={ngo.wallet || ""}
//         Icon={<Wallet style={iconLogin} />} />

//       <InputWithIcon
//         label="תיאור מטרות העמותה"
//         placeholder="תאר/י בקצרה את מטרות העמותה"
//         field="description"
//         isMultiLine={true}
//         onChange={handleChangeNgo}
//         value={ngo.description || ""}
//         className="w-full border rounded-full p-3 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none" />

//       <InputFileWithIcon<NgoMediaType>
//         label="לוגו עמותה"
//         field="logoUrl"
//         onChange={handleChangeMedia}
//         value={media.logoUrl}
//         accept="image/*"
//         Icon={<Wallet style={iconLogin} />} />

//       {media.logoUrl && <img src={URL.createObjectURL(media.logoUrl)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}  
      
//        <InputFileWithIcon<NgoMediaType>
//         label="אישור עמותה"
//         field="certificate"
//         onChange={handleChangeMedia}
//         value={media.certificate}
//         accept="application/pdf"
//         Icon={<Wallet style={iconLogin} />} />
//     </>
//   )
// }

// export default NewNgo


import type { Ngo } from "../models/Ngo";
import type { NgoMediaType } from "../pages/RegistrationNgo";
import { Mail, MapPin, Phone, CreditCard, Wallet, Building2,File,Image,IdCard,ScreenShare } from "lucide-react";

type Props = {
  ngo: Ngo;
  media: NgoMediaType;
  handleChangeNgo: (field: string, value: string | number) => void;
  handleChangeMedia: (field: keyof NgoMediaType, value: FileList | null) => void;
};

const NewNgo = ({ ngo, media, handleChangeNgo, handleChangeMedia }: Props) => {
  return (
    <>
      {/* שם העמותה */}
      <div className="input-group">
        <Building2 className="input-icon" />
        <input
          type="text"
          placeholder="שם העמותה"
          value={ngo.name}
          onChange={(e) => handleChangeNgo("name", e.target.value)}
          className="input-field"
          required
        />
      </div>

      {/* מספר עמותה */}
      <div className="input-group">
        <IdCard className="input-icon"/>
        <input
          type="text"
          placeholder="מספר עמותה"
          value={ngo.ngoNumber}
          onChange={(e) => handleChangeNgo("ngoNumber", e.target.value)}
          className="input-field"
        />
      </div>

      {/* אימייל עמותה */}
      <div className="input-group">
        <Mail className="input-icon" />
        <input
          type="email"
          placeholder="אימייל עמותה"
          value={ngo.email || ""}
          onChange={(e) => handleChangeNgo("email", e.target.value)}
          className="input-field"
        />
      </div>

      {/* כתובת */}
      <div className="input-group">
        <MapPin className="input-icon" />
        <input
          type="text"
          placeholder="כתובת"
          value={ngo.address || ""}
          onChange={(e) => handleChangeNgo("address", e.target.value)}
          className="input-field"
        />
      </div>

      {/* טלפון */}
      <div className="input-group">
        <Phone className="input-icon" />
        <input
          type="tel"
          placeholder="טלפון עמותה"
          value={ngo.phone || ""}
          onChange={(e) => handleChangeNgo("phone", e.target.value)}
          className="input-field"
        />
      </div>

      
      {/* אתר */}
      <div className="input-group">
        <ScreenShare className="input-icon" />
        <input
          type="text"
          placeholder="קישור לאתר העמותה"
          value={ngo.website || ""}
          onChange={(e) => handleChangeNgo("website", e.target.value)}
          className="input-field"
        />
      </div>

      {/* חשבון בנק */}
      <div className="input-group">
        <CreditCard className="input-icon" />
        <input
          type="text"
          placeholder="חשבון בנק עמותה"
          value={ngo.bankAccount || ""}
          onChange={(e) => handleChangeNgo("bankAccount", e.target.value)}
          className="input-field"
        />
      </div>

      {/* ארנק קריפטו */}
      <div className="input-group">
        <Wallet className="input-icon" />
        <input
          type="text"
          placeholder="ארנק קריפטו עמותה"
          value={ngo.wallet || ""}
          onChange={(e) => handleChangeNgo("wallet", e.target.value)}
          className="input-field"
        />
      </div>

      {/* תיאור מטרות העמותה */}
      <div className="input-group">
        {/* אפשר להציג כאן גם אייקון אם רוצים */}
        <textarea
          placeholder="תאר/י בקצרה את מטרות העמותה"
          value={ngo.description || ""}
          onChange={(e) => handleChangeNgo("description", e.target.value)}
          className="input-field textarea-like"
        />
      </div>

      {/* העלאת לוגו */}
      <span className="section-title">העלאת לוגו עמותה </span>
      <div className="input-group  file-upload-group">
        <Image className="input-icon" />
        <div className="file-upload" style={{ width: "100%" }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChangeMedia("logoUrl", e.target.files)}
          className="input-field file-field"
        />
        <button type="button" className="fake-btn">בחר/י קובץ</button>
         <span className="file-name">
          {media.logoUrl ? media.logoUrl.name : "לא נבחר קובץ"}
         </span>
         </div>
      </div>

      {media.logoUrl && (
        <img
          src={URL.createObjectURL(media.logoUrl)}
          alt="תצוגה מקדימה ללוגו"
          style={{ width: 100, height: 70, borderRadius: 8, marginBottom: 10 }}
        />
      )}

      {/* אישור עמותה (PDF) */}
      <span className="section-title">העלאת אישור עמותה</span>
      <div className="input-group file-upload-group">
        <File className="input-icon" />
        <div className="file-upload" style={{ width: "100%" }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleChangeMedia("certificate", e.target.files)}
        />
        <button type="button" className="fake-btn">בחר/י קובץ</button>
         <span className="file-name">
          {media.certificate ? media.certificate.name : "לא נבחר קובץ"}
         </span>
         </div>
      </div>
    </>
  );
};

export default NewNgo;

