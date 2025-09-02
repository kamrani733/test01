import { Sofa, Lamp, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts, getCategories } from '@/core/lib/api/main/main-shop-product';
import { MainShopProduct } from '@/core/models/shop-product-model';
import ProductCard from '@/components/shared/ProductCard';

export default async function Home() {
  // Fetch featured products and categories from API
  const [featuredProductsResponse, categoriesResponse] = await Promise.all([
    getFeaturedProducts(6),
    getCategories()
  ]);
  
  const featuredProducts: MainShopProduct[] = featuredProductsResponse?.data?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans" dir="rtl">
      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-center justify-center bg-[#F5F5F5] text-center">
        {/* Fallback background color if image fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47]/20 to-[#D4A373]/20 z-0" />
        <Image
          src="/assets/images/dummy.jpg"
          alt="اتاق نشیمن شیک"
          fill
          className="absolute z-0 object-cover opacity-50"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="relative z-10 px-4">
          <h1 className="mb-4 font-serif text-5xl font-bold text-[#2F2F2F] md:text-7xl">
            مبلمان جاودانه
          </h1>
          <p className="mb-6 text-lg text-[#2F2F2F] md:text-xl max-w-2xl mx-auto">
            طراحی‌های کلاسیک را کشف کنید که برای راحتی و زیبایی ساخته شده‌اند. 
            فضای خود را با قطعاتی که داستانی را روایت می‌کنند، متحول کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="bg-[#8B6F47] text-white hover:bg-[#D4A373] transition-colors duration-300 shadow-lg"
              aria-label="اکنون خرید کنید"
            >
              <Link href="/shop" className="flex items-center">
                اکنون خرید کنید <ShoppingBag className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-colors duration-300"
              aria-label="بیشتر بدانید"
            >
              <Link href="/aboutUs" className="flex items-center">
                بیشتر بدانید <ArrowRight className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8B6F47] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F2F2F] mb-2">کیفیت برتر</h3>
              <p className="text-[#2F2F2F]/80">ساخته شده با بهترین مواد و توجه به جزئیات</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8B6F47] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sofa className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F2F2F] mb-2">طراحی جاودانه</h3>
              <p className="text-[#2F2F2F]/80">سبک‌های کلاسیک که هرگز از مد نمی‌افتند</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8B6F47] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lamp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2F2F2F] mb-2">هنر استادانه</h3>
              <p className="text-[#2F2F2F]/80">ساخته شده برای ماندگاری نسل‌ها</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-[#2F2F2F] mb-4">
                دسته‌بندی محصولات
              </h2>
              <p className="text-lg text-[#2F2F2F]/80 max-w-2xl mx-auto">
                محصولات خود را بر اساس دسته‌بندی مورد نظرتان پیدا کنید
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category: any) => (
                <Link
                  key={category.id}
                  href={`/shop/category/products/${category.slug}`}
                  className="group block"
                >
                  <div className="bg-[#F5F5F5] rounded-lg p-6 text-center transition-all duration-300 hover:bg-[#8B6F47] hover:text-white group-hover:scale-105">
                    <div className="w-16 h-16 bg-[#8B6F47] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:text-[#8B6F47]">
                      <Sofa className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                    <p className="text-sm opacity-80 group-hover:opacity-100">
                      {category.description || `${category.title} با کیفیت بالا`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button
                asChild
                variant="outline"
                className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-colors duration-300"
                aria-label="مشاهده همه دسته‌بندی‌ها"
              >
                <Link href="/shop" className="flex items-center mx-auto">
                  مشاهده همه دسته‌بندی‌ها <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="bg-[#E8E8E8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#2F2F2F] mb-4">
              مجموعه‌های ویژه
            </h2>
            <p className="text-lg text-[#2F2F2F]/80 max-w-2xl mx-auto">
              محبوب‌ترین قطعات ما را که زیبایی، راحتی و عملکرد را ترکیب می‌کنند، کشف کنید
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-md mb-4">
                    <Image
                      src={product.thumbnail?.url || "/assets/images/dummy.jpg"}
                      alt={product.title}
                      width={400}
                      height={300}
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-[#2F2F2F] mb-2">{product.title}</h3>
                  <p className="mb-4 text-[#2F2F2F]/80">
                    {product.excerpt || product.description || "محصول با کیفیت بالا و طراحی زیبا"}
                  </p>
                  <div className="flex items-center justify-between">
                    <Sofa className="h-6 w-6 text-[#8B6F47]" />
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white"
                      aria-label={`مشاهده جزئیات ${product.title}`}
                    >
                      <Link href={`/shop/product/${product.id}/${product.slug}`}>
                        مشاهده جزئیات
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback content if no products are available
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Product Card 1 */}
              <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-md mb-4">
                  <Image
                    src="/assets/images/dummy.jpg"
                    alt="کاناپه مدرن با پارچه خاکستری"
                    width={400}
                    height={300}
                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-2xl text-[#2F2F2F] mb-2">کاناپه مدرن</h3>
                <p className="mb-4 text-[#2F2F2F]/80">
                  راحتی شیک برای فضای نشیمن شما با پارچه ممتاز و ساختار محکم.
                </p>
                <div className="flex items-center justify-between">
                  <Sofa className="h-6 w-6 text-[#8B6F47]" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white"
                    aria-label="مشاهده جزئیات کاناپه مدرن"
                  >
                    مشاهده جزئیات
                  </Button>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-md mb-4">
                  <Image
                    src="/assets/images/dummy.jpg"
                    alt="چراغ کلاسیک با طراحی زیبا"
                    width={400}
                    height={300}
                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-2xl text-[#2F2F2F] mb-2">چراغ کلاسیک</h3>
                <p className="mb-4 text-[#2F2F2F]/80">
                  نورپردازی جاودانه برای هر اتاق با روشنایی قابل تنظیم و طراحی شیک.
                </p>
                <div className="flex items-center justify-between">
                  <Lamp className="h-6 w-6 text-[#8B6F47]" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white"
                    aria-label="مشاهده جزئیات چراغ کلاسیک"
                  >
                    مشاهده جزئیات
                  </Button>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-md mb-4">
                  <Image
                    src="/assets/images/dummy.jpg"
                    alt="میز ناهارخوری با طراحی کلاسیک"
                    width={400}
                    height={300}
                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-2xl text-[#2F2F2F] mb-2">میز ناهارخوری</h3>
                <p className="mb-4 text-[#2F2F2F]/80">
                  گردهمایی با سبک و هنر استادانه و مواد بادوام.
                </p>
                <div className="flex items-center justify-between">
                  <ShoppingBag className="h-6 w-6 text-[#8B6F47]" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white"
                    aria-label="مشاهده جزئیات میز ناهارخوری"
                  >
                    مشاهده جزئیات
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-[#8B6F47] text-white hover:bg-[#D4A373] transition-colors duration-300 shadow-lg"
              aria-label="کاوش در همه مجموعه‌ها"
            >
              <Link href="/shop" className="flex items-center mx-auto">
                کاوش در همه مجموعه‌ها <ArrowRight className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2F2F2F] text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            آماده تغییر فضای خود هستید؟
          </h2>
          <p className="text-lg text-[#F5F5F5]/80 mb-8 max-w-2xl mx-auto">
            اجازه دهید با مجموعه‌ای از مبلمان جاودانه، خانه رویایی شما را خلق کنیم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#8B6F47] text-white hover:bg-[#D4A373] transition-colors duration-300 shadow-lg"
              aria-label="شروع خرید"
            >
              <Link href="/shop">شروع خرید</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-[#2F2F2F] transition-colors duration-300"
              aria-label="تماس با ما"
            >
              <Link href="/contactus">تماس با ما</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}