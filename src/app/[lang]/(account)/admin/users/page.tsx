"use client";

import { useState, useCallback } from "react";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import { getUsers, deleteUser } from "@/core/lib/api/account/users";
import { User } from "@/core/models/user-model";
import { userColumns } from "@/components/account/columns/UserColumns";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { Heading } from "@/components/ui/Heading";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import AddItemPage from "@/components/account/AddItemPage";
import UserStatistics from "@/components/account/UserStatistics";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { FetchParams } from "@/core/hooks/use-data-table-data";

export default function Page() {
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const [showStats, setShowStats] = useState(false);

  // تابع سفارشی برای دریافت داده‌ها
  const fetchUsers = useCallback(async (params: FetchParams) => {
    return getUsers(params);
  }, []);

  const { data, isLoading } = useDataTableData<User>({
    fetchFunction: fetchUsers,
    queryKey: "users",
  });

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessUsers"]}>
      <div className="space-y-6">
        {/* هدر صفحه */}
        <div className="flex items-center justify-between">
          <Heading level={1}>{dictionary.nav.users}</Heading>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? dictionary.common.hideStatistics : dictionary.common.showStatistics}
            {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* آمار */}
        {showStats && <UserStatistics usersData={data?.data} />}

        {hasPermission("CreateUsers") && (
          <AddItemPage
            label={dictionary.common.add + " " + dictionary.nav.user}
          />
        )}

        {/* جدول داده‌ها */}
        <div className="space-y-4">
          <MainDataTable
            data={data}
            columns={userColumns(dictionary)}
            action={deleteUser}
            isLoading={isLoading}
            queryKey={["users"]}
          />
        </div>
      </div>
    </ProtectWithPermissionWrapper>
  );
}
