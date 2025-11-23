// import { useState, type ChangeEvent, useEffect } from "react";
// import { useCampaigns } from "../contexts/CampaignsContext";
// import { cryptoDonation } from "../services/api";
// import { buttonStyle, fildsPositionStyle, inputStyle, labelStyle } from "../css/dashboardStyles";
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useDisconnect } from 'wagmi';
// import type { Donation } from "../models/Donation";
// import Spinner from "./Spinner";
// import { useSpinner } from "./Spinner";
// import { useCryptoPayment } from "../services/cryptoApi";

// const CryptoPayment = ({ close, campaignId }: { close: () => void, campaignId: string, userId: string }) => {

//   const { updateCampaign } = useCampaigns();
//   const { disconnect } = useDisconnect();
//   const { donateCrypto, waiting, isPending, isSuccess, error, hash } = useCryptoPayment();

//   const [ccForm, setCcform] = useState<Donation>({
//     comment: '',
//     phone: '',
//     email: '',
//     firstName: '',
//     lastName: '',
//     amount: 0,
//     originalAmount:0,
//     campaign: campaignId,
//     currency: 'ETH',
//     method: 'crypto',
//     txHash: '',
//     anonymous: false
//   });

//   const [message, setMessage] = useState<string | null>(null);
//   const [showConfirm, setShowConfirm] = useState<boolean>(false);
//   const { isLoading, start, stop } = useSpinner();

//   const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { id, value } = event.target;
//     setCcform({ ...ccForm, [id]: value });
//   };

//   const handleAnonymouse = (checked: boolean) => {
//     setCcform({ ...ccForm, anonymous: checked });
//   };

//   useEffect(() => {
//     if (isSuccess && !isPending && hash) {
//       saveDonation();
//     }
//   }, [isSuccess, isPending, hash]);

//   const saveDonation = async () => {
//     try {
//       const chargeData = { ...ccForm, campaignId, txHash: hash };
//       const { data, status } = await cryptoDonation(chargeData, campaignId);
//       if (status === 201) {
//         updateCampaign(campaignId);
//         setShowConfirm(true);
//         disconnect();
//       } else {
//         setMessage(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       stop();
//     }
//   };

//   const handlePayment = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setMessage(null);

//     // ✅ בדיקת שכל השדות הדרושים מלאים
//     if (!ccForm.firstName.trim()) return setMessage("יש להזין שם פרטי");
//     if (!ccForm.lastName.trim()) return setMessage("יש להזין שם משפחה");
//     if (!ccForm.phone.match(/^[0-9]{3}[\-.]?[0-9]{7}$/))
//       return setMessage("יש להזין מספר פלאפון תקין בפורמט 0501234567");
//     if (!ccForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
//       return setMessage("יש להזין כתובת מייל תקינה");
//     if (!ccForm.amount || ccForm.amount <= 0)
//       return setMessage("יש להזין סכום תרומה תקין");

//     try {
//       start();
//       await donateCrypto(`${ccForm.amount}`);
//     } catch (error) {
//       console.error(error);
//       setMessage((error as any).message||"אירעה שגיאה בעת ביצוע התרומה, אנא נסי שוב.");
//       stop();
//     }
//   };

//   if (isLoading) return <Spinner />;

//   if (showConfirm)
//     return (
//       <div className="result">
//         <h3 className="resultTitle">תרומתך התבצעה בהצלחה</h3>
//         <h3 className="resultSecondTitle">כתובת hash של התרומה: {hash}</h3>
//         <div className="resultLink">
//           <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">
//             מעבר לתיעוד התרומה
//           </a>
//         </div>
//         <div>
//           <button type="button" onClick={close} style={buttonStyle}>אישור</button>
//         </div>
//       </div>
//     );

//   return (
//     <form onSubmit={handlePayment} style={{ width: "100%" }}>
//       <div style={fildsPositionStyle}>
//         <label htmlFor="firstName" style={labelStyle}>שם פרטי</label>
//         <input id="firstName" placeholder="שם פרטי" type="text" onChange={handleChange} style={inputStyle} />
//         <label htmlFor="lastName" style={labelStyle}>שם משפחה</label>
//         <input id="lastName" placeholder="שם משפחה" type="text" onChange={handleChange} style={inputStyle} />
//       </div>

//       <div style={fildsPositionStyle}>
//         <label htmlFor="phone" style={labelStyle}>פלאפון</label>
//         <input id="phone" placeholder="מספר פלאפון" type="tel" onChange={handleChange} style={inputStyle} />
//         <label htmlFor="email" style={labelStyle}>מייל</label>
//         <input id="email" placeholder="מייל" type="email" onChange={handleChange} style={inputStyle} />
//       </div>

