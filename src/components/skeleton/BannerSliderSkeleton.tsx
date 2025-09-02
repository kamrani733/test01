// components/shared/BannerSliderSkeleton.tsx
export function BannerSliderSkeleton({
  varient = "full",
}: {
  varient?: "full" | "short";
}) {
  return (
    <div
      className={`${
        varient === "full" ? "h-[calc(100vh-4.5rem)]" : "aspect-[16/9]"
      } w-full bg-gray-200 animate-pulse rounded-none`}
    />
  );
}
