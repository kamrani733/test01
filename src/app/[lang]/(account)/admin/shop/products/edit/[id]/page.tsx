import CreateEditShopProductForm from "@/components/account/form/CreateEditShopProductForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getShopCategoriesList } from "@/core/lib/api/account/shop-categories";
import { getShopColorsList } from "@/core/lib/api/account/shop-colors";
import { getShopGroupsList } from "@/core/lib/api/account/shop-groups";
import { getShopProductById, getShopProductsList } from "@/core/lib/api/account/shop-products";
import { getShopTagsList } from "@/core/lib/api/account/shop-tags";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const shopProductsList = await getShopProductsList();
  const shopTagsList = await getShopTagsList();
  const shopGroupsList = await getShopGroupsList();
  const shopCategoriesList = await getShopCategoriesList();
  const shopColorList = await getShopColorsList();
  const shopProduct = await getShopProductById(id);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateShopProducts"]}>
      <CreateEditShopProductForm
        shopProductsList={shopProductsList}
        shopTagsList={shopTagsList.data}
        shopGroupsList={shopGroupsList.data}
        shopCategoriesList={shopCategoriesList}
        defaultValue={shopProduct}
        shopColorList={shopColorList.data}
      />
    </ProtectWithPermissionWrapper>
  );
}
