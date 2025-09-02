import { Button } from "@/components/ui/button";

interface CategoriesListProps {
  id: number;
  label: string;
}

const categoriesList: CategoriesListProps[] = [
  { id: 1, label: "دسته بندی 1" },
  { id: 2, label: "دسته بندی 2" },
  { id: 3, label: "دسته بندی 3" },
  { id: 4, label: "دسته بندی 4" },
  { id: 5, label: "دسته بندی 5" },
  { id: 6, label: "دسته بندی 6" },
  { id: 7, label: "دسته بندی 7" },
];

export default function ProductsHeader() {
  return (
    <header className="flex justify-between items-center mb-16">
      <div className="flex items-center gap-x-3">
        <Button className="px-15 bg-[#8B6F47] text-white hover:bg-[#D4A373]">فیلترها</Button>
        <div className="flex gap-x-4">
          {categoriesList.map((item) => (
            <Button variant={"outline"} key={item.id} className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white">
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      <p className="text-[#525252]">9 مورد</p>
    </header>
  );
}
