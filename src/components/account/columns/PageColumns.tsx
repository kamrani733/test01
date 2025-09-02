'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';



import { useState } from 'react';



import Link from 'next/link';



import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/authContext';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { deletePage } from '@/core/lib/api/account/pages';
import { Dictionary } from '@/core/lib/dict';
import { Page } from '@/core/models/page-model';



import { Checkbox } from '../../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import ConfirmDelete from '../ConfirmDelete';





interface ActionsCellProps {
  row: Row<Page>;
  onSuccess?: () => void;
}

export const PagesActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <div className="flex justify-end items-center gap-2">
      {hasPermission('UpdatePagePage') && (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/pages/edit/${row.original.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission('DeletePagePage') && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="size-4" />
        </Button>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dictionary.common.delete}</DialogTitle>
            <DialogDescription>
              {dictionary.common.deleteItemDescription}
            </DialogDescription>
          </DialogHeader>
          <ConfirmDelete
            action={deletePage}
            ids={[row.original.id]}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            onCancel={() => setDeleteOpen(false)}
            queryKey={['pages']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function pageColumns(dictionary: Dictionary): ColumnDef<Page>[] {
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
      accessorKey: 'title',
      header: dictionary.forms.title,
      enableColumnFilter: true,
    },
    {
      accessorKey: 'slug',
      header: dictionary.forms.slug,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.getValue('slug') as string;
        return (
          <div className="max-w-50 lg:max-w-max truncate" title={value}>
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: dictionary.forms.status,
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: PagesActionsCell,
      enableColumnFilter: false,
    },
  ];
}