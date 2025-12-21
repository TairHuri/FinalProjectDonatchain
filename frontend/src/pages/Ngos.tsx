import { useEffect, useState } from "react";
import { Grid, List, Search } from "lucide-react"; // אייקונים
import NgoItem from "../components/ngo/NgoItem";
import { getNgoList } from "../services/ngoApi";
import type { Ngo } from "../models/Ngo";

import '../css/ngo/Ngos.css'
import AlertDialog, { useAlertDialog } from "../components/gui/AlertDialog";

export default function Ngos() {
    // Search input value for filtering NGOs by name  
    const [search, setSearch] = useState("");

    // Selected sorting method (name, creation date, campaign count...)  
    const [sortBy, setSortBy] = useState("name");

    // List of NGOs fetched from server  
    const [ngos, setNgos] = useState<Ngo[]>([]);

    // Current UI view mode: grid or list  
    const [view, setView] = useState<"grid" | "list">("grid");

    // Custom hook for showing alert dialog (errors, etc.)
    const { showAlert, message,isFailure, clearAlert, setAlert } = useAlertDialog();

    // Fetch NGO list from API and filter only active ones
    const loadNgoList = async () => {
        try {
            const ngos = await getNgoList();
            setNgos(ngos.items.filter(n => n.isActive == true));
        } catch (error) {
            console.error(error);
            setAlert('error loading ngos', true)
        }
    }

    // Call API on initial render
    useEffect(() => {
        loadNgoList();
    }, [])
    // Filter + sort NGOs based on user actions
    const filteredNgos = ngos
        .filter((ngo) => ngo.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name)
            } else if (sortBy === "createdOld") {
                return a.createdAt.toString().localeCompare(b.createdAt.toString())
            } else if (sortBy === 'createdNew') {
                return b.createdAt.toString().localeCompare(a.createdAt.toString())
            } else {
                const ngoa = (a as any)
                const ngob = (b as any)
                return ngob.ngoCampaignsCount - ngoa.ngoCampaignsCount
            }
        }
        );

    return (
        <div dir="rtl" className="ngos-page">
            {/* Page title */}
            <header className="ngos-header">
                <div className="ngos-title-wrap">
                    <h1 className="ngos-title">רשימת עמותות</h1>
                    <span className="ngos-count">{ngos.length} עמותות</span>
                </div>

                {/* Filters + search bar + view buttons */}
                <div className="ngos-filters">
                    <div className="ngos-input-wrap">
                        <Search size={18} />
                        <input
                            type="text"
                            className="ngos-input"
                            placeholder="חיפוש..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="ngos-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name">מיין לפי שם</option>
                        <option value="createdOld">מיין לפי תאריך הקמה מהישן</option>
                        <option value="createdNew">מיין לפי תאריך הקמה מהחדש</option>
                        <option value="ngoCampaignsCount">מיין לפי מספר קמפיינים  </option>
                    </select>


                    {/* Switch view buttons  */}
                    <div className="ngos-view">
                        <button
                            type="button"
                            className={`ngos-view-btn ${view === "list" ? "is-active" : ""}`}
                            onClick={() => setView("list")}
                        >
                            <List size={20} />
                        </button>
                        <button
                            type="button"
                            className={`ngos-view-btn ${view === "grid" ? "is-active" : ""}`}
                            onClick={() => setView("grid")}
                        >
                            <Grid size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <AlertDialog show={showAlert} message={message} isFailure={isFailure} failureOnClose={clearAlert} />
            {/* NGO list results  */}
            {filteredNgos.length === 0 ? (
                <div className="ngos-empty">
                    לא נמצאו עמותות תואמות. נסו לשנות את החיפוש או המיון.
                </div>
            ) : (
                <div className={view == 'grid' ? 'ngos-items-container_grid' : 'ngos-items-container_flex'}>
                    {filteredNgos.map((ngo) => <NgoItem key={ngo._id} ngo={ngo} view={view} />)}
                </div>
            )}
        </div >
    );
}



