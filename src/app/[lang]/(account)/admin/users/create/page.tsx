import CreateEditUserForm from "@/components/account/form/CreateEditUserForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getCities } from "@/core/lib/api";
import { getRolesList } from "@/core/lib/api/account/roles";

export default async function page() {
  const rolesList = await getRolesList();
  const cities = await getCities();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateUsers"]}>
      <CreateEditUserForm rolesList={rolesList.data} cities={cities.data} />
    </ProtectWithPermissionWrapper>
  );
}
