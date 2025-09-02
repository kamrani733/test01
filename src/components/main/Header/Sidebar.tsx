"use client";
import { MenuItem } from "@/core/types/menuApi";
import { useDrawerStore } from "@/stores/drawerStore";
import PrimaryDrawer from "./PrimaryDrawer";
import SecondaryDrawer from "./SecondaryDrawer";
import { useEffect } from "react";

type SidebarContentProps = {
  mainItems: MenuItem[];
  mainDescription: string;
  introItems: MenuItem[];
  introDescription: string;
};

export default function Sidebar({
  mainItems,
  mainDescription,
  introItems,
  introDescription,
}: SidebarContentProps) {
  const { primaryOpen, secondaryOpen , setPrimaryOpen, setSecondaryOpen, selectedItemId } =
    useDrawerStore();
  const selectedItem = mainItems.find((item) => item.id === selectedItemId);

  useEffect(() => {
    if (primaryOpen || secondaryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [primaryOpen , secondaryOpen]);

  return (
    <div className="relative">
      {primaryOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out"
   
         
          onClick={() => {
            setPrimaryOpen(false);
            setSecondaryOpen(false);
          }}
          aria-hidden="true"
        />
      )}
      <div
        className="fixed top-0 h-full no-scrollbar flex z-50 pointer-events-none w-full ltr:left-0 rtl:right-0"
      >
        <PrimaryDrawer
          mainDescription={mainDescription}
          mainItems={mainItems}
          introItems={introItems}
          introDescription={introDescription}
        />
        <SecondaryDrawer selectedItem={selectedItem} />
      </div>
    </div>
  );
}