"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import AddItemModal from "@/components/account/AddItemModal";
import { ShopStore } from "@/core/models/shop-store-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { shopStoreColumns } from "@/components/account/columns/ShopStoreColumns";
import CreateEditShopStoreForm from "@/components/account/form/CreateEditShopStore";
import { deleteShopStore, getShopStores } from "@/core/lib/api/account/shop-store";

export default function ShopStoresPage() {
  const { data, isLoading } = useDataTableData<ShopStore>({
    fetchFunction: getShopStores,
    queryKey: "shop-stores",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopStores")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.stores}</Heading>
      {hasPermission("CreateShopStores") && (
        <AddItemModal
          FormComponent={CreateEditShopStoreForm}
          label={dictionary.common.add + " " + dictionary.nav.store}
        />
      )}
 
        <MainDataTable
          data={data}
          columns={shopStoreColumns(dictionary)}
          action={deleteShopStore}
          isLoading={isLoading}
          queryKey={["shop-stores"]}
        />
      
    </>
  );
}
