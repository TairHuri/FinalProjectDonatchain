
import { ethers } from "ethers";
import hubAbi from '../abi/Donatchain.json';    // ← ה-ABI שהעתקת
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";

import { cardStyle, inputStyle, primaryBtnStyle } from "../css/dashboardStyles";
import { getNgoById } from "../services/ngoApi";
import type { Ngo } from "../models/Ngo";
import type { User } from "../models/User";
import Spinner, { useSpinner } from "./Spinner";

import '../css/AlertDialog.css'
import AlertDialog from "./gui/AlertDialog";
import type { Campaign } from "../models/Campaign";
import InputText, { InputFile } from "./gui/InputText";
const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;
const TARGET_CHAIN_ID = BigInt(import.meta.env.VITE_CHAIN_ID ?? "11155111"); // Sepolia


const SEPOLIA = {
    chainIdDec: 11155111n,
    chainIdHex: '0xaa36a7', // 11155111 in hex
    rpcUrls: ['https://rpc.sepolia.org'],
    chainName: 'Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

async function ensureSepolia() {
    if (!window.ethereum) throw new Error('No injected wallet');

    // 1) If already on Sepolia, nothing to do
    const provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (net.chainId === SEPOLIA.chainIdDec) return provider;

    // 2) Try switching
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA.chainIdHex }],
        });
    } catch (err: any) {
        // 4902 = chain not added; add it, then switch
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
    // 1) בדיקת MetaMask
    if (!window.ethereum) {
        alert("לא נמצא ארנק בדפדפן (MetaMask).");
        return false;
    }
    await ensureSepolia();
    // 2) חיבור לרשת והארנק
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    console.log('network.chainId !== TARGET_CHAIN_ID', network.chainId, TARGET_CHAIN_ID);

    if (network.chainId !== TARGET_CHAIN_ID) {
        alert("נא לעבור לרשת Sepolia בארנק.");
        return false;
    }
    const signer = await provider.getSigner();

    // 3) יצירת Contract instance וקריאה לפונקציה
    const hub = new ethers.Contract(CONTRACT, hubAbi.abi as any, signer);

    // החוזה שלך: function createCampaign(string campaignName, uint256 charityId, string charityName, address beneficiary)
    const tx = await hub.createCampaign(
        opts.campaignName,
        BigInt(opts.charityId),
        opts.charityName,
        opts.beneficiary
    );
    console.log("createCampaign tx:", tx.hash);
    const receipt = await tx.wait();

    // extract campaignId
    const event = receipt.logs
        .map((log: { topics: ReadonlyArray<string>; data: string; }) => {
            try { return hub.interface.parseLog(log); } catch { return null; }
        })
        .find((p: { name: string; }) => p && p.name === "CampaignCreated");

    const onchainId = event?.args?.campaignId; // BigInt
    console.log("on-chain campaignId:", onchainId?.toString());
    return onchainId;
}


