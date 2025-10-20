import { useState, type ChangeEvent, useEffect } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { cryptoDonation } from "../services/api";
import { buttonStyle, fildsPositionStyle, inputStyle, labelStyle } from "../css/dashboardStyles";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt, useDisconnect } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther, type Abi } from 'viem';
import hubAbiJson from '../abi/Donatchain.json';
import type { Donation } from "../models/Donation";
import Spinner from "./Spinner";
import { useSpinner } from "./Spinner";

const CryptoPayment = ({ close, campaignId }: { close: () => void, campaignId: string, userId: string }) => {

  const { updateCampaign } = useCampaigns();
  const { disconnect } = useDisconnect();
  const { donateCrypto, waiting, isPending, isSuccess, error, hash } = useCryptoPayment()
  //const { ngo } = useAuth();
  const [ccForm, setCcform] = useState<Donation>({ phone: '', email: '', firstName: '', lastName: '', amount: 0, campaign: campaignId, currency: 'ETH', method: 'crypto', txHash: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const { isLoading, start, stop } = useSpinner()

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value })
  }

  useEffect(() => {
    if (isSuccess && !isPending && hash) {
      saveDonation()
    }
  }, [isSuccess, isPending, hash])

  const saveDonation = async () => {

    try {
      const chargeData = { ...ccForm, campaignId, txHash: hash }
      const { data, status } = await cryptoDonation(chargeData, campaignId)

      console.log('sent', chargeData)
      console.log(data, status);
      if (status == 201) {
        updateCampaign(campaignId);
        setShowConfirm(true)
        disconnect();
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.log(error);

    } finally {
      stop();
    }
  }


  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (ccForm.amount <= 0) {
        setMessage("amount must be greater than 0")
        return;
      }
      start();
      console.log('start spinner');

      await donateCrypto(`${ccForm.amount}`)
    } catch (error) {
      console.log(error);
      stop();
    }
  }
  

  if (isLoading) return <Spinner />
  if (showConfirm) return (
    <div className="result">
      <h3>התרומה התבצעה בהצלחה</h3>
      <div>Tx: <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank">{hash}</a></div>
      <div>
      <button type='button' onClick={close} style={buttonStyle}>אישור</button>
      </div>
    </div>
  )
  return (
    <form onSubmit={handlePayment} style={{ width: '100%' }}>

      <div style={fildsPositionStyle}>
        <label htmlFor="firstName" style={labelStyle}>שם פרטי</label><input id="firstName" placeholder="שם פרטי" type="text" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="lastName" style={labelStyle}>שם משפחה</label><input id="lastName" placeholder="שם משפחה" type="text" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
        <label htmlFor="phone" style={labelStyle}>פלאפון</label><input id="phone" placeholder="מספר פלאפון" pattern="^[0-9]{3}[\-.]?[0-9]{7}$" title="incorrect be xxx.1234567" type="tel" required onChange={handleChange} style={inputStyle} />
        <label htmlFor="email" style={labelStyle}>מייל</label><input id="email" placeholder="מייל" type="email" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
        <label htmlFor="amount" style={labelStyle}>סכום </label><input id="amount" placeholder="סכום התרומה" required onChange={handleChange} style={inputStyle} />
      </div>
      <div style={fildsPositionStyle}>
        <Crypto waiting={waiting} isPending={isPending} isSuccess={isSuccess} error={error as Error} hash={hash} />
        <button type='button' onClick={close} style={buttonStyle}>ביטול</button>
      </div>
    </form>
  )
}

const useCryptoPayment = () => {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function donateCrypto(amountEth: string) {
    console.log('amountEth', amountEth);
    if (!isConnected) { alert('התחברי לארנק'); return; }
    if (chainId !== sepolia.id) { switchChain({ chainId: sepolia.id }); return; }

    // הקריאה לחוזה שלך: זה שולח tx מהארנק של התורם אל כתובת החוזה
    writeContract({
      address: CONTRACT,
      abi: HUB_ABI,
      functionName: 'donateCrypto',
      args: [BigInt(CAMPAIGN_ID)],
      value: parseEther(amountEth || '0.01'),
    });
  }

  return { donateCrypto, waiting, isSuccess, hash, isPending, error }
}

const HUB_ABI = hubAbiJson.abi as Abi;
const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const CAMPAIGN_ID = Number(import.meta.env.VITE_CAMPAIGN_ID ?? 0);

type CryptoProps = {
  isPending: boolean;
  waiting: boolean;
  isSuccess: boolean;
  hash: string | undefined;
  error: Error

}
function Crypto({ waiting, isPending, isSuccess, error }: CryptoProps) {

  return (
    <div dir="rtl" style={{ padding: 24 }}>
      <ConnectButton accountStatus="address" />

      <button disabled={isPending || waiting} style={buttonStyle}>
        {isPending || waiting ? 'שולח…' : 'לתרומה בקריפטו'}
      </button>
      {error && <div style={{ color: 'crimson' }}>{(error as any).shortMessage || error.message}</div>}
      {isSuccess && <div style={{ color: 'green' }}>הושלם ✅</div>}
    </div>
  );
}

export default CryptoPayment