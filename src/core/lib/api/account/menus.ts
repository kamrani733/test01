"use server";

import { FetchParams } from "@/core/hooks/use-data-table-data";
import { Menu } from "@/core/models/menu-model";
import axios from "axios";
import { api, getCsrfToken } from "..";

export const getMenus = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    
  
    
    const { data } = await api.get("api/admin/menus", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    
  
    
    return data;
  } catch (error) {
    
    if (error instanceof Error && error.message.includes('socket hang up')) {
      // Retry once without CSRF token
      try {
        const { data } = await api.get("api/admin/menus", {
          params: { page, perPage, filters, sort, globalFilter },
        });
        return data;
      } catch (retryError) {
        throw retryError;
      }
    }
    
    if (axios.isAxiosError(error)) {
    }
    
    throw error;
  }
};
export const getMenuById = async (id: number) => {
  try {
    await getCsrfToken();
    
 
    const { data } = await api.get(`api/admin/menus/${id}`);
    
  
    
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('socket hang up')) {
      // Retry once without CSRF token
      try {
        const { data } = await api.get(`api/admin/menus/${id}`);
        return data;
      } catch (retryError) {
        throw retryError;
      }
    }
    throw error;
  }
};
export const deleteMenu = async (id: Array<number>): Promise<any> => {
  try {
    await getCsrfToken();
    

    const results = await Promise.all(
      id.map(async (menuId) => {
        try {
          console.log(`🔍 API - Deleting Menu ${menuId}...`);
          const { data } = await api.delete(`api/admin/menus/${menuId}`);
          console.log(`🔍 API - Delete Menu ${menuId} Response:`, data);
          return { id: menuId, success: true, data };
        } catch (error) {
          console.log(`🔍 API - Delete Menu ${menuId} Error:`, error);
          return { id: menuId, success: false, error };
        }
      })
    );

    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);


    if (failed.length === 0) {
      return {
        status: "success",
        message: `Successfully deleted ${successful.length} menu(s)`,
        data: { ids: successful.map(r => r.id) }
      };
    } else if (successful.length === 0) {
      return {
        status: "error",
        message: "Failed to delete any menus",
        data: { 
          failed_items: failed.map(f => ({
            id: f.id,
            title: `Menu ${f.id}`,
            reason: [(f.error as any)?.response?.data?.message || "Unknown error"]
          }))
        }
      };
    } else {
      return {
        status: "partial",
        message: `Deleted ${successful.length} menu(s), failed to delete ${failed.length} menu(s)`,
        data: { 
          ids: successful.map(r => r.id),
          failed_items: failed.map(f => ({
            id: f.id,
            title: `Menu ${f.id}`,
            reason: [(f.error as any)?.response?.data?.message || "Unknown error"]
          }))
        }
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('socket hang up')) {
      // Retry once without CSRF token
      try {
        return await deleteMenu(id);
      } catch (retryError) {
        throw retryError;
      }
    }
    
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    
    throw error;
  }
};
export const createMenus = async (menuData: Menu) => {
  try {
    await getCsrfToken();
 
    
    const { data } = await api.post(`api/admin/menus`, menuData);
    
   
    
    return data;
  } catch (error) {
    
    if (error instanceof Error && error.message.includes('socket hang up')) {
      // Retry once without CSRF token
      try {
        const { data } = await api.post(`api/admin/menus`, menuData);
        return data;
      } catch (retryError) {
        throw retryError;
      }
    }
    
    if (axios.isAxiosError(error)) {

      const errData = error.response?.data;
      return errData;
    }
    
    // Re-throw the error if it's not an axios error
    throw error;
  }
};
export const updateMenus = async (menuData: Menu, id: number | undefined) => {
  try {
    await getCsrfToken();
    
 
    
    const { data } = await api.put(`api/admin/menus/${id}`, menuData);
    
 
    
    return data;
  } catch (error) {
    
    if (error instanceof Error && error.message.includes('socket hang up')) {
      // Retry once without CSRF token
      try {
        const { data } = await api.put(`api/admin/menus/${id}`, menuData);
        return data;
      } catch (retryError) {
        throw retryError;
      }
    }
    
    if (axios.isAxiosError(error)) {
      
      const errData = error.response?.data;
      return errData;
    }
    
    throw error;
  }
};
