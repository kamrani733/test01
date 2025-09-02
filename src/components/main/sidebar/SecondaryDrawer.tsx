"use client";

import { Button } from "@/components/ui/button";
import { useDrawerStore } from "@/stores/drawerStore";

export default function SecondaryDrawer() {
  const { primaryOpen, secondaryOpen, setSecondaryOpen } = useDrawerStore();

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-gray-200 border-r border-gray-300 overflow-hidden pointer-events-auto ${
        primaryOpen && secondaryOpen ? "w-64" : "w-0"
      }`}
    >
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Secondary Drawer</h2>
          <Button variant="ghost" onClick={() => setSecondaryOpen(false)}>
            Close
          </Button>
        </div>
        <p>Content for the selected item goes here.</p>
        {/* Add dynamic content based on selected item if needed */}
      </div>
    </div>
  );
}
