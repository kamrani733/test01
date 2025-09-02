"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2, Building2, User } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useState } from "react";
import { Party, Company, Person } from "@/core/models/party-model";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import CreateEditPartyForm from "../form/CreateEditPartyForm";
import { Dictionary } from "@/core/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { deleteParty } from "@/core/lib/api/account/parties";

interface ActionsCellProps {
  row: Row<Party>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-nowrap justify-end gap-2">
      {hasPermission("UpdateParties") && (
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>
      )}

      {hasPermission("DeleteParties") && (
        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-800" />
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + (row.original.entity === "company" ? "شرکت" : "شخص")}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditPartyForm
            partyToEdit={row.original}
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
            action={deleteParty}
            onCancel={() => setDeleteOpen(false)}
            ids={[row.original.id]}
            queryKey={["parties"]}
            onSuccess={() => {
              setDeleteOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function partyColumns(dictionary: Dictionary): ColumnDef<Party>[] {
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
      accessorKey: "entity",
      header: "نوع",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const entity = row.original.entity;
        return (
          <div className="flex items-center gap-2">
            {entity === "company" ? (
              <Building2 className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-green-600" />
            )}
            <span>{entity === "company" ? "شرکت" : "شخص"}</span>
          </div>
        );
      },
      meta: {
        label: "نوع",
        variant: "select",
        placeholder: "جستجو بر اساس نوع...",
        options: [
          { label: "شرکت", value: "company" },
          { label: "شخص", value: "person" },
        ],
      },
    },
    {
      accessorKey: "display_name",
      header: "نام نمایشی",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const party = row.original;
        let displayName = "";
        
        if (party.entity === "company") {
          const company = party as Company;
          displayName = company.trade_name || company.legal_name || "نامشخص";
        } else {
          const person = party as Person;
          displayName = `${person.first_name} ${person.last_name}`;
        }
        
        return (
          <div className="max-w-60 truncate" title={displayName}>
            {displayName}
          </div>
        );
      },
      meta: {
        label: "نام نمایشی",
        variant: "text",
        placeholder: "جستجو بر اساس نام...",
      },
    },
    {
      accessorKey: "mobile",
      header: "موبایل",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const mobile = row.getValue("mobile") as string;
        return (
          <div className="font-mono text-sm">
            {mobile}
          </div>
        );
      },
      meta: {
        label: "موبایل",
        variant: "text",
        placeholder: "جستجو بر اساس موبایل...",
      },
    },
    {
      accessorKey: "email",
      header: "ایمیل",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return (
          <div className="max-w-60 truncate" title={email}>
            {email || "-"}
          </div>
        );
      },
      meta: {
        label: "ایمیل",
        variant: "text",
        placeholder: "جستجو بر اساس ایمیل...",
      },
    },
    {
      accessorKey: "type",
      header: "نوع طرف",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const types = row.original.type || [];
        return (
          <div className="flex flex-wrap gap-1">
            {types.slice(0, 2).map((type, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
            {types.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{types.length - 2}
              </Badge>
            )}
          </div>
        );
      },
      meta: {
        label: "نوع طرف",
        variant: "select",
        placeholder: "جستجو بر اساس نوع طرف...",
        options: [
          { label: "بازاریاب", value: "marketer" },
          { label: "کاربران", value: "users" },
          { label: "پیمانکار", value: "contractor" },
          { label: "مشتری", value: "customer" },
          { label: "پرسنل", value: "personnel" },
          { label: "تأمین‌کننده", value: "supplier" },
          { label: "همکار", value: "colleague" },
        ],
      },
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div>
            {status === "active" ? (
              <Badge variant="verified">فعال</Badge>
            ) : (
              <Badge variant="destructive">غیرفعال</Badge>
            )}
          </div>
        );
      },
      meta: {
        label: "وضعیت",
        variant: "select",
        placeholder: "جستجو بر اساس وضعیت...",
        options: [
          { label: "فعال", value: "active" },
          { label: "غیرفعال", value: "deactive" },
        ],
      },
    },
    {
      accessorKey: "code",
      header: "کد طرف",
      enableColumnFilter: true,
      cell: ({ row }) => {
        const code = row.getValue("code") as string;
        return (
          <div className="font-mono text-sm">
            {code || "-"}
          </div>
        );
      },
      meta: {
        label: "کد طرف",
        variant: "text",
        placeholder: "جستجو بر اساس کد طرف...",
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
