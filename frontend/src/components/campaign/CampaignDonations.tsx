import React, { useEffect, useState } from "react";
import type { Donation } from "../../models/Donation";
import Spinner, { useSpinner } from "../Spinner";
import { getDonationsByCampaign } from "../../services/donationApi";


const CampaignDonations = ({campaignId}:{campaignId:string}) => {
    const [donations, setDonations] = useState<Pick<Donation, "_id"|"firstName" | "lastName" | "amount" | "currency" | "comment" | "txHash">[]>([])
    const {isLoading, start,stop} = useSpinner();

    const loadDonations = async() => {
        start()
        try{
            const donations = await getDonationsByCampaign(campaignId)
            setDonations(donations)
        }catch(error){

        }finally{
            stop();
        }
    }
    useEffect(() => {
        loadDonations();
    }, [])
    if(isLoading) return <Spinner/>
    if (!donations || donations.length === 0) {
        return (
            <div
                style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "16px",
                    fontFamily: "calibri",
                    fontSize: "0.9rem",
                    color: "#4b5563",
                    textAlign: "center",
                }}
            >
                עדיין אין תרומות לקמפיין הזה
            </div>
        );
    }

    return (
        <div
            style={{
                fontFamily: "calibri",
            }}
        >
            {/* כותרת האיזור */}
            <div
                style={{
                    marginBottom: "12px",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#111827",
                        lineHeight: 1.3,
                    }}
                >
                    תרומות אחרונות
                </div>
                <div
                    style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        lineHeight: 1.4,
                    }}
                >
                    תודה לכל מי שתורם ועוזר לנו לעשות שינוי אמיתי 💚
                </div>
            </div>

            {/* הגריד של התרומות */}
            <div
                style={{
                    display: "grid", // 👈 לפי הבקשה שלך
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "12px",
                }}
            >
                {donations.map((donation) => {
                    const isAnon =
                        donation.firstName.toLowerCase() === "anonymous" ||
                        donation.lastName.toLowerCase() === "anonymous";

                    const donorName = isAnon
                        ? "תורם אנונימי"
                        : `${donation.firstName} ${donation.lastName}`;

                    const shortHash =
                        donation.txHash!.length > 12
                            ? `${donation.txHash!.slice(0, 8)}...${donation.txHash!.slice(-6)}`
                            : donation.txHash;

                    return (
                        <div
                            key={donation._id!}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "10px",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                                padding: "12px 14px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                lineHeight: 1.4,
                            }}
                        >
                            {/* שם התורם */}
                            <div
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 600,
                                    color: "#111827",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>{donorName}</span>
                                <span
                                    style={{
                                        fontWeight: 700,
                                        color: "#065f46",
                                        backgroundColor: "#d1fae5",
                                        borderRadius: "6px",
                                        padding: "2px 8px",
                                        fontSize: "0.8rem",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {donation.amount} {donation.currency}
                                </span>
                            </div>

                            {/* לינק לבלוקצ'יין */}
                            <div
                                style={{
                                    fontSize: "0.75rem",
                                    color: "#6b7280",
                                    wordBreak: "break-word",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    rowGap: "4px",
                                }}
                            >
                                <span>טרנזקציה:</span>

                                <a
                                    href={`https://sepolia.etherscan.io/tx/${donation.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#047857",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        backgroundColor: "#ecfdf5",
                                        border: "1px solid #a7f3d0",
                                        borderRadius: "6px",
                                        padding: "2px 6px",
                                        fontSize: "0.75rem",
                                        lineHeight: 1.3,
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                                    }}
                                >
                                    {shortHash}
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default CampaignDonations;