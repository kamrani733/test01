'use client';

import { Minus, Plus } from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';

import CustomButton from '@/components/shared/CustomButton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Heading } from '@/components/ui/Heading';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDictionary } from '@/core/hooks/use-dictionary';
import {
  MainShopProduct,
  ProductColor,
} from '@/core/models/shop-product-model';

// اضافه کردن آیکون‌ها

type ProductInformationProps = {
  product: MainShopProduct;
  colors: ProductColor[];
};

export default function ProductInformation({
  product,
  colors,
}: ProductInformationProps) {
  const [openState, setOpenState] = useState({ details: false, sizes: false });

  const { dictionary } = useDictionary();

  return (
    <div className="lg:col-span-1 flex flex-col gap-8 text-primary-900 space-y-6">
      <div className="space-y-3">
        {/* heading */}
        <div>
          <Heading level={1} className="text-base">
            {product.title + ' ' + product.color_title}
          </Heading>
        </div>
        {product.excerpt && (
          <p className="text-sm text-primary-900">{product.excerpt}</p>
        )}
        {product.description && (
          <p className="text-sm text-primary-600">{product.description}</p>
        )}

        {/* color */}
        <div className="flex flex-wrap gap-3 mt-5">
          {colors.map(color => (
            <Tooltip key={color.product_id}>
              <TooltipTrigger asChild>
                <Link href={`/shop/product/${color.product_id}/`}>
                  <div
                    className="w-9 h-9 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-[#C6B8A3] transition-transform hover:scale-110"
                    style={{ backgroundColor: color.color_code }}
                    title={color.color_title}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm text-primary-0">{color.color_title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* detail */}
        <div className="space-y-2">
          {product.meta_fields.length > 0 && (
            <Collapsible
              open={openState.details}
              onOpenChange={open =>
                setOpenState(prev => ({ ...prev, details: open }))
              }
            >
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-semibold text-primary-900">
                  {openState.details ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {dictionary.ui.product.details.show}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {product.meta_fields.map((item, index) => (
                  <p key={index} className="text-sm text-primary-600">
                    {item.label}: {item.value}
                  </p>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          <Collapsible
            open={openState.sizes}
            onOpenChange={open =>
              setOpenState(prev => ({ ...prev, sizes: open }))
            }
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-semibold text-primary-900">
                {openState.sizes ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {dictionary.ui.product.sizes.show}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {product.fabric_area && (
                <p className="text-sm text-primary-600">
                  {dictionary.forms.fabric_area} :{' '}
                  <span>{product.fabric_area}</span>
                </p>
              )}

              {product.weight && (
                <p className="text-sm text-primary-600">
                  {dictionary.forms.weight} : <span>{product.weight}</span>
                </p>
              )}
              {product.overalsize && (
                <p className="text-sm text-primary-600">
                  {dictionary.forms.overalsize} :{' '}
                  <span>{product.overalsize}</span>
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* price and button */}
      <div>
        <div className="flex gap-2 items-center mb-4">
          <Heading level={2}>
            {product.price + ' ' + dictionary.ui.product.currency}
          </Heading>
        </div>

        <CustomButton size="full" disabled={product.inventory <= 0}>
          {product.inventory > 0
            ? dictionary.ui.product.addToCart
            : dictionary.ui.product.noInventory}
        </CustomButton>
        {product.description && (
          <p className="text-sm text-primary-600 mt-4">{product.description}</p>
        )}
      </div>
    </div>
  );
}
