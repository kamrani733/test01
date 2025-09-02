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
import { ShopStore } from "@/core/models/shop-store-model";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import { Dictionary } from "@/core/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { useDictionary } from "@/core/hooks/use-dictionary";
import CreateEditShopStoreForm from "../form/CreateEditShopStore";
import { deleteShopStore } from "@/core/lib/api/account/shop-store";

interface ActionsCellProps {
  row: Row<ShopStore>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateShopStores") && (
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>
      )}

      {hasPermission("DeleteShopStores") && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + dictionary.nav.store}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditShopStoreForm
            onSuccess={() => {
              setEditOpen(false);
              onSuccess?.();
            }}
            shopStoreToEdit={row.original}
          />
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
            action={deleteShopStore}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={["shop-stores"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function shopStoreColumns(
  dictionary: Dictionary
): ColumnDef<ShopStore>[] {
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
      accessorKey: "code",
      header: dictionary.forms.code,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.code,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.code + "...",
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
