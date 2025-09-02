"use client";

import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useDeleteMutation } from "@/core/hooks/common/useDeleteMutation";

type FailedItem = {
  id: number;
  title: string;
  reason: string[];
};

type ActionResponse = {
  status: string;
  message: string;
  data: {
    ids?: number[];
    failed_items?: FailedItem[];
  };
};

type ConfirmDeleteProps = {
  onCancel: () => void;
  onSuccess: () => void;
  ids: number[];
  action: (ids: number[]) => Promise<ActionResponse>;
  queryKey: string[];
};

export default function ConfirmDelete({
  onCancel,
  onSuccess,
  ids,
  action,
  queryKey,
}: ConfirmDeleteProps) {
  const { dictionary } = useDictionary();
  console.log(ids , "ids" , queryKey , "queryKey" , action , "action");
  const deleteMutation = useDeleteMutation({
    mutationFn: action,
    queryKey,
    dictionary,
    onSuccess,
  });

  const handleDelete = () => {
    deleteMutation.mutate(ids);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            dictionary.common.delete
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {dictionary.common.cancel}
        </Button>
      </div>
    </div>
  );
}
