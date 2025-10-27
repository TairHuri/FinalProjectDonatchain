import { useState, type ChangeEvent } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { creditDonation } from "../services/api";
import { buttonStyle, fildsPositionStyle, inputStyle, labelStyle } from "../css/dashboardStyles";
import Spinner, { useSpinner } from "./Spinner";


const CreditPayment = ({ close, campaignId, userId }: { close: () => void, campaignId: string, userId: string }) => {
  const date = new Date()
  const { updateCampaign } = useCampaigns();
  //const { ngo } = useAuth();
  const [ccForm, setCcform] = useState({phone: '', email: '', firstName: '', lastName: '', comment: '', amount: 0, currency: 'ILS', ccNumber: '', expYear: date.getFullYear(), expMonth: 1, cvv: 0, ownerId: '', ownername: '', anonymous:false })
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const {isLoading, start, stop} = useSpinner()

  const handleChange = (event: ChangeEvent<HTMLInputElement| HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value })
  }
  const handleAnonymouse = (checked:boolean) => {
    setCcform({...ccForm, anonymous:checked})
  }
  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (ccForm.ccNumber.length < 8) {
      setMessage("cc number is too short")
      return;
    }
    if (ccForm.cvv < 100 || ccForm.cvv > 999) {
      setMessage("cvv is invalid ")
      return
    }
    start()
    try{
    // send post /charge
    const chargeData = { ...ccForm, campaign:campaignId, }
    const { data, status } = await creditDonation(chargeData, campaignId)
    const { donation } = data;
    console.log('sent', chargeData)
    console.log(data, status);
    if (status == 201) {
      updateCampaign(campaignId);
      setTxHash(donation.txHash)
      setShowConfirm(true)
    } else {
      setMessage(data.message)
    }}catch(error){
      console.log(error);
      
    }finally{

      stop()
    }
  }
  
  if(isLoading) return <Spinner/>
  if (showConfirm) return (
    <div className="result">
      <h3 className="resultTitle">התרומה התבצעה בהצלחה</h3>
      <h3 className="resultSecondTitle">כתובת hash של התרומה: {txHash}</h3>
      <div className="resultLink"><a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">מעבר לתיעוד התרומה</a></div>      <div>
        <button type='button' onClick={close} style={buttonStyle}>אישור</button>
      </div>
    </div>
  )
  return (
    <form onSubmit={handlePayment} style={{ width: '100%', lineHeight: '1.5'}}>

      <div style={fildsPositionStyle}>
        <label htmlFor="firstName" style={labelStyle}>שם פרטי</label>
        <input id="firstName" placeholder="שם פרטי" type="text" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="lastName" style={labelStyle}>שם משפחה</label>
        <input id="lastName" placeholder="שם משפחה" type="text" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
        <label htmlFor="phone" style={labelStyle}>פלאפון</label>
        <input id="phone" placeholder="מספר פלאפון" pattern="^[0-9]{3}[\-.]?[0-9]{7}$" title="incorrect be xxx.1234567" type="tel" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="email" style={labelStyle}>מייל</label>
        <input id="email" placeholder="מייל" type="email" required onChange={handleChange} style={inputStyle} />
      </div>
      <div dir="rtl">
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: 'calibri'}}>
        <input type="checkbox" checked={ccForm.anonymous} onChange={(e) => handleAnonymouse(e.target.checked)}/>
        הישארו אנונימיים - אני רוצה שבעמוד הקמפיין יופיע רק סכום התרומה</label>
      </div>
      <div>
         <label htmlFor="comment" style={labelStyle}>תגובה</label>
         <textarea id="comment" placeholder="כמה מילים על תרומתך" onChange={handleChange} style={inputStyle} ></textarea>
      </div>
      <p style={{textAlign: 'center', fontFamily: 'calibri'}}>פרטי אשראי</p>
      {message && <p>{message}</p>}
      <div style={fildsPositionStyle}>
        <label htmlFor="amount" style={labelStyle}>סכום </label><input id="amount" placeholder="סכום התרומה" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="currency" style={labelStyle}>מטבע</label><select id="currency" onChange={handleChange}><option value="ILS">ILS</option><option value="USD">USD</option><option value="EU">EU</option> </select>
      </div>
      <div style={fildsPositionStyle}>
        <label htmlFor="ccNumber" style={labelStyle}>כרטיס אשראי</label>
        <input id="ccNumber" placeholder="מספר כרטיס" required onChange={handleChange} style={inputStyle} />
        <label style={labelStyle}>תאריך תפוגה</label>
        <input id="expYear" type="number" min={date.getFullYear()} max={date.getFullYear() + 15} placeholder="שנה" required onChange={handleChange} style={inputStyle} />
        <input id="expMonth" type="number" min="1" max="12" placeholder="חודש" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="cvv" style={labelStyle}>CVV code</label>
        <input id="cvv" placeholder="cvv" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
        <label htmlFor="ownerId" style={labelStyle}>ת"ז</label><input id="ownerId" type="text" placeholder="תעודת זהות בעל הכרטיס" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="ownerName" style={labelStyle}>שם</label><input id="ownerName" type="text" placeholder="שם בעל הכרטיס" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
        <button type='submit' style={buttonStyle}>
          תרום </button>
        <button type='button' onClick={close} style={buttonStyle}>ביטול</button>
      </div>
    </form>
  )
}

export default CreditPayment