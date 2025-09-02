import { getSliderByCategory } from "@/core/lib/api/main/main-shop-product";
import BannerSlider from "../widgets/BannerSlider";

export default async function SliderSection({ slug }: { slug: string }) {
  const slides = await getSliderByCategory(slug);
  console.log(slides);

  return <BannerSlider slides={slides.data} varient="short" />;
}
