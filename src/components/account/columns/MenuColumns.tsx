"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
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
import Link from "next/link";
import { Menu } from "@/core/models/menu-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { deleteMenu } from "@/core/lib/api/account/menus";
import Image from "next/image";

interface ActionsCellProps {
  row: Row<Menu>;
  onSuccess?: () => void;
  isEmail?: boolean;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateMenus") && (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/menus/edit/${row.original.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission("DeleteMenus") && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="size-4" />
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
            action={deleteMenu}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            queryKey={["menus"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function menuColumns(dictionary: Dictionary): ColumnDef<Menu>[] {
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
      header: dictionary.nav.menu,
    },
    {
      accessorKey: "name",
      header: dictionary.forms.name,
    },
    {
      accessorKey: "items",
      header: dictionary.forms.image,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.image,
        variant: "text",
        placeholder: dictionary.forms.image,
      },
      cell: ({ row }) => {
        const firstItem = row.original.items?.[0];
        
        console.log("Menu item for image display:", {
          menuId: row.original.id,
          firstItem: firstItem,
          imageInfo: firstItem?.image_info,
          imageUrl: firstItem?.imageUrl,
          image: firstItem?.image
        });
        
        // Check for image in different possible locations
        let imageUrl = null;
        if (firstItem?.image_info?.url) {
          imageUrl = firstItem.image_info.url;
        } else if (firstItem?.imageUrl) {
          imageUrl = firstItem.imageUrl;
        }

        console.log("Image URL found:", {
          menuId: row.original.id,
          imageUrl: imageUrl,
          imageInfoUrl: firstItem?.image_info?.url,
          imageUrlField: firstItem?.imageUrl
        });

        if (!imageUrl) {
          return (
            <div className="flex items-center border-1 border-primary-300 rounded-sm justify-center h-11 w-13 relative bg-gray-100">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          );
        }

        return (
          <div className="flex items-center border-1 border-primary-300 rounded-sm justify-center h-11 w-13 relative">
            <img
              src={imageUrl}
              alt={firstItem.title || "Menu item image"}
              className="w-full h-full rounded-sm object-cover"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-500">Image failed to load</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
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
