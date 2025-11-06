import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

export const getNonce = (address) => api.get(`/auth/nonce?address=${address}`);
export const loginWallet = (data) => api.post(`/auth/wallet`, data);
export const getClaims = (token) => api.get(`/claims`, { headers: { Authorization: `Bearer ${token}` } });
export const createClaim = (token, body) => api.post(`/claims`, body, { headers: { Authorization: `Bearer ${token}` } });
export const getClaimById = (token, id) => api.get(`/claims/${id}`, { headers: { Authorization: `Bearer ${token}` } });
