"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { shopGroupColumns } from "@/components/account/columns/ShopGroupColumns";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopGroup } from "@/core/models/shop-group-model";
import AddItemPage from "@/components/account/AddItemPage";
import { deleteShopGroup, getShopGroups } from "@/core/lib/api/account/shop-groups";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopGroup>({
    fetchFunction: getShopGroups,
    queryKey: "shop-groups",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopGroups")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.groups}</Heading>
      {hasPermission("CreateShopGroups") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.group}
        />
      )}
 
        <MainDataTable
          data={data}
          columns={shopGroupColumns(dictionary)}
          action={deleteShopGroup}  
          isLoading={isLoading}
            queryKey={[ "shop-groups"]}
        />
       
    </>
  );
}
