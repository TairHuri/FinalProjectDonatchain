import { useEffect, useRef, useState } from "react";
import { cardStyle, inputStyle, primaryBtnStyle } from "../../css/dashboardStyles"
import { useCampaigns } from "../../contexts/CampaignsContext";
import type { Campaign } from "../../models/Campaign";
import { getCampaignTags, updateCampaign } from "../../services/campaignApi";
import AlertDialog, { useAlertDialog } from "./../gui/AlertDialog";
import Tags from "./../gui/Tags";

import "../../css/campaign/CreateCampaign.css";
import "../../css/campaign/EditCampaign.css"
import { getCampaignOnChain, updateCampaignOnChain } from "../../services/cryptoApi";
import { formatDates } from "../../validations/campaignDates";

type MediaType = {
  images: { value: FileList | null, ref: React.RefObject<HTMLInputElement | null> },
  movie: { value: File | null, ref: React.RefObject<HTMLInputElement | null> },
  mainImage: { value: File | null, ref: React.RefObject<HTMLInputElement | null> },
};

export type SetCampaign = (func: (c: Campaign | null) => Campaign | null) => void;
export type CampaignEditProps = {
  token: string;
  setCampaign: SetCampaign;
  campaign: Campaign;
  setEditMode: (mode: "view" | "edit") => void;
}
const CampaignEdit = ({ campaign, setEditMode, setCampaign, token, }: CampaignEditProps) => {

  const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();
  const [disableStartDate, setDisableStartDate] = useState<boolean>(false)
  const [origCampaign, setOrigCampaign] = useState<Campaign>({ ...campaign })
  const { postUpdateCampaign } = useCampaigns();
  const [media, setMedia] = useState<MediaType>({
    images: { value: null as FileList | null, ref: useRef<HTMLInputElement>(null) },
    movie: { value: null as File | null, ref: useRef<HTMLInputElement>(null) },
    mainImage: { value: null as File | null, ref: useRef<HTMLInputElement>(null) },
  })

  const removeImage = (field: string, imageName: string) => {
    if (!campaign) return;
    setCampaign((prev) => {
      if (!prev) return null;
      if (field === 'images') {
        return { ...prev, images: prev.images.filter(img => img !== imageName) }
      } else {
        return { ...prev, [field]: null } as Campaign
      }
    })
  }
  const removeNewMedia = (field: keyof MediaType, image: File) => {
    if (field === 'images') {
      if (!media.images.value) return;
      const existingImages = new DataTransfer();
      for (const img of media.images.value) {
        if (img.name !== image.name) existingImages.items.add(img);
      }
      setMedia(existing => ({ ...existing, images: { ...existing.images, value: existingImages.files } }))
      if (media[field].ref.current) media[field].ref.current.files = existingImages.files;
    } else {
      setMedia(existing => ({ ...existing, [field]: { ...existing[field], value: null } }))
      if (media[field].ref.current) media[field].ref.current!.value = ""
    }
  }

  const handleSaveChanges = async () => {

    if (!campaign || !token) return;

    if (!campaign.title || !campaign._id) {
      setAlert("יש למלא את כל השדות", true);
      return;
    }
    if (Number(campaign.goal) < Number(campaign.totalRaised)) {
      setAlert(`לא ניתן להגדיר סכום יעד (${campaign.goal} ₪) קטן מהסכום שכבר גויס (${campaign.totalRaised} ₪).`, true);
      return;
    }


    const images: File[] = [];
    if (media.images.value) for (const img of media.images.value) images.push(img);
    try {
      const chainFields: Partial<Record<keyof Campaign, boolean>> = { title: false, startDate: false, endDate: false, goal: false };
      for (const k in chainFields) {
        if (origCampaign[k as keyof Campaign] != campaign[k as keyof Campaign]) {
          chainFields[k as keyof Campaign] = true;
        }
      }
      const { startDate, endDate } = formatDates(campaign.startDate, campaign.endDate);
      const hasChanged = Object.values(chainFields).reduce((acc, curr) => acc || curr, false)
      
      if (hasChanged) {
        //const campaignOnChain = await getCampaignOnChain(+campaign.blockchainTx!);
        const finalStartDate = chainFields.startDate? startDate.getTime() / 1000 : 0;
        const finalEndDate = chainFields.endDate? endDate.getTime() / 1000 : 0;
        console.log(finalStartDate, finalEndDate);
        await updateCampaignOnChain({
          blockchainTx: +campaign.blockchainTx!,
          campaignName: campaign.title,
          startDate: finalStartDate,
          endDate: finalEndDate,
          goalAmount: campaign.goal
        })
      }

      const updatedCampaign = await updateCampaign(
        campaign,
        token,
        images,
        media.movie.value,
        media.mainImage.value
      );
      if (updatedCampaign._id){
        console.log('updatedCampaign', updatedCampaign);
        
         postUpdateCampaign(updatedCampaign);
      }

      setAlert("קמפיין עודכן בהצלחה", false);

    } catch (error) {
      console.log(error);
      setAlert("עדכון הקמפיין נכשל", true);
    }
  };


  useEffect(() => {

    if (campaign) {
      setCampaign(prev => campaign)
      const now = new Date();
      const startDate = new Date(campaign.startDate)
      if (now.getTime() > startDate.getTime()) setDisableStartDate(true)
    }
  }, [campaign])

  const handleChangeTags = (field: string, value: string | number | string[]) => {
    if (!campaign) return;
    setCampaign(prev => ({ ...campaign!, [field]: value }))
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!campaign) return;
    const { name, value } = event.target;
    if (name === 'startDate') {
      const now = new Date();
      const startDate = new Date(campaign.startDate)
      if (now.getTime() > startDate.getTime()) setDisableStartDate(true)
    }
    setCampaign(prev => ({ ...campaign, [name]: value } as Campaign))
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (!campaign) return;
    const field = name as keyof MediaType
    if (field === 'images') {
      setMedia({ ...media, [field]: { ...media[field], value: files ? files : null } })
    } else {
      setMedia({ ...media, [field]: { ...media[field], value: files ? files![0] : null } })
      if ((campaign as any)[field]) removeImage(field, (campaign as any)[field])
    }
  }

  const getImages = () => {
    const images: File[] = []
    if (media.images.value) for (const img of media.images.value) images.push(img);
    return images;
  }
  const handleSuccess = () => {
    setEditMode("view");
    clearAlert();
  }
  return (
    <div className="cc-card cc-compact-media" style={cardStyle} dir="rtl">
      <h2 className="cc-title">פרטי קמפיין</h2>

      <div className="cc-grid">
        <section className="cc-section">
          <h3 className="cc-section-title">פרטי בסיס</h3>
          <input
            type="text" placeholder="שם הקמפיין" value={campaign.title} name="title"
            onChange={handleChange} style={inputStyle}
          />
          <input
            type="number" placeholder="סכום יעד" value={campaign.goal} name="goal"
            onChange={handleChange} style={inputStyle}
          />
          <div className="cc-row2">
            <div>
              <label style={{ fontWeight: 700 }}>תאריך התחלה:</label>
              <input
                type="date" value={campaign.startDate.split("T")[0]} name="startDate" disabled={disableStartDate}
                onChange={handleChange} style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontWeight: 700 }}>תאריך סיום:</label>
              <input
                type="date" value={campaign.endDate.split("T")[0]} name="endDate"
                onChange={handleChange} style={inputStyle}
              />
            </div>
          </div>
          <textarea
            placeholder="תיאור הקמפיין" value={campaign.description} name="description"
            onChange={handleChange} style={{ ...inputStyle, height: "110px" }}
          />
        </section>

        <section className="cc-section">
          <h3 className="cc-section-title">מדיה</h3>

          <div className="cc-media-field">
            <label>תמונת קמפיין:</label>
            <input
              type="file" accept="image/*" name="mainImage" className="image"
              ref={media.mainImage.ref} onChange={handleMediaChange} style={inputStyle}
            />
            {media.mainImage.value && (
              <div className="image-tile" style={{ marginTop: ".5rem" }}>
                <img src={URL.createObjectURL(media.mainImage.value)} alt="תמונה" className="cc-main-preview" />
                <span onClick={() => removeNewMedia('mainImage', media.mainImage.value!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>
            )}
            {campaign.mainImage && !media.mainImage.value && (
              <div className="image-tile" style={{ marginTop: ".5rem" }}>
                <img src={`${IMAGE_URL}/${campaign.mainImage}`} alt="תמונה" className="cc-main-preview" />
                <span onClick={() => removeImage('mainImage', campaign.mainImage!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>
            )}
          </div>

          <div className="cc-media-field">
            <label>תמונות קמפיין:</label>
            <input
              type="file" accept="image/*" multiple name="images"
              ref={media.images.ref} onChange={handleMediaChange} style={inputStyle}
            />
            <div className="cc-gallery">
              {getImages().map(image => (
                <div key={image.name} className="image-tile">
                  <img src={URL.createObjectURL(image)} alt="תמונה" className="cc-thumb" />
                  <span onClick={() => removeNewMedia('images', image)} className="material-symbols-outlined remove-image-button">close</span>
                </div>
              ))}
            </div>
            <div className="cc-gallery">
              {campaign.images.map(image => (
                <div key={image} className="image-tile">
                  <img src={`${IMAGE_URL}/${image}`} alt="תמונה" className="cc-thumb" />
                  <span onClick={() => removeImage('images', image)} className="material-symbols-outlined remove-image-button">close</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cc-media-field">
            <label>סרטון:</label>
            <input
              type="file" accept="video/*" name="movie" ref={media.movie.ref}
              onChange={handleMediaChange} style={inputStyle}
            />
            {media.movie.value && (
              <div className="image-tile" style={{ marginTop: ".5rem" }}>
                <video src={URL.createObjectURL(media.movie.value)} controls className="cc-video" />
                <span onClick={() => removeNewMedia('movie', media.movie.value!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>
            )}
            {campaign.movie && !media.movie.value && (
              <div className="image-tile" style={{ marginTop: ".5rem" }}>
                <video src={`${IMAGE_URL}/${campaign.movie}`} controls className="cc-video" />
                <span onClick={() => removeImage('movie', campaign.movie!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>
            )}
          </div>
        </section>
      </div>
      <section className="cc-section" style={{ marginTop: "12px" }}>
        <div className="cc-section-title with-counter">
          <span>קטגוריות הקמפיין</span>
          <span className={`cc-counter ${(campaign.tags?.length || 0) === 3 ? 'full' : ''}`}>
            {(campaign.tags?.length || 0)}/3
          </span>
        </div>
        <Tags tagLoader={getCampaignTags} tags={campaign.tags} handleChange={handleChangeTags} />

      </section>

      <div className="cc-actions" style={{ gap: ".6rem" }}>
        <button onClick={handleSaveChanges} style={primaryBtnStyle}>
          עדכן קמפיין
        </button>
        <button onClick={() => setEditMode("view")} style={{ ...primaryBtnStyle, background: "#f87171", color: "#fff" }}>
          ביטול
        </button>
      </div>

      <AlertDialog message={message} show={showAlert} isFailure={isFailure} failureOnClose={clearAlert} successOnClose={handleSuccess} />
    </div>
  )
}



export default CampaignEdit;
