import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dictionary } from "../../lib/dict";

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

interface DeleteMutationOptions<TData> {
  mutationFn: (data: TData) => Promise<ActionResponse>;
  queryKey: string[];
  dictionary: Dictionary;
  onSuccess?: () => void;
}

export const useDeleteMutation = <TData,>({
  mutationFn,
  queryKey,
  dictionary,
  onSuccess,
}: DeleteMutationOptions<TData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (result: ActionResponse) => {
      if (result?.status === "success") {
        toast.success(result.message || "Item deleted successfully");
        queryClient.invalidateQueries({ queryKey });
        onSuccess?.();
      } else {
        const description = result?.data?.failed_items
          ? result.data.failed_items
              .map((item) => `• ${item.reason.join(";")}`)
              .join("\n")
          : undefined;
        toast.error(result?.message || "Failed to delete item", {
          description,
        });
      }
    },
    onError: (error) => {
      const errorMsg =
        error instanceof Error ? error.message : dictionary.common.error;
      toast.error(errorMsg);
    },
  });
};
