"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import AddItemModal from "@/components/account/AddItemModal";
import { Role } from "@/core/models/role-model";
import CreateEditRoleForm from "@/components/account/form/CreateEditRoleForm";
import { roleColumns } from "@/components/account/columns/RoleColumns";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { deleteRole, getRoles } from "@/core/lib/api/account/roles";

export default function Page() {
  const { data, isLoading } = useDataTableData<Role>({
    fetchFunction: getRoles,
    queryKey: "roles",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessRoles"]}>
      <Heading level={1}>{dictionary.nav.roles}</Heading>
      {hasPermission("CreateRoles") && (
        <AddItemModal
          FormComponent={CreateEditRoleForm}
          label={dictionary.common.add + " " + dictionary.nav.role}
        />
      )}
      <MainDataTable
        data={data}
        columns={roleColumns(dictionary)}
        action={deleteRole}
        isLoading={isLoading}
        queryKey={["roles"]}
      />
    </ProtectWithPermissionWrapper>
  );
}
