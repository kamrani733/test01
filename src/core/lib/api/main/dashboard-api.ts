"use server";

import axios from "axios";
import { api, getCsrfToken } from "..";
import { UserProfileData } from "@/core/schemas/userProfileSchema";

export type CityProps = {
  label: string;
  value: number;
};

export type CitiesApiResponse = {
  status: boolean;
  message: string;
  data: CityProps[];
};

type LocationType = { lat: number; lon: number } | null;

export interface UserProfilePayload
  extends Omit<UserProfileData, "avatar_id" | "avatar"> {
  avatar_id: number | null;
  selectedLocation?: LocationType;
  selectedAddress?: string | null;
}

export const updateProfile = async ({
  profileData,
}: {
  profileData: UserProfilePayload;
}) => {
  try {
    await getCsrfToken();
    const result = await api.put("/api/profile", profileData);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("❌ [Profile] API request failed:", error.response?.data);
    } else {
      console.log("❌ [Profile] Unexpected error occurred:", error);
    }
    throw error;
  }
};

export type UploadResponse = {
  status: string;
  message: string;
  data: {
    user_id: number;
    url: string;
    description: string;
    status: number;
    name: string;
    size: number;
    mime: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
};

export const uploadImage = async (file: File, description?: string) => {
  try {
    await getCsrfToken();

    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);

    const res = await api.post("/api/attachments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "❌ [Upload Image] API request failed:",
        error.response?.data
      );
    } else {
      console.log("❌ [Upload Image] Unexpected error occurred:", error);
    }
    throw error;
  }
};

export const getCities = async (): Promise<CityProps[]> => {
  try {
    const result = await api.get("/api/cities");
    return result.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("❌ [Cities] API request failed:", error.response?.data);
    } else {
      console.log("❌ [Cities] Unexpected error occurred:", error);
    }
    return [];
  }
};

export type AvatarInfo = {
  id: number;
  name: string;
  url: string;
};

export type UserResponseData = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  nickname: string;
  mobile: string;
  email: string | null;
  mobile_verified_at: string | null;
  email_verified_at: string | null;
  phone_full: string | null;
  gender: "male" | "female" | null;
  birthdate_jalali: string | null;
  date_marriage: string | null;
  city: string | null;
  address: string | null;
  education: string | null;
  location_lat: string | null;
  location_lon: string | null;
  job: string | null;
  role: string | null;
  avatar_id: number | null;
  avatar_info: AvatarInfo | null;
};

export const getProfile = async () => {
  try {
    const result = await api.get("/api/profile");
    // console.log("Profile result in api:", result.data);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("❌ [Profile] API request failed:", error.response?.data);
    } else {
      console.log("❌ [Profile] Unexpected error occurred:", error);
    }
  }
};
