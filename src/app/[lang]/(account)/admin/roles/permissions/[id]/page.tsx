import CreateEditRolePermissionForm from '@/components/account/form/CreateEditRolePermissionForm';
import ProtectWithPermissionWrapper from '@/components/account/ProtectWithPermissionWrapper';
import { getRolePermissionById } from '@/core/lib/api/account/role-permissions';

interface Props {
  params: Promise<{ id: number }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const checkedPermissions = await getRolePermissionById(id);

  return (
    <ProtectWithPermissionWrapper
      requiredPermissions={['AccessRolePermissions']}
    >
      <CreateEditRolePermissionForm
        id={Number(id)}
        checkedPermissions={checkedPermissions.data || []}
      />
    </ProtectWithPermissionWrapper>
  );
}
