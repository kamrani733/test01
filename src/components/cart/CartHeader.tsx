import { getDictionaryServer } from '@/core/lib/dictionary';

import { Heading } from '../ui/Heading';

interface CartHeaderProps {
  itemCount: number;
}

export default async function CartHeader({ itemCount }: CartHeaderProps) {
  const { dictionary } = await getDictionaryServer();
  return (
    <div className="px-6 py-4">
      <Heading level={1}>
        {dictionary.ui.cart.title}
        <span className="text-xs text-primary-500">({itemCount})</span>
      </Heading>
    </div>
  );
}
