"use server";

import axios from "axios";
import { api } from "../../api";
import { MenuItem, MenuResponseData } from "@/core/types/menuApi";

export const getSidebarMainMenu = async (): Promise<MenuResponseData> => {
  try {
    const { data } = await api.get("/api/menus/menu_sidebar_1");
    return {
      description: data?.data?.description ?? "",
      items: Array.isArray(data?.data?.items) ? data.data.items : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "❌ [Sidebar Menu 1] API request failed:",
        error.response?.data
      );
    } else {
      console.log("❌ [Sidebar Menu 1] Unknown error:", error);
    }
    return {
      description: "",
      items: [],
    };
  }
};

export const getSidebarSecondaryMenu = async (): Promise<MenuResponseData> => {
  try {
    const { data } = await api.get("/api/menus/menu_sidebar_2");
    return {
      description: data?.data?.description ?? "",
      items: Array.isArray(data?.data?.items) ? data.data.items : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "❌ [Sidebar Menu 2] API request failed:",
        error.response?.data
      );
    } else {
      console.log("❌ [Sidebar Menu 2] Unknown error:", error);
    }
    return {
      description: "",
      items: [],
    };
  }
};

export const getMainMenu = async (): Promise<MenuItem[]> => {
  try {
    const { data } = await api.get("/api/menus/menu_main");
    
    // Log main menu data to check for images
    console.log("🔍 Main Menu - Menu Data Check:", {
      totalItems: data?.data?.items?.length || 0,
      itemsWithImages: data?.data?.items?.filter((item: any) => item.image_info || item.image || item.imageUrl)?.length || 0,
      sampleItemWithImage: data?.data?.items?.find((item: any) => item.image_info || item.image || item.imageUrl),
      allItems: data?.data?.items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        hasImageInfo: !!item.image_info,
        hasImageId: !!item.image,
        hasImageUrl: !!item.imageUrl,
        imageInfo: item.image_info,
        imageId: item.image,
        imageUrl: item.imageUrl
      })) || []
    });
    
    return data.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
    } else {
    }
    return [];
  }
};

export const getFooterItems = async (): Promise<MenuItem[]> => {
  try {
    const { data } = await api.get("/api/menus/menu_footer");
    return data.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
    } else {
    }
    return [];
  }
};
