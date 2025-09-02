import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDictionary } from "@/core/hooks/use-dictionary";

type FailedItem = {
  id: number;
  title: string;
  reason: string[];
};

type ActionResponse<TData = unknown> = {
  status: "success" | "validation_error" | "error";
  message: string;
  data?: {
    ids?: number[];
    failed_items?: FailedItem[];
    modelData?: TData;
  };
};

type FormKeys<T> = keyof Omit<T, "id">;

type EntityMutationOptions<TInput, TData = unknown> = {
  mutationFn: (data: TInput) => Promise<ActionResponse<TData>>;
  queryKey: string | string[];
  operation: "create" | "update";
  setError?: (
    name: FormKeys<TInput> | `root.${string}`,
    error: { type: string; message: string }
  ) => void;
  onSuccess?: () => void;
};

export const useCreateUpdateMutation = <TInput, TData = unknown>({
  mutationFn,
  queryKey,
  operation,
  setError,
  onSuccess,
}: EntityMutationOptions<TInput, TData>) => {
  const queryClient = useQueryClient();
  const { dictionary } = useDictionary();

  const errorMessage = {
    create: dictionary.errors.createError,
    update: dictionary.errors.updateError,
  }[operation];

  return useMutation<ActionResponse<TData>, Error, TInput>({
    mutationFn,
    onSuccess: (result) => {
      if (result.status === "success") {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        });
        onSuccess?.();
      } else if (
        result.status === "validation_error" &&
        result.data &&
        setError
      ) {
        // manage validation error
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as FormKeys<TInput>, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(result.message || errorMessage);
      }
    },
    onError: (error) => {
      toast.error(error.message || errorMessage);
    },
  });
};
