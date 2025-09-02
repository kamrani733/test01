"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { menuColumns } from "@/components/account/columns/MenuColumns";
import { Menu } from "@/core/models/menu-model";
import AddItemPage from "@/components/account/AddItemPage";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { deleteMenu, getMenus } from "@/core/lib/api/account/menus";

export default function Page() {
  const { data, isLoading } = useDataTableData<Menu>({
    fetchFunction: getMenus,
    queryKey: "menus",
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessMenus"]}>
      <Heading level={1}>{dictionary.nav.menus}</Heading>
      {hasPermission("CreateMenus") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.menu}
        />
      )}
  
        <MainDataTable
          data={data}
          columns={menuColumns(dictionary)}
          action={deleteMenu}
          isLoading={isLoading}
          queryKey={["menus"]}

        />
   
    </ProtectWithPermissionWrapper>
  );
}
