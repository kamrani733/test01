"use client";
import { Heading } from "@/components/ui/Heading";
import { useDictionary } from "@/core/hooks/use-dictionary";
import CreateEditMenuForm from "@/components/account/form/CreateEditMenuForm";
import { useAuth } from "@/contexts/authContext";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";

export default function CreateMenuPage() {
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateMenus"]}>
      <div className="space-y-6">
        <Heading level={1}>
          {dictionary.common.add} {dictionary.nav.menu}
        </Heading>
        <CreateEditMenuForm defaultValue={undefined} />
      </div>
    </ProtectWithPermissionWrapper>
  );
}
