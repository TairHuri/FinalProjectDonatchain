import { useState, type ChangeEvent, useEffect } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { cryptoDonation } from "../services/api";
import { buttonStyle, fildsPositionStyle, inputStyle, labelStyle } from "../css/dashboardStyles";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import type { Donation } from "../models/Donation";
import Spinner from "./Spinner";
import { useSpinner } from "./Spinner";
import { useCryptoPayment } from "../services/cryptoApi";

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

    // ✅ בדיקת שכל השדות הדרושים מלאים
    if (!ccForm.firstName.trim()) return setMessage("יש להזין שם פרטי");
    if (!ccForm.lastName.trim()) return setMessage("יש להזין שם משפחה");
    if (!ccForm.phone.match(/^[0-9]{3}[\-.]?[0-9]{7}$/))
      return setMessage("יש להזין מספר פלאפון תקין בפורמט 0501234567");
    if (!ccForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return setMessage("יש להזין כתובת מייל תקינה");
    if (!ccForm.amount || ccForm.amount <= 0)
      return setMessage("יש להזין סכום תרומה תקין");

    try {
      start();
      await donateCrypto(`${ccForm.amount}`);
    } catch (error) {
      console.error(error);
      setMessage((error as any).message||"אירעה שגיאה בעת ביצוע התרומה, אנא נסי שוב.");
      stop();
    }
  };

  if (isLoading) return <Spinner />;

  if (showConfirm)
    return (
      <div className="result">
        <h3 className="resultTitle">תרומתך התבצעה בהצלחה</h3>
        <h3 className="resultSecondTitle">כתובת hash של התרומה: {hash}</h3>
        <div className="resultLink">
          <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">
            מעבר לתיעוד התרומה
          </a>
        </div>
        <div>
          <button type="button" onClick={close} style={buttonStyle}>אישור</button>
        </div>
      </div>
    );

  return (
    <form onSubmit={handlePayment} style={{ width: "100%" }}>
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
          הישארו אנונימיים - אני רוצה שבעמוד הקמפיין יופיע רק סכום התרומה
        </label>
      </div>

      <div>
        <label htmlFor="comment" style={labelStyle}>תגובה</label>
        <textarea id="comment" placeholder="כמה מילים על תרומתך (לא חובה)" onChange={handleChange} style={inputStyle}></textarea>
      </div>

      {message && (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{message}</p>
      )}

      <div style={fildsPositionStyle}>
        <label htmlFor="amount" style={labelStyle}>סכום</label>
        <input id="amount" placeholder="סכום התרומה" onChange={handleChange} style={inputStyle} />
      </div>

      <div style={fildsPositionStyle}>
        <Crypto waiting={waiting} isPending={isPending} isSuccess={isSuccess} error={error as Error} hash={hash} />
        <button type="button" onClick={close} style={buttonStyle}>ביטול</button>
      </div>
    </form>
  );
};





type CryptoProps = {
  isPending: boolean;
  waiting: boolean;
  isSuccess: boolean;
  hash: string | undefined;
  error: Error;
};

function Crypto({ waiting, isPending, isSuccess, error }: CryptoProps) {
  return (
    <div dir="rtl" style={{ padding: 24 }}>
      <ConnectButton accountStatus="address" />
      <button disabled={isPending || waiting} style={buttonStyle}>
        {isPending || waiting ? "שולח…" : "לתרומה בקריפטו"}
      </button>
      {error && <div style={{ color: "crimson" }}>{(error as any).shortMessage || error.message}</div>}
      {isSuccess && <div style={{ color: "green" }}>הושלם ✅</div>}
    </div>
  );
}

export default CryptoPayment;