//       <div dir="rtl">
//         <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "calibri" }}>
//           <input type="checkbox" checked={ccForm.anonymous} onChange={(e) => handleAnonymouse(e.target.checked)} />
//           הישארו אנונימיים - אני רוצה שבעמוד הקמפיין יופיע רק סכום התרומה
//         </label>
//       </div>

//       <div>
//         <label htmlFor="comment" style={labelStyle}>תגובה</label>
//         <textarea id="comment" placeholder="כמה מילים על תרומתך (לא חובה)" onChange={handleChange} style={inputStyle}></textarea>
//       </div>

//       {message && (
//         <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{message}</p>
//       )}

//       <div style={fildsPositionStyle}>
//         <label htmlFor="amount" style={labelStyle}>סכום</label>
//         <input id="amount" placeholder="סכום התרומה" onChange={handleChange} style={inputStyle} />
//       </div>

//       <div style={fildsPositionStyle}>
//         <Crypto waiting={waiting} isPending={isPending} isSuccess={isSuccess} error={error as Error} hash={hash} />
//         <button type="button" onClick={close} style={buttonStyle}>ביטול</button>
//       </div>
//     </form>
//   );
// };





// type CryptoProps = {
//   isPending: boolean;
//   waiting: boolean;
//   isSuccess: boolean;
//   hash: string | undefined;
//   error: Error;
// };

// function Crypto({ waiting, isPending, isSuccess, error }: CryptoProps) {
//   return (
//     <div dir="rtl" style={{ padding: 24 }}>
//       <ConnectButton accountStatus="address" />
//       <button disabled={isPending || waiting} style={buttonStyle}>
//         {isPending || waiting ? "שולח…" : "לתרומה בקריפטו"}
//       </button>
//       {error && <div style={{ color: "crimson" }}>{(error as any).shortMessage || error.message}</div>}
//       {isSuccess && <div style={{ color: "green" }}>הושלם ✅</div>}
//     </div>
//   );
// }

// export default CryptoPayment;


import { useState, type ChangeEvent, useEffect } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { cryptoDonation } from "../services/api";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import type { Donation } from "../models/Donation";
import Spinner from "./Spinner";
import { useSpinner } from "./Spinner";
import { useCryptoPayment } from "../services/cryptoApi";

import '../css/campaign/CryptoPayment.css'; // שימי לב שאת מייבאת את קובץ ה-CSS החדש

