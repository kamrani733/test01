"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { MenuItem } from "@/core/types/menuApi";
import { useDrawerStore } from "@/stores/drawerStore";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SidebarDetailsProps = {
  selectedItem?: MenuItem;
};

export default function SecondaryDrawer({ selectedItem }: SidebarDetailsProps) {
  const { primaryOpen, secondaryOpen, setSecondaryOpen, setPrimaryOpen } =
    useDrawerStore();

  const sortedChildren = [...(selectedItem?.children ?? [])].sort((a, b) => {
    if (a.imageUrl && !b.imageUrl) return 1;
    if (!a.imageUrl && b.imageUrl) return -1;
    return 0;
  });

  function handleClose() {
    setSecondaryOpen(false);
    setPrimaryOpen(false);
  }

  return (
    <div
      className={`
    transition-all no-scrollbar duration-300 ease-in-out bg-white overflow-y-auto
    fixed top-0 h-full z-60
    w-full lg:w-80 
    ltr:left-0 rtl:right-0 
    lg:ltr:left-80 lg:rtl:right-80
    ltr:border-r rtl:border-l
    ${primaryOpen && secondaryOpen
      ? "translate-x-0 opacity-100 pointer-events-auto"
      : "ltr:-translate-x-full rtl:translate-x-full opacity-0 pointer-events-none"
    }
  `}
  role="navigation"
  aria-label="Secondary navigation drawer"
    >
      <div className="p-4 min-h-full">
        {selectedItem ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="ghost"  
                size="icon"
                onClick={() => setSecondaryOpen(false)}
                aria-label="Back to primary drawer"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </Button>
              <Heading level={2} className="text-sm font-semibold text-gray-800">
                {selectedItem.title}
              </Heading>
            </div>
            <ul className="flex flex-col gap-y-3">
              {sortedChildren.map((child) => (
                <li key={child.id} onClick={handleClose}>
                  <Link
                    href={child.link}
                    className="flex items-center gap-x-3 gap-y-3 hover:bg-gray-100 focus:bg-gray-100 rounded-md p-2"
                  >
                    {child.imageUrl && (
                      <Image
                        src={child.imageUrl}
                        alt={child.imageName ?? "Untitled image"}
                        height={150}
                        width={200}
                        className="w-20 h-12 rounded-sm object-contain bg-gray-100 p-1"
                      />
                    )}
                    <Heading level={3} className="text-sm font-medium text-gray-700">
                      {child.title}
                    </Heading>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}