import EditSettingsForm from "@/components/account/form/EditSettingForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getSettings } from "@/core/lib/api/account/settings";

export default async function page() {
  const Settings = await getSettings();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessSettings"]}>
      <EditSettingsForm defaultValue={Settings.data} />;
    </ProtectWithPermissionWrapper>
  );
}
