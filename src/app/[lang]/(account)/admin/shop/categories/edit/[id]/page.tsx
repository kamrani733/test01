import CreateEditShopCategoryForm from "@/components/account/form/CreateEditShopCategoryForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import {
  getShopCategoriesList,
  getShopCategoryById,
} from "@/core/lib/api/account/shop-categories";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const shopCategory = await getShopCategoryById(id);
  const shopCategoriesList = await getShopCategoriesList();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateShopCategory"]}>
      <CreateEditShopCategoryForm
        defaultValue={shopCategory}
        shopCategoriesList={shopCategoriesList}
      />
    </ProtectWithPermissionWrapper>
  );
}
