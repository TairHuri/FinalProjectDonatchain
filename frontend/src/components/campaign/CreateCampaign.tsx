
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCampaigns } from "../../contexts/CampaignsContext";
import { cardStyle, primaryBtnStyle } from "../../css/general/dashboardStyles";
import { getNgoById } from "../../services/ngoApi";
import type { Ngo } from "../../models/Ngo";
import type { User } from "../../models/User";
import Spinner, { useSpinner } from "../gui/Spinner";

import InputText, { InputFile } from "../gui/InputText";
import AlertDialog, { useAlertDialog } from "../gui/AlertDialog";
import { getCampaignTags } from "../../services/campaignApi";
import Tags from "../gui/Tags";

import { createCampaignOnChain } from "../../services/cryptoApi";
import { formatDates } from "../../validations/campaignDates";
import '../../css/gui/AlertDialog.css';
import "../../css/campaign/CreateCampaign.css"; 

// Component for creating a new donation campaign
const CreateCampaign = ({ postSave }: { postSave: () => void }) => {
   // Logged-in user data
  const { user } = useAuth();
    // Spinner controls for async operations
  const { isLoading, start, stop } = useSpinner();
 
  // Campaign context for storing newly created campaigns
  const { addCampaign } = useCampaigns();
  // NGO entity associated with the user
  const [ngo, setNgo] = useState<Ngo | null>(null);
  
  // Form state object
  const [form, setForm] = useState({
    title: "",
    goal: "",
    startDate: "",
    endDate: "",
    description: "",
    images: null as FileList | null,
    movie: null as File | null,
    mainImage: null as File | null,
    tags: [] as string[],                       
  });

  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();

    // Load NGO details once the user is available
  useEffect(() => {
    const loadNgo = async (u: User) => {
      const n = await getNgoById(u?.ngoId);
      setNgo(n);
    };
    if (user?.token) loadNgo(user);

  }, [user]);

    // Main submit handler
  const handleCreateCampaign = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !ngo || !ngo.wallet) return;

    for (const key in validations) {
      const field = key as keyof typeof form;
      if (!validateFormCreateCampaign(field, (form as any)[field]?.toString?.() ?? "", 'submit')) return;
    }

    start();
    // Build campaign payload
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
      tags: form.tags,                          
    };

    const images: File[] = [];
    if (form.images) for (const img of form.images) images.push(img);
try{
    const {startDate, endDate} = formatDates(newCampaign.startDate, newCampaign.endDate);
    
    const blockchainTx = await createCampaignOnChain({
      campaignName: newCampaign.title,
      charityId: +ngo.ngoNumber,
      startDate: startDate.getTime()/1000,
      endDate: endDate.getTime()/1000,
      goalAmount: newCampaign.goal * 1000,
      beneficiary: ngo.wallet
    });
    if (!blockchainTx.status) { 
      
      setAlert(blockchainTx.message, true)
      return; 
    }
 
    newCampaign.blockchainTx = blockchainTx.onchainId.toString();
    const success = await addCampaign(newCampaign, images, form.movie, form.mainImage);
    if (!success) {
      stop();setAlert("שגיאה ביצירת הקמפיין", true);  return;
    }
    stop(); setAlert("הקמפיין נוצר בהצלחה!", false); 
    setForm({
      title: "", goal: "", startDate: "", endDate: "", description: "",
      images: null, movie: null, mainImage: null, tags: []
    });
    postSave();
     }catch(error){
      console.log(error);
      setAlert((error as any).message, true)
      stop(); 
    }
  };

  const getImages = () => {
    const out: File[] = [];
    if (form.images) for (const img of form.images) out.push(img);
    return out;
  };

  type StatusType = 'edit' | 'submit' | 'both';
  type ValidationType = {
    [key in keyof Partial<typeof form>]: {
      validate: (value: string) => boolean,
      message: string,
      status: StatusType
    }
  }
  const validations: ValidationType = {
    endDate: { validate: (v) => (form.startDate !== "" && v.localeCompare(form.startDate) <= 0), message: "תאריך סיום קמפיין חייב להיות אחרי תאריך התחלה", status: 'submit' },
    goal: {
      validate: (v) => !v || isNaN(+v) || +v <= 0,
      message: "נא להזין סכום יעד תקין (מספר גדול מ-0).",
      status: 'submit'
    },
    title: {
      validate: (v) => !v || v.trim().length < 2,
      message: "יש להזין שם קמפיין (לפחות 2 תווים).",
      status: 'submit'
    },
    startDate: {
      validate: (v) => !v || v.localeCompare(new Date().toISOString().split("T")[0]) < 0,
      message: "נא להזין תאריך התחלה שאינו בעבר.",
      status: 'submit'
    },
    description: {
      validate: (v) => !v || v.trim().length < 10,
      message: "נא להזין תיאור מפורט (לפחות 10 תווים).",
      status: 'submit'
    },
    mainImage: {
      validate: (_) => !form.mainImage,
      message: "יש להעלות תמונה ראשית לקמפיין.",
      status: 'submit'
    },
    tags: {
      validate: (_) => !form.tags || form.tags.length < 1,
      message: "נא לבחור לפחות קטגוריה אחת לקמפיין.",
      status: 'submit'
    },

  };
  const validateFormCreateCampaign = (name: keyof typeof form, value: string, status: StatusType) => {
    if (validations[name] && (validations[name].status === 'both' || validations[name].status === status) && validations[name].validate(value)) {
      setAlert(validations[name].message, true);  return false;
    }
    return true;
  };

  const handleChange = (name: string, value: string | number | string[]) => {
    if (!validateFormCreateCampaign(name as keyof typeof form, String(value), 'edit')) return;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleFileChange = (field: string, value: FileList | null, multiple: boolean) => {
    setForm((f) => ({ ...f, [field]: value ? (multiple ? value : value[0]) : null }));
  };

  if (isLoading) return (<div style={{display:'flex', alignItems:'center', height:'100%'}}><Spinner /></div>);

  return (
    <>
      <form
        className="cc-card cc-compact-media"
        style={cardStyle}
        onSubmit={handleCreateCampaign}
        dir="rtl"
        noValidate
      >

        <h2 className="cc-title">יצירת קמפיין</h2>

        <div className="cc-grid">
          <section className="cc-section">
            <h3 className="cc-section-title">פרטי בסיס</h3>
            <InputText field="title" placeholder="שם הקמפיין" value={form.title} onChange={handleChange} />
            <InputText field="goal" type="number" placeholder="סכום יעד" value={form.goal} onChange={handleChange} />
            <div className="cc-row2">
              <InputText field="startDate" type="date" label="תאריך התחלה" value={form.startDate} onChange={handleChange} />
              <InputText field="endDate" type="date" label="תאריך סיום" value={form.endDate} onChange={handleChange} />
            </div>
            <InputText field="description" isMultiLine placeholder="תיאור הקמפיין" value={form.description} style={{ height: "110px" }} onChange={handleChange} />
          </section>

          <section className="cc-section">
            <h3 className="cc-section-title">מדיה</h3>
            <div className="cc-media-field">
              <InputFile field="mainImage" label="תמונת קמפיין:" onChange={handleFileChange} accept="image/*" />
              {form.mainImage && (
                <img
                  src={URL.createObjectURL(form.mainImage)}
                  alt="תמונה ראשית"
                  className="cc-main-preview"
                />
              )}
            </div>

            <div className="cc-media-field">
              <InputFile field="images" label="תמונות נוספות:" onChange={handleFileChange} accept="image/*" multiple />
              <div className="cc-gallery">
                {getImages().map(image => (
                  <img key={image.name} src={URL.createObjectURL(image)} alt="תמונה" className="cc-thumb" />
                ))}
              </div>
            </div>

            <div className="cc-media-field">
              <InputFile field="movie" label="סרטון:" onChange={handleFileChange} accept="video/*" />
              {form.movie && <video src={URL.createObjectURL(form.movie)} controls className="cc-video" />}
            </div>
          </section>
        </div>

        {/* קטגוריות */}
        <section className="cc-section">
          <div className="cc-section-title with-counter">
            <span>קטגוריות הקמפיין</span>
            <span className={`cc-counter ${form.tags.length === 3 ? 'full' : ''}`}>{form.tags.length}/3</span>
          </div>
          <Tags tagLoader={getCampaignTags} tags={form.tags} handleChange={handleChange} />
 
        </section>

        <div className="cc-actions">
          <button type="submit" style={primaryBtnStyle} className="cc-submit">צור קמפיין</button>
        </div>
      </form>

      <AlertDialog
        show={showAlert}
        failureTitle="שגיאה"
        successTitle=""
        message={message}
        failureOnClose={clearAlert}
        isFailure={isFailure}
      />
    </>
  );
};

export default CreateCampaign;
