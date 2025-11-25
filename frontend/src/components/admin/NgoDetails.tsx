import type { Ngo } from "../../models/Ngo";

interface Props {
  ngo: Ngo;          // The NGO object whose details will be displayed
  onBack: () => void; // Callback for navigating back to the previous screen
}

export default function NgoDetails({ ngo, onBack }: Props) {
  return (
    <div className="p-4">
      {/* Back button to return to the NGO list or previous view */}
      <button
        onClick={onBack}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
      >
        חזרה
      </button>

      {/* NGO Name as the main title */}
      <h2 className="text-2xl font-bold mb-4">{ngo.name}</h2>

      {/* NGO information section */}
      <div className="space-y-2">
        <p><strong>תיאור:</strong> {ngo.description || "לא צויין"}</p> {/* NGO description with fallback text */}
        <p><strong>אימייל:</strong> {ngo.email || "-"}</p>              {/* Contact email */}
        <p><strong>טלפון:</strong> {ngo.phone || "-"}</p>              {/* Contact phone */}
        <p><strong>מספר עמותה:</strong> {ngo.ngoNumber || "-"}</p>     {/* Official NGO registration number */}
        <p>
          <strong>נוצר בתאריך:</strong> 
          {new Date(ngo.createdAt).toLocaleDateString()} {/* Formats creation date */}
        </p>
      </div>

      {/* If a logo exists, display it */}
      {ngo.logoUrl && (
        <div className="mt-4">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${ngo.logoUrl}`} // Logo URL served from backend
            alt="לוגו עמותה" // Alternative text for accessibility
            className="max-w-xs rounded shadow" // Styling for layout and aesthetics
          />
        </div>
      )}
    </div>
  );
}
