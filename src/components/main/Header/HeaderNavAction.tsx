import { User, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function HeaderNavAction() {
  return (
    <div className="flex justify-end items-center gap-3.5 w-5/12">
      <Link 
        href={'/login'} 
        aria-label="User profile"
        className="p-2 rounded-full hover:bg-[#8B6F47]/10 transition-colors duration-300 group"
      >
        <User className="w-5 h-5 stroke-1 text-[#2F2F2F] group-hover:text-[#8B6F47] transition-colors duration-300" />
      </Link>
      <Link 
        href={'/cart'}
        className="p-2 rounded-full hover:bg-[#8B6F47]/10 transition-colors duration-300 group relative"
      >
        <ShoppingCart className="w-5 h-5 stroke-1 text-[#2F2F2F] group-hover:text-[#8B6F47] transition-colors duration-300" />
        {/* Cart badge - you can add dynamic count here */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B6F47] text-white text-xs rounded-full flex items-center justify-center font-medium">
          0
        </span>
      </Link>
      <button className="p-2 rounded-full hover:bg-[#8B6F47]/10 transition-colors duration-300 group">
        <Search className="w-5 h-5 stroke-1 text-[#2F2F2F] group-hover:text-[#8B6F47] transition-colors duration-300" />
      </button>
    </div>
  );
}
