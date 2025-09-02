import { getCities } from "@/core/lib/api";
import { getProfile } from "@/core/lib/api/main/dashboard-api";

export default async function ProfilePage() {
  const cities = await getCities();
  const defaultValue = await getProfile();

  return (
    <div>profile</div>
  );
}
