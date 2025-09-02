import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import CreateEditShopInventoryForm from "@/components/account/form/CreateEditShopInventoryForm";
import { getShopInventoryById } from "@/core/lib/api/account/shop-inventories";
import { getShopProductsList } from "@/core/lib/api/account/shop-products";
import { getShopStoresList } from "@/core/lib/api/account/shop-store";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function EditShopInventoryPage({ params }: Props) {
  const { id } = await params;
  const inventoryResponse = await getShopInventoryById(id);
  const shopStoresList = await getShopStoresList();
  const shopProductsList = await getShopProductsList();

  return (
    <ProtectWithPermissionWrapper
      requiredPermissions={["UpdateShopInventories"]}
    >
      <CreateEditShopInventoryForm
        defaultValue={inventoryResponse.data}
        shopStoresList={shopStoresList.data}
        shopProductsList={shopProductsList}
      />
    </ProtectWithPermissionWrapper>
  );
}
