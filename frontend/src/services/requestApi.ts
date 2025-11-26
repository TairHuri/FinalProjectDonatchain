import type { AdminRequestByUser } from "../models/Request";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Create a new admin request made by a user
export const createRequest = async (request:AdminRequestByUser, token:string) => {
       const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({request}),
    });
    if (res.status != 201) {
        throw new Error(await res.text())
    }
    return res.json();
}
// Update an existing admin request
export const updateRequest = async (requestId:string,  request:AdminRequestByUser, token:string) => {
       const res = await fetch(`${API_URL}/requests/${requestId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({request}),
    });
    if (res.status != 201) {
        throw new Error(await res.text())
    }
    return res.json();
}

// Get all requests for a specific NGO, including completed ones
export const getRequestsByNgoId = async(ngoId:string, token:string) => {
    const res = await fetch(`${API_URL}/requests/${ngoId}?includeDone=true`, {
        headers:{"Authorization": `Bearer ${token}`,}
    }); 
    const requests = await res.json();
    return requests;
}
// Get all admin requests, optionally including completed ones
export const getRequests = async(includeDone:boolean, token:string) => {
    const res = await fetch(`${API_URL}/requests?includeDone=${includeDone}`, {
        headers:{"Authorization": `Bearer ${token}`,}
    }); 
    const requests = await res.json();
    return requests;
}
export const getTemplates = async(token:string) => {
    const res = await fetch(`${API_URL}/requests/templates`, {
        headers:{"Authorization": `Bearer ${token}`,}
    }); 
    const templates = await res.json();
    return templates;
}