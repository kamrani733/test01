import { MenuItem } from "@/core/types/menuApi";
import Link from "next/link";

type FooterListProps = {
  footerItems: MenuItem[];
};

export default function FooterList({ footerItems }: FooterListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {footerItems.map((item) => (
        <div key={item.id} className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-[#D4A373]">
            {item.title}
          </h4>
          <ul className="space-y-2">
            {item.children && item.children.length > 0 ? (
              item.children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={child.link}
                    className="text-sm text-[#E8E8E8] hover:text-[#D4A373] transition-colors duration-200"
                  >
                    {child.title}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link
                  href={item.link}
                  className="text-sm text-[#E8E8E8] hover:text-[#D4A373] transition-colors duration-200"
                >
                  {item.title}
                </Link>
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
