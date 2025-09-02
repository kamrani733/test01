import { getMainMenu } from "@/core/lib/api/main/menu-api";
import { MenuItem } from "@/core/types/menuApi";
import Link from "next/link";

export default async function HeaderNavMenu() {
  const mainMenu: MenuItem[] = await getMainMenu();

  return (
    <nav className="gap-8 menu-links hidden lg:flex">
      {mainMenu.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="text-sm font-medium text-[#2F2F2F] hover:text-[#8B6F47] transition-colors duration-300 relative group"
        >
          {item.title}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B6F47] transition-all duration-300 group-hover:w-full"></span>
        </Link>
      ))}
    </nav>
  );
}
