"use client";
import type * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  UserCircle,
  FileCog,
  Key,
  Store,
  NotebookPen,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useDirection } from "@/core/hooks/use-direction";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import Image from "next/image";
import { Heading } from "../ui/Heading";
import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import ChangePasswordForm from "./form/ChangePasswordForm";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { lang } = props;
  const direction = useDirection(lang ?? "fa");
  const { dictionary } = useDictionary();
  const { hasPermission, clearAuth } = useAuth();
  const accessUsersUl = hasPermission(
    ["AccessUsers", "AccessRoles", "AccessPermissions"],
    "any"
  );
  const accessWidgetsUl = hasPermission(
    ["AccessSliders", "AccessMenus"],
    "any"
  );
  const { state } = useAuth();
  const settingSection = accessUsersUl || accessWidgetsUl;
  const data = {
    user: {
      name: state.user?.full_name || dictionary.common.noname,
      mobile: state.user?.mobile,
      avatar: state.user?.avatar,
      id: state.user?.id,
    },
    settings: [
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.users
            : dictionary.nav.users + dictionary.nav.management,
        url: "#",
        icon: User,
        access: accessUsersUl,
        items: [
          {
            title: dictionary.nav.roles,
            url: "/admin/roles",
            access: hasPermission("AccessRoles"),
          },
          {
            title: dictionary.nav.permissions,
            url: "/admin/permissions",
            access: hasPermission("AccessPermissions"),
          },
          {
            title: dictionary.nav.users,
            url: "/admin/users",
            access: hasPermission("AccessUsers"),
          },
        ],
      },
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.widgets
            : dictionary.nav.widgets + dictionary.nav.management,
        url: "#",
        icon: FileCog,
        access: accessWidgetsUl,
        items: [
          {
            title: dictionary.nav.sliders,
            url: "/admin/sliders",
            access: hasPermission("AccessSliders"),
          },
          {
            title: dictionary.nav.menus,
            url: "/admin/menus",
            access: hasPermission("AccessMenus"),
          },
          {
            title: dictionary.nav.homewidgets,
            url: "/admin/widgets",
            access: hasPermission("AccessWidgets"),
          },
          {
            title: dictionary.nav.socialMedia,
            url: "/admin/socials",
            access: hasPermission("AccessWidgetSocialMedia"),
          },
        ],
      },
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.site
            : dictionary.nav.site + dictionary.nav.management,
        url: "/admin/settings",
        icon: User,
        access: hasPermission("AccessSettings"),
      },
    ],
    shop: [
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.shop
            : dictionary.nav.shop + dictionary.nav.management,
        url: "#",
        icon: Store,
        access: accessUsersUl,
        items: [
          {
            title: dictionary.nav.tags,
            url: "/admin/shop/tags",
            access: hasPermission("AccessShopTags"),
          },
          {
            title: dictionary.nav.groups,
            url: "/admin/shop/groups",
            access: hasPermission("AccessShopTags"),
          },
          {
            title: dictionary.nav.categories,
            url: "/admin/shop/categories",
            access: hasPermission("AccessShopCategory"),
          },
          {
            title: dictionary.nav.products,
            url: "/admin/shop/products",
            access: hasPermission("AccessShopProducts"),
          },
          {
            title: dictionary.nav.colors,
            url: "/admin/shop/colors",
            access: hasPermission("AccessShopColor"),
          },
          {
            title: dictionary.nav.inventories,
            url: "/admin/shop/inventories",
            access: hasPermission("AccessShopInventories"),
          },
          {
            title: dictionary.nav.stores,
            url: "/admin/shop/stores",
            access: hasPermission("AccessShopStores"),
          },
        ],
      },
    ],
    pages: [
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.pages
            : dictionary.nav.pages + dictionary.nav.management,
        url: "/admin/pages",
        icon: NotebookPen,
        access: hasPermission("AccessPagePage"),
      },
    ],
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props} side={direction}>
        <SidebarHeader className="border-b-1 border-primary-200">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex relative aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {data.user.avatar ? (
                        <Image
                          src={data.user.avatar}
                          alt={data.user.name}
                          fill
                          className="absolute object-cover rounded-full scale-130"
                        />
                      ) : (
                        <User className="size-4" />
                      )}
                    </div>
                    <div className="grid flex-1 text-start ms-1 text-sm leading-tight">
                      <Heading className="mb-2" level={4}>
                        {data.user.name}
                      </Heading>
                      <span className="truncate text-xs">
                        {data.user.mobile}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] text-right min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem>
                    <Link
                      className="w-full"
                      href={`/admin/users/edit/${data.user.id}`}
                    >
                      {dictionary.forms.profile}
                    </Link>
                    <UserCircle className="size-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
                    {dictionary.forms.changePassword}
                    <Key className="size-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => clearAuth()}>
                    {dictionary.common.logout}
                    <LogOut className="size-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* settings Section */}
          {settingSection && (
            <SidebarGroup>
              <SidebarGroupLabel>{dictionary.nav.settings}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.settings.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      {item.access && item.items?.length ? (
                        <Collapsible
                          asChild
                          defaultOpen={item.name === "Website Redesign"}
                          className="group/collapsible"
                        >
                          <div>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.name}>
                                <item.icon />
                                <span>{item.name}</span>
                                <ChevronRight
                                  className={`ms-auto ${
                                    direction === "right" && "rotate-180"
                                  } transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                                />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub side={direction}>
                                {item.items.map((subItem) =>
                                  subItem.access ? (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton asChild>
                                        <a href={subItem.url}>
                                          <span>{subItem.title}</span>
                                        </a>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ) : null
                                )}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ) : (
                        item.access && (
                          <SidebarMenuButton asChild tooltip={item.name}>
                            <a href={item.url}>
                              <item.icon />
                              <span>{item.name}</span>
                            </a>
                          </SidebarMenuButton>
                        )
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {/* shop Section */}
          <SidebarGroup>
            <SidebarGroupLabel>{dictionary.nav.shop}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.shop.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    {item.access && item.items?.length ? (
                      <Collapsible
                        asChild
                        defaultOpen={item.name === "Website Redesign"}
                        className="group/collapsible"
                      >
                        <div>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.name}>
                              <item.icon />
                              <span>{item.name}</span>
                              <ChevronRight
                                className={`ms-auto ${
                                  direction === "right" && "rotate-180"
                                } transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub side={direction}>
                              {item.items.map((subItem) =>
                                subItem.access ? (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <a href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ) : null
                              )}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ) : (
                      item.access && (
                        <SidebarMenuButton asChild tooltip={item.name}>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      )
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* pages Section */}
          <SidebarGroup>
            <SidebarGroupLabel>{dictionary.nav.pages}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.pages.map((item) =>
                  item.access ? (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild tooltip={item.name}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.delete}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.deleteItemDescription}
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onSuccess={() => {
              setPasswordOpen(false);
            }}
            passwordToEditId={state?.user?.id}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
