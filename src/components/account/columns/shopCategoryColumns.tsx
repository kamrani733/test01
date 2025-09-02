'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
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
import { ShopCategory } from '@/core/models/shop-category-model';
import Link from 'next/link';
import Image from 'next/image';
import { deleteShopCategory } from '@/core/lib/api/account/shop-categories';

interface ActionsCellProps {
  row: Row<ShopCategory>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end items-center gap-2">
      {hasPermission('UpdateShopCategory') && (
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/shop/categories/edit/${row.original.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission('DeleteShopCategory') && (
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
            action={deleteShopCategory}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={['shop-categories']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function shopCategoryColumns(
  dictionary: Dictionary
): ColumnDef<ShopCategory>[] {
  return [
    {
      id: 'expand',
      header: '',
      size: 36,
      cell: ({ row }) => (
        <div className="h-full flex items-center overflow-hidden w-full">
          {row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={row.getToggleExpandedHandler()}
              className="p-1"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4 rtl:rotate-180" />
              )}
            </Button>
          ) : (
            <span className="h-4 w-9 inline-block" />
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: 'first_image',
      header: dictionary.forms.image,
      enableColumnFilter: false,
      meta: {
        label: dictionary.forms.image,
        variant: 'text',
        placeholder: dictionary.forms.image,
      },
      cell: ({ row }) => {
        const image = row.original.first_image;

        return (
          image !== '' && (
            <div className="flex items-center border-1 border-primary-300 rounded-sm justify-center h-11 w-13 relative">
              <Image
                src={image}
                fill
                alt="image"
                className="rounded-sm object-cover"
              />
            </div>
          )
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
      accessorKey: 'description',
      header: dictionary.forms.description,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.getValue('description') as string;
        return (
          <div className="max-w-60  truncate" title={value}>
            {value || '-'}
          </div>
        );
      },
      meta: {
        label: dictionary.forms.description,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.description + '...',
      },
    },
    {
      accessorKey: 'level',
      header: dictionary.forms.level,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.level,
        variant: 'text',
        placeholder:
          dictionary.common.search + ' ' + dictionary.forms.level + '...',
      },
    },
    {
      id: 'actions',
      enableColumnFilter: false,

      cell: ActionsCell,
    },
  ];
}
