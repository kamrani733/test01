"use server";
import { FetchParams } from "@/core/hooks/use-data-table-data";
import { api, getCsrfToken } from "..";
import { SliderFormData } from "@/core/schemas/sliderSchema";
import axios from "axios";

//?SLIDERS
export const getSliders = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/sliders", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  return data;
};
export const getSliderById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/sliders/${id}`);
  return data;
};
export const updateSlider = async (sliderData: SliderFormData, id: number) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/sliders/${id}`, sliderData);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createSlider = async (sliderData: SliderFormData) => {
  try {
    console.log("sliderData:", sliderData);

    await getCsrfToken();
    const { data } = await api.post("/api/admin/sliders", sliderData);
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteSlider = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    

    const { data } = await api.delete(`api/admin/sliders/delete-multiple`, {
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
