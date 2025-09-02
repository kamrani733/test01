import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SupportInformationProps = {
  id: number;
  title: string;
  description: string;
  value: string;
};

const SupportInformationItems: SupportInformationProps[] = [
  {
    id: 1,
    title: "با طراحان داخلی ما در ارتباط باشید",
    description:
      "لورم ایپسون گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، ",
    value: "item-1",
  },
  {
    id: 2,
    title: "تماس با فروشگاه ارم هوم",
    description:
      "لورم ایپسون گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، ",
    value: "item-2",
  },
  {
    id: 3,
    title: "خدمات مشتری",
    description:
      "لورم ایپسون گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، ",
    value: "item-3",
  },
  {
    id: 4,
    title: "به دنبال شغلی با ما هستید؟",
    description:
      "لورم ایپسون گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، ",
    value: "item-4",
  },
];

export default function SupportInformation() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {SupportInformationItems.map((item) => (
        <AccordionItem value={item.value} key={item.id}>
          <AccordionTrigger className="hover:no-underline cursor-pointer text-[#2F2F2F] font-serif">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-[#525252] leading-relaxed">
            {item.description}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
