
import { ethers } from "ethers";
import hubAbi from '../abi/Donatchain.json';    // ← ה-ABI שהעתקת
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";

import { cardStyle, inputStyle, primaryBtnStyle } from "../css/dashboardStyles";
import { getNgoById } from "../services/ngoApi";
import type { Ngo } from "../models/Ngo";
import type { User } from "../models/User";
import Spinner, { useSpinner } from "./Spinner";
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
        const {isLoading, start, stop} = useSpinner()
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

        useEffect(() => {
            const loadNgo = async (user: User) => {
                const ngo = await getNgoById(user?.ngoId)
                setNgo(ngo)
            }
            if (user && user.token) {
                loadNgo(user);
            }
        }, [user])

        const handleCreateCampaign = async () => {
            if (!form.title || !form.goal) return alert("יש למלא את כל השדות");
            if (!user || !ngo || !ngo.wallet) return;
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
            const success = await addCampaign(newCampaign, images, form.movie,form.mainImage); 
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
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
            const {name, value} = event.target
            if(name == "endDate" && form.startDate != "" && value.localeCompare(form.startDate) < 0){
                alert("תאריך סיום קמפיין חייב להיות אחרי תאריך התחלה")
                return;
            }
            if(name == 'goal' && +value <= 0){
                alert("סכום יעד חייב להיות חיובי ")
                return;
            }
            if(name == 'startDate' && value.localeCompare(new Date().toISOString()) < 0){
                alert("תאריך התחלה לא יכול להיות בעבר ")
                return;
            }
            setForm({ ...form, [name]:value })
        }
        
        if(isLoading) return (<Spinner/>)
        return (
            <div style={cardStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                    יצירת קמפיין
                </h2>
                <input type="text" placeholder="שם הקמפיין" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
                <input type="number" placeholder="סכום יעד" value={form.goal}  name="goal"
                    onChange={handleChange} style={inputStyle} />
                <label style={{ fontWeight: "bold" }}>תאריך התחלה:</label>
                <input type="date" value={form.startDate} 
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} />
                <label style={{ fontWeight: "bold" }}>תאריך סיום:</label>
                <input type="date" value={form.endDate} name="endDate"
                    onChange={handleChange} style={inputStyle} />
                <textarea placeholder="תיאור הקמפיין" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, height: "80px" }} />

                <label>תמונת קמפיין:</label>
                <input type="file" accept="image/*" 
                    onChange={(e) => setForm({ ...form, mainImage: e.target.files ? e.target.files![0] : null })} style={inputStyle} />

                 {form.mainImage && <img src={URL.createObjectURL(form.mainImage)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}

                <label>תמונות קמפיין:</label>
                <input type="file" accept="image/*" multiple
                    onChange={(e) => setForm({ ...form, images: e.target.files ? e.target.files : null })} style={inputStyle} />

                {getImages().map(image => <img key={image.name} src={URL.createObjectURL(image)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />)}

                <label>סרטון:</label>
                <input type="file" accept="video/*"
                    onChange={(e) => setForm({ ...form, movie: e.target.files ? e.target.files[0] : null })} style={inputStyle} />
                {form.movie && <video src={URL.createObjectURL(form.movie)} controls style={{ width: "150px", marginBottom: "10px" }} />}

                <button onClick={handleCreateCampaign} style={primaryBtnStyle}>
                    צור קמפיין
                </button>
            </div>

        )
    }

    export default CreateCampaign