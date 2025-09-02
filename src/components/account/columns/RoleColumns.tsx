"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Shield, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useState } from "react";
import { Role } from "@/core/models/role-model";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import CreateEditRoleItemForm from "../form/CreateEditRoleForm";
import { Dictionary } from "@/core/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/core/hooks/use-dictionary";
import Link from "next/link";
import { deleteRole } from "@/core/lib/api/account/roles";

interface ActionsCellProps {
  row: Row<Role>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateRoles") && (
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>
      )}

      {hasPermission("DeleteRoles") && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {hasPermission("AccessRolePermissions") && (
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/roles/permissions/${row.original.id}`}>
            <Shield className="size-4 text-blue-600 hover:text-blue-800" />
          </Link>
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + dictionary.nav.role}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditRoleItemForm
            roleToEdit={row.original}
            onSuccess={() => {
              setEditOpen(false);
            }}
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
            action={deleteRole}
            onCancel={() => setDeleteOpen(false)}
            ids={[row.original.id]}
            queryKey={["roles"]}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function roleColumns(dictionary: Dictionary): ColumnDef<Role>[] {
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
      accessorKey: "systemic",
      header: dictionary.forms.systemic,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.systemic,
        variant: "select",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.systemic + "...",
        options: [
          { label: dictionary.common.yes, value: "yes" },
          { label: dictionary.common.no, value: "no" },
        ],
      },
      cell: ({ row }) => {
        const systemic = row.original.systemic;

        return (
          <div>
            {systemic === "yes" ? (
              <Badge variant="verified">{dictionary.common.yes}</Badge>
            ) : (
              <Badge variant="destructive">{dictionary.common.no}</Badge>
            )}
          </div>
        );
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
