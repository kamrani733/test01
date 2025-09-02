'use client';

import AddItemModal from '@/components/account/AddItemModal';
import { socialColumns } from '@/components/account/columns/SocialColumns';
import CreateEditSocialForm from '@/components/account/form/CreateEditSocialMediaForm';
import ProtectWithPermissionWrapper from '@/components/account/ProtectWithPermissionWrapper';
import { MainDataTable } from '@/components/account/table/MainDataTable';
import { Heading } from '@/components/ui/Heading';
import { useAuth } from '@/contexts/authContext';
import { useDataTableData } from '@/core/hooks/use-data-table-data';
import { useDictionary } from '@/core/hooks/use-dictionary';
import {
  deleteSocialMedia,
  getSocialMedias,
} from '@/core/lib/api/account/socialmedia';
import { Social } from '@/core/models/social-model';

export default function Page() {
  const { data, isLoading } = useDataTableData<Social>({
    fetchFunction: getSocialMedias,
    queryKey: 'social-media',
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper
      requiredPermissions={['AccessWidgetSocialMedia']}
    >
      <Heading level={1}>{dictionary.nav.socialMedia}</Heading>
      {hasPermission('CreateWidgetSocialMedia') && (
        <AddItemModal
          FormComponent={CreateEditSocialForm}
          label={dictionary.common.add + ' ' + dictionary.nav.socialMedia}
        />
      )}

      <MainDataTable
        data={data}
        columns={socialColumns(dictionary)}
        action={deleteSocialMedia}
        queryKey={['social-media']}
        isLoading={isLoading}
      />
    </ProtectWithPermissionWrapper>
  );
}
