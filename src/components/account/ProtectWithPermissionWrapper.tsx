"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WithPermissionClientWrapperProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  redirectTo?: string;
}

export default function ProtectWithPermissionWrapper({
  children,
  requiredPermissions,
  redirectTo = "/dashboard",
}: WithPermissionClientWrapperProps) {
  const { hasPermission } = useAuth();
  const router = useRouter();

  const hasAccess = requiredPermissions.every((perm) => hasPermission(perm));
  
  useEffect(() => {
    if (!hasAccess) {
      router.push(redirectTo);
    }
  }, [hasAccess, router, redirectTo]);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