const CryptoPayment = ({ close, campaignId }: { close: () => void, campaignId: string, userId: string }) => {

  const { updateCampaign } = useCampaigns();
  const { disconnect } = useDisconnect();
  const { donateCrypto, waiting, isPending, isSuccess, error, hash } = useCryptoPayment();

  const [ccForm, setCcform] = useState<Donation>({
    comment: '',
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    amount: 0,
    originalAmount: 0,
    campaign: campaignId,
    currency: 'ETH',
    method: 'crypto',
    txHash: '',
    anonymous: false
  });

  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { isLoading, start, stop } = useSpinner();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value });
  };

  const handleAnonymouse = (checked: boolean) => {
    setCcform({ ...ccForm, anonymous: checked });
  };

  useEffect(() => {
    if (isSuccess && !isPending && hash) {
      saveDonation();
    }
  }, [isSuccess, isPending, hash]);

  const saveDonation = async () => {
    try {
      const chargeData = { ...ccForm, campaignId, txHash: hash };
      const { data, status } = await cryptoDonation(chargeData, campaignId);
      if (status === 201) {
        updateCampaign(campaignId);
        setShowConfirm(true);
        disconnect();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      stop();
    }
  };

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    // ולידציה בסיסית
    if (!ccForm.firstName.trim()) return setMessage("יש להזין שם פרטי");
    if (!ccForm.lastName.trim()) return setMessage("יש להזין שם משפחה");
    if (!ccForm.phone.match(/^[0-9]{3}[\-.]?[0-9]{7}$/)) return setMessage("יש להזין מספר פלאפון תקין");
    if (!ccForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return setMessage("יש להזין כתובת מייל תקינה");
    if (!ccForm.amount || ccForm.amount <= 0) return setMessage("יש להזין סכום תרומה תקין");

    try {
      start();
      // המרה ל-String עבור ה-API
      await donateCrypto(`${ccForm.amount}`);
    } catch (error) {
      console.error(error);
      setMessage((error as any).message || "אירעה שגיאה בעת ביצוע התרומה, אנא נסי שוב.");
      stop();
    }
  };

  if (isLoading) return <Spinner />;

  if (showConfirm)
    return (
      <div className="crypto-container result-box">
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
        <h3 className="result-title">תרומתך התבצעה בהצלחה!</h3>
        <p>תודה רבה על תרומתך הנדיבה.</p>
        
        <div className="hash-box">
           Hash: {hash}
        </div>
        
        <div className="resultLink">
          <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer" className="etherscan-link">
            מעבר לתיעוד התרומה (Etherscan)
          </a>
        </div>
        <div>
          <button type="button" onClick={close} className="btn-submit" style={{width: '200px'}}>סגור ואישור</button>
        </div>
      </div>
    );

  return (
    <div className="crypto-container" dir="rtl">
      <h2 className="crypto-title">תרומה בקריפטו (ETH)</h2>
      
      <form onSubmit={handlePayment}>
        
        {/* שורה 1: שם פרטי + משפחה */}
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="firstName" className="label-text">שם פרטי</label>
            <input id="firstName" placeholder="ישראל" type="text" onChange={handleChange} className="custom-input" />
          </div>
          <div className="input-group">
            <label htmlFor="lastName" className="label-text">שם משפחה</label>
            <input id="lastName" placeholder="ישראלי" type="text" onChange={handleChange} className="custom-input" />
          </div>
        </div>

        {/* שורה 2: טלפון + מייל */}
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="phone" className="label-text">פלאפון</label>
            <input id="phone" placeholder="050-0000000" type="tel" onChange={handleChange} className="custom-input" />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="label-text">מייל</label>
            <input id="email" placeholder="example@mail.com" type="email" onChange={handleChange} className="custom-input" />
          </div>
        </div>

        {/* סכום */}
        <div className="input-group full-width" style={{marginBottom: '16px'}}>
           <label htmlFor="amount" className="label-text">סכום התרומה (ETH)</label>
           <input id="amount" placeholder="0.01" type="number" step="any" onChange={handleChange} className="custom-input" style={{fontSize: '1.2rem', fontWeight: 'bold'}} />
        </div>

        {/* אנונימיות */}
        <label className="checkbox-wrapper">
          <input type="checkbox" checked={ccForm.anonymous} onChange={(e) => handleAnonymouse(e.target.checked)} />
          <span className="checkbox-text">הישארו אנונימיים (יופיע רק סכום התרומה בדף הקמפיין)</span>
        </label>

        {/* הערה */}
        <div className="input-group full-width">
          <label htmlFor="comment" className="label-text">הקדשה / הערה</label>
          <textarea id="comment" placeholder="כמה מילים חמות..." onChange={handleChange} className="custom-input"></textarea>
        </div>

        {/* הודעות שגיאה */}
        {message && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
            {message}
          </div>
        )}

        {/* אזור התשלום וחיבור ארנק */}
        <div className="wallet-section">
           <Crypto 
             waiting={waiting} 
             isPending={isPending} 
             isSuccess={isSuccess} 
             error={error as Error} 
             hash={hash} 
             // העברנו את כפתור הביטול פנימה כדי שיהיה באותו קו
             onCancel={close}
           />
        </div>

      </form>
    </div>
  );
};

type CryptoProps = {
  isPending: boolean;
  waiting: boolean;
  isSuccess: boolean;
  hash: string | undefined;
  error: Error;
  onCancel: () => void; // הוספתי פרופ לביטול
};

function Crypto({ waiting, isPending, isSuccess, error, onCancel }: CryptoProps) {
  return (
    <div style={{ width: '100%' }}>
      
      {/* 1. Connect Button */}
      <div className="connect-wrapper">
         <ConnectButton accountStatus="address" showBalance={false} />
      </div>

      {/* 2. Action Buttons */}
      <div className="actions-row">
         <button type="button" onClick={onCancel} className="btn-cancel">
           ביטול
         </button>

         <button 
           type="submit" // זה הכפתור ששולח את הטופס הראשי
           disabled={isPending || waiting} 
           className="btn-submit"
         >
           {isPending || waiting ? "מעבד תרומה..." : "בצע תרומה"}
         </button>
      </div>

      {/* 3. Status Messages */}
      {error && <div style={{ color: "crimson", marginTop: '10px', textAlign: 'center' }}>{(error as any).shortMessage || error.message}</div>}
      {isSuccess && <div style={{ color: "green", marginTop: '10px', textAlign: 'center', fontWeight: 'bold' }}>הושלם בהצלחה ✅</div>}
    </div>
  );
}

export default CryptoPayment;