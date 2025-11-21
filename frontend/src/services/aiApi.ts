import type { Message } from "../models/Message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";


export const saveNgo = async (message:Message, token:string) => {
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

export const search = async(searchText: string) => {
    const res = await fetch(`${API_URL}/ngos/search?q=${searchText}`); 
    const searchResults = await res.json();
    return searchResults;
}