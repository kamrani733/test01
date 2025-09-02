"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/core/lib/api/account/users";
import { useDictionary } from '@/core/hooks/use-dictionary';

interface UserStatistics {
  total: number;
  active: number;
  deactive: number;
  recent: number;
  roleStats: Record<string, number>;
}

interface UserStatisticsProps {
  className?: string;
  usersData?: any[]; // داده‌های کاربران از جدول
}

export default function UserStatistics({ 
  usersData, 
  className = "" 
}: UserStatisticsProps) {
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dictionary } = useDictionary();

  useEffect(() => {
    const calculateStatistics = () => {
      console.log('UserStatistics: Calculating stats with usersData:', usersData);
      
      if (!usersData || !Array.isArray(usersData)) {
        setStats({
          total: 0,
          active: 0,
          deactive: 0,
          recent: 0,
          roleStats: {
            admin: 0,
            user: 0,
            moderator: 0,
            editor: 0,
            other: 0
          }
        });
        setIsLoading(false);
        return;
      }

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const roleStats: Record<string, number> = {
        admin: 0,
        user: 0,
        moderator: 0,
        editor: 0,
        other: 0
      };

      let active = 0;
      let deactive = 0;
      let recent = 0;

      usersData.forEach((user: any) => {
        // شمارش وضعیت
        if (user.status === 'active') {
          active++;
        } else if (user.status === 'deactive' || user.status === 'deactive') {
          deactive++;
        }

        // شمارش کاربران جدید
        if (user.created_at) {
          const createdDate = new Date(user.created_at);
          if (createdDate >= sevenDaysAgo) {
            recent++;
          }
        }

        // شمارش نقش‌ها
        if (user.role && user.role.name) {
          const roleName = user.role.name.toLowerCase();
          if (roleStats.hasOwnProperty(roleName)) {
            roleStats[roleName]++;
          } else {
            roleStats.other++;
          }
        }
      });

      const newStats = {
        total: usersData.length,
        active,
        deactive,
        recent,
        roleStats
      };
      
      console.log('UserStatistics: Calculated stats:', newStats);
      setStats(newStats);
      setIsLoading(false);
    };

    calculateStatistics();
  }, [usersData]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 border border-red-200 rounded-lg bg-red-50 ${className}`}>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: dictionary.common.admin,
      user: dictionary.common.user,
      moderator: dictionary.common.moderator,
      editor: dictionary.common.editor,
      other: dictionary.common.other
    };
    return labels[role] || role;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* آمار کلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">{dictionary.common.totalUsers}</div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">{dictionary.common.active}</div>
        </div>

        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.deactive}</div>
          <div className="text-sm text-gray-600">{dictionary.common.inactive}</div>
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.recent}</div>
          <div className="text-sm text-gray-600">{dictionary.common.new}</div>
        </div>
      </div>

      {/* آمار نقش‌ها */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(stats.roleStats).map(([role, count]) => (
          <div key={role} className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-semibold">{count}</div>
            <div className="text-xs text-gray-600">
              {getRoleLabel(role)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
