"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { Page as PageTs } from "@/core/models/page-model";
import AddItemPage from "@/components/account/AddItemPage";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { deletePage, getPages } from "@/core/lib/api/account/pages";
import { pageColumns } from "@/components/account/columns/PageColumns";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";

export default function Pages() {
  const { data, isLoading } = useDataTableData<PageTs>({
    fetchFunction: getPages,
    queryKey: "pages",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessPagePage"]}>
      <Heading level={1}>{dictionary.nav.pages}</Heading>

      {hasPermission("CreatePagePage") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.page}
        />
      )}

      <MainDataTable
        data={data}
        columns={pageColumns(dictionary)}
        action={deletePage}
        isLoading={isLoading}
        queryKey={["pages"]}
      />
    </ProtectWithPermissionWrapper>
  );
}
