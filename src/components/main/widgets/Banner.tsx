import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { BannerData } from "@/core/types/about-us";
import CustomButton from "@/components/shared/CustomButton";

interface BannerProps {
  data: BannerData;
}

export function Banner({ data }: BannerProps) {
  console.log(data);

  const Content = (
    <div className="relative w-full h-56 lg:h-60 flex items-center justify-center p-8 overflow-hidden rounded-lg">
      {data.image_info && (
        <Image
          src={data.image_info?.url}
          alt={data.title || "some picture"}
          className="absolute w-full h-full object-cover"
          fill
        />
      )}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="absolute text-center z-10">
        <Heading
          level={1}
          className="text-white text-[calc(1.2rem+0.3vw)] font-serif"
        >
          {data.title}
        </Heading>
        {data.buttonContent && <CustomButton variant="black" asChild>
          <Link href={data.link}>{data.buttonContent}</Link>
        </CustomButton>}
      </div>
    </div>
  );

  return data.link ? (
    <Link href={data.link} className="block">
      {Content}
    </Link>
  ) : (
    Content
  );
}
