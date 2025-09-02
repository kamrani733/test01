import CreateEditShopProductForm from '@/components/account/form/CreateEditShopProductForm';
import ProtectWithPermissionWrapper from '@/components/account/ProtectWithPermissionWrapper';
import { getShopCategoriesList } from '@/core/lib/api/account/shop-categories';
import { getShopColorsList } from '@/core/lib/api/account/shop-colors';
import { getShopGroupsList } from '@/core/lib/api/account/shop-groups';
import { getShopProductsList } from '@/core/lib/api/account/shop-products';
import { getShopTagsList } from '@/core/lib/api/account/shop-tags';

export default async function Page() {
  const [
    shopProductsList,
    shopTagsList,
    shopGroupsList,
    shopCategoriesList,
    shopColorList,
  ] = await Promise.all([
    getShopProductsList(),
    getShopTagsList(),
    getShopGroupsList(),
    getShopCategoriesList(),
    getShopColorsList(),
  ]);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={['CreateShopProducts']}>
      <CreateEditShopProductForm
        shopProductsList={shopProductsList}
        shopTagsList={shopTagsList.data}
        shopGroupsList={shopGroupsList.data}
        shopCategoriesList={shopCategoriesList}
        shopColorList={shopColorList.data}
      />
    </ProtectWithPermissionWrapper>
  );
}
