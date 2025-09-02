import { Sofa, Lamp, ShoppingBag, Star, Truck, Shield, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-center justify-center bg-[#F5F5F5] text-center">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop&crop=center"
          alt="Elegant living room"
          fill
          className="absolute z-0 opacity-50 object-cover"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 px-4">
          <h1 className="mb-4 font-serif text-5xl font-bold text-[#2F2F2F] md:text-7xl">
            Timeless Furniture
          </h1>
          <p className="mb-6 text-lg text-[#2F2F2F] md:text-xl">
            Discover classic designs crafted for comfort and elegance.
          </p>
          <Button asChild className="bg-[#8B6F47] text-white hover:bg-[#D4A373] px-8 py-4 text-lg">
            <Link href="/shop">Shop Now <ShoppingBag className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <Truck className="mx-auto mb-4 h-12 w-12 text-[#8B6F47]" />
              <h3 className="mb-2 font-serif text-xl font-semibold text-[#2F2F2F]">Free Shipping</h3>
              <p className="text-[#525252]">On orders over $500</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-[#8B6F47]" />
              <h3 className="mb-2 font-serif text-xl font-semibold text-[#2F2F2F]">Quality Guarantee</h3>
              <p className="text-[#525252]">30-day return policy</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-[#8B6F47]" />
              <h3 className="mb-2 font-serif text-xl font-semibold text-[#2F2F2F]">Fast Delivery</h3>
              <p className="text-[#525252]">2-5 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-[#E8E8E8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 font-serif text-4xl font-bold text-[#2F2F2F] text-center">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Card 1 */}
            <div className="group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative mb-4 h-64 w-full overflow-hidden rounded-md bg-[#F5F5F5]">
                <Image
                  src="https://images.unsplash.com/photo-1595526114035-0c6c6a195985?w=400&h=300&fit=crop&crop=center"
                  alt="Modern Sofa"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-2xl text-[#2F2F2F]">Modern Sofa</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />
                  <span className="ml-1 text-sm text-[#525252]">4.8</span>
                </div>
              </div>
              <p className="mb-4 text-[#525252]">Elegant comfort for your living space.</p>
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-semibold text-[#8B6F47]">$1,299</span>
                <Sofa className="h-6 w-6 text-[#8B6F47]" />
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative mb-4 h-64 w-full overflow-hidden rounded-md bg-[#F5F5F5]">
                <Image
                  src="https://images.unsplash.com/photo-1519961655809-5fa5d27a09c8?w=400&h=300&fit=crop&crop=center"
                  alt="Classic Lamp"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-2xl text-[#2F2F2F]">Classic Lamp</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />
                  <span className="ml-1 text-sm text-[#525252]">4.9</span>
                </div>
              </div>
              <p className="mb-4 text-[#525252]">Timeless lighting for any room.</p>
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-semibold text-[#8B6F47]">$299</span>
                <Lamp className="h-6 w-6 text-[#8B6F47]" />
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative mb-4 h-64 w-full overflow-hidden rounded-md bg-[#F5F5F5]">
                <Image
                  src="https://images.unsplash.com/photo-1611967164521-abae6af6e663?w=400&h=300&fit=crop&crop=center"
                  alt="Dining Table"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-2xl text-[#2F2F2F]">Dining Table</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />
                  <span className="ml-1 text-sm text-[#525252]">4.7</span>
                </div>
              </div>
              <p className="mb-4 text-[#525252]">Gather in style with classic craftsmanship.</p>
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-semibold text-[#8B6F47]">$899</span>
                <ShoppingBag className="h-6 w-6 text-[#8B6F47]" />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-transparent border-2 border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white px-8 py-4 text-lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 font-serif text-4xl font-bold text-[#2F2F2F]">
                Crafted with Passion
              </h2>
              <p className="mb-6 text-lg text-[#525252] leading-relaxed">
                For over three decades, we've been creating furniture that combines timeless design with modern comfort.
                Each piece is carefully crafted using the finest materials and traditional techniques.
              </p>
              <p className="mb-8 text-lg text-[#525252] leading-relaxed">
                Our commitment to quality and attention to detail ensures that every item in your home tells a story
                of craftsmanship and elegance.
              </p>
              <Button asChild className="bg-[#8B6F47] text-white hover:bg-[#D4A373] px-6 py-3">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center"
                  alt="Craftsman working on furniture"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#2F2F2F] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-white">
            Stay Updated
          </h2>
          <p className="mb-8 text-lg text-[#E8E8E8]">
            Subscribe to our newsletter for exclusive offers and design inspiration.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-md rounded-lg border-0 px-4 py-3 text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
            />
            <Button className="bg-[#8B6F47] text-white hover:bg-[#D4A373] px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
 
    </div>
  );
}
