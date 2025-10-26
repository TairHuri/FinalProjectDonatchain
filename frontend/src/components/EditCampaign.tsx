import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, inputStyle, menuBtnStyle, primaryBtnStyle } from "../css/dashboardStyles"
import { useCampaigns } from "../contexts/CampaignsContext";
import type { Campaign } from "../models/Campaign";
import '../css/EditCampaign.css'
import { updateCampaign } from "../services/campaignApi";

type MediaType = {
  images: { value: FileList | null, ref: React.RefObject<HTMLInputElement | null> },
  movie: { value: File | null, ref: React.RefObject<HTMLInputElement | null> },
  mainImage: { value: File | null, ref: React.RefObject<HTMLInputElement | null> },
}

const EditCampaign = ({ campaignId, editMode, setEditMode }: { campaignId: string, editMode: string, setEditMode: (mode: "view" | "edit" | "password") => void }) => {
  const { user } = useAuth()
  if (!user) return <p>לא בוצעה התחברות</p>
  const { campaigns, postUpdateCampaign } = useCampaigns();
  const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

  const [campaign, setCampaign] = useState<Campaign | null>();
  const [disableStartDate, setDisableStartDate] = useState<boolean>(false)
  const [media, setMedia] = useState<MediaType>({
    images: { value: null as FileList | null, ref: useRef<HTMLInputElement>(null) },
    movie: { value: null as File | null, ref: useRef<HTMLInputElement>(null) },
    mainImage: { value: null as File | null, ref: useRef<HTMLInputElement>(null) },
  })

  const removeImage = (field: string, imageName: string) => {
    if (!campaign) return;

    //setCampaign({...campaign, images: campaign.images.filter(img => img !=imageName)})

    setCampaign((prev) => {
      if (!prev) return null;
      if (field == 'images') {
        return { ...prev, images: campaign.images.filter(img => img != imageName) }
      } else {
        return { ...prev, [field]: null }
      }
    })
  }
  const removeNewMedia = (field: keyof MediaType, image: File) => {

    if (field == 'images') {
      if (!media.images.value) return;
      const existingImages = new DataTransfer();
      for (const img of media.images.value) {
        if (img.name != image.name) {
          existingImages.items.add(img);
        }
      }
      setMedia(existingValue => ({ ...existingValue, images: { ...existingValue.images, value: existingImages.files } }))
      if (media[field].ref.current) media[field].ref.current.files = existingImages.files;
    } else {
      setMedia(existingValue => ({ ...existingValue, [field]: { ...[field], value: null } }))
      if (media[field].ref.current) media[field].ref.current.value = ""
    }

  }
  const handleSaveChanges = async () => {
    if (!campaign || !user.token) return;

    if (!campaign.title || !campaign._id) {
      alert("יש למלא את כל השדות");
      return;
    }

    const images: File[] = []
    if (media.images.value) {
      for (const img of media.images.value) {
        images.push(img);
      }
    }
    try{
      console.log('campaign', campaign);
      
      const updatedCampaign = await updateCampaign(campaign, user.token, images, media.movie.value, media.mainImage.value);
      if(updatedCampaign._id){
        postUpdateCampaign(updatedCampaign)
      }
      alert('קמפיין עודכן בהצלחה')
      setEditMode("view")
    }catch(error){
      console.log(error);
      alert('עדכון הקמפיין נכשל')
      
    }
    
  };

  useEffect(() => {
    const campaign = campaigns.find((c) => c._id! === (campaignId));
    if (campaign) {
      console.log('campaign', campaign);

      setCampaign(campaign)
      const now = new Date();
      const startDate = new Date(campaign.startDate)
      if (now.getTime() > startDate.getTime()) {
        setDisableStartDate(true)
      }
    }
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!campaign) return;
    const { name, value } = event.target;
    if (name == 'startDate') {
      const now = new Date();
      const startDate = new Date(campaign.startDate)
      if (now.getTime() > startDate.getTime()) {
        setDisableStartDate(true)
      }
    }
    setCampaign({ ...campaign, [name]: value })
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    console.log(1, name, files);
    if (!campaign) return;

    const field = name as keyof MediaType
    if (field == 'images') {
      console.log(2, name, files);
      setMedia({ ...media, [field]: { ...media[field], value: files ? files : null } })

    } else {
      setMedia({ ...media, [field]: { ...media[field], value: files ? files![0] : null } })
      if (campaign[field]) removeImage(field, campaign[field])
    }
  }

  const getImages = () => {
    const images: File[] = []
    if (media.images.value) {
      for (const img of media.images.value) {
        images.push(img);
      }
    }
    return images;
  }
  console.log(media);

  if (!campaign) return <p>קמפיין לא נמצא</p>;
  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        פרטי קמפיין
      </h2>
      {user ? (
        <>
          {editMode === "view" && (
            <div>
              <p><strong>שם קמפיין:</strong> {campaign.title}</p>
              <p><strong>תיאור קמפיין:</strong> {campaign.description}</p>
              <p><strong>מספר בלוקצ'יין:</strong> {campaign.blockchainTx}</p>
              <p><strong>סכום יעד:</strong> {campaign.goal}</p>
              <p><strong>סכום שגויס:</strong> {campaign.raised}</p>
              <p><strong>מספר תורמים:</strong> {campaign.numOfDonors}</p>
              <p><strong>תאריך התחלה:</strong> {campaign.startDate}</p>
              <p><strong>תאריך סיום:</strong> {campaign.endDate}</p>
              <p><strong>תאריך יצירה:</strong> {!campaign.createdAt}</p>
              <button
                onClick={() => setEditMode("edit")}
                style={{ ...primaryBtnStyle, marginTop: "15px" }}
              >
                עריכת פרטים
              </button>
            </div>
          )}

          {editMode === "edit" && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                עדכון קמפיין
              </h2>
              <input type="text" placeholder="שם הקמפיין" value={campaign.title} name="title"
                onChange={handleChange} style={inputStyle} />
              <input type="number" placeholder="סכום יעד" value={campaign.goal} name="goal"
                onChange={handleChange} style={inputStyle} />
              <label style={{ fontWeight: "bold" }}>תאריך התחלה:</label>
              <input type="date" value={campaign.startDate.split("T")[0]} name="startDate" disabled={disableStartDate}
                onChange={handleChange} style={inputStyle} />
              <label style={{ fontWeight: "bold" }}>תאריך סיום:</label>
              <input type="date" value={campaign.endDate.split("T")[0]} name="endDate"
                onChange={handleChange} style={inputStyle} />
              <textarea placeholder="תיאור הקמפיין" value={campaign.description} name="description"
                onChange={handleChange} style={{ ...inputStyle, height: "80px" }} />

              <label>תמונת קמפיין:</label>
              <input type="file" accept="image/*" name="mainImage" className="image" ref={media.mainImage.ref}
                onChange={handleMediaChange} style={inputStyle} />

              {media.mainImage.value && <div className="image-tile">
                <img src={URL.createObjectURL(media.mainImage.value)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />
                <span onClick={() => removeNewMedia('mainImage', media.mainImage.value!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>}
              {campaign.mainImage && <div className="image-tile">
                <img src={`${IMAGE_URL}/${campaign.mainImage}`} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />
                <span onClick={() => removeImage('mainImage', campaign.mainImage!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>}

              <label>תמונות קמפיין:</label>
              <input type="file" accept="image/*" multiple name="images" ref={media.images.ref}
                onChange={handleMediaChange} style={inputStyle} />
              <div className='image-container'>
                {getImages().map(image => (
                  <div key={image.name} className="image-tile">
                    <img src={URL.createObjectURL(image)} alt="תמונה" className='image' />
                    <span onClick={() => removeNewMedia('images', image)} className="material-symbols-outlined remove-image-button">close</span>
                  </div>))}
              </div>
              <div className='image-container'>
                {campaign.images.map(image => (
                  <div key={image} className="image-tile">
                    <img src={`${IMAGE_URL}/${image}`} alt="תמונה" className="image" />

                    <span onClick={() => removeImage('images', image)} className="material-symbols-outlined remove-image-button">close</span>
                  </div>))}
              </div>


              <label>סרטון:</label>
              <input type="file" accept="video/*" name="movie" ref={media.movie.ref}
                onChange={handleMediaChange} style={inputStyle} />
              {media.movie.value && <div className="image-tile">
                <video src={URL.createObjectURL(media.movie.value)} controls style={{ width: "150px", marginBottom: "10px" }} />
                <span onClick={() => removeNewMedia('movie', media.movie.value!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>}
              {campaign.movie && <div className="image-tile">
                <video src={`${IMAGE_URL}/${campaign.movie}`} controls style={{ width: "150px", marginBottom: "10px" }} />
                <span onClick={() => removeImage('movie', campaign.movie!)} className="material-symbols-outlined remove-image-button">close</span>
              </div>}

              <button onClick={handleSaveChanges} style={primaryBtnStyle}>
                עדכן קמפיין
              </button>
              <button onClick={() => setEditMode("view")} style={{ ...menuBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
            </div>
          )}
        </>
      ) : (
        <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
      )}
    </div>
  )

}


export default EditCampaign;