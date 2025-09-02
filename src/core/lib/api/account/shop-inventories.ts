"use server";

import { ShopInventoryFormData } from "@/core/schemas/shopInventorySchema";
import axios from "axios";
import { api, getCsrfToken } from "..";
import { FetchParams } from "@/core/hooks/use-data-table-data";

export const getShopInventories = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-inventories", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || {
        status: "error",
        message: "Failed to fetch shop inventories",
      };
      return errData;
    }
    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }
};

export const getShopInventoryById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/shop-inventories/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || {
        status: "error",
        message: "Failed to fetch shop inventory",
      };
      return errData;
    }
    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }
};

export const createShopInventory = async (
  shopInventoryData: ShopInventoryFormData
) => {
  try {
    await getCsrfToken();
    const { data } = await api.post(
      "api/admin/shop-inventories",
      shopInventoryData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || {
        status: "error",
        message: "Failed to create shop inventory",
      };
      return errData;
    }
    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }
};

export const updateShopInventory = async (
  shopInventoryData: ShopInventoryFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-inventories/${id}`,
      shopInventoryData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || {
        status: "error",
        message: "Failed to update shop inventory",
      };
      return errData;
    }
    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }
};

export const deleteShopInventory = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(
      "api/admin/shop-inventories/delete-multiple",
      {
        data: ids,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || {
        status: "error",
        message: "Failed to delete shop inventories",
      };
      return errData;
    }
    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }
};
