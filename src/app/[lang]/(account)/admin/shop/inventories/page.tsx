"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopInventory } from "@/core/models/shop-inventory-model";

import AddItemPage from "@/components/account/AddItemPage";
import { shopInventoryColumns } from "@/components/account/columns/ShopInventoryColumns";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { deleteShopInventory, getShopInventories } from "@/core/lib/api/account/shop-inventories";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopInventory>({
    fetchFunction: getShopInventories,
    queryKey: "shop-inventories",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopInventories")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.inventories}</Heading>
      {hasPermission("CreateShopInventories") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.inventory}
        />
      )}
    
        <MainDataTable
          data={data}
          columns={shopInventoryColumns(dictionary)}
          action={deleteShopInventory}
          queryKey={["shop-inventories"]}
          isLoading={isLoading}
        />
      
    </>
  );
}
