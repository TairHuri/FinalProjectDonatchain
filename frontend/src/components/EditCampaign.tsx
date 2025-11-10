
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, inputStyle, primaryBtnStyle } from "../css/dashboardStyles"
import { useCampaigns } from "../contexts/CampaignsContext";
import type { Campaign } from "../models/Campaign";
import { getCampaignTags, toggleCampaignStatus, updateCampaign } from "../services/campaignApi";
import ConfirmDialog, { useConfirmDialog } from "./gui/ConfirmDialog";
import "../css/campaign/CreateCampaign.css"; // ⬅️ שימוש באותם סגנונות של מסך יצירה (cc- classes)
import "../css/campaign/EditCampaign.css"
import type { User } from "../models/User";
import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";

type MediaType = {
  images: { value: FileList | null, ref: React.RefObject<HTMLInputElement | null> },
  movie: { value: File | null, ref: React.RefObject<HTMLInputElement | null> },
  mainImage: { value: File | null, ref: React.RefObject<HTMLInputElement | null> },
};


const EditCampaign = ({
  campaignId,
  editMode,
  setEditMode
}: {
  campaignId: string,
  editMode: string,
  setEditMode: (mode: "view" | "edit" | "password") => void
}) => {
  const { user } = useAuth()
  if (!user) return <p>לא בוצעה התחברות</p>
  const { campaigns, postUpdateCampaign } = useCampaigns();
  const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

  const [campaignTags, setCampaignTags] = useState<{[key:string]:string}[]>([])
  const { showConfirm, openConfirm, closeConfirm } = useConfirmDialog()
  const {showAlert, isFailure, setIsFailure, message, setMessage, setShowAlert} = useAlertDialog()
  const [campaign, setCampaign] = useState<Campaign | null>();
  const [disableStartDate, setDisableStartDate] = useState<boolean>(false)
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
  if (!campaign || !user.token) return;
  if (!campaign.title || !campaign._id) {
    alert("יש למלא את כל השדות");
    return;
  }

  
  if (Number(campaign.goal) < Number(campaign.raised)) {
    alert(`לא ניתן להגדיר סכום יעד (${campaign.goal} ₪) קטן מהסכום שכבר גויס (${campaign.raised} ₪).`);
    return;
  }

  const images: File[] = [];
  if (media.images.value) for (const img of media.images.value) images.push(img);

  try {
    const updatedCampaign = await updateCampaign(
      campaign,
      user.token,
      images,
      media.movie.value,
      media.mainImage.value
    );
    if (updatedCampaign._id) postUpdateCampaign(updatedCampaign);
    alert("קמפיין עודכן בהצלחה");
    setEditMode("view");
  } catch (error) {
    console.log(error);
    alert("עדכון הקמפיין נכשל");
  }
};


  useEffect(() => {
    const c = campaigns.find((x) => x._id! === (campaignId));
    if (c) {
      setCampaign(c)
      const now = new Date();
      const startDate = new Date(c.startDate)
      if (now.getTime() > startDate.getTime()) setDisableStartDate(true)
    }
  }, [])

  useEffect(() => {
    const loadNgo = async (u: User) => {
      const t = await getCampaignTags()
      setCampaignTags(t);
    };
    if (user?.token) loadNgo(user);

  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!campaign) return;
    const { name, value } = event.target;
    if (name === 'startDate') {
      const now = new Date();
      const startDate = new Date(campaign.startDate)
      if (now.getTime() > startDate.getTime()) setDisableStartDate(true)
    }
    setCampaign({ ...campaign, [name]: value } as Campaign)
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

  const handleToggle = async (id: string) => {
    try {
      const res = await toggleCampaignStatus(id, user.token!);
      
      setIsFailure(false);
      setMessage(res.message || "הסטטוס עודכן בהצלחה")
      setCampaign({...campaign!,isActive:!campaign?.isActive})
    } catch (err) {
      console.error((err as any).message);
      closeConfirm()
      setIsFailure(false);
      setMessage((err as any).message || "שגיאה בעדכון הסטטוס")
    } finally {
      closeConfirm()
      setShowAlert(true)
     }
  };

  
  const toggleTag = (tag: string) => {
    if (!campaign) return;
    const tags = campaign.tags || [];
    const exists = tags.includes(tag);
    if (exists) {
      setCampaign({ ...campaign, tags: tags.filter(t => t !== tag) });
    } else {
      if (tags.length >= 3) return;
      setCampaign({ ...campaign, tags: [...tags, tag] });
    }
  };
  const removeTag = (tag: string) => {
    if (!campaign) return;
    setCampaign({ ...campaign, tags: (campaign.tags || []).filter(t => t !== tag) });
  };

  if (!campaign) return <p>קמפיין לא נמצא</p>;

  return (
    <div className="cc-card cc-compact-media" style={cardStyle} dir="rtl">
      <h2 className="cc-title">פרטי קמפיין</h2>

      {user ? (
        <>
          {editMode === "view" && (
            <div className="cc-section">
              <p><strong>שם קמפיין:</strong> {campaign.title}</p>
              <p><strong>תיאור קמפיין:</strong> {campaign.description}</p>
              <p><strong>מספר בלוקצ'יין:</strong> {campaign.blockchainTx}</p>
              <p><strong>סכום יעד:</strong> {campaign.goal}</p>
              <p><strong>סכום שגויס:</strong> {campaign.raised}</p>
              <p><strong>מספר תורמים:</strong> {campaign.numOfDonors}</p>
              <p><strong>תאריך התחלה:</strong> {new Date(campaign.startDate).toLocaleDateString('he')}</p>
              <p><strong>תאריך סיום:</strong> {new Date(campaign.endDate).toLocaleDateString('he')}</p>
              <p><strong>קטגוריות:</strong> {(campaign.tags || []).join(", ") || "-"}</p>
              <div className="campaign-edit-buttons cc-actions" style={{ gap: ".5rem", marginTop: ".8rem" }}>
                <button onClick={() => setEditMode("edit")} style={{ ...primaryBtnStyle }}>
                  עריכת פרטים
                </button>
                <button style={{ ...primaryBtnStyle }} onClick={openConfirm}>
                  {campaign.isActive? 'השהייה/מחיקה' : 'הפעל'}
                </button>
              </div>
              <ConfirmDialog
                show={showConfirm}
                onYes={() => handleToggle(campaign._id!)}
                onNo={closeConfirm}
                message={campaign.isActive? 'פעולה זו תמחק/תשהה את הקמפיין' : 'פעולה זו תפעיל את הקמפיין'}
              />
              <AlertDialog message={message} show={showAlert} isFailure={isFailure} failureOnClose={() =>setShowAlert(false)} successOnClose={() =>setShowAlert(false)}/>
            </div>
          )}

          {editMode === "edit" && (
            <>
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

                <div className="cc-chips">
                  {campaignTags.map(({tag}) => {
                    const selected = (campaign.tags || []).includes(tag);
                    const disabled = !selected && (campaign.tags || []).length >= 3;
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`cc-chip ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={selected}
                        disabled={disabled}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {(campaign.tags?.length || 0) > 0 && (
                  <div className="cc-selected">
                    {campaign.tags!.map(tag => (
                      <span key={tag} className="cc-selected-chip" onClick={() => removeTag(tag)} title="הסרת קטגוריה">✕ {tag}</span>
                    ))}
                  </div>
                )}
              </section>

              <div className="cc-actions" style={{ gap: ".6rem" }}>
                <button onClick={handleSaveChanges} style={primaryBtnStyle}>
                  עדכן קמפיין
                </button>
                <button onClick={() => setEditMode("view")} style={{ ...primaryBtnStyle, background: "#f87171", color: "#fff" }}>
                  ביטול
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
      )}
    </div>
  )
}

export default EditCampaign;
