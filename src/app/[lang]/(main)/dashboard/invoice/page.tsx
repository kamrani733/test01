import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const buttonLabel = ["بازه ی زمانی", "وضعیت پرداخت", "مشخصات مشتری"];

export default function InvoicePage() {
  return (
    <section className="col-span-5">
      <div className="flex justify-between">
        <p className="text-primary-600">صورتحساب ها</p>
        <Button variant={"secondary"}>خروجی اکسل</Button>
      </div>
      <Separator className="bg-primary-600" />
      <div className="flex gap-4">
        {buttonLabel.map((item, index) => (
          <Button key={index} variant={"secondary"}>
            {item}
          </Button>
        ))}
      </div>
    </section>
  );
}
