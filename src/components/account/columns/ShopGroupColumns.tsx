"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import { Dictionary } from "@/core/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { useDictionary } from "@/core/hooks/use-dictionary";
import Link from "next/link";
import { ShopGroup } from "@/core/models/shop-group-model";
import { deleteShopGroup } from "@/core/lib/api/account/shop-groups";

interface ActionsCellProps {
  row: Row<ShopGroup>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateShopGroups") && (
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/shop/groups/edit/${row.original.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission("DeleteShopGroups") && (
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
            action={deleteShopGroup}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={["shop-groups"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function shopGroupColumns(
  dictionary: Dictionary
): ColumnDef<ShopGroup>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: dictionary.forms.title,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.title,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.title + "...",
      },
    },
    {
      accessorKey: "description",
      header: dictionary.forms.description,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.getValue("description") as string;
        return (
          <div className="max-w-60  truncate" title={value}>
            {value || "-"}
          </div>
        );
      },
      meta: {
        label: dictionary.forms.description,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.description + "...",
      },
    },
    {
      id: "actions",
      enableColumnFilter: false,

      cell: (props) => (
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
