

import { Heading } from '../ui/Heading';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isNew?: boolean;
    details: {
      leg: string;
      upholstery: string;
    };
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="relative flex gap-6 px-2 py-6 bg-gray-50">
      <div className="flex-shrink-0 ">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="w-48 h-32 object-cover rounded-md"
        />
      </div>

      <div className="flex-1">
        <div className="space-y-3 h-6/10">
          <Heading level={2}>{item.name}</Heading>
          <Heading level={2} variant="secondary" className="text-primary-900">
            {formatPrice(item.price)}
          </Heading>
        </div>
        <div className="border-t-1 h-4/10 border-t-primary-200">
          کد محصول : 13241324
        </div>
      </div>
    </div>
  );
}
