import { Heading } from "@/components/ui/Heading";
import Image from "next/image";
import Link from "next/link";

export function PostBar({ data }) {  
  return (
    <div>
      <div className="mb-3 lg:text-center">
        <Heading level={2} className="mb-1">
          {data.title}
        </Heading>
        <Heading level={3}>{data.subtitle}</Heading>
        <p className="text-[#525252]">{data.description}</p>
      </div>

      <div className="grid gap-y-5 md:grid-cols-2 md:gap-x-8 space-y-2">
        {data.items.map((item) => {
          const content = (
            <div key={item.title}>
              {item.image_info && (
                <div className="relative h-138 mb-2 overflow-hidden rounded-lg bg-[#F5F5F5]">
                  <Image
                    src={item.image_info?.url}
                    alt={item.title}
                    className="mb-3 md:mb-4 object-cover"
                    fill
                  />
                </div>
              )}
              <Heading className="mt-3" level={3}>{item.title}</Heading>
              <Heading level={4}>{item.subtitle}</Heading>
              <p className="text-[#525252]">{item.description}</p>
            </div>
          );

          return item.link ? (
            <Link href={item.link} key={item.title}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
}
