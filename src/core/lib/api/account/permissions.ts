"use server";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import { api, getCsrfToken } from "..";
import axios from "axios";

export const getPermissions = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/permissions", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  
  return data;
};
export const updatePermissions = async (permissionData: {
  id: number;
  name: string;
  title: string;
  description?: string | undefined;
}) => {
  try {
    await getCsrfToken();
    const { id, ...rest } = permissionData;
    const { data } = await api.put(`api/admin/roles/${id}`, rest);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createPermissions = async (permissionData: {
  name: string;
  title: string;
  description?: string | undefined;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/permissions", permissionData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deletePermission = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/permissions/delete-multiple`, {
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
