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
import { Slider } from "@/core/models/slider-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { deleteSlider } from "@/core/lib/api/account/sliders";

interface ActionsCellProps {
  row: Row<Slider>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateSliders") && (
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/sliders/edit/${row.original.id}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
      )}

      {hasPermission("DeleteUsers") && (
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
            action={deleteSlider}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            queryKey={["sliders"]}
            ids={[row.original.id]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function SliderColumns(dictionary: Dictionary): ColumnDef<Slider>[] {
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
      accessorKey: "items",
      header: dictionary.forms.image,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.image,
        variant: "text",
        placeholder: dictionary.forms.image,
      },
      cell: ({ row }) => {
        const firstItem = row.original.items[0];

        const image = firstItem?.image_info?.url;

        return (
          <div className="flex items-center border-1 border-primary-300 rounded-sm justify-center h-11 w-13 relative">
            <Image
              src={image}
              alt={firstItem.title || "image"}
              fill
              className="rounded-sm object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: dictionary.forms.title,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.title,
        variant: "text",
        placeholder: dictionary.forms.title,
      },
    },
    {
      accessorKey: "name",
      header: dictionary.forms.name,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.name,
        variant: "text",
        placeholder: dictionary.forms.name,
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
            {value}
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
