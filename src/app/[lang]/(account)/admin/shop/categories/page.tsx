"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopCategory } from "@/core/models/shop-category-model";

import AddItemPage from "@/components/account/AddItemPage";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { shopCategoryColumns } from "@/components/account/columns/shopCategoryColumns";
import {
  deleteShopCategory,
  getShopCategories,
} from "@/core/lib/api/account/shop-categories";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopCategory>({
    fetchFunction: getShopCategories,
    queryKey: "shop-categories",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopCategory")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.categories}</Heading>
      {hasPermission("CreateShopCategory") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.category}
        />
      )}
    
        <MainDataTable
          data={data}
          isLoading={isLoading}
          columns={shopCategoryColumns(dictionary)}
          action={deleteShopCategory}
          queryKey={["shop-categories"]}
        />
    
    </>
  );
}
