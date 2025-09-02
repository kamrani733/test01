'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';

import { useState } from 'react';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';
import { updateRolePermissions } from '@/core/lib/api/account/role-permissions';
import ContainerView from '../ContainerView';
import { Heading } from '@/components/ui/Heading';
import { useDictionary } from '@/core/hooks/use-dictionary';

type Permission = {
  id: string | number;
  name: string;
  title: string;
  children?: Permission[];
  has_permission?: boolean;
};

interface FormValues {
  permissionIds: number[];
}

interface Props {
  id: number;
  checkedPermissions: Permission[];
}

export default function CreateEditRolePermissionForm({
  id,
  checkedPermissions,
}: Props) {
  const router = useRouter();

  const [expandedPermissions, setExpandedPermissions] = useState<Set<number>>(
    new Set()
  );

  const { dictionary } = useDictionary();

  const {
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      permissionIds: checkedPermissions
        .map((perm: Permission) => Number(perm.id))
        .filter(id => !isNaN(id)),
    },
  });

  const watchedPermissions = watch('permissionIds');

  const updateMutation = useCreateUpdateMutation<FormValues & { id: number }>({
    mutationFn: data => updateRolePermissions(data.id, data.permissionIds),
    queryKey: ['roles'],
    operation: 'update',
    setError,
    onSuccess: () => {
      router.push('/admin/roles');
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({ ...data, id });
  };

  const toggleExpanded = (permissionId: number) => {
    const newExpanded = new Set(expandedPermissions);
    if (newExpanded.has(permissionId)) {
      newExpanded.delete(permissionId);
    } else {
      newExpanded.add(permissionId);
    }
    setExpandedPermissions(newExpanded);
  };

  const handleParentChange = (
    permissionId: number,
    checked: boolean,
    children?: Permission[]
  ) => {
    const currentPermissions = watchedPermissions || [];
    let newPermissions = [...currentPermissions];

    if (checked) {
      // Add parent permission if not already included
      if (!newPermissions.includes(permissionId)) {
        newPermissions.push(permissionId);
      }
      // Expand to show children
      setExpandedPermissions(prev => new Set([...prev, permissionId]));
    } else {
      // Remove parent permission
      newPermissions = newPermissions.filter(id => id !== permissionId);
      // Remove all children permissions
      if (children) {
        const childIds = children.map(child => Number(child.id));
        newPermissions = newPermissions.filter(id => !childIds.includes(id));
      }
      // Collapse children
      setExpandedPermissions(prev => {
        const newSet = new Set(prev);
        newSet.delete(permissionId);
        return newSet;
      });
    }

    setValue('permissionIds', newPermissions);
  };

  const handleChildChange = (permissionId: number, checked: boolean) => {
    const currentPermissions = watchedPermissions || [];
    let newPermissions = [...currentPermissions];

    if (checked) {
      if (!newPermissions.includes(permissionId)) {
        newPermissions.push(permissionId);
      }
    } else {
      newPermissions = newPermissions.filter(id => id !== permissionId);
    }

    setValue('permissionIds', newPermissions);
  };

  const isParentChecked = (parentId: number) => {
    return watchedPermissions?.includes(parentId) || false;
  };

  const renderPermissionItem = (
    permission: Permission,
    level = 0,
    parentId?: number
  ) => {
    const permissionId = Number(permission.id);
    const isChecked = watchedPermissions?.includes(permissionId) || false;
    const hasChildren = permission.children && permission.children.length > 0;
    const isExpanded = expandedPermissions.has(permissionId);
    const isChild = level > 0 && parentId !== undefined;
    const parentChecked = isChild ? isParentChecked(parentId) : true;

    return (
      <div key={permission.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center space-x-2 py-2">
          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleExpanded(permissionId)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-6" />}

          <Checkbox
            id={`permission-${permission.id}`}
            checked={isChecked}
            disabled={isChild && !parentChecked}
            onCheckedChange={checked => {
              if (isChild && !parentChecked) return;

              if (hasChildren) {
                handleParentChange(
                  permissionId,
                  checked as boolean,
                  permission.children
                );
              } else {
                handleChildChange(permissionId, checked as boolean);
              }
            }}
          />

          <Label
            htmlFor={`permission-${permission.id}`}
            className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
              isChild && !parentChecked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {permission.title}
          </Label>
        </div>

        {hasChildren && isExpanded && (
          <div className="ms-2.5 ltr:border-l-2 rtl:border-r-2 border-gray-200 pl-4">
            {permission.children?.map(child =>
              renderPermissionItem(child, level + 1, permissionId)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={2}>{dictionary.nav.permissions}</Heading>
        <p className="text-primary-600">
          {dictionary.common.editItemDescription}
        </p>
      </div>
      <ContainerView className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <>
            {checkedPermissions.map(permission =>
              renderPermissionItem(permission)
            )}
          </>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full h-11 text-base"
          >
            {updateMutation.isPending ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              dictionary.common.submit
            )}
          </Button>
        </form>
      </ContainerView>
    </div>
  );
}
