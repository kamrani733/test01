"use client";

import React from "react";
import Link from "next/link";
import CustomButton from "@/components/shared/CustomButton";

interface Category {
  label: string;
  value: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeSlug: string;
}

function CategoryNavComponent({ categories, activeSlug }: CategoryNavProps) {
  const allCategories = React.useMemo(
    () => [{ label: "همه", value: "all" }, ...categories],
    [categories]
  );

  return (
    <nav className="flex gap-4 overflow-x-auto py-8 border-y-1 border-gray-200 mb-8">
      {allCategories.map(({ label, value }) => {
        const isActive = activeSlug === value;
        console.log(activeSlug);

        return (
          <CustomButton
            asChild
            key={value}
            variant={isActive ? "black" : "outline"}
          >
            <Link href={`/shop/category/products/${value}`}>{label}</Link>
          </CustomButton>
        );
      })}
    </nav>
  );
}

export const CategoryNav = React.memo(CategoryNavComponent);
