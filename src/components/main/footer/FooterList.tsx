import { Heading } from "@/components/ui/Heading";
import { MenuItem } from "@/core/types/menuApi";
import Link from "next/link";

type FooterListProps = {
  footerItems: MenuItem[];
};

export default function FooterList({ footerItems }: FooterListProps) {
  return (
    <div className="grid grid-cols-4 space-y-8">
      {footerItems.map((item) => (
        <div
          key={item.id}
          className="col-span-4 px-3 lg:col-span-1 md:col-span-2"
        >
          <Heading level={4} className="mb-3 text-[#F5F5F5]">
            {item.title}
          </Heading>
          <ul className="space-y-1">
            {item.children!.map((child) => (
              <li key={child.id}>
                <Link 
                  href={item.link} 
                  className="text-[#D4A373] hover:text-[#F5F5F5] transition-colors duration-300 text-xs"
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
