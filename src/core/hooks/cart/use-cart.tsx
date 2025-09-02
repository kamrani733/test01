// 'use client';

// import { useEffect, useState } from 'react';

// import {
//   addToCart as addToCartUtil,
//   type Cart,
//   getGuestCart,
//   removeFromCart as removeFromCartUtil,
//   syncCartToBackend,
//   updateCartItemQuantity as updateQuantityUtil,
// } from '@/lib/cart';

// export function useCart() {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // بارگذاری سبد خرید در ابتدا
//   useEffect(() => {
//     const loadCart = () => {
//       const savedCart = getGuestCart();
//       setCart(savedCart);
//       setIsLoading(false);
//     };

//     loadCart();
//   }, []);

//   // اضافه کردن محصول به سبد
//   const addToCart = (productId: number, quantity = 1) => {
//     const updatedCart = addToCartUtil(productId, quantity);
//     setCart(updatedCart);
//   };

//   // حذف محصول از سبد
//   const removeFromCart = (productId: number) => {
//     const updatedCart = removeFromCartUtil(productId);
//     setCart(updatedCart);
//   };

//   // به‌روزرسانی تعداد محصول
//   const updateQuantity = (productId: number, quantity: number) => {
//     const updatedCart = updateQuantityUtil(productId, quantity);
//     setCart(updatedCart);
//   };

//   // همگام‌سازی با بک‌اند پس از لاگین
//   const syncToBackend = async () => {
//     setIsLoading(true);
//     const success = await syncCartToBackend();
//     if (success) {
//       setCart(null); // سبد محلی پاک شده
//     }
//     setIsLoading(false);
//     return success;
//   };

//   // محاسبه تعداد کل آیتم‌ها
//   const totalItems =
//     cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

//   return {
//     cart,
//     isLoading,
//     totalItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     syncToBackend,
//   };
// }
