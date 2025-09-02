import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePriorityWidget } from "@/core/lib/api/account/widgets";

export function useChangePriorityWidget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: "up" | "down" }) =>
      changePriorityWidget(id, action),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["widgets"] });
    },
    onError: (err) => toast.error(err?.message),
  });
}
