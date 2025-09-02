"use server";
import axios from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: "https://srv.xoos.ir",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;
  const lang = cookieStore.get("locale")?.value || "fa";
  console.log(lang);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Accept-Language"] = lang;

  return config;
});

export const getCsrfToken = async () => {
  const response = await api.get("/sanctum/csrf-cookie");
  return response;
};
