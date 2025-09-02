"use server";

import axios from "axios";
import { api } from "..";

export const getSettings = async () => {
  try {
    const result = await api.get("/api/pub-setting");
    return result.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) return error.response?.data;
  }
};
