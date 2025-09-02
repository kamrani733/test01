"use server";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import axios from "axios";
import { api, getCsrfToken } from "..";
import { ShopStoreFormData } from "@/core/schemas/shopStoreSchema";

export const getShopStores = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-stores", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const getShopStoresList = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-stores/list");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createShopStore = async (shopStoreData: ShopStoreFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/shop-stores", shopStoreData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateShopStore = async (
  shopStoreData: ShopStoreFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-stores/${id}`,
      shopStoreData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteShopStore = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(`api/admin/shop-stores/delete-multiple`, {
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
