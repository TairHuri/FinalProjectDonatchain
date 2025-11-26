import { useEffect, useState } from "react";
import axios from "axios";
import AlertDialog, { useAlertDialog } from "../../components/gui/AlertDialog";
// Admin component for editing the website rules / terms & conditions
export default function AdminRulesEditor() {

  // Holds the list of rules fetched from the server
  const [rules, setRules] = useState<any[]>([]);
  // Alert dialog state and handler methods
  const { showAlert, message,isFailure, clearAlert, setAlert } = useAlertDialog();

   // Fetch current rules when component is mounted
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rules`);
        setRules(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת התקנון:", err);
      }
    };
    fetchRules();
  }, []);

  // Save updated rules to the backend
  const saveChanges = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/rules`, rules);
      setAlert("התקנון עודכן בהצלחה ", false);
    } catch (err) {
      setAlert("שגיאה בשמירה ", true);
    }
  };

  if (!rules.length) return <p>טוען תקנון...</p>;

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">עריכת תקנון האתר</h2>
      {rules.map((rule, i) => (
        <div key={i} className="mb-4">
          <input
            type="text"
            value={rule.title}
            onChange={(e) => {
              const newRules = [...rules];
              newRules[i].title = e.target.value;
              setRules(newRules);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full mb-1"
          />
          <textarea
            value={rule.text}
            onChange={(e) => {
              const newRules = [...rules];
              newRules[i].text = e.target.value;
              setRules(newRules);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full h-24"
          />
        </div>
      ))}
      <button onClick={saveChanges} className="bg-blue-700 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-800">
        שמור שינויים
      </button>
      <AlertDialog show={showAlert} message={message} isFailure={isFailure} failureOnClose={clearAlert} successOnClose={clearAlert}/>
    </div>
  );
}
