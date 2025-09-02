import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePrioritySocialMedia } from "@/core/lib/api/account/socialmedia";

export const useChangePrioritySocial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: "up" | "down" }) =>
      changePrioritySocialMedia(id, action),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["socials"] });
    },
  });
};
