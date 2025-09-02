import { Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';

import CustomButton from '../shared/CustomButton';
import { Heading } from '../ui/Heading';

interface OrderSummaryProps {
  subtotal: number;
  delivery: number;
  total: number;
}

export function OrderSummary({ subtotal, delivery, total }: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-gray-50 p-4 space-y-6">
      <Heading level={2}>جزییات سفارش</Heading>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>قیمت </span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>هزینه ارسال</span>
          <span>{delivery === 0 ? '-' : formatPrice(delivery)}</span>
        </div>

        <hr className="border-gray-300" />

        <Heading level={3} className="text-primary-900">
          <span>جمع سبد خرید</span>
          <span>{formatPrice(total)}</span>
        </Heading>
      </div>

      <CustomButton
        variant="black"
        className="w-full h-11 text-base bg-primary-900 text-white py-3"
      >
        ادامه
      </CustomButton>
    </div>
  );
}
