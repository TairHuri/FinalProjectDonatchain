import { useEffect, useState } from "react";
import { getNgoList } from "../../services/ngoApi"
import type { Ngo } from "../../models/Ngo";

interface Props {
  onSelectNgo: (ngo: Ngo) => void;
}

export default function NgoList({ onSelectNgo }: Props) {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNgos() {
      try {
        const res = await getNgoList();
        setNgos(res.items);
      } catch (err: any) {
        setError(err.message || "שגיאה בטעינת העמותות");
      } finally {
        setLoading(false);
      }
    }
    fetchNgos();
  }, []);

  if (loading) return <p>טוען עמותות...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">שם העמותה</th>
            <th className="p-2 border">אימייל</th>
            <th className="p-2 border">טלפון</th>
            <th className="p-2 border">צפייה</th>
          </tr>
        </thead>
        <tbody>
          {ngos.map((ngo) => (
            <tr key={ngo._id} className="hover:bg-gray-100">
              <td className="p-2 border">{ngo.name}</td>
              <td className="p-2 border">{ngo.email || "-"}</td>
              <td className="p-2 border">{ngo.phone || "-"}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => onSelectNgo(ngo)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  הצג
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
