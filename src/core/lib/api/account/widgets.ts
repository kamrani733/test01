"use server";

import { WidgetFormData } from "@/core/schemas/widgetSchema";
import { api, getCsrfToken } from "..";
import axios from "axios";

export const getWidgets = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/widgets");
  return data;
};
export const getWidgetsTemplateList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/widgets/templates/list");
  return data.data;
};
export const getWidgetsTemplate = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/widgets/templates");
  return data.data;
};
export const getWidgetById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/widgets/${id}`);
  return data.data;
};
export const updateWidget = async (widgetData: WidgetFormData, id: number) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/widgets/${id}`, widgetData);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createWidget = async (widgetData: WidgetFormData) => {
  try {
    console.log("widgetData:", widgetData);

    await getCsrfToken();
    const { data } = await api.post("/api/admin/widgets", widgetData);
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteWidget = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };

    const { data } = await api.delete(`api/admin/widgets/delete-multiple`, {
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
export const changePriorityWidget = async (
  id: number,
  action: "up" | "down"
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put("api/admin/widgets/update-priority", {
      id,
      action,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
