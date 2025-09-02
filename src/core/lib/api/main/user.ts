"use server";

import { PasswordFormData } from "@/core/schemas/passwordSchema";
import axios from "axios";
import { api, getCsrfToken } from "..";

export const changePassword = async (userData: PasswordFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.patch(`api/profile/change-password`, userData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "❌ [Change password] API request failed:",
        error.response?.data
      );
    } else {
      console.log("[Change password] Unexpected error occurred:", error);
    }
    return null;
  }
};
