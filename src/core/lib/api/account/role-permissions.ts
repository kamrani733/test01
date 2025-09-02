'use server';
import axios from 'axios';
import { api, getCsrfToken } from '..';

export const getRolePermissionById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/roles/${id}/permissions`);
  return data;
};
export const updateRolePermissions = async (
  roleId: number,
  permissionIds: number[]
) => {
  try {
    await getCsrfToken();
    const payload = {
      role_id: roleId,
      permission_ids: permissionIds,
    };

    const { data } = await api.post('api/admin/roles-permissions', payload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
