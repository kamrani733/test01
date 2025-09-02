"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { useDrawerStore } from "@/stores/drawerStore";
import { MenuItem } from "@/core/types/menuApi";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";

type SidebarMenuProps = {
  mainItems: MenuItem[];
  introItems: MenuItem[];
  introDescription: string;
  mainDescription: string;
};

export default function PrimaryDrawer({
  mainItems,
  introItems,
  introDescription,
  mainDescription,
}: SidebarMenuProps) {
  const { primaryOpen, setPrimaryOpen, setSecondaryOpen, setSelectedItemId } =
    useDrawerStore();

  function handleClose() {
    setPrimaryOpen(false);
    setSecondaryOpen(false);
  }

  function handleItemClick(id: number) {
    setSelectedItemId(id);
    setSecondaryOpen(true);
  }
  console.log(mainItems);
  

  return (
    <div
      className={`transition-transform no-scrollbar duration-300 ease-in-out bg-white overflow-y-auto pointer-events-auto fixed top-0 h-full z-50 lg:z-70 ${
        primaryOpen
          ? "translate-x-0 w-full lg:w-80 ltr:border-r rtl:border-l"
          : "ltr:-translate-x-full rtl:translate-x-full w-0 lg:w-80"
      } ltr:left-0 rtl:right-0`}
      role="navigation"
      aria-label="Primary navigation drawer"
    >
      <div className="p-4 min-h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Heading level={2} className="text-sm font-semibold text-gray-800">
            {mainDescription}
          </Heading>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main items */}
        <div className="mb-12">
          {mainItems.length > 0 && (
            <ul className="flex flex-col gap-y-3">
              {mainItems.map((item) => (
                <li
                  key={item.id}
                  className="group relative"
                  onMouseEnter={() => {
                    if (
                      window.innerWidth >= 1024 &&
                      item.children?.length > 0
                    ) {
                      handleItemClick(item.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between cursor-pointer min-h-13 group-hover:bg-primary-100 rounded-md p-2">
                    {/* لینک دار بودن Heading */}
                    <Link
                      href={item.link || "#"}
                      className="flex-1"
                      onClick={() => {
                        if (!item.children || item.children.length === 0) {
                          handleClose();
                        }
                      }}
                    >
                      <Heading
                        level={3}
                      >
                        {item.title}
                      </Heading>
                    </Link>

                    {/* اگر آیتم child داشت → دکمه باز کردن */}
                    {item.children && item.children.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleItemClick(item.id)}
                        aria-label={`Open submenu for ${item.title}`}
                        aria-expanded={
                          useDrawerStore.getState().secondaryOpen &&
                          useDrawerStore.getState().selectedItemId === item.id
                        }
                      >
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Intro items */}
        <div>
          {introItems.length > 0 && (
            <div>
              {introDescription && (
                <Heading
                  level={2}
                  className="mb-6 text-sm font-semibold text-gray-800"
                >
                  {introDescription}
                </Heading>
              )}
              <ul className="flex flex-col gap-y-3">
                {introItems.map((item) => (
                  <li key={item.id} onClick={handleClose}>
                    <Link
                      href={item.link || "#"}
                      className="text-gray-700 text-sm hover:bg-gray-100 focus:bg-gray-100 rounded-md p-2 block"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
