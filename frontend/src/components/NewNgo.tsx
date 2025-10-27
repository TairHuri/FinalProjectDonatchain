import { iconLogin } from "../css/dashboardStyles";
import type { Ngo } from "../models/Ngo"
import type { NgoMediaType } from "../pages/RegistrationNgo";
import { Input, InputFileWithIcon, InputWithIcon } from "./gui/InputText"
import { Mail, MapPin, Phone, CreditCard, Wallet, Building2 } from "lucide-react";


const NewNgo = ({ ngo, media, handleChangeNgo, handleChangeMedia }: { ngo: Ngo, media:NgoMediaType, handleChangeNgo: (field: string, value: string | number) => void, handleChangeMedia:(field: keyof NgoMediaType, value: FileList|null)=>void }) => {

  return (
    <>
      <InputWithIcon
        label="שם העמותה"
        field="name"
        onChange={handleChangeNgo}
        value={ngo.name}
        Icon={<Building2 style={iconLogin} />} />
      <InputWithIcon
        label="מספר העמותה"
        field="ngoNumber"
        onChange={handleChangeNgo}
        value={ngo.ngoNumber} />
      <InputWithIcon
        label="אימייל עמותה"
        field="email"
        type="email"
        onChange={handleChangeNgo}
        value={ngo.email || ""}
        Icon={<Mail style={iconLogin} />} />

      <InputWithIcon
        label="כתובת"
        field="address"
        onChange={handleChangeNgo}
        value={ngo.address || ""}
        Icon={<MapPin style={iconLogin} />} />

      <InputWithIcon
        label="טלפון עמותה"
        field="phone"
        onChange={handleChangeNgo}
        value={ngo.phone || ""}
        Icon={<Phone style={iconLogin} />} />


      <InputWithIcon
        label="חשבון בנק עמותה"
        field="bankAccount"
        onChange={handleChangeNgo}
        value={ngo.bankAccount || ""}
        Icon={<CreditCard style={iconLogin} />} />

      <InputWithIcon
        label="ארנק קריפטו עמותה"
        field="wallet"
        onChange={handleChangeNgo}
        value={ngo.wallet || ""}
        Icon={<Wallet style={iconLogin} />} />

      <InputWithIcon
        label="תיאור מטרות העמותה"
        placeholder="תאר/י בקצרה את מטרות העמותה"
        field="description"
        isMultiLine={true}
        onChange={handleChangeNgo}
        value={ngo.description || ""}
        className="w-full border rounded-full p-3 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none" />

      <InputFileWithIcon<NgoMediaType>
        label="לוגו עמותה"
        field="logoUrl"
        onChange={handleChangeMedia}
        value={media.logoUrl}
        accept="image/*"
        Icon={<Wallet style={iconLogin} />} />

      {media.logoUrl && <img src={URL.createObjectURL(media.logoUrl)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}  
      
       <InputFileWithIcon<NgoMediaType>
        label="אישור עמותה"
        field="certificate"
        onChange={handleChangeMedia}
        value={media.certificate}
        accept="application/pdf"
        Icon={<Wallet style={iconLogin} />} />
    </>
  )
}

export default NewNgo