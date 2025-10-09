import { iconLogin } from "../css/dashboardStyles";
import type { Ngo } from "../models/Ngo"
import { Input, InputWithIcon } from "./gui/InputText"
import {Mail, MapPin, Phone, CreditCard, Wallet, Building2 } from "lucide-react";


const NewNgo = ({ngo,handleChangeNgo}:{ngo: Ngo, handleChangeNgo:(field: string, value: string | number)=> void,}) => {

    return(
        <>
          <InputWithIcon
            label="שם העמותה"
            field="name"
            onChange={handleChangeNgo}
            value={ngo.name}
            Icon={<Building2 style={iconLogin}/>} />
          <InputWithIcon 
            label="מספר העמותה" 
            field="ngoNumber" 
            onChange={handleChangeNgo}
            value={ngo.ngoNumber}/>          
          <InputWithIcon 
            label="אימייל עמותה" 
            field="email" 
            type="email"
            onChange={handleChangeNgo}
            value={ngo.email||""}
            Icon={<Mail style={iconLogin}/>}/>   

          <InputWithIcon 
            label="כתובת" 
            field="address" 
            onChange={handleChangeNgo}
            value={ngo.address||""}
            Icon={<MapPin style={iconLogin}/>}/>   

          <InputWithIcon 
            label="טלפון עמותה" 
            field="phone" 
            onChange={handleChangeNgo}
            value={ngo.phone||""}
            Icon={<Phone style={iconLogin}/>}/>   
          

          <InputWithIcon 
            label="חשבון בנק עמותה" 
            field="bankAccount" 
            onChange={handleChangeNgo}
            value={ngo.bankAccount||""}
            Icon={<CreditCard style={iconLogin}/>}/>

          <InputWithIcon 
            label="ארנק קריפטו עמותה" 
            field="wallet" 
            onChange={handleChangeNgo}
            value={ngo.wallet||""}
            Icon={<Wallet style={iconLogin}/>}/>

          <InputWithIcon 
            label="תיאור מטרות העמותה" 
            placeholder="תאר/י בקצרה את מטרות העמותה"
            field="description" 
            isMultiLine={true}
            onChange={handleChangeNgo}
            value={ngo.description||""}
            className="w-full border rounded-full p-3 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"/>
        </>
    )
}

export default NewNgo