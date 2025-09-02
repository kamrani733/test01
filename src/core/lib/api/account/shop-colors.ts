"use server";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import { api, getCsrfToken } from "..";
import axios from "axios";
import { ShopColorFormData } from "@/core/schemas/shopColorSchema";

export const getShopColors = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-colors", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const getShopColorsList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/shop-colors/list");
  return data;
};

export const createShopColor = async (shopColorData: ShopColorFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/shop-colors", shopColorData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateShopColor = async (
  shopColorData: ShopColorFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-colors/${id}`,
      shopColorData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteShopColor = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/shop-colors/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
