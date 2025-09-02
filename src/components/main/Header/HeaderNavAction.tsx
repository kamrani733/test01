import { User, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function HeaderNavAction() {
  return (
    <div className="flex justify-end items-center gap-3.5 w-5/12">
      <Link href={'/login'} aria-label="User profile">
        <User className="w-5 h-5 stroke-1" />
      </Link>
      <Link href={'/cart'}>
        <ShoppingCart className="w-5 h-5 stroke-1" />
      </Link>
      <button>
        <Search className="w-5 h-5 stroke-1" />
      </button>
    </div>
  );
}
