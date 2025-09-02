import CreateEditShopInventoryForm from "@/components/account/form/CreateEditShopInventoryForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getShopProductsList } from "@/core/lib/api/account/shop-products";
import { getShopStoresList } from "@/core/lib/api/account/shop-store";

export default async function AddShopInventoryPage() {
  const shopStoresList = await getShopStoresList();
  const shopProductsList = await getShopProductsList();
  console.log(shopStoresList);

  return (
    <ProtectWithPermissionWrapper
      requiredPermissions={["CreateShopInventories"]}
    >
      <CreateEditShopInventoryForm
        shopStoresList={shopStoresList.data}
        shopProductsList={shopProductsList}
      />
    </ProtectWithPermissionWrapper>
  );
}
