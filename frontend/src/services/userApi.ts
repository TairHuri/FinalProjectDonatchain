import type { User } from "../models/User";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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