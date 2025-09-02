import CreateEditUserForm from "@/components/account/form/CreateEditUserForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getCities } from "@/core/lib/api";
import { getRolesList } from "@/core/lib/api/account/roles";
import { getUserById } from "@/core/lib/api/account/users";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const rolesList = await getRolesList();
  const cities = await getCities();
  const { id } = await params;
  const user = await getUserById(id);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateUsers"]}>
      <CreateEditUserForm
        rolesList={rolesList.data}
        cities={cities.data}
        defaultValue={user.data}
      />
    </ProtectWithPermissionWrapper>
  );
}
