import type { Ngo } from "../../models/Ngo";

interface Props {
  ngo: Ngo;
  onBack: () => void;
}

export default function NgoDetails({ ngo, onBack }: Props) {
  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
      >
        חזרה
      </button>
      <h2 className="text-2xl font-bold mb-4">{ngo.name}</h2>
      <div className="space-y-2">
        <p><strong>תיאור:</strong> {ngo.description || "לא צויין"}</p>
        <p><strong>אימייל:</strong> {ngo.email || "-"}</p>
        <p><strong>טלפון:</strong> {ngo.phone || "-"}</p>
        <p><strong>מספר עמותה:</strong> {ngo.ngoNumber || "-"}</p>
        <p><strong>נוצר בתאריך:</strong> {new Date(ngo.createdAt).toLocaleDateString()}</p>
      </div>
      {ngo.logoUrl && (
        <div className="mt-4">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${ngo.logoUrl}`}
            alt="לוגו עמותה"
            className="max-w-xs rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
