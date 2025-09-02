"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import AddItemModal from "@/components/account/AddItemModal";
import { permissionsColumns } from "@/components/account/columns/PermissionsColumns";
import CreateEditPermissionForm from "@/components/account/form/CreateEditPermissionForm";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { Permission } from "@/core/models/permission-model";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import {
  deletePermission,
  getPermissions,
} from "@/core/lib/api/account/permissions";

export default function Page() {
  const { data, isLoading } = useDataTableData<Permission>({
    fetchFunction: getPermissions,
    queryKey: "permissions",
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessPermissions"]}>
      <Heading level={1}>{dictionary.nav.permissions}</Heading>
      {hasPermission("CreatePermissions") && (
        <AddItemModal
          FormComponent={CreateEditPermissionForm}
          label={dictionary.common.add + " " + dictionary.nav.permission}
        />
      )}

      <MainDataTable
        data={data}
        columns={permissionsColumns(dictionary)}
        action={deletePermission}
        isLoading={isLoading}
        queryKey={["permissions"]}
      />
    </ProtectWithPermissionWrapper>
  );
}
