import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react"; // אייקונים
import NgoItem from "../components/NgoItem";
import { getNgoList } from "../services/ngoApi";
import type { Ngo } from "../models/Ngo";

import '../css/Ngos.css'

export default function Ngos() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [ngos, setNgos] = useState<Ngo[]>([])
    const [view, setView] = useState<"grid" | "list">("grid"); // מצב תצוגה

    const loadNgoList = async () => {
        try {
            const ngos = await getNgoList();
            setNgos(ngos.items);
        } catch (error) {
            console.log(error);
            alert('error loading ngos')
        }
    }
    useEffect(() => {
        loadNgoList();
    }, [])
    const filteredNgos = ngos
        .filter((ngo) => ngo.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name)
            } else if (sortBy === "createdOld") {
                return a.createdAt.toString().localeCompare(b.createdAt.toString())
            } else if(sortBy === 'createdNew') {
                return b.createdAt.toString().localeCompare(a.createdAt.toString())
            }else{
                const ngoa = (a as any)
                const ngob = (b as any)
                return ngob.ngoCampaignsCount - ngoa.ngoCampaignsCount
            }
        }
        );

    return (
        <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "20px", width: "80%" }}>
            {/* כותרת */}
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#374151" }}>רשימת עמותות</h1>

            {/* חיפוש + מיון */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                >
                    <option value="name">מיין לפי שם</option>
                    <option value="createdOld">מיין לפי תאריך הקמה מהישן</option>
                    <option value="createdNew">מיין לפי תאריך הקמה מהחדש</option>
                    <option value="ngoCampaignsCount">מיין לפי מספר קמפיינים  </option>
                </select>

                <input
                    type="text"
                    placeholder="חיפוש..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                />

                {/* כפתורי תצוגה */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={() => setView("list")}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            background: view === "list" ? "#e5e7eb" : "white",
                            cursor: "pointer",
                        }}
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setView("grid")}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            background: view === "grid" ? "#e5e7eb" : "white",
                            cursor: "pointer",
                        }}
                    >
                        <Grid size={20} />
                    </button>
                </div>
            </div>

            {/* רשימת עמותות */}

                <div className={view == 'grid'?'ngos-container_grid':'ngos-container_flex'}>
                    {filteredNgos.map((ngo) => <NgoItem key={ngo._id} ngo={ngo} view={view}/>)}
                </div> 
        </div>
    );
}



