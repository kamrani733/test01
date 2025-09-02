import Image from "next/image";
import image1 from "@/assets/images/dummy.jpg";

export default function DisplayImages() {
  return (
    <figure className="col-span-6 lg:col-span-4">
      <Image src={image1} alt="some image" className="w-full h-full" />
    </figure>
  );
}
