"use server";
import axios from "axios";
import { api, getCsrfToken } from "..";

export const uploadAttachment = async (file: File, description?: string) => {
  try {
    await getCsrfToken();
    const formData = new FormData();

    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    const { data } = await api.post("/api/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 second timeout
    });

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error("زمان آپلود فایل به پایان رسید. لطفاً فایل کوچکتری انتخاب کنید.");
      }
      if (error.response) {
        throw new Error(error.response.data?.message || "خطا در آپلود فایل.");
      }
    }
    throw new Error("خطای غیرمنتظره در آپلود فایل رخ داد.");
  }
};
