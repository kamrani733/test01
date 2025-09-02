import Image from 'next/image';
import HeaderNavMenu from './HeaderNavMenu';
import HeaderNavAction from './HeaderNavAction';
import HeaderNavToggle from './HeaderNavToggle';
import { MenuResponseData } from '@/core/types/menuApi';
import {
  getSidebarMainMenu,
  getSidebarSecondaryMenu,
} from '@/core/lib/api/main/menu-api';
import Sidebar from './Sidebar';
import Link from 'next/link';
import { getSettings } from '@/core/lib/api/main/setting';

export default async function Header() {
  const setting = await getSettings();
  const menuItemsData: MenuResponseData = await getSidebarMainMenu();
  const introductionSidebarData: MenuResponseData =
    await getSidebarSecondaryMenu();

  return (
    <>
      <header className="sticky top-0 z-50 h-18 bg-white text-[#2F2F2F] flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12 shadow-sm border-b border-[#E8E8E8]">
        <div className="flex items-center gap-5 w-5/12">
          <HeaderNavToggle />
          <HeaderNavMenu />
        </div>
        <Link
          href="/"
          className="flex items-center justify-center h-full w-2/12"
        >
          <Image
            src={setting.logo_mobile}
            alt={setting.site_title}
            width={40}
            height={40}
            className="object-contain lg:hidden"
          />
          <Image
            src={setting.logo_desktop}
            alt={setting.site_title}
            width={140}
            height={70}
            className="object-contain hidden lg:flex"
          />
        </Link>
        <HeaderNavAction />
      </header>
      <Sidebar
        mainItems={menuItemsData.items}
        mainDescription={menuItemsData.description}
        introItems={introductionSidebarData.items}
        introDescription={introductionSidebarData.description}
      />
    </>
  );
}
