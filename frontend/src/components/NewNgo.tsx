
import type { Ngo, NgoMediaType } from "../models/Ngo";

import { Mail, MapPin, Phone, CreditCard, Wallet, Building2, File, Image, IdCard, ScreenShare, Goal } from "lucide-react";
import { getNgoTags } from "../services/ngoApi";
import Tags from "./gui/Tags";

type Props = {
  ngo: Ngo;
  media: NgoMediaType;
  handleChangeNgo: (field: string, value: string | number | string[]) => void;
  handleChangeMedia: (field: keyof NgoMediaType, value: FileList | null) => void;
};

const NewNgo = ({ ngo, media, handleChangeNgo, handleChangeMedia }: Props) => {

 
  return (
    <>
      {/* name */}
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

      {/* number */}
      <div className="input-group">
        <IdCard className="input-icon" />
        <input
          type="text"
          placeholder="מספר עמותה"
          value={ngo.ngoNumber}
          onChange={(e) => handleChangeNgo("ngoNumber", e.target.value)}
          className="input-field"
        />
      </div>

      {/* email */}
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

      {/* address - city */}
      <div className="input-group">
        <MapPin className="input-icon" />
        <input
          type="text"
          placeholder="עיר"
          value={ngo.address || ""}
          onChange={(e) => handleChangeNgo("address", e.target.value)}
          className="input-field"
        />
      </div>

      {/* phone */}
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


      {/* website */}
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

      {/* bank account */}
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

      {/* crypto wallet */}
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

      {/* description */}
      <div className="input-group">
        <Goal className="input-icon" />
        <textarea
          placeholder="תאר/י בקצרה את מטרות העמותה"
          value={ngo.description || ""}
          onChange={(e) => handleChangeNgo("description", e.target.value)}
          className="input-field textarea-like"
        />
      </div>

      <span className="section-title">בחירת קטגוריות</span>
      <Tags tagLoader={getNgoTags} tags={ngo.tags} handleChange={handleChangeNgo}/>

      {/* upload logo */}
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

