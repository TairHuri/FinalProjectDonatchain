import type { User } from "../models/User";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Update the current user's information
export async function editUser(user:User) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/me`, 
    { method: 'PUT', 
        headers: {'Content-Type':'application/json', "Authorization": `Bearer ${token}` },
    body: JSON.stringify(user) })
  if(res.status >= 400){
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

// Change current user's password
export async function changePassword(currentPassword:string, newPassword:string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/me`, 
    { method: 'PATCH', 
        headers: {'Content-Type':'application/json', "Authorization": `Bearer ${token}` },
    body: JSON.stringify({currentPassword, newPassword}) })
  if(res.status >= 400){
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

// Set a user's role (admin functionality)
export async function setUserRoleApi(userId: string, role:string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/role/${userId}`,
    { method: 'PATCH', headers: { "Authorization": `Bearer ${token}`, 'Content-Type':'application/json' },
  body:JSON.stringify({role}) })
  return res.json();
}

export async function deleteUserApi(userId: string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } })
  return res.json();
}


/**
 * Logs in a user using email and password.
 *
 * @param data - Login credentials
 * @returns Authentication result including token if successful
 */
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Retrieves users belonging to a specific NGO.
 *
 * @param ngoId - The NGO ID
 * @returns List of users under that NGO
 */
export async function getUsers(ngoId: string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/ngo/${ngoId}`, { headers: { "Authorization": `Bearer ${token}` } })
  return res.json();
}

/**
 * Approves a user under an NGO (Admin/NGO manager action).
 *
 * @param userId - ID of the user to approve
 * @returns Updated user or status
 */
export async function approveUserApi(userId: string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/approve/${userId}`, { method: 'PATCH', headers: { "Authorization": `Bearer ${token}` } })
  return res.json();
}