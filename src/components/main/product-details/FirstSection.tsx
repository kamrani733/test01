import Selecting from "./Selecting";
import CustomButton from "@/components/shared/CustomButton";
import Link from "next/link";
import DisplayImages from "./DisplayImages";

interface InfoProps {
  id: number;
  title: string;
  description: string;
}

const info: InfoProps[] = [
  { id: 1, title: "سایز", description: "45×160 سانتی متر" },
  { id: 2, title: "لوازم خانگی", description: "پارچه راولو رز گرد و خاکی" },
];

export default function FirstSection() {
  return (
    <div className="grid grid-cols-6 gap-10">
      <DisplayImages />
      <section className="col-span-6 lg:col-span-2 flex flex-col gap-14">
        <header>
          <p className="text-primary-600">توضیحات محصول</p>
          <p className="text-primary-600">Nawabari ottoman, small</p>
        </header>

        <div>
          <p className="text-primary-600 mb-3">طراحی خود را انتخاب کنید</p>
          <div className="flex flex-col gap-3 mb-3">
            <Selecting />
            <Selecting />
          </div>

          <div className="flex flex-col gap-4">
            {info.map((item) => (
              <div
                key={item.id}
                className="text-primary-600 flex gap-5 select-none"
              >
                <p>{item.title}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-primary-600 mb-6">
            <div className="flex gap-2">
              <p>قیمت فعلی</p>
              <p className="">$899.00</p>
            </div>
            <p className="bg-green-100 px-2 rounded-sm">انتخاب مدیر</p>
          </div>

          <CustomButton className="mb-3">افزودن به سبد خرید</CustomButton>
          <div className="flex justify-between text-primary-600 mb-6">
            <div className="flex gap-4">
              <p>زمان تحویل مورد انتظار :</p>
              <p>هفته 12-10</p>
            </div>
            <Link href={"#"}>دیدن جزئیات بیشتر محصول</Link>
          </div>
          <p className="text-primary-600">
            کیفیت زمان می‌برد - بیشتر مبلمان ما سفارشی ساخته می‌شوند و با دقت و
            ظرافت، دقیقاً برای شما ساخته می‌شوند
          </p>
        </div>
      </section>
    </div>
  );
}
