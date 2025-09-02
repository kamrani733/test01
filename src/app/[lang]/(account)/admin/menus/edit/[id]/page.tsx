'use client';

import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import CreateEditMenuForm from '@/components/account/form/CreateEditMenuForm';
import ProtectWithPermissionWrapper from '@/components/account/ProtectWithPermissionWrapper';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Heading } from '@/components/ui/Heading';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { getMenuById } from '@/core/lib/api/account/menus';
import { Menu } from '@/core/models/menu-model';

export default function EditMenuPage() {
  const { dictionary } = useDictionary();
  const { id } = useParams();

  const {
    data: menu,
    isLoading,
    error,
  } = useQuery<Menu>({
    queryKey: ['menus', id],
    queryFn: () => getMenuById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !menu) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">Error loading menu data</p>
      </div>
    );
  }

  return (
    <ProtectWithPermissionWrapper requiredPermissions={['UpdateMenus']}>
      <div className="space-y-6">
        <Heading level={1}>
          {dictionary.common.edit} {dictionary.nav.menu}
        </Heading>
        <CreateEditMenuForm defaultValue={menu?.data as Menu} />
      </div>
    </ProtectWithPermissionWrapper>
  );
}
