import { Heading } from "@/components/ui/Heading";
import image1 from "@/assets/images/dummy.jpg";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const info: string[] = ["جزئیات محصول", "اندازه ها", "سوال دارید؟"];

interface SubInfoProps {
  id: number;
  title: string;
  description: string;
}

const subInfo: SubInfoProps[] = [
  {
    id: 1,
    title: "الهام گرفته از هر صحافی ژاپنی",
    description:
      "«ناواباری از هنر ژاپنیِ بستن با طناب برای ایجاد پیوندهای محکم الهام گرفته شده است. «ناوا» در زبان ژاپنی به معنای طناب است و اصطلاح «ناواباری» به طور سنتی به معنای طناب کشیدن ترجمه می‌شود.»",
  },
  {
    id: 2,
    title: "طراحی فانتزی",
    description:
      "این ساعت مدرن، همانقدر که ارگانیک است، مجسمه‌گونه نیز هست و حس مدرن بودن را به هر فضایی می‌آورد.",
  },
  {
    id: 3,
    title: "پایه های  سه گانه",
    description:
      "هر یک از سه‌پایه‌ها با زاویه‌ای ایده‌آل گسترده شده‌اند تا وزن ساعت-دوربین را با وقار تحمل کنند",
  },
];

export default function ThirdSection() {
  return (
    <div className="">
      <div className="grid lg:grid-cols-2 gap-6 mb-4 lg:mb-10">
        <Heading level={2}>
          ساعت ایستاده با پایه های زیبا در هر فضایی توجه را به خود جلب می‌کند.
        </Heading>
        <div className="flex flex-col gap-4">
          {info.map((item, index) => (
            <Link
              key={index}
              href={"#"}
              className="bg-primary-100 px-3 py-2 lg:py-4 rounded-sm flex justify-between"
            >
              <p className="text-primary-600">{item}</p>
              <ChevronLeft className="stroke-1" />
            </Link>
          ))}
        </div>
      </div>
      <figure className="mb-6">
        <Image
          src={image1}
          alt="some image"
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="grid lg:grid-cols-3 gap-3">
        {subInfo.map((item) => (
          <div key={item.id} className="bg-primary-100 p-4">
            <Heading level={3} className="mb-3">
              {item.title}
            </Heading>
            <p className="text-primary-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
