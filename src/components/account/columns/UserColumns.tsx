'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { KeyRound, Pencil, Trash2, User as UserIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { useState } from 'react';
import { Checkbox } from '../../ui/checkbox';
import ConfirmDelete from '../ConfirmDelete';
import { User } from '@/core/models/user-model';
import { Dictionary } from '@/core/lib/dict';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/authContext';
import { useDictionary } from '@/core/hooks/use-dictionary';
import ChangePasswordForm from '../form/ChangePasswordForm';
import Image from 'next/image';
import { deleteUser } from '@/core/lib/api/account/users';
import {
  useChangeStatusUser,
  useVerifyEmail,
  useVerifyMobile,
} from '@/core/hooks/user/useUserMutations';

interface ActionsCellProps {
  row: Row<User>;
  onSuccess?: () => void;
}

/* ----------  ActionsCell  ---------- */
export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end">
      {hasPermission('UpdateUsers') && (
        <>
          <Button asChild variant="ghost" size="icon">
            <Link href={`/admin/users/edit/${row.original.id}`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPasswordOpen(true)}
          >
            <KeyRound className="size-4" />
          </Button>
        </>
      )}

      {hasPermission('DeleteUsers') && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.delete}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.deleteItemDescription}
            </DialogDescription>
          </DialogHeader>
          <ConfirmDelete
            action={deleteUser}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
            ids={[row.original.id]}
            queryKey={['users']}
          />
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.changePassword}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.changePasswordDescription}
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onSuccess={() => {
              setPasswordOpen(false);
            }}
            passwordToEditId={row.original.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ----------  VerifyCell  ---------- */
export const VerifyCell = ({
  row,
  isEmail,
}: {
  row: Row<User>;
  onSuccess?: () => void;
  isEmail?: boolean;
}) => {
  const { hasPermission } = useAuth();
  const verifyEmailMut = useVerifyEmail();
  const verifyMobileMut = useVerifyMobile();
  const mutation = isEmail ? verifyEmailMut : verifyMobileMut;

  const isVerified = isEmail
    ? !!row.original.email_verified_at
    : !!row.original.mobile_verified_at;

  const handleToggle = () => {
    if (!hasPermission('UpdateUsers')) return;
    mutation.mutate({ flag: isVerified ? 0 : 1, userId: row.original.id });
  };

  return (
    <Switch
      checked={isVerified}
      disabled={!hasPermission('UpdateUsers') || mutation.isPending}
      onCheckedChange={handleToggle}
    />
  );
};

/* ----------  ChangeStatusCell  ---------- */
export const ChangeStatusCell = ({ row }: ActionsCellProps) => {
  const { hasPermission } = useAuth();
  const mutation = useChangeStatusUser();
  const isActive = row.original.status === 'active';

  const handleToggle = () => {
    if (!hasPermission('UpdateUsers')) return;
    mutation.mutate({
      status: isActive ? 'deactive' : 'active',
      userId: row.original.id,
    });
  };

  return (
    <Switch
      checked={isActive}
      disabled={!hasPermission('UpdateUsers') || mutation.isPending}
      onCheckedChange={handleToggle}
    />
  );
};

/* ----------  userColumns  ---------- */
export function userColumns(dictionary: Dictionary): ColumnDef<User>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'avatar_url.url',
      header: dictionary.forms.avatar,
      enableColumnFilter: false,
      meta: {
        label: dictionary.forms.avatar,
        variant: 'text',
        placeholder: dictionary.forms.avatar,
      },
      cell: ({ row }) => {
        const avatar = row.original.avatar_url?.url;
        return (
          <div className="flex items-center border border-primary-300 rounded-full justify-center size-8 relative">
            {avatar ? (
              <Image
                src={avatar}
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <UserIcon className="size-4" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'full_name',
      header: dictionary.forms.fullname,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.fullname,
        variant: 'text',
        placeholder: dictionary.forms.fullname,
      },
    },
    {
      accessorKey: 'mobile',
      header: dictionary.forms.mobile,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.mobile,
        variant: 'text',
        placeholder: dictionary.forms.mobile,
      },
    },
    {
      accessorKey: 'role.title',
      header: dictionary.forms.role,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.role,
        variant: 'text',
        placeholder: dictionary.forms.role,
      },
    },
    {
      accessorKey: 'email',
      header: dictionary.forms.email,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.email,
        variant: 'text',
        placeholder: dictionary.forms.email,
      },
    },
    {
      accessorKey: 'status',
      header: dictionary.forms.status,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.status,
        variant: 'select',
        placeholder: `${dictionary.common.search} ${dictionary.forms.status}...`,
        options: [
          { label: dictionary.ui.status.active, value: 'active' },
          { label: dictionary.ui.status.deactive, value: 'deactive' },
        ],
      },
      cell: props => (
        <ChangeStatusCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
    {
      accessorKey: 'email_verified_at',
      header: `${dictionary.forms.verify} ${dictionary.forms.email}`,
      enableColumnFilter: true,
      cell: props => (
        <VerifyCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
          isEmail
        />
      ),
      meta: {
        label: `${dictionary.forms.verify} ${dictionary.forms.email}`,
        variant: 'select',
        placeholder: `${dictionary.common.search} ${dictionary.forms.verify} ${dictionary.forms.email}...`,
        options: [
          { label: dictionary.forms.verified, value: 'active' },
          { label: dictionary.forms.notVerified, value: '0' },
        ],
      },
    },
    {
      accessorKey: 'mobile_verified_at',
      header: `${dictionary.forms.verify} ${dictionary.forms.mobile}`,
      enableColumnFilter: true,
      cell: props => (
        <VerifyCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
      meta: {
        label: `${dictionary.forms.verify} ${dictionary.forms.mobile}`,
        variant: 'select',
        placeholder: `${dictionary.common.search} ${dictionary.forms.verify} ${dictionary.forms.mobile}...`,
        options: [
          { label: dictionary.forms.verified, value: 'active' },
          { label: dictionary.forms.notVerified, value: '0' },
        ],
      },
    },
    {
      id: 'actions',
      enableColumnFilter: false,
      cell: props => (
        <ActionsCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
  ];
}
