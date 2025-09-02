import CreateEditPageForm from "@/components/account/form/CreateEditPageForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";

export default async function Page() {
  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreatePagePage"]}>
      <CreateEditPageForm />
    </ProtectWithPermissionWrapper>
  );
}
