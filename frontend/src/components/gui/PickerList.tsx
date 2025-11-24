import { useState, useMemo } from 'react';
import { X, Search, ChevronDown } from "lucide-react";

import '../../css/gui/PickerList.css';

export interface Entity {
    _id: string;
    name: string;

}
export type StateFunc = (b: boolean) => void
export type PickerListProps = {
    list: Entity[];
    openPicker: boolean;
    setOpenPicker: React.Dispatch<React.SetStateAction<boolean>>;
    selectedItemId: string;
    setSelectedItemId: React.Dispatch<React.SetStateAction<string>>;
    useNgo?: boolean
}
const PickerList = ({ list, openPicker, setOpenPicker, selectedItemId, setSelectedItemId, useNgo=false}: PickerListProps) => {
    
    const [query, setQuery] = useState<string>("");
    
     const visibleItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return list.sort((c1, c2) => c1.name.localeCompare(c2.name));
        return list.filter((c) => c.name?.toLowerCase().includes(q)).sort((c1, c2) => c1.name.localeCompare(c2.name));
      }, [list, query]);

    return (
        <div className={useNgo?'pickerlist_input-field':'picker'}>
            <button
                type="button"
                className={`picker__button ${useNgo? 'input-field_picker__button' :''}`}
                onClick={() => setOpenPicker((v:boolean) => !v)}
                aria-expanded={openPicker}
                aria-haspopup="listbox"
            >
                <span className="picker__label">
                    {selectedItemId === "all" ? (useNgo?"עמותות קיימות": "כל הקמפיינים") : (list.find(c => c._id === selectedItemId)?.name ?? "בחרו")}
                </span>
                <ChevronDown size={16} className={`chev ${openPicker ? "open" : ""}`} />
            </button>
            {openPicker && <div className="picker__panel" role="listbox">

                <div className="picker__search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="חיפוש..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="picker__clear" onClick={() => setQuery("")} type="button" aria-label="נקה חיפוש">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {!useNgo && <button
                    type="button"
                    className={`picker__option ${selectedItemId === "all" ? "active" : ""}`}
                    onClick={() => { setSelectedItemId("all"); setOpenPicker(false); }}
                >
                    כל הקמפיינים
                </button>}

                <div className="picker__list custom-scroll">
                    {visibleItems.length === 0 && (
                        <div className="picker__empty">לא נמצאו תוצאות</div>
                    )}
                    {visibleItems.map((c) => (
                        <button
                            key={c._id}
                            type="button"
                            className={`picker__option ${selectedItemId === c._id ? "active" : ""}`}
                            onClick={() => { setSelectedItemId(c._id!); setOpenPicker(false); }}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>}
        </div>
    )
}

export const usePickerList = () => {
    const [openPicker, setOpenPicker] = useState<boolean>(false);
    const [ selectedItemId, setSelectedItemId] = useState<string | "all">("all");

    return { openPicker, setOpenPicker,  selectedItemId, setSelectedItemId }
}
export default PickerList;