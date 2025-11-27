import { useState, type ChangeEvent } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { creditDonation } from "../services/donationApi";
import { buttonStyle } from "../css/dashboardStyles";
import Spinner, { useSpinner } from "./Spinner";

import "../css/campaign/CreditPayment.css";


// -----------------------------------------------------
// Credit Card Payment Component
// Responsible for handling donation via credit card
// -----------------------------------------------------
const CreditPayment = ({ close, campaignId, userId }: { close: () => void, campaignId: string, userId: string }) => {
  const date = new Date();
  const { updateCampaign } = useCampaigns();
  // ------------------------
  // Credit card form state
  // ------------------------
  const [ccForm, setCcform] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    comment: "",
    originalAmount: 0,
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
  // Validation Functions
  // =====================

  // Validate credit card number using the Luhn algorithm
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

  // Validate Israeli ID number using the official checksum algorithm
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
  // Check if the credit card expiration date is still valid
  const isFutureDate = (month: number, year: number) => {
    const now = new Date();
    const exp = new Date(year, month - 1);
    return exp >= new Date(now.getFullYear(), now.getMonth());
  };
  // =====================
  // Input Handlers
  // =====================

  // Update input fields dynamically based on element id
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value });
  };

  const handleAnonymouse = (checked: boolean) => {
    setCcform({ ...ccForm, anonymous: checked });
  };


  // =====================
  // Donation Logic
  // =====================
  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    // Input validations
    if (!ccForm.firstName.trim()) return setMessage("יש להזין שם פרטי");
    if (!ccForm.lastName.trim()) return setMessage("יש להזין שם משפחה");
    if (!ccForm.phone.match(/^[0-9]{3}[\-.]?[0-9]{7}$/)) return setMessage("יש להזין מספר פלאפון תקין (לדוגמה: 0501234567)");
    if (!ccForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return setMessage("יש להזין כתובת דוא\"ל תקינה");
    if (!ccForm.originalAmount || Number(ccForm.originalAmount) <= 0) return setMessage("יש להזין סכום תרומה תקין");
    if (!isValidCreditCard(ccForm.ccNumber)) return setMessage("מספר כרטיס האשראי שהוזן אינו תקין");
    if (ccForm.cvv < 100 || ccForm.cvv > 999) return setMessage("קוד CVV אינו תקין");
    if (!isValidIsraeliId(ccForm.ownerId)) return setMessage("תעודת הזהות שהוזנה אינה תקינה");
    if (!ccForm.ownerName.trim()) return setMessage("יש להזין שם בעל הכרטיס");
    if (!isFutureDate(Number(ccForm.expMonth), Number(ccForm.expYear))) return setMessage("תאריך תפוגת הכרטיס אינו תקין – הכרטיס פג תוקף");

    start();
    try {
      const chargeData = {
        ...ccForm,
        amount: 0,
        ownername: ccForm.ownerName,
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
    <div className="credit-container">
      <h2 className="credit-title">תרומה באשראי </h2>

      <form onSubmit={handlePayment}>
        {/* פרטי תורם */}
        <h3 className="form-section-title">פרטי תורם</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">שם פרטי</label>
            <input id="firstName" placeholder="שם פרטי" type="text" onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">שם משפחה</label>
            <input id="lastName" placeholder="שם משפחה" type="text" onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">טלפון</label>
            <input id="phone" placeholder="מספר טלפון" type="tel" onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="email">מייל</label>
            <input id="email" placeholder="מייל" type="email" onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div className="form-checkbox-container" dir="rtl">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={ccForm.anonymous}
              onChange={(e) => handleAnonymouse(e.target.checked)}
            />
            <span> הישארו אנונימיים – אני רוצה שבעמוד הקמפיין יופיע רק סכום התרומה</span>
          </label>
        </div>


        <div className="form-group">
          <label htmlFor="comment">הקדשה/תגובה</label>
          <textarea
            id="comment"
            placeholder="כמה מילים על תרומתך (לא חובה)"
            onChange={handleChange}
            className="form-input textarea"
          ></textarea>
        </div>

        <hr className="divider" />

        <h3 className="form-section-title">פרטי תשלום</h3>

        {message && <p className="error-message">{message}</p>}

        <div className="form-row amount-currency-row">
          <div className="form-group amount-group">
            <label htmlFor="originalAmount">סכום התרומה</label>
            <input id="originalAmount" placeholder="סכום" type="number" onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group currency-group">
            <label htmlFor="currency">מטבע</label>
            <select id="currency" onChange={handleChange} className="form-select">
              <option value="ILS"> ILS (ש"ח)</option>
              <option value="USD"> USD (דולר)</option>
              <option value="EUR"> EUR (אירו)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ccNumber">מספר כרטיס אשראי</label>
          <input id="ccNumber" placeholder="xxxx xxxx xxxx xxxx" type="text" onChange={handleChange} className="form-input" />
        </div>

        <div className="form-row small-fields-row">
          <div className="form-group expiry-group">
            <label>תאריך תפוגה</label>
            <div className="expiry-fields">
              <input id="expMonth" type="number" min="1" max="12" placeholder="חודש" onChange={handleChange} className="form-input small-input" />
              <input id="expYear" type="number" min={new Date().getFullYear()} max={new Date().getFullYear() + 15} placeholder="שנה" onChange={handleChange} className="form-input small-input" />
            </div>
          </div>

          <div className="form-group cvv-group">
            <label htmlFor="cvv">קוד CVV</label>
            <input id="cvv" placeholder="123" type="number" onChange={handleChange} className="form-input" />
          </div>
        </div>


        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ownerId">ת"ז בעל הכרטיס</label>
            <input id="ownerId" type="text" placeholder="תעודת זהות" onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="ownerName">שם בעל הכרטיס</label>
            <input id="ownerName" type="text" placeholder="שם מלא" onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div className="form-buttons-row">
          <button type="submit" className="form-button primary-button"> תרום עכשיו</button>
          <button type="button" onClick={close} className="form-button secondary-button">ביטול</button>
        </div>
      </form>
    </div>

  );
};

export default CreditPayment;
