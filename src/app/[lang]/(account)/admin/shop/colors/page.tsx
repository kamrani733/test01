"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import AddItemModal from "@/components/account/AddItemModal";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopColor } from "@/core/models/shop-color-model";
import { shopColorColumns } from "@/components/account/columns/ShopColorColumns";
import CreateEditShopColorForm from "@/components/account/form/CreateEditShopColorForm";
import {
  deleteShopColor,
  getShopColors,
} from "@/core/lib/api/account/shop-colors";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopColor>({
    fetchFunction: getShopColors,
    queryKey: "shop-colors",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopColor")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.colors}</Heading>
      {hasPermission("CreateShopColor") && (
        <AddItemModal
          FormComponent={CreateEditShopColorForm}
          label={dictionary.common.add + " " + dictionary.nav.color}
        />
      )}
  
        <MainDataTable
          data={data}
          columns={shopColorColumns(dictionary)}
          action={deleteShopColor}
          isLoading={isLoading}
          queryKey={["shop-colors"]}
        />
      
    </>
  );
}
