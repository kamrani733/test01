"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopProduct } from "@/core/models/shop-product-model";
import AddItemPage from "@/components/account/AddItemPage";
import { shopProductColumns } from "@/components/account/columns/ShopProductColumns";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import {
  deleteShopProduct,
  getShopProducts,
} from "@/core/lib/api/account/shop-products";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopProduct>({
    fetchFunction: getShopProducts,
    queryKey: "shop-products",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopProducts")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.products}</Heading>
      {hasPermission("CreateShopProducts") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.product}
        />
      )}
      <MainDataTable
        data={data}
        columns={shopProductColumns(dictionary)}
        action={deleteShopProduct}
        isLoading={isLoading}
        queryKey={["shop-products"]}
      />
    </>
  );
}
