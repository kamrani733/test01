'use client';

import { ArrowDown, ArrowUp, X } from 'lucide-react';
import {
  FieldPath,
  FieldValues,
  UseFieldArrayMove,
  UseFormSetValue,
} from 'react-hook-form';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/Heading';

// تطابق با تایپ‌های SliderItem در CreateEditSliderForm
interface SliderItemImage {
  id: number;
  url?: string;
  name?: string;
}
interface SliderItem {
  id?: number;
  title: string;
  title_en?: string;
  title_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  link?: string;
  buttonContent?: string;
  priority: number;
  image?: number;
  image_info?: SliderItemImage;
}

interface FormSectionProps<TFormValues extends FieldValues, TItem> {
  title: string;
  children: ReactNode;
  index?: number;
  fieldsLength?: number;
  move?: UseFieldArrayMove;
  setItemImageIds?: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  setValue?: UseFormSetValue<TFormValues>;
  defaultItems?: TItem[]; // ← حالا به صورت مجزا تایپ میشه
  onRemove?: () => void;
}

export default function FormSection<TFormValues extends FieldValues, TItem>({
  title,
  children,
  index,
  fieldsLength,
  move,
  setItemImageIds,
  setValue,
  defaultItems,
  onRemove,
}: FormSectionProps<TFormValues, TItem>) {
  const moveItem = (direction: 'up' | 'down') => {
    if (
      index === undefined ||
      fieldsLength === undefined ||
      move === undefined ||
      setValue === undefined
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fieldsLength) return;

    // 1) جابه‌جایی در react-hook-form
    move(index, newIndex);

    // 2) جابه‌جایی imageId در state موقت
    if (setItemImageIds) {
      setItemImageIds(prev => {
        const newIds = [...prev];
        [newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]];
        return newIds;
      });
    }

    // 3) جابه‌جایی اطلاعات تصویر در defaultItems برای FileUploadInput
    if (defaultItems) {
      [defaultItems[index], defaultItems[newIndex]] = [
        defaultItems[newIndex],
        defaultItems[index],
      ];
    }

    // 4) به‌روزرسانی priority برای همهٔ آیتم‌ها
    for (let i = 0; i < fieldsLength; i++) {
      const fieldPath: FieldPath<TFormValues> =
        `items.${i}.priority` as FieldPath<TFormValues>;
      // @ts-expect-error – dynamic path
      setValue(fieldPath, i + 1);
    }
  };

  return (
    <div className="bg-primary-100 p-4 rounded-sm border">
      <div className="flex justify-between items-center mb-2">
        <Heading level={3}>{title}</Heading>
        <div className="flex gap-2">
          {index !== undefined && index > 0 && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => moveItem('up')}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {index !== undefined &&
            fieldsLength !== undefined &&
            index < fieldsLength - 1 && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => moveItem('down')}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          {onRemove && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
