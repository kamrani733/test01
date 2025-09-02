"use server";
import axios from "axios";
import { api, getCsrfToken } from "..";
import { SettingsFormData } from "@/core/schemas/settingSchema";

export const getSettings = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/settings/show");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const updateSettings = async (settingsData: SettingsFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.put("api/admin/settings", settingsData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
