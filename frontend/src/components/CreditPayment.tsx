import { useState, type ChangeEvent } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { creditDonation } from "../services/api";
import { buttonStyle, fildsPositionStyle, inputStyle, labelStyle } from "../css/dashboardStyles";

const CreditPayment = ({ close, campaignId, userId }: { close: () => void, campaignId: string, userId: string }) => {
  const date = new Date()
  const { updateCampaign } = useCampaigns();
  //const { ngo } = useAuth();
  const [ccForm, setCcform] = useState({ donorNumber: '', donorEmail: '', donorFirstName: '', donorLastName: '', amount: 0, currency: '', ccNumber: '', expYear: date.getFullYear(), expMonth: 1, cvv: 0, ownerId: '', ownername: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value })
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
    // send post /charge
    const chargeData = { ...ccForm, campaignId, }
    const { data, status } = await creditDonation(chargeData, campaignId)

    console.log('sent', chargeData)
    console.log(data, status);
    if (status == 201) {
      updateCampaign(campaignId);
      setShowConfirm(true)
    } else {
      setMessage(data.message)
    }
  }
  if(showConfirm)return (
    <div>
      <h3>התרומה התבצעה בהצלחה</h3>
      <button type='button' onClick={close} style={buttonStyle}>אישור</button>
    </div>
  )
  return (
    <form onSubmit={handlePayment} style={{ width: '100%' }}>

      <div style={fildsPositionStyle}>
      <label htmlFor="donorFirstName" style={labelStyle}>שם פרטי</label><input id="donorFirstName" placeholder="שם פרטי" type="text" required onChange={handleChange} style={inputStyle} />
      <label htmlFor="donorLastName" style={labelStyle}>שם משפחה</label><input id="donorLastName" placeholder="שם משפחה" type="text" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
      <label htmlFor="donorNumber" style={labelStyle}>פלאפון</label><input id="donorNumber" placeholder="מספר פלאפון" pattern="^[0-9]{3}[\-.]?[0-9]{7}$" title="incorrect be xxx.1234567" type="tel" required onChange={handleChange} style={inputStyle} />
      <label htmlFor="donorEmail" style={labelStyle}>מייל</label><input id="donorEmail" placeholder="מייל" type="email" required onChange={handleChange} style={inputStyle} />
      </div>
      <p>credit payment</p>
      {message && <p>{message}</p>}
      <div style={fildsPositionStyle}>
      <label htmlFor="amount" style={labelStyle}>סכום </label><input id="amount" placeholder="סכום התרומה" required onChange={handleChange} style={inputStyle}/>
      <label htmlFor="currency" style={labelStyle}>מטבע</label><select id="currency" onChange={handleChange}><option value="ILS">ILS</option><option value="USD">USD</option><option value="EU">EU</option> </select>
      </div>
      <div style={fildsPositionStyle}>
      <label htmlFor="ccNumber" style={labelStyle}>כרטיס אשראי</label><input id="ccNumber" placeholder="מספר כרטיס" required onChange={handleChange} style={inputStyle}/>
      <label style={labelStyle}>תאריך תפוגה</label>
      <input id="expYear" type="number" min={date.getFullYear()} max={date.getFullYear() + 15} placeholder="שנה" required onChange={handleChange} style={inputStyle}/>
      <input id="expMonth" type="number" min="1" max="12" placeholder="חודש" required onChange={handleChange} style={inputStyle}/>
      <label htmlFor="cvv" style={labelStyle}>CVV code</label><input id="cvv" placeholder="cvv" required onChange={handleChange} style={inputStyle}/>
      </div>
      <div style={fildsPositionStyle}>
      <label htmlFor="ownerId" style={labelStyle}>ת"ז</label><input id="ownerId" type="text" placeholder="תעודת זהות בעל הכרטיס" required onChange={handleChange} style={inputStyle}/>
      <label htmlFor="ownerName" style={labelStyle}>שם</label><input id="ownerName" type="text" placeholder="שם בעל הכרטיס" required onChange={handleChange} style={inputStyle}/>
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