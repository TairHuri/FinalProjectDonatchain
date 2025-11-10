
// import { ethers } from "ethers";
// import hubAbi from '../abi/Donatchain.json';    // ← ה-ABI שהעתקת
// import { useEffect, useState, type FormEvent } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useCampaigns } from "../contexts/CampaignsContext";
// import { cardStyle, primaryBtnStyle } from "../css/dashboardStyles";
// import { getNgoById } from "../services/ngoApi";
// import type { Ngo } from "../models/Ngo";
// import type { User } from "../models/User";
// import Spinner, { useSpinner } from "./Spinner";

// import '../css/AlertDialog.css'


// import InputText, { InputFile } from "./gui/InputText";
// import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";
// const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
// const TARGET_CHAIN_ID = BigInt(import.meta.env.VITE_CHAIN_ID ?? "11155111"); // Sepolia


// const SEPOLIA = {
//     chainIdDec: 11155111n,
//     chainIdHex: '0xaa36a7', // 11155111 in hex
//     rpcUrls: ['https://rpc.sepolia.org'],
//     chainName: 'Sepolia',
//     nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
//     blockExplorerUrls: ['https://sepolia.etherscan.io'],
// };

// async function ensureSepolia() {
//     if (!window.ethereum) throw new Error('No injected wallet');

//     // 1) If already on Sepolia, nothing to do
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const net = await provider.getNetwork();
//     if (net.chainId === SEPOLIA.chainIdDec) return provider;

//     // 2) Try switching
//     try {
//         await window.ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: SEPOLIA.chainIdHex }],
//         });
//     } catch (err: any) {
//         // 4902 = chain not added; add it, then switch
//         if (err?.code === 4902) {
//             await window.ethereum.request({
//                 method: 'wallet_addEthereumChain',
//                 params: [{
//                     chainId: SEPOLIA.chainIdHex,
//                     chainName: SEPOLIA.chainName,
//                     rpcUrls: SEPOLIA.rpcUrls,
//                     nativeCurrency: SEPOLIA.nativeCurrency,
//                     blockExplorerUrls: SEPOLIA.blockExplorerUrls,
//                 }],
//             });
//             await window.ethereum.request({
//                 method: 'wallet_switchEthereumChain',
//                 params: [{ chainId: SEPOLIA.chainIdHex }],
//             });
//         } else {
//             throw err;
//         }
//     }
// }
// async function createCampaignOnChain(opts: {
//     campaignName: string;
//     charityId: number;
//     charityName: string;
//     beneficiary: string;
// }) {
//     // 1) בדיקת MetaMask
//     if (!window.ethereum) {
//         alert("לא נמצא ארנק בדפדפן (MetaMask).");
//         return false;
//     }
//     await ensureSepolia();
//     // 2) חיבור לרשת והארנק
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//     const network = await provider.getNetwork();
//     console.log('network.chainId !== TARGET_CHAIN_ID', network.chainId, TARGET_CHAIN_ID);

//     if (network.chainId !== TARGET_CHAIN_ID) {
//         alert("נא לעבור לרשת Sepolia בארנק.");
//         return false;
//     }
//     const signer = await provider.getSigner();

//     // 3) יצירת Contract instance וקריאה לפונקציה
//     const hub = new ethers.Contract(CONTRACT, hubAbi.abi as any, signer);

//     // החוזה שלך: function createCampaign(string campaignName, uint256 charityId, string charityName, address beneficiary)
//     const tx = await hub.createCampaign(
//         opts.campaignName,
//         BigInt(opts.charityId),
//         opts.charityName,
//         opts.beneficiary
//     );
//     console.log("createCampaign tx:", tx.hash);
//     const receipt = await tx.wait();

//     // extract campaignId
//     const event = receipt.logs
//         .map((log: { topics: ReadonlyArray<string>; data: string; }) => {
//             try { return hub.interface.parseLog(log); } catch { return null; }
//         })
//         .find((p: { name: string; }) => p && p.name === "CampaignCreated");

//     const onchainId = event?.args?.campaignId; // BigInt
//     console.log("on-chain campaignId:", onchainId?.toString());
//     return onchainId;
// }


// const CreateCampaign = ({ postSave }: { postSave: () => void }) => {
//     const { user } = useAuth();
//     const { isLoading, start, stop } = useSpinner()
//     const { addCampaign } = useCampaigns();
//     const [ngo, setNgo] = useState<Ngo | null>(null)
//     const [form, setForm] = useState({
//         title: "",
//         goal: "",
//         startDate: "",
//         endDate: "",
//         description: "",
//         images: null as FileList | null,
//         movie: null as File | null,
//         mainImage: null as File | null,
//     });

