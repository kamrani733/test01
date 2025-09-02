'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
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
import { Dictionary } from '@/core/lib/dict';
import { useAuth } from '@/contexts/authContext';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { ShopProduct } from '@/core/models/shop-product-model';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { deleteShopProduct } from '@/core/lib/api/account/shop-products';

interface ActionsCellProps {
  row: Row<ShopProduct>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end items-center gap-2">
      {hasPermission('UpdateShopProducts') && (
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/shop/products/edit/${row.original.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission('DeleteShopProducts') && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

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
            action={deleteShopProduct}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={['shop-products']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function shopProductColumns(
  dictionary: Dictionary
): ColumnDef<ShopProduct>[] {
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
      accessorKey: 'thumbnail',
      header: dictionary.forms.image,
      enableColumnFilter: false,
      meta: {
        label: dictionary.forms.image,
        variant: 'text',
        placeholder: dictionary.forms.image,
      },
      cell: ({ row }) => {
        const image = row.original?.thumbnail;

        return (
          <div className="flex items-center border-1 border-primary-300 rounded-sm justify-center h-11 w-13 relative">
            {image && (
              <Image
                src={image.url}
                fill
                alt={image.name}
                className="rounded-sm object-cover"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: dictionary.forms.title,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.title,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.title + '...',
      },
    },
    {
      accessorKey: 'code',
      header: dictionary.forms.code,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.code,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.code + '...',
      },
    },
    {
      accessorKey: 'color.label',
      header: dictionary.nav.color,
      enableColumnFilter: true,
      meta: {
        label: dictionary.nav.color,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.nav.color + '...',
      },
    },
    {
      accessorKey: 'price',
      header: dictionary.forms.price,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.price,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.price + '...',
      },
    },
    {
      accessorKey: 'group.title',
      header: dictionary.nav.group,
      enableColumnFilter: true,
      meta: {
        label: dictionary.nav.group,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.nav.group + '...',
      },
    },
    {
      accessorKey: 'status',
      header: dictionary.forms.status,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.status,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.status + '...',
      },
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: 'creatorUser.full_name',
      header: dictionary.forms.creatorUser,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.creatorUser,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.creatorUser + '...',
      },
    },
    {
      accessorKey: 'updaterUser.full_name',
      header: dictionary.forms.updaterUser,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.updaterUser?.full_name || '',
      meta: {
        label: dictionary.forms.updaterUser,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.updaterUser + '...',
      },
    },
    {
      id: 'actions',
      enableColumnFilter: false,

      cell: ActionsCell,
    },
  ];
}
