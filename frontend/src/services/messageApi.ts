import type { Message } from "../models/Message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";


export const saveMessage = async (message:Message, token:string) => {
       const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({message}),
    });
    if (res.status != 201) {
        throw new Error(await res.text())
    }
    return res.json();
}

export const getMessagesByNgoId = async(ngoId:string, token:string) => {
    const res = await fetch(`${API_URL}/messages/${ngoId}`, {
        headers:{"Authorization": `Bearer ${token}`,}
    }); 
    const messages = await res.json();
    return messages;
}