import BannerSlider from "@/components/main/widgets/BannerSlider";
import WidgetsRender from "@/components/main/widgets/WidgetsRender";
import { getHomeSliderMain } from "@/core/lib/api/main/landing";
import { getWidgets } from "@/core/lib/getWidgets";
import { SliderItemFrom } from "@/core/models/slider-model";

export default async function page() {
  const slides: SliderItemFrom[] = await getHomeSliderMain();
  const widgets = await getWidgets();

  return (
    <>
      <BannerSlider slides={slides} />
      <WidgetsRender widgets={widgets} />
    </>
  );
}
