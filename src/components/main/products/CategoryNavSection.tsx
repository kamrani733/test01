import { getCategories } from "@/core/lib/api/main/main-shop-product";
import { CategoryNav } from "./CategoryNav";

export default async function CategoryNavSection({
  activeSlug,
}: {
  activeSlug: string;
}) {
  const categories = await getCategories();
  return <CategoryNav categories={categories.data} activeSlug={activeSlug} />;
}
