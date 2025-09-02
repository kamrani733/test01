"use server";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import { api, getCsrfToken } from "..";
import { UpdateUserFormData, UserFormData } from "@/core/schemas/userSchema";
import axios from "axios";
import { PasswordFormData } from "@/core/schemas/passwordSchema";

export const getUsers = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();

  const params = {
    page,
    perPage,
    filters: Array.isArray(filters) ? JSON.stringify(filters) : "[]",
    sort: Array.isArray(sort) ? JSON.stringify(sort) : "[]",
    globalFilter,
  };

  const { data } = await api.get("api/admin/users", {
    params,
  });
  return data;
};
export const getUserById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/users/${id}`);

  return data;
};
export const updateUser = async (userData: UpdateUserFormData, id: number) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/users/${id}`, userData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createUser = async (userData: UserFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("/api/admin/users", userData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteUser = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/users/delete-multiple`, {
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
export const changeStatusUser = async (status: string, id: number) => {
  try {
    await getCsrfToken();
    console.log(status);

    const { data } = await api.patch(`api/admin/users/${id}/change-status`, {
      status,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const changePassword = async (
  userData: PasswordFormData,
  id: number
) => {
  try {
    await getCsrfToken();

    const { data } = await api.patch(
      `api/admin/users/${id}/change-password`,
      userData
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const verifyEmail = async (status: number, id: number) => {
  try {
    await getCsrfToken();
    console.log(status, id);

    const payload = { status: status };
    console.log(payload);

    const { data } = await api.patch(
      `/api/admin/users/${id}/verify-email`,
      payload
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const verifyMobile = async (status: number, id: number) => {
  try {
    await getCsrfToken();
    console.log(status, id);

    const payload = { status: status };
    console.log(payload);

    const { data } = await api.patch(
      `/api/admin/users/${id}/verify-mobile`,
      payload
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
