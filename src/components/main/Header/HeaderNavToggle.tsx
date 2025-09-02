
"use client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useDrawerStore } from "@/stores/drawerStore";

export default function HeaderNavToggle() {
  const { primaryOpen, setPrimaryOpen } = useDrawerStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setPrimaryOpen(!primaryOpen)}
      aria-label={primaryOpen ? "Close menu" : "Open menu"}
      className="text-gray-800 hover:bg-gray-100"
    >
      <Menu className="w-6 h-6" />
    </Button>
  );
}
