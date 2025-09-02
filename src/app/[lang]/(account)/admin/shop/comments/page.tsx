"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

import { ShopComment } from "@/core/models/shop-comment";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { shopCommentColumns } from "@/components/account/columns/ShopCommentColumns";
import {
  deleteMultipleShopComments,
  getShopComments,
} from "@/core/lib/api/account/shop-comments";

export default function Page() {
  const { data, isLoading } = useDataTableData<ShopComment>({
    fetchFunction: getShopComments,
    queryKey: "shop-comments",
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopComments")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.comments}</Heading>

  
        <MainDataTable
          data={data}
          columns={shopCommentColumns(dictionary)}
          action={deleteMultipleShopComments}
          isLoading={isLoading}
          queryKey={["shop-comments"]}
        />
      
    </>
  );
}
