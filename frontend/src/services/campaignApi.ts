import type { Campaign } from "../models/Campaign";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function updateCampaign(data: Campaign, token: string, images: File[] | null, movie: File | null, mainImage: File | null) {
    // content type: multipart/formdata

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("startDate", data.startDate)
    formData.append("endDate", data.endDate)
    formData.append("isActive", `${data.isActive}`)
    formData.append("tags", `${data.tags}`)
    formData.append("ngo", data.ngo)
    formData.append("blockchainTx", data.blockchainTx!)
    formData.append("goal", `${data.goal}`)
    formData.append("raised", `${data.raised}`)
    for (const image of data.images) {
        formData.append("existingImages", image)
    }
    if (data.movie) {
        formData.append("existingMovie", `${data.movie}`)
    }
    if (data.mainImage) {
        formData.append("existingMainImage", `${data.mainImage}`)
    }
    if (images) {
        for (const image of images) {
            formData.append("images", image)
        }
    }
    if (movie) {
        formData.append("movie", movie)
    }
    if (mainImage) {
        formData.append("mainImage", mainImage)
    }

    const res = await fetch(`${API_URL}/campaigns/${data._id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    if (res.status != 201) {
        throw new Error(await res.text())
    }
    return res.json();
}