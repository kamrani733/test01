"use server";
import axios from "axios";
import { api, getCsrfToken } from "..";

export const getShopComments = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-comments");
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || [];
    }
  }
};

export const changeShopCommentStatus = async (status: string, id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.patch(
      `api/admin/shop-comments/${id}/change-status`,
      { status }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};

export const deleteMultipleShopComments = async (ids: Array<number>) => {
  try {
    await getCsrfToken();
    const { data } = await api.delete(
      `api/admin/shop-comments/delete-multiple`,
      {
        data: { ids },
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
    throw error;
  }
};
