"use client";
import { Trash } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  Dialog,
  DialogHeader,
} from "../ui/dialog";
import ConfirmDelete from "../account/ConfirmDelete";
import { useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useDictionary } from "@/core/hooks/use-dictionary";

interface ActionsCellProps {
  ids: number[];
  onSuccess?: () => void;
  action: (
    ids: number[]
  ) => Promise<{ status: string; message: string; data: { ids: number[] } }>;
  queryKey: string[];
}

export default function DataTableActionDelete({
  ids,
  onSuccess,
  action,
  queryKey,
}: ActionsCellProps) {
  const [Open, setOpen] = useState(false);
  const { dictionary } = useDictionary();

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          //   size="icon"
          className="rounded-md h-7"
        >
          <Trash className="size-3.5" />
        </Button>
      </DialogTrigger>
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
          action={action}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
          }}
          ids={ids}
          queryKey={queryKey}
        />
      </DialogContent>
    </Dialog>
  );
}
