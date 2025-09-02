"use server";

import axios from "axios";
import { api, getCsrfToken } from "..";


export async function newsletterSubscribe({ email }: { email: string }) {
  try {
    await getCsrfToken();
    const { data } = await api.post("/api/newsletter/subscribe", { email });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
}

export const getSocial = async ()=> {
  try {
    const result = await api.get("/api/social-media");
    return result.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const getHomeSliderMain = async () => {
  try {
    const result = await api.get("/api/sliders/slider_main");
    return result.data.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
