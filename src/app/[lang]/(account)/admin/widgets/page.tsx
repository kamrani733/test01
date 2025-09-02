"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import AddItemPage from "@/components/account/AddItemPage";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { WidgetColumns } from "@/components/account/columns/WidgetColumns";
import { deleteWidget, getWidgets } from "@/core/lib/api/account/widgets";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { Widget } from "@/core/models/widget-model";

export default function Page() {
  const { data, isLoading } = useDataTableData<Widget>({
    fetchFunction: getWidgets,
    queryKey: "widgets",
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessWidgets"]}>
      <Heading level={1}>{dictionary.nav.homewidgets}</Heading>
      {hasPermission("CreateWidgets") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.widget}
        />
      )}

      <MainDataTable
        data={data}
        columns={WidgetColumns(dictionary)}
        action={deleteWidget}
        isLoading={isLoading}
        queryKey={["widgets"]}
      />
    </ProtectWithPermissionWrapper>
  );
}
