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
import { ShopInventory } from "@/core/models/shop-inventory-model";
import { deleteShopInventory } from "@/core/lib/api/account/shop-inventories";

interface ActionsCellProps {
  row: Row<ShopInventory>;
  onSuccess?: () => void;
}

const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateShopInventories") && (
        <>
          <Button asChild variant="ghost" size="icon">
            <Link href={`/admin/shop/inventories/edit/${row.original.id}`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4 text-red-600 hover:text-red-800" />
          </Button>
        </>
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
            action={deleteShopInventory}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={["shop-inventories"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function shopInventoryColumns(
  dictionary: Dictionary
): ColumnDef<ShopInventory>[] {
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
      accessorKey: "store_title",
      header: dictionary.nav.store,
      enableColumnFilter: true,
      meta: {
        label: dictionary.nav.store,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.nav.store + "...",
      },
    },
    {
      accessorKey: "store_code",
      header: dictionary.forms.name + " " + dictionary.nav.store,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.name + " " + dictionary.nav.store,
        variant: "text",
        placeholder:
          dictionary.common.search +
          " " +
          dictionary.forms.name +
          " " +
          dictionary.nav.store +
          "...",
      },
    },
    {
      accessorKey: "product_title",
      header: dictionary.nav.product,
      enableColumnFilter: true,
      meta: {
        label: dictionary.nav.product,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.nav.product + "...",
      },
    },
    {
      accessorKey: "product_code",
      header: dictionary.forms.name + " " + dictionary.nav.product,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.name + " " + dictionary.nav.product,
        variant: "text",
        placeholder:
          dictionary.common.search +
          " " +
          dictionary.forms.name +
          " " +
          dictionary.nav.product +
          "...",
      },
    },
    {
      accessorKey: "inventory",
      header: dictionary.nav.inventory,
      enableColumnFilter: true,
      meta: {
        label: dictionary.nav.inventory,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.nav.inventory + "...",
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
