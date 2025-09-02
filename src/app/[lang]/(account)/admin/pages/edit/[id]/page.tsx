import CreateEditPageForm from '@/components/account/form/CreateEditPageForm';
import ProtectWithPermissionWrapper from '@/components/account/ProtectWithPermissionWrapper';
import { getPageById } from '@/core/lib/api/account/pages';

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const page = await getPageById(id);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={['UpdatePagePage']}>
      <CreateEditPageForm defaultValue={page.data} />
    </ProtectWithPermissionWrapper>
  );
}