//     const {message, setMessage, showAlert, setShowAlert, isFailure, setIsFailure} = useAlertDialog()

//     useEffect(() => {
//         const loadNgo = async (user: User) => {
//             const ngo = await getNgoById(user?.ngoId)
//             setNgo(ngo)
//         }
//         if (user && user.token) {
//             loadNgo(user);
//         }
//     }, [user])

//     const handleCreateCampaign = async (event: FormEvent) => {
//         event.preventDefault();
//         if (!user || !ngo || !ngo.wallet || !form) return;

//         for (const key in validations) {
//             const field = key as keyof typeof form
//             if (!validateFormCreateCampaign(field, form[field]!.toString(), 'submit')) return;
//         }

//         start();
//         const newCampaign = {
//             ngo: user.ngoId,
//             title: form.title,
//             description: form.description,
//             targetAmount: Number(form.goal),
//             goal: Number(form.goal),
//             startDate: form.startDate,
//             numOfDonors: 0,
//             endDate: form.endDate,
//             isActive: true,
//             blockchainTx: '',
//             images: [],
//             movie: '',
//             tags: [],  // אם רוצים, אפשר להוסיף שדות tags מהטופס
//         };

//         const images: File[] = []
//         if (form.images) {
//             for (const img of form.images) {
//                 images.push(img);
//             }

//         }
//         const blockchainTx: string | boolean = await createCampaignOnChain({
//             campaignName: newCampaign.title,
//             charityId: +ngo?.ngoNumber,
//             charityName: ngo?.name,
//             beneficiary: ngo.wallet
//         })
//         if (blockchainTx === false || !blockchainTx) {
//             return;
//         }
//         console.log(blockchainTx);

//         newCampaign.blockchainTx = blockchainTx.toString();
//         const success = await addCampaign(newCampaign, images, form.movie, form.mainImage);
//         if (!success) {
//             stop();
//             setIsFailure(true)
//             setMessage("שגיאה ביצירת הקמפיין");
//             setShowAlert(true);
//             return;
//         }
//         stop();
//         setIsFailure(false)
//         setMessage("הקמפיין נוצר בהצלחה!");
//         setShowAlert(true);        
//         setForm({
//             title: "",
//             goal: "",
//             startDate: "",
//             endDate: "",
//             description: "",
//             images: null as FileList | null,
//             movie: null as File | null,
//             mainImage: null as File | null,
//         });
//         postSave()
//     };

//     const getImages = () => {
//         const images: File[] = []
//         if (form.images) {
//             for (const img of form.images) {
//                 images.push(img);
//             }
//         }
//         return images;
//     }
//     type StatusType = 'edit'|'submit'|'both';
//     type ValidationType = { 
//         [key in keyof Partial<typeof form>]: { 
//             validate: (value: string) => boolean,
//              message: string,
//              status: StatusType
//              }
//      }
//     const validations: ValidationType = {
//         endDate: {
//             validate: (value: string) => (form.startDate != "" && value.localeCompare(form.startDate) <= 0),
//             message: "תאריך סיום קמפיין חייב להיות אחרי תאריך התחלה",
//             status:'submit',
//         },
//         goal: {
//             validate: (value: string) => isNaN(+value) || +value <= 0,
//             message: "סכום יעד חייב להיות חיובי",
//             status:'submit',
//         },
//         title:{
//             validate:(value:string) => value.length < 2,
//             message:'שם קמפיין קצר מדי',
//             status: 'submit'
//         },
//         startDate: {
//             validate: (value: string) => {
//                 console.log(value, new Date().toISOString().split("T")[0], value.localeCompare(new Date().toISOString().split("T")[0]) <= 0);
                
//                 return value.localeCompare(new Date().toISOString().split("T")[0]) < 0
//             },
//             message: "תאריך התחלה לא יכול להיות בעבר",
//             status:'submit',
//         },
//     }
//     const validateFormCreateCampaign = (name: keyof typeof form, value: string, status:StatusType) => {
//         if (validations[name] && (validations[name].status == 'both' ||validations[name].status ==status) && validations[name].validate(value)) {
//             setIsFailure(true)
//             setMessage(validations[name].message);
//             setShowAlert(true);
//             return false;
//         }

//         return true;
//     }

//     const handleChange = (name: string, value: string | number) => {

