"use server";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import { ShopProductPayload } from "@/core/schemas/shopProductSchema";
import axios from "axios";
import { api, getCsrfToken } from "..";

export const getShopProducts = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-products", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || [];
    }
  }
};

export const getShopProductsList = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-products/list");
    console.log('🔍 getShopProductsList - Raw Response:', data);
    
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
      console.log('🔍 getShopProductsList - Unknown structure:', data);
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || [];
    }
  }
};

export const getShopProductById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/shop-products/${id}`);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const createShopProduct = async (
  shopProductData: ShopProductPayload
) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/shop-products", shopProductData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const updateShopProduct = async (
  shopProductData: ShopProductPayload,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-products/${id}`,
      shopProductData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const deleteShopProduct = async (ids: Array<number>) => {
  try {
    await getCsrfToken();
    const { data } = await api.delete(
      `api/admin/shop-products/delete-multiple`,
      {
        data: { ids },
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
