"use server";

import { FetchParams } from "@/core/hooks/use-data-table-data";
import { api, getCsrfToken } from "..";
import axios from "axios";
import { PartyFormData, CompanyFormData, PersonFormData } from "@/core/schemas/partySchema";
import { Party, Company, Person } from "@/core/models/party-model";

export const getParties = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/parties", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  return data;
};

export const getPartiesList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/parties/list");
  return data;
};

export const getPartyById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/parties/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createCompany = async (companyData: CompanyFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/parties", companyData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createPerson = async (personData: PersonFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/parties", personData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateParty = async (partyData: PartyFormData & { id: number }) => {
  try {
    await getCsrfToken();
    const { id, ...rest } = partyData;
    const { data } = await api.put(`api/admin/parties/${id}`, rest);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteParty = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(`api/admin/parties/delete-multiple`, {
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

export const checkPartyMobileExists = async (mobile: string, excludeId?: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/parties", {
      params: { 
        filters: JSON.stringify([{
          id: "mobile",
          value: mobile,
          variant: "text",
          operator: "equals"
        }])
      }
    });
    
    const existingParties = data.data || [];
    const partyExists = existingParties.some((party: any) => 
      party.mobile === mobile && (!excludeId || party.id !== excludeId)
    );
    
    return { exists: partyExists };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { exists: false };
  }
};

export const checkPartyEmailExists = async (email: string, excludeId?: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/parties", {
      params: { 
        filters: JSON.stringify([{
          id: "email",
          value: email,
          variant: "text",
          operator: "equals"
        }])
      }
    });
    
    const existingParties = data.data || [];
    const partyExists = existingParties.some((party: any) => 
      party.email === email && (!excludeId || party.id !== excludeId)
    );
    
    return { exists: partyExists };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { exists: false };
  }
};

export const checkPartyCodeExists = async (code: string, excludeId?: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/parties", {
      params: { 
        filters: JSON.stringify([{
          id: "code",
          value: code,
          variant: "text",
          operator: "equals"
        }])
      }
    });
    
    const existingParties = data.data || [];
    const partyExists = existingParties.some((party: any) => 
      party.code === code && (!excludeId || party.id !== excludeId)
    );
    
    return { exists: partyExists };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { exists: false };
  }
};

export const checkCompanyNationalIdExists = async (nationalId: string, excludeId?: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/parties", {
      params: { 
        filters: JSON.stringify([{
          id: "national_id",
          value: nationalId,
          variant: "text",
          operator: "equals"
        }])
      }
    });
    
    const existingParties = data.data || [];
    const partyExists = existingParties.some((party: any) => 
      party.national_id === nationalId && (!excludeId || party.id !== excludeId)
    );
    
    return { exists: partyExists };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { exists: false };
  }
};

export const checkPersonNationalCodeExists = async (nationalCode: string, excludeId?: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/parties", {
      params: { 
        filters: JSON.stringify([{
          id: "national_code",
          value: nationalCode,
          variant: "text",
          operator: "equals"
        }])
      }
    });
    
    const existingParties = data.data || [];
    const partyExists = existingParties.some((party: any) => 
      party.national_code === nationalCode && (!excludeId || party.id !== excludeId)
    );
    
    return { exists: partyExists };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { exists: false };
  }
};

export const searchParties = async (searchFields: {
  mobile?: string;
  email?: string;
  code?: string;
  national_code?: string;
  first_name?: string;
  last_name?: string;
  national_id?: string;
  trade_name?: string;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/parties/search", searchFields);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { results: [] };
  }
};

export const getPartyTypes = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/parties/types");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    return { data: [] };
  }
};

export const convertPersonToUser = async (partyId: number, userData: {
  username: string;
  password: string;
  role_id: number;
  status?: string;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(`api/admin/parties/${partyId}/create-user`, userData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
