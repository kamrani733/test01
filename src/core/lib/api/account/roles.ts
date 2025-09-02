"use server";

import { FetchParams } from "@/core/hooks/use-data-table-data";
import { api, getCsrfToken } from "..";
import axios from "axios";
import { RoleFormData } from "@/core/schemas/roleSchema";

export const getRoles = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/roles", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  return data;
};
export const getRolesList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/roles/list");
  return data;
};
export const updateRole = async (roleData: RoleFormData & { id: number }) => {
  try {
    await getCsrfToken();
    const { id, ...rest } = roleData;
    const { data } = await api.put(`api/admin/roles/${id}`, rest);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createRole = async (roleData: RoleFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/roles", roleData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const getRoleById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/roles/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const checkRoleNameExists = async (name: string, excludeId?: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/roles", {
      params: { 
        filters: JSON.stringify([{
          id: "name",
          value: name,
          variant: "text",
          operator: "equals"
        }])
      }
    });
    
    // Check if any role with this name exists (excluding current role if editing)
    const existingRoles = data.data || [];
    const roleExists = existingRoles.some((role: any) => 
      role.name === name && (!excludeId || role.id !== excludeId)
    );
    
    return { exists: roleExists };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { exists: false };
  }
};
export const deleteRole = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/roles/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};
