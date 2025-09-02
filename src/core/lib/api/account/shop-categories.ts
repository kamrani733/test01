"use server";

import { FetchParams } from "@/core/hooks/use-data-table-data";
import { ShopCategoryFormData } from "@/core/schemas/shopCategorySchema";
import axios from "axios";
import { api, getCsrfToken } from "..";

export const getShopCategories = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-categories", {
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

export const getShopCategoriesList = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-categories/list");
    console.log('🔍 getShopCategoriesList - Raw Response:', data);
    
    // Handle different response structures
    if (data?.data?.data) {
      // Nested structure: { data: { data: [...] } }
      return data.data.data;
    } else if (data?.data) {
      // Direct structure: { data: [...] }
      return data.data;
    } else if (Array.isArray(data)) {
      // Array structure: [...]
      return data;
    } else {
      console.log('🔍 getShopCategoriesList - Unknown structure:', data);
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || [];
    }
  }
};

export const getShopCategoryById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/shop-categories/${id}`);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createShopCategory = async (
  shopCategoryData: ShopCategoryFormData
) => {
  try {
    await getCsrfToken();
    const { data } = await api.post(
      "api/admin/shop-categories",
      shopCategoryData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateShopCategory = async (
  shopCategoryData: ShopCategoryFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-categories/${id}`,
      shopCategoryData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteShopCategory = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(
      `api/admin/shop-categories/delete-multiple`,
      {
        data: ids,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const changePriorityShopCategory = async (
  id: number,
  action: "up" | "down"
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      "api/admin/shop-categories/change-priority",
      {
        id,
        action,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
