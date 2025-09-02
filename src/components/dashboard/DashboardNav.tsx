"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const info = [
  { id: 1, label: "پنل ادمین", url: "/admin" },
  { id: 2, label: "حساب کاربری", url: "/dashboard/profile" },
  { id: 3, label: "صورتحساب", url: "#" },
  { id: 4, label: "رمز عبور", url: "/dashboard/password" },
  { id: 5, label: "خروج", type: "logout" },
];

export default function DashboardNav() {
  const { clearAuth } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <nav className="flex flex-col gap-5">
      {info.map((item) =>
        item.type === "logout" ? (
          <Button variant="outline" key={item.id} onClick={handleLogout}>
            {item.label}
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            key={item.id}
            disabled={item.label === "صورتحساب"}
            className={`${
              item.label === "صورتحساب" ? "cursor-not-allowed" : ""
            }`}
          >
            <Link href={item.url ?? "#"}>{item.label}</Link>
          </Button>
        )
      )}
    </nav>
  );
}
