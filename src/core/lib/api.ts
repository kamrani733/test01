"use server";

import axios from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: "https://srv.xoos.ir",
  withCredentials: true,
  timeout: 15000, // 15 second timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;
  const lang = cookieStore.get("locale")?.value || "fa";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Accept-Language"] = lang;

  return config;
});

export const getCsrfToken = async () => {
  try {
    const response = await api.get("/sanctum/csrf-cookie");
    return response;
  } catch (error) {
    console.log("🔴 CSRF token error:", error);
    // Continue without CSRF token if it fails
    return null;
  }
};

//? PUBLIC_APIS
export const getCities = async () => {
  const { data } = await api.get("/api/cities");
  return data;
};
