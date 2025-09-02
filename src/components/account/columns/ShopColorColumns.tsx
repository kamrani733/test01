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
import { ShopColor } from "@/core/models/shop-color-model";
import CreateEditColorForm from "../form/CreateEditShopColorForm";
import { deleteShopColor } from "@/core/lib/api/account/shop-colors";

interface ActionsCellProps {
  row: Row<ShopColor>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateShopColor") && (
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>
      )}

      {hasPermission("DeleteShopColor") && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + dictionary.nav.color}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditColorForm
            onSuccess={() => {
              setEditOpen(false);
            }}
            colorToEdit={row.original}
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
            action={deleteShopColor}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
            ids={[row.original.id]}
            queryKey={["shop-colors"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function shopColorColumns(
  dictionary: Dictionary
): ColumnDef<ShopColor>[] {
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
      header: dictionary.forms.name,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.code,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.code + "...",
      },
    },
    {
      accessorKey: "code_hex",
      header: dictionary.forms.code_hex,
      enableColumnFilter: true,
      enableSorting: false,
      meta: {
        label: dictionary.forms.code_hex,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.code_hex + "...",
      },
      cell: ({ row }) => {
        const codeHex = row.original.code_hex;
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: codeHex }}
            />
            <span>{codeHex}</span>
          </div>
        );
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
