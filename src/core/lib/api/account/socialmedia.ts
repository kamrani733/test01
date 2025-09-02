'use server';
import axios from 'axios';
import { api, getCsrfToken } from '..';
import { SocialFormData } from '@/core/schemas/socialSchema';
import { FetchParams } from '@/core/hooks/use-data-table-data';

export const getSocialMedias = async ({
  page = 1,
  perPage = 100,
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get('api/admin/social-media', {
    params: { page, perPage, globalFilter },
  });

  return data;
};
export const createSocailMedia = async (socialMediaData: SocialFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post('/api/admin/social-media', socialMediaData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const updateSocailMedia = async (
  socialMediaData: SocialFormData,
  id: number
) => {
  try {
    console.log('socialMediaData:', socialMediaData);

    await getCsrfToken();
    const { data } = await api.put(
      `/api/admin/social-media/${id}`,
      socialMediaData
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteSocialMedia = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };

    const { data } = await api.delete(
      `api/admin/social-media/delete-multiple`,
      {
        data: ids,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};

export const changePrioritySocialMedia = async (
  id: number,
  action: 'up' | 'down'
) => {
  try {
    console.log(id, action);

    await getCsrfToken();
    const { data } = await api.put('api/admin/social-media/change-priority', {
      id,
      action,
    });
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
