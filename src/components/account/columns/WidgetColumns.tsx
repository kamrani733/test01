'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/authContext';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { useChangePriorityWidget } from '@/core/hooks/widget/useChangePriorityWidget';
import { deleteWidget } from '@/core/lib/api/account/widgets';
import { Dictionary } from '@/core/lib/dict';
import { Widget } from '@/core/models/widget-model';

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
  row: Row<Widget>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end">
      {hasPermission('UpdateWidgets') && (
        <Button asChild variant="ghost" size="icon">
          <Link
            href={`/admin/widgets/edit/${row.original.id}?template=${row.original.template_coding}`}
          >
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission('DeleteWidgets') && (
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
            action={deleteWidget}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
            ids={[row.original.id]}
            queryKey={['widgets']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const PriorityCell = ({ row }: ActionsCellProps) => {
  const { hasPermission } = useAuth();
  const changePriority = useChangePriorityWidget();

  const handleChange = (action: 'up' | 'down') => {
    if (!hasPermission('UpdateWidgetSocialMedia')) return;
    changePriority.mutate({ id: row.original.id, action });
  };

  return (
    <div className="flex gap-2">
      {hasPermission('UpdateWidgetSocialMedia') && (
        <>
          <Button
            disabled={changePriority.isPending}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange('up')}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            disabled={changePriority.isPending}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange('down')}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
export function WidgetColumns(dictionary: Dictionary): ColumnDef<Widget>[] {
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
      meta: {
        label: dictionary.forms.title,
        variant: 'text',
        placeholder: dictionary.forms.title,
      },
    },
    {
      accessorKey: 'template_coding',
      header: dictionary.forms.template_coding,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.template_coding,
        variant: 'text',
        placeholder: dictionary.forms.template_coding,
      },
    },
    {
      accessorKey: 'description',
      header: dictionary.forms.description,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.getValue('description') as string;

        return (
          <div className="max-w-60 truncate" title={value}>
            {value}
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
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div>
            {status === 'active' ? (
              <Badge variant="verified">{dictionary.ui.status.active}</Badge>
            ) : (
              <Badge variant="destructive">
                {dictionary.ui.status.deactive}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: dictionary.forms.priority,
      enableSorting: false,
      cell: props => (
        <PriorityCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
    {
      id: 'actions',
      header: '',
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
