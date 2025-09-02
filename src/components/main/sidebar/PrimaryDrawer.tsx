"use client";

import { Button } from "@/components/ui/button";
import { useDrawerStore } from "@/stores/drawerStore";

export default function PrimaryDrawer() {
  const { primaryOpen, setPrimaryOpen, setSecondaryOpen } = useDrawerStore();

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-gray-100 border-r border-gray-200 overflow-hidden pointer-events-auto ${
        primaryOpen ? "w-64" : "w-0"
      }`}
    >
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Primary Drawer</h2>
          <Button
            variant="ghost"
            onClick={() => {
              setPrimaryOpen(false);
              setSecondaryOpen(false);
            }}
          >
            Close
          </Button>
        </div>
        <ul className="space-y-2">
          <li>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSecondaryOpen(true)}
            >
              Item 1
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setSecondaryOpen(true)}
            >
              Item 2
            </Button>
          </li>
          {/* Add more items as needed */}
        </ul>
      </div>
    </div>
  );
}
