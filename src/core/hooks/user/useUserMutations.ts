import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changeStatusUser,
  verifyEmail,
  verifyMobile,
} from "@/core/lib/api/account/users";

export function useChangeStatusUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      status,
      userId,
    }: {
      status: "active" | "deactive";
      userId: number;
    }) => changeStatusUser(status, userId),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err?.message),
  });
}

export function useVerifyEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ flag, userId }: { flag: 0 | 1; userId: number }) =>
      verifyEmail(flag, userId),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err?.message),
  });
}

export function useVerifyMobile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ flag, userId }: { flag: 0 | 1; userId: number }) =>
      verifyMobile(flag, userId),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err?.message),
  });
}