//         if (!validateFormCreateCampaign(name as keyof typeof form, value.toString(), 'edit')) return;
//         setForm({ ...form, [name]: value })
//     }
//     const handleFileChange = (field: string, value: FileList | null, multiple: boolean) => {
//         setForm({ ...form, [field]: value ? multiple ? value : value![0] : null })
//     }
//     if (isLoading) return (<Spinner />)
//     return (
//         <>
//             <form style={cardStyle} onSubmit={handleCreateCampaign}>
//                 <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
//                     יצירת קמפיין
//                 </h2>
//                 <InputText field="title" placeholder="שם הקמפיין" value={form.title} onChange={handleChange} />
//                 <InputText field="goal" type="number" placeholder="סכום יעד" value={form.goal} onChange={handleChange} />
//                 <InputText field="startDate" type="date" label="תאריך התחלה" value={form.startDate} onChange={handleChange} />
//                 <InputText field="endDate" type="date" label="תאריך סיום" value={form.endDate} onChange={handleChange} />
//                 <InputText field="description" isMultiLine={true} placeholder="תיאור הקמפיין" value={form.description} style={{ height: "80px" }} onChange={handleChange} />

//                 <InputFile field="mainImage" label="תמונת קמפיין:" onChange={handleFileChange} accept="image/*" />
//                 {form.mainImage && <img src={URL.createObjectURL(form.mainImage)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}

//                 <InputFile field="images" label="תמונות קמפיין:" onChange={handleFileChange} accept="image/*" multiple={true} />
//                 {getImages().map(image => <img key={image.name} src={URL.createObjectURL(image)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />)}

//                 <InputFile field="movie" label="סרטון:" onChange={handleFileChange} accept="video/*" />

//                 {form.movie && <video src={URL.createObjectURL(form.movie)} controls style={{ width: "150px", marginBottom: "10px" }} />}

//                 <button type='submit' style={primaryBtnStyle}>
//                     צור קמפיין
//                 </button>
//             </form>
//       <AlertDialog
//         show={showAlert}
//         failureTitle="שגיאה"
//         successTitle=""
//         message={message}
//         failureOnClose={() => setShowAlert(false)}
//         isFailure={isFailure}
//       />
//         </>

//     )
// }

// export default CreateCampaign


import { ethers } from "ethers";
import hubAbi from '../abi/Donatchain.json';
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";
import { cardStyle, primaryBtnStyle } from "../css/dashboardStyles";
import { getNgoById } from "../services/ngoApi";
import type { Ngo } from "../models/Ngo";
import type { User } from "../models/User";
import Spinner, { useSpinner } from "./Spinner";
import '../css/AlertDialog.css';

import InputText, { InputFile } from "./gui/InputText";
import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";
import "../css/campaign/CreateCampaign.css";               // ⬅️ חדש: קובץ העיצוב לעמוד
import { getCampaignTags } from "../services/campaignApi";

const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const TARGET_CHAIN_ID = BigInt(import.meta.env.VITE_CHAIN_ID ?? "11155111"); // Sepolia
const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

const SEPOLIA = {
  chainIdDec: 11155111n,
  chainIdHex: '0xaa36a7',
  rpcUrls: ['https://rpc.sepolia.org'],
  chainName: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

// קטגוריות מוצעות (אפשר להרחיב/לשנות)
// const CATEGORIES = [
//   "רווחה", "בריאות", "חינוך", "סביבה", "בעלי חיים", "קהילה",
//   "תרבות", "חירום", "טכנולוגיה", "חסד", "שוויון", "נגישות"
// ];

async function ensureSepolia() {
  if (!window.ethereum) throw new Error('No injected wallet');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const net = await provider.getNetwork();
  if (net.chainId === SEPOLIA.chainIdDec) return provider;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA.chainIdHex }],
    });
  } catch (err: any) {
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA.chainIdHex,
          chainName: SEPOLIA.chainName,
          rpcUrls: SEPOLIA.rpcUrls,
          nativeCurrency: SEPOLIA.nativeCurrency,
          blockExplorerUrls: SEPOLIA.blockExplorerUrls,
        }],
      });
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA.chainIdHex }],
      });
    } else {
      throw err;
    }
  }
}
async function createCampaignOnChain(opts: {
  campaignName: string;
  charityId: number;
  charityName: string;
  beneficiary: string;
}) {
  if (!window.ethereum) { alert("לא נמצא ארנק בדפדפן (MetaMask)."); return false; }
  await ensureSepolia();
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (network.chainId !== TARGET_CHAIN_ID) { alert("נא לעבור לרשת Sepolia בארנק."); return false; }
  const signer = await provider.getSigner();
  const hub = new ethers.Contract(CONTRACT, hubAbi.abi as any, signer);
  const tx = await hub.createCampaign(
    opts.campaignName,
    BigInt(opts.charityId),
    opts.charityName,
    opts.beneficiary
  );
  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log: { topics: ReadonlyArray<string>; data: string; }) => { try { return hub.interface.parseLog(log); } catch { return null; } })
    .find((p: { name: string; } | null) => p && (p as any).name === "CampaignCreated");
  const onchainId = (event as any)?.args?.campaignId;
  return onchainId;
}

