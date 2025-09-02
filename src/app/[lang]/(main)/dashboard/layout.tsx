"use client";

import DashboardNav from "@/components/dashboard/DashboardNav";
import Container from "@/components/shared/Container";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Container className="grid grid-cols-6 gap-20 pt-20">
      <div className="col-span-1">
        <DashboardNav />
      </div>
      <div className="col-span-5">{children}</div>
    </Container>
  );
}
