'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useState, useTransition } from 'react';

import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/authContext';
import { useDictionary } from '@/core/hooks/use-dictionary';
import {
  changeShopCommentStatus,
  deleteMultipleShopComments,
} from '@/core/lib/api/account/shop-comments';
import { Dictionary } from '@/core/lib/dict';
import { ShopComment } from '@/core/models/shop-comment';

import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import ConfirmDelete from '../ConfirmDelete';

interface ActionsCellProps {
  row: Row<ShopComment>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={() => setViewOpen(true)}>
        <Eye className="size-4" />
      </Button>

      {hasPermission('DeleteShopComments') && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.view + ' ' + dictionary.nav.comment}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <strong>{dictionary.forms.user}:</strong> {row.original.name}
            </div>
            <div>
              <strong>{dictionary.nav.product}:</strong>{' '}
              {row.original.product.title}
            </div>
            <div>
              <strong>{dictionary.forms.status}:</strong> {row.original.status}
            </div>
            <div>
              <strong>{dictionary.forms.content}:</strong>{' '}
              {row.original.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            action={deleteMultipleShopComments}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={['shop-comments']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const ChangeStatusCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [isPending, startTransition] = useTransition();

  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  const userId = row.original.id;
  const status = row.original.status;

  const statusForAction = status === 'active' ? 'deactive' : 'active';

  const handleACtiveComment = async () => {
    startTransition(async () => {
      try {
        const result = await changeShopCommentStatus(statusForAction, userId);
        console.log(result);

        if (result?.status === 'success') {
          toast.success(result?.message);
          onSuccess?.();
        } else {
          toast.error(result?.message);
        }
      } catch {
        toast.error(dictionary.common.error);
      }
    });
  };

  return (
    <>
      <Switch
        checked={status === 'active'}
        disabled={!hasPermission('UpdateShopComments') || isPending}
        onCheckedChange={handleACtiveComment}
      />
    </>
  );
};

export function shopCommentColumns(
  dictionary: Dictionary
): ColumnDef<ShopComment>[] {
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
      accessorKey: 'name',
      header: dictionary.forms.user,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.user,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.user + '...',
      },
    },
    {
      accessorKey: 'content',
      header: dictionary.forms.content,
      enableColumnFilter: false,

      cell: ({ row }) => {
        const value = row.getValue('content') as string;
        return (
          <div className="max-w-50 lg:max-w-max truncate" title={value}>
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: 'product.title',
      header: dictionary.nav.product,
      enableColumnFilter: true,
      meta: {
        label: dictionary.nav.product,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.nav.product + '...',
      },
    },
    {
      accessorKey: 'status',
      header: dictionary.forms.status,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.status,
        variant: 'select',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.status + '...',
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
