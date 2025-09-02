"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { shopTagColumns } from "@/components/account/columns/ShopTagColumns";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { ShopTag } from "@/core/models/shop-tag-model";
import AddItemPage from "@/components/account/AddItemPage";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { deleteShopTag, getShopTags } from "@/core/lib/api/account/shop-tags";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopTag>({
    fetchFunction: getShopTags,
    queryKey: "shop-tags",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessShopTags"]}>
      <Heading level={1}>{dictionary.nav.tags}</Heading>
      {hasPermission("CreateShopTags") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.tags}
        />
      )}
 
        <MainDataTable
          data={data}
          columns={shopTagColumns(dictionary)}
          action={deleteShopTag}    
          isLoading={isLoading} 
            queryKey={["shop-tags"]}
          />
      
    </ProtectWithPermissionWrapper>
  );
}
