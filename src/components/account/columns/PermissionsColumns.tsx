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
import { Permission } from "@/core/models/permission-model";
import CreateEditPermissionForm from "../form/CreateEditPermissionForm";
import { Dictionary } from "@/core/lib/dict";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { deletePermission } from "@/core/lib/api/account/permissions";

interface ActionsCellProps {
  row: Row<Permission>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end">
      {hasPermission("UpdatePermissions") && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          title={dictionary.common.edit}
        >
          <Pencil className="size-4" />
        </Button>
      )}
      {hasPermission("DeletePermissions") && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          title={dictionary.common.delete}
        >
          <Trash2 className="size-4 text-red-500 hover:text-red-800" />
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditPermissionForm
            onSuccess={() => {
              setEditOpen(false);
            }}
            permissionToEdit={row.original}
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
            action={deletePermission}
            queryKey={["permissions"]}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
            ids={[row.original.id]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function permissionsColumns(
  dictionary: Dictionary
): ColumnDef<Permission>[] {
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
      accessorKey: "name",
      header: dictionary.forms.name,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.name,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.name + "...",
      },
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
