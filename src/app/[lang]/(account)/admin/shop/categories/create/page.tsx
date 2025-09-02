import CreateEditShopCategoryForm from "@/components/account/form/CreateEditShopCategoryForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getShopCategoriesList } from "@/core/lib/api/account/shop-categories";

export default async function page() {
  const shopCategoriesList = await getShopCategoriesList();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateShopCategory"]}>
      <CreateEditShopCategoryForm shopCategoriesList={shopCategoriesList} />
    </ProtectWithPermissionWrapper>
  );
}