const CreateCampaign = ({ postSave }: { postSave: () => void }) => {
  const { user } = useAuth();
  const { isLoading, start, stop } = useSpinner();
  const { addCampaign } = useCampaigns();
  const [ngo, setNgo] = useState<Ngo | null>(null);
  const [campaignTags, setCampaignTags] = useState<{[key:string]:string}[]>([])

  const [form, setForm] = useState({
    title: "",
    goal: "",
    startDate: "",
    endDate: "",
    description: "",
    images: null as FileList | null,
    movie: null as File | null,
    mainImage: null as File | null,
    tags: [] as string[],                       // ⬅️ חדש: קטגוריות שנבחרו
  });

  const {message, setMessage, showAlert, setShowAlert, isFailure, setIsFailure} = useAlertDialog();

  useEffect(() => {
    const loadNgo = async (u: User) => {
      const n = await getNgoById(u?.ngoId);
      setNgo(n);
      const t = await getCampaignTags()
      setCampaignTags(t);
    };
    if (user?.token) loadNgo(user);

  }, [user]);

  const handleCreateCampaign = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !ngo || !ngo.wallet) return;

    for (const key in validations) {
      const field = key as keyof typeof form;
      if (!validateFormCreateCampaign(field, (form as any)[field]?.toString?.() ?? "", 'submit')) return;
    }

    start();
    const newCampaign = {
      ngo: user.ngoId,
      title: form.title,
      description: form.description,
      targetAmount: Number(form.goal),
      goal: Number(form.goal),
      startDate: form.startDate,
      numOfDonors: 0,
      endDate: form.endDate,
      isActive: true,
      blockchainTx: '',
      images: [],
      movie: '',
      tags: form.tags,                          // ⬅️ שולחים לשרת
    };

    const images: File[] = [];
    if (form.images) for (const img of form.images) images.push(img);

    const blockchainTx: string | boolean = await createCampaignOnChain({
      campaignName: newCampaign.title,
      charityId: +ngo.ngoNumber,
      charityName: ngo.name,
      beneficiary: ngo.wallet
    });
    if (!blockchainTx) { stop(); return; }

    newCampaign.blockchainTx = blockchainTx.toString();
    const success = await addCampaign(newCampaign, images, form.movie, form.mainImage);
    if (!success) {
      stop(); setIsFailure(true); setMessage("שגיאה ביצירת הקמפיין"); setShowAlert(true); return;
    }
    stop(); setIsFailure(false); setMessage("הקמפיין נוצר בהצלחה!"); setShowAlert(true);
    setForm({
      title: "", goal: "", startDate: "", endDate: "", description: "",
      images: null, movie: null, mainImage: null, tags: []
    });
    postSave();
  };

  const getImages = () => {
    const out: File[] = [];
    if (form.images) for (const img of form.images) out.push(img);
    return out;
  };

  type StatusType = 'edit'|'submit'|'both';
  type ValidationType = { 
    [key in keyof Partial<typeof form>]: { 
      validate: (value: string) => boolean,
      message: string,
      status: StatusType
    }
  }
  const validations: ValidationType = {
    endDate: { validate: (v) => (form.startDate !== "" && v.localeCompare(form.startDate) <= 0), message: "תאריך סיום קמפיין חייב להיות אחרי תאריך התחלה", status:'submit' },
  goal: {
    validate: (v) => !v || isNaN(+v) || +v <= 0,
    message: "נא להזין סכום יעד תקין (מספר גדול מ-0).",
    status: 'submit'
  },
    title: {
    validate: (v) => !v || v.trim().length < 2,
    message: "יש להזין שם קמפיין (לפחות 2 תווים).",
    status: 'submit'
  },
  startDate: {
    validate: (v) => !v || v.localeCompare(new Date().toISOString().split("T")[0]) < 0,
    message: "נא להזין תאריך התחלה שאינו בעבר.",
    status: 'submit'
  },
    description: {
    validate: (v) => !v || v.trim().length < 10,
    message: "נא להזין תיאור מפורט (לפחות 10 תווים).",
    status: 'submit'
  },
  mainImage: {
    validate: (_) => !form.mainImage,
    message: "יש להעלות תמונה ראשית לקמפיין.",
    status: 'submit'
  },
  tags: {
    validate: (_) => !form.tags || form.tags.length < 1,
    message: "נא לבחור לפחות קטגוריה אחת לקמפיין.",
    status: 'submit'
  },

  };
  const validateFormCreateCampaign = (name: keyof typeof form, value: string, status:StatusType) => {
    if (validations[name] && (validations[name].status === 'both' || validations[name].status === status) && validations[name].validate(value)) {
      setIsFailure(true); setMessage(validations[name].message); setShowAlert(true); return false;
    }
    return true;
  };

  const handleChange = (name: string, value: string | number) => {
    if (!validateFormCreateCampaign(name as keyof typeof form, String(value), 'edit')) return;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleFileChange = (field: string, value: FileList | null, multiple: boolean) => {
    setForm((f) => ({ ...f, [field]: value ? (multiple ? value : value[0]) : null }));
  };

  // בחירת קטגוריות עד 3
  const toggleTag = (tag: string) => {
    setForm((f) => {
      const exists = f.tags.includes(tag);
      if (exists) return { ...f, tags: f.tags.filter(t => t !== tag) };
      if (f.tags.length >= 3) return f;               // מגבלה עד 3
      return { ...f, tags: [...f.tags, tag] };
    });
  };
  const removeTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  if (isLoading) return (<Spinner />);

  return (
    <>
     <form
  className="cc-card cc-compact-media"
  style={cardStyle}
  onSubmit={handleCreateCampaign}
  dir="rtl"
  noValidate
>

        <h2 className="cc-title">יצירת קמפיין</h2>

        <div className="cc-grid">
          <section className="cc-section">
            <h3 className="cc-section-title">פרטי בסיס</h3>
            <InputText field="title" placeholder="שם הקמפיין" value={form.title} onChange={handleChange} />
            <InputText field="goal" type="number" placeholder="סכום יעד" value={form.goal} onChange={handleChange} />
            <div className="cc-row2">
              <InputText field="startDate" type="date" label="תאריך התחלה" value={form.startDate} onChange={handleChange} />
              <InputText field="endDate" type="date" label="תאריך סיום" value={form.endDate} onChange={handleChange} />
            </div>
            <InputText field="description" isMultiLine placeholder="תיאור הקמפיין" value={form.description} style={{ height: "110px" }} onChange={handleChange} />
          </section>

          <section className="cc-section">
            <h3 className="cc-section-title">מדיה</h3>
            <div className="cc-media-field">
              <InputFile field="mainImage" label="תמונת קמפיין:" onChange={handleFileChange} accept="image/*" />
              {form.mainImage && (
                <img
                  src={URL.createObjectURL(form.mainImage)}
                  alt="תמונה ראשית"
                  className="cc-main-preview"
                />
              )}
            </div>

            <div className="cc-media-field">
              <InputFile field="images" label="תמונות נוספות:" onChange={handleFileChange} accept="image/*" multiple />
              <div className="cc-gallery">
                {getImages().map(image => (
                  <img key={image.name} src={URL.createObjectURL(image)} alt="תמונה" className="cc-thumb" />
                ))}
              </div>
            </div>

            <div className="cc-media-field">
              <InputFile field="movie" label="סרטון:" onChange={handleFileChange} accept="video/*" />
              {form.movie && <video src={URL.createObjectURL(form.movie)} controls className="cc-video" />}
            </div>
          </section>
        </div>

        {/* קטגוריות */}
        <section className="cc-section">
          <div className="cc-section-title with-counter">
            <span>קטגוריות הקמפיין</span>
            <span className={`cc-counter ${form.tags.length === 3 ? 'full' : ''}`}>{form.tags.length}/3</span>
          </div>

          <div className="cc-chips">
            {campaignTags.map(({tag}) => {
              const selected = form.tags.includes(tag);
              const disabled = !selected && form.tags.length >= 3;
              return (
                <button
                  key={tag}
                  type="button"
                  className={`cc-chip ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={selected}
                  disabled={disabled}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* הצגת הנבחרות + אפשרות להסרה */}
          {form.tags.length > 0 && (
            <div className="cc-selected">
              {form.tags.map(tag => (
                <span key={tag} className="cc-selected-chip" onClick={() => removeTag(tag)} title="הסרת קטגוריה">✕ {tag}</span>
              ))}
            </div>
          )}
        </section>

        <div className="cc-actions">
          <button type="submit" style={primaryBtnStyle} className="cc-submit">צור קמפיין</button>
        </div>
      </form>

      <AlertDialog
        show={showAlert}
        failureTitle="שגיאה"
        successTitle=""
        message={message}
        failureOnClose={() => setShowAlert(false)}
        isFailure={isFailure}
      />
    </>
  );
};

export default CreateCampaign;
