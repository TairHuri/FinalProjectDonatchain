import { useState, type ChangeEvent } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { creditDonation } from "../services/api";
import { buttonStyle, fildsPositionStyle, inputStyle, labelStyle } from "../css/dashboardStyles";
import Spinner, { useSpinner } from "./Spinner";

const CreditPayment = ({ close, campaignId, userId }: { close: () => void, campaignId: string, userId: string }) => {
  const date = new Date();
  const { updateCampaign } = useCampaigns();
  const [ccForm, setCcform] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    comment: "",
    amount: 0,
    currency: "ILS",
    ccNumber: "",
    expYear: date.getFullYear(),
    expMonth: 1,
    cvv: 0,
    ownerId: "",
    ownerName: "",
    anonymous: false,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const { isLoading, start, stop } = useSpinner();

  // =====================
  // פונקציות בדיקה
  // =====================

  // אלגוריתם Luhn – לבדוק תקינות כרטיס אשראי
  const isValidCreditCard = (num: string) => {
    const sanitized = num.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // בדיקת תקינות ת"ז ישראלית
  const isValidIsraeliId = (id: string) => {
    id = id.trim();
    if (id.length > 9 || id.length < 5) return false;
    id = id.padStart(9, "0");

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = Number(id[i]) * ((i % 2) + 1);
      if (num > 9) num -= 9;
      sum += num;
    }
    return sum % 10 === 0;
  };

  // בדיקת תאריך תפוגה
  const isFutureDate = (month: number, year: number) => {
    const now = new Date();
    const exp = new Date(year, month - 1);
    return exp >= new Date(now.getFullYear(), now.getMonth());
  };

  // =====================
  // שינויי שדות
  // =====================
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value });
  };

  const handleAnonymouse = (checked: boolean) => {
    setCcform({ ...ccForm, anonymous: checked });
  };

  // =====================
  // תשלום
  // =====================
  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    // ולידציות
    if (!ccForm.firstName.trim()) return setMessage("יש להזין שם פרטי");
    if (!ccForm.lastName.trim()) return setMessage("יש להזין שם משפחה");
    if (!ccForm.phone.match(/^[0-9]{3}[\-.]?[0-9]{7}$/)) return setMessage("יש להזין מספר פלאפון תקין (לדוגמה: 0501234567)");
    if (!ccForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return setMessage("יש להזין כתובת דוא\"ל תקינה");
    if (!ccForm.amount || Number(ccForm.amount) <= 0) return setMessage("יש להזין סכום תרומה תקין");
    if (!isValidCreditCard(ccForm.ccNumber)) return setMessage("מספר כרטיס האשראי שהוזן אינו תקין");
    if (ccForm.cvv < 100 || ccForm.cvv > 999) return setMessage("קוד CVV אינו תקין");
    if (!isValidIsraeliId(ccForm.ownerId)) return setMessage("תעודת הזהות שהוזנה אינה תקינה");
    if (!ccForm.ownerName.trim()) return setMessage("יש להזין שם בעל הכרטיס");
    if (!isFutureDate(Number(ccForm.expMonth), Number(ccForm.expYear))) return setMessage("תאריך תפוגת הכרטיס אינו תקין – הכרטיס פג תוקף");

    start();
    try {
      const chargeData = { 
        ...ccForm, 
        ownername: ccForm.ownerName, // השם שהטיפוס דורש
        campaign: campaignId 
      };

      const { data, status } = await creditDonation(chargeData, campaignId);
      const { donation } = data;

      if (status === 201) {
        updateCampaign(campaignId);
        setTxHash(donation.txHash);
        setShowConfirm(true);
      } else {
        setMessage(data.message || "אירעה שגיאה בעת ביצוע התרומה, אנא נסו שוב.");
      }
    } catch (error) {
      console.error(error);
      setMessage("שגיאה בעת שליחת התרומה, אנא בדקו את הפרטים ונסו שוב.");
    } finally {
      stop();
    }
  };

  // =====================
  // UI
  // =====================
  if (isLoading) return <Spinner />;

  if (showConfirm)
    return (
      <div className="result">
        <h3 className="resultTitle">התרומה התבצעה בהצלחה</h3>
        <h3 className="resultSecondTitle">כתובת hash של התרומה: {txHash}</h3>
        <div className="resultLink">
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">
            מעבר לתיעוד התרומה
          </a>
        </div>
        <div>
          <button type="button" onClick={close} style={buttonStyle}>
            אישור
          </button>
        </div>
      </div>
    );

  return (
    <form onSubmit={handlePayment} style={{ width: "100%", lineHeight: "1.5" }}>
      <div style={fildsPositionStyle}>
        <label htmlFor="firstName" style={labelStyle}>שם פרטי</label>
        <input id="firstName" placeholder="שם פרטי" type="text" onChange={handleChange} style={inputStyle} />
        <label htmlFor="lastName" style={labelStyle}>שם משפחה</label>
        <input id="lastName" placeholder="שם משפחה" type="text" onChange={handleChange} style={inputStyle} />
      </div>

      <div style={fildsPositionStyle}>
        <label htmlFor="phone" style={labelStyle}>פלאפון</label>
        <input id="phone" placeholder="מספר פלאפון" type="tel" onChange={handleChange} style={inputStyle} />
        <label htmlFor="email" style={labelStyle}>מייל</label>
        <input id="email" placeholder="מייל" type="email" onChange={handleChange} style={inputStyle} />
      </div>

      <div dir="rtl">
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "calibri" }}>
          <input type="checkbox" checked={ccForm.anonymous} onChange={(e) => handleAnonymouse(e.target.checked)} />
          הישארו אנונימיים – אני רוצה שבעמוד הקמפיין יופיע רק סכום התרומה
        </label>
      </div>

      <div>
        <label htmlFor="comment" style={labelStyle}>תגובה</label>
        <textarea id="comment" placeholder="כמה מילים על תרומתך (לא חובה)" onChange={handleChange} style={inputStyle}></textarea>
      </div>

      <p style={{ textAlign: "center", fontFamily: "calibri" }}>פרטי אשראי</p>
      {message && <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{message}</p>}

      <div style={fildsPositionStyle}>
        <label htmlFor="amount" style={labelStyle}>סכום</label>
        <input id="amount" placeholder="סכום התרומה" type="number" onChange={handleChange} style={inputStyle} />
        <label htmlFor="currency" style={labelStyle}>מטבע</label>
        <select id="currency" onChange={handleChange}>
          <option value="ILS">ILS</option>
          <option value="USD">USD</option>
          <option value="EU">EU</option>
        </select>
      </div>

      <div style={fildsPositionStyle}>
        <label htmlFor="ccNumber" style={labelStyle}>כרטיס אשראי</label>
        <input id="ccNumber" placeholder="מספר כרטיס" type="text" onChange={handleChange} style={inputStyle} />
        <label style={labelStyle}>תאריך תפוגה</label>
        <input id="expYear" type="number" min={date.getFullYear()} max={date.getFullYear() + 15} placeholder="שנה" onChange={handleChange} style={inputStyle} />
        <input id="expMonth" type="number" min="1" max="12" placeholder="חודש" onChange={handleChange} style={inputStyle} />
        <label htmlFor="cvv" style={labelStyle}>CVV code</label>
        <input id="cvv" placeholder="cvv" type="number" onChange={handleChange} style={inputStyle} />
      </div>

      <div style={fildsPositionStyle}>
        <label htmlFor="ownerId" style={labelStyle}>ת"ז</label>
        <input id="ownerId" type="text" placeholder="תעודת זהות בעל הכרטיס" onChange={handleChange} style={inputStyle} />
        <label htmlFor="ownerName" style={labelStyle}>שם בעל הכרטיס</label>
        <input id="ownerName" type="text" placeholder="שם בעל הכרטיס" onChange={handleChange} style={inputStyle} />
      </div>

      <div style={fildsPositionStyle}>
        <button type="submit" style={buttonStyle}>תרום</button>
        <button type="button" onClick={close} style={buttonStyle}>ביטול</button>
      </div>
    </form>
  );
};

export default CreditPayment;
