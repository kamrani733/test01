"use server";

import axios from "axios";
import { api, getCsrfToken } from "..";

export const getPageBySlug = async (slug: string) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/pages/${slug}`);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw error;
  }
};
