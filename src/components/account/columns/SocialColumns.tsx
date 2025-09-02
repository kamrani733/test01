"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/core/hooks/use-dictionary";
import CreateEditSocialForm from "../form/CreateEditSocialMediaForm";
import { Social } from "@/core/models/social-model";
import { deleteSocialMedia } from "@/core/lib/api/account/socialmedia";
import { useChangePrioritySocial } from "@/core/hooks/social/useChangePrioritySocial";

interface ActionsCellProps {
  row: Row<Social>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();

  const { dictionary } = useDictionary();
  return (
    <div className="flex flex-nowrap justify-end">
      {hasPermission("UpdateWidgetSocialMedia") && (
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>
      )}

      {hasPermission("DeleteWidgetSocialMedia") && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + dictionary.nav.socialMedia}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditSocialForm
            onSuccess={() => {
              setEditOpen(false);
            }}
            socialToEdit={row.original}
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
            action={deleteSocialMedia}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
            ids={[row.original.id]}
            queryKey={["social-media"]}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const PriorityCell = ({ row }: ActionsCellProps) => {
  const { hasPermission } = useAuth();
  const changePriority = useChangePrioritySocial();

  const handleChange = (action: "up" | "down") => {
    if (!hasPermission("UpdateWidgetSocialMedia")) return;
    changePriority.mutate({ id: row.original.id, action });
  };

  return (
    <div className="flex gap-2">
      {hasPermission("UpdateWidgetSocialMedia") && (
        <>
          <Button
            disabled={changePriority.isPending}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange("up")}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            disabled={changePriority.isPending}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange("down")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export function socialColumns(dictionary: Dictionary): ColumnDef<Social>[] {
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
      enableSorting: false,
    },
    {
      accessorKey: "type",
      header: dictionary.forms.type,
      enableSorting: false,
    },
    {
      accessorKey: "link",
      header: dictionary.forms.link,
      enableSorting: false,
      cell: ({ row }) => {
        const value = row.getValue("link") as string;
        return (
          <div className="max-w-25  truncate" title={value}>
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: dictionary.forms.status,
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "active" ? "verified" : "destructive"}>
            {status === "active"
              ? dictionary.ui.status.active
              : dictionary.ui.status.deactive}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: dictionary.forms.priority,
      enableSorting: false,
      cell: (props) => (
        <PriorityCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
    {
      id: "actions",
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
