// 'use client';

// import { Minus, Plus, ShoppingCart } from 'lucide-react';

// import { useState } from 'react';

// import { Button } from '@/components/ui/button';
// import { useCart } from '@/hooks/use-cart';
// import { useToast } from '@/hooks/use-toast';

// interface AddToCartButtonProps {
//   productId: number;
//   productName?: string;
//   className?: string;
// }

// export function AddToCartButton({
//   productId,
//   productName,
//   className,
// }: AddToCartButtonProps) {
//   const [quantity, setQuantity] = useState(1);
//   const { addToCart, cart } = useCart();
//   const { toast } = useToast();

//   // بررسی اینکه آیا محصول در سبد وجود دارد
//   const existingItem = cart?.items.find(item => item.product_id === productId);
//   const currentQuantity = existingItem?.quantity || 0;

//   const handleAddToCart = () => {
//     addToCart(productId, quantity);
//     toast({
//       title: 'محصول به سبد خرید اضافه شد',
//       description: productName
//         ? `${productName} با موفقیت اضافه شد`
//         : 'محصول با موفقیت اضافه شد',
//     });
//   };

//   const increaseQuantity = () => {
//     setQuantity(prev => prev + 1);
//   };

//   const decreaseQuantity = () => {
//     setQuantity(prev => (prev > 1 ? prev - 1 : 1));
//   };

//   return (
//     <div className={`flex items-center gap-3 ${className}`}>
//       {/* انتخاب تعداد */}
//       <div className="flex items-center border rounded-lg">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={decreaseQuantity}
//           disabled={quantity <= 1}
//           className="h-8 w-8 p-0"
//         >
//           <Minus className="h-4 w-4" />
//         </Button>
//         <span className="px-3 py-1 min-w-[40px] text-center">{quantity}</span>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={increaseQuantity}
//           className="h-8 w-8 p-0"
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* دکمه اضافه به سبد */}
//       <Button onClick={handleAddToCart} className="flex items-center gap-2">
//         <ShoppingCart className="h-4 w-4" />
//         افزودن به سبد خرید
//         {currentQuantity > 0 && (
//           <span className="bg-primary-foreground text-primary px-2 py-1 rounded-full text-xs">
//             {currentQuantity}
//           </span>
//         )}
//       </Button>
//     </div>
//   );
// }
