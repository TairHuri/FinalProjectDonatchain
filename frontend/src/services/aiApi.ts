import type { Message } from "../models/Message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Saves a new NGO-related message to the server.
 * Sends a POST request with the message data.
 *
 * @param message - The message object to save
 * @param token - Authentication token for authorization
 * @returns The saved message data returned by the server
 * @throws Error if the server response status is not 201 (Created)
 */
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

/**
 * Searches for NGOs based on a text query.
 * Sends a GET request with a search query parameter.
 *
 * @param searchText - The text input used to filter NGO search results
 * @returns A list of NGOs matching the search query
 */
export const search = async(searchText: string) => {
    const res = await fetch(`${API_URL}/ngos/search?q=${searchText}`); 
    const searchResults = await res.json();
    return searchResults;
}