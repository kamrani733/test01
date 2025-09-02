"use server";

import axios from "axios";
import { api, getCsrfToken } from "..";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import { PageFormData } from "@/core/schemas/pageSchema";

export const getPages = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/page-pages", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return error.response?.data;
  }
};

export const getPageById = async (id: number | string) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/page-pages/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createPage = async (pageData: PageFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/page-pages", pageData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const updatePage = async (pageData: PageFormData, id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(`api/admin/page-pages/${id}`, pageData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};

export const deletePage = async (ids: number[]) => {
  try {
    await getCsrfToken();
    const { data } = await api.delete("api/admin/page-pages/delete-multiple", {
      data: { ids },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) return error.response?.data;
  }
};
