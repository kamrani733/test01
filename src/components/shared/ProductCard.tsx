"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  href: string;
}

export default function ProductCard({
  id,
  name,
  price,
  rating,
  image,
  description,
  href,
}: ProductCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="furniture-card">
        <div className="relative mb-4 h-64 w-full overflow-hidden rounded-md bg-[#F5F5F5]">
          <Image
            src={image}
            alt={name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-2xl text-[#2F2F2F]">{name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />
            <span className="ml-1 text-sm text-[#525252]">{rating}</span>
          </div>
        </div>
        <p className="mb-4 text-[#525252]">{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl font-semibold text-[#8B6F47]">
            ${price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