const CreateCampaign = ({ postSave }: { postSave: () => void }) => {
    const { user } = useAuth();
    const { isLoading, start, stop } = useSpinner()
    const { addCampaign } = useCampaigns();
    const [ngo, setNgo] = useState<Ngo | null>(null)
    const [form, setForm] = useState({
        title: "",
        goal: "",
        startDate: "",
        endDate: "",
        description: "",
        images: null as FileList | null,
        movie: null as File | null,
        mainImage: null as File | null,
    });

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        const loadNgo = async (user: User) => {
            const ngo = await getNgoById(user?.ngoId)
            setNgo(ngo)
        }
        if (user && user.token) {
            loadNgo(user);
        }
    }, [user])

    const handleCreateCampaign = async (event: FormEvent) => {
        event.preventDefault();
        if (!user || !ngo || !ngo.wallet || !form) return;

        for (const key in validations) {
            const field = key as keyof typeof form
            if (!validateFormCreateCampaign(field, form[field]!.toString(), 'submit')) return;
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
            tags: [],  // אם רוצים, אפשר להוסיף שדות tags מהטופס
        };

        const images: File[] = []
        if (form.images) {
            for (const img of form.images) {
                images.push(img);
            }

        }
        const blockchainTx: string | boolean = await createCampaignOnChain({
            campaignName: newCampaign.title,
            charityId: +ngo?.ngoNumber,
            charityName: ngo?.name,
            beneficiary: ngo.wallet
        })
        if (blockchainTx === false || !blockchainTx) {
            return;
        }
        console.log(blockchainTx);

        newCampaign.blockchainTx = blockchainTx.toString();
        const success = await addCampaign(newCampaign, images, form.movie, form.mainImage);
        if (!success) {
            stop();
            alert("שגיאה ביצירת הקמפיין");
            return;
        }
        stop();
        alert("הקמפיין נוצר בהצלחה!");
        setForm({
            title: "",
            goal: "",
            startDate: "",
            endDate: "",
            description: "",
            images: null as FileList | null,
            movie: null as File | null,
            mainImage: null as File | null,
        });
        postSave()
    };

    const getImages = () => {
        const images: File[] = []
        if (form.images) {
            for (const img of form.images) {
                images.push(img);
            }
        }
        return images;
    }
    type StatusType = 'edit'|'submit'|'both';
    type ValidationType = { 
        [key in keyof Partial<typeof form>]: { 
            validate: (value: string) => boolean,
             message: string,
             status: StatusType
             }
     }
    const validations: ValidationType = {
        endDate: {
            validate: (value: string) => (form.startDate != "" && value.localeCompare(form.startDate) <= 0),
            message: "תאריך סיום קמפיין חייב להיות אחרי תאריך התחלה",
            status:'submit',
        },
        goal: {
            validate: (value: string) => isNaN(+value) || +value <= 0,
            message: "סכום יעד חייב להיות חיובי",
            status:'submit',
        },
        title:{
            validate:(value:string) => value.length < 2,
            message:'שם קמפיין קצר מדי',
            status: 'submit'
        },
        startDate: {
            validate: (value: string) => {
                console.log(value, new Date().toISOString().split("T")[0], value.localeCompare(new Date().toISOString().split("T")[0]) <= 0);
                
                return value.localeCompare(new Date().toISOString().split("T")[0]) < 0
            },
            message: "תאריך התחלה לא יכול להיות בעבר",
            status:'submit',
        },
    }
    const validateFormCreateCampaign = (name: keyof typeof form, value: string, status:StatusType) => {
        if (validations[name] && (validations[name].status == 'both' ||validations[name].status ==status) && validations[name].validate(value)) {
            setErrorMessage(validations[name].message);
            setShowError(true);
            return false;
        }

        return true;
    }

    const handleChange = (name: string, value: string | number) => {

        if (!validateFormCreateCampaign(name as keyof typeof form, value.toString(), 'edit')) return;
        setForm({ ...form, [name]: value })
    }
    const handleFileChange = (field: string, value: FileList | null, multiple: boolean) => {
        setForm({ ...form, [field]: value ? multiple ? value : value![0] : null })
    }
    if (isLoading) return (<Spinner />)
    return (
        <>
            <form style={cardStyle} onSubmit={handleCreateCampaign}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                    יצירת קמפיין
                </h2>
                <InputText field="title" placeholder="שם הקמפיין" value={form.title} onChange={handleChange} />
                <InputText field="goal" type="number" placeholder="סכום יעד" value={form.goal} onChange={handleChange} />
                <InputText field="startDate" type="date" label="תאריך התחלה" value={form.startDate} onChange={handleChange} />
                <InputText field="endDate" type="date" label="תאריך סיום" value={form.endDate} onChange={handleChange} />
                <InputText field="description" isMultiLine={true} placeholder="תיאור הקמפיין" value={form.description} style={{ height: "80px" }} onChange={handleChange} />

                <InputFile field="mainImage" label="תמונת קמפיין:" onChange={handleFileChange} accept="image/*" />
                {form.mainImage && <img src={URL.createObjectURL(form.mainImage)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}

                <InputFile field="images" label="תמונות קמפיין:" onChange={handleFileChange} accept="image/*" multiple={true} />
                {getImages().map(image => <img key={image.name} src={URL.createObjectURL(image)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />)}

                <InputFile field="movie" label="סרטון:" onChange={handleFileChange} accept="video/*" />

                {form.movie && <video src={URL.createObjectURL(form.movie)} controls style={{ width: "150px", marginBottom: "10px" }} />}

                <button type='submit' style={primaryBtnStyle}>
                    צור קמפיין
                </button>
            </form>
            <AlertDialog
                show={showError}
                title="שגיאה"
                message={errorMessage}
                onClose={() => setShowError(false)}
            />
        </>

    )
}

export default CreateCampaign