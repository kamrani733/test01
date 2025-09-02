import CartHeader from './CartHeader';
import { CartItem } from './CartItem';
import { OrderSummary } from './OrderSummary';

const cartItems = [
  {
    id: '482030012063708',
    name: 'Aarhus',
    description: 'Aarhus 3-seater sofa',
    price: 5499.0,
    image: '/modern-gray-sofa.png',
    isNew: true,
    details: {
      leg: 'natural oak, clear oiled',
      upholstery: 'light gray Frisco fabric with aquaclean 2063',
    },
    quantity: 1,
  },
  {
    id: '482030012063708',
    name: 'Aarhus',
    description: 'Aarhus 3-seater sofa',
    price: 5499.0,
    image: '/modern-gray-sofa.png',
    isNew: true,
    details: {
      leg: 'natural oak, clear oiled',
      upholstery: 'light gray Frisco fabric with aquaclean 2063',
    },
    quantity: 1,
  },
  {
    id: '482030012063708',
    name: 'Aarhus',
    description: 'Aarhus 3-seater sofa',
    price: 5499.0,
    image: '/modern-gray-sofa.png',
    isNew: true,
    details: {
      leg: 'natural oak, clear oiled',
      upholstery: 'light gray Frisco fabric with aquaclean 2063',
    },
    quantity: 1,
  },
  {
    id: '482030012063708',
    name: 'Aarhus',
    description: 'Aarhus 3-seater sofa',
    price: 5499.0,
    image: '/modern-gray-sofa.png',
    isNew: true,
    details: {
      leg: 'natural oak, clear oiled',
      upholstery: 'light gray Frisco fabric with aquaclean 2063',
    },
    quantity: 1,
  },
  {
    id: '482030012063708',
    name: 'Aarhus',
    description: 'Aarhus 3-seater sofa',
    price: 5499.0,
    image: '/modern-gray-sofa.png',
    isNew: true,
    details: {
      leg: 'natural oak, clear oiled',
      upholstery: 'light gray Frisco fabric with aquaclean 2063',
    },
    quantity: 1,
  },
];

export function Cart() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <CartHeader itemCount={cartItems.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
        <div className="lg:col-span-2 space-y-2">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary subtotal={subtotal} delivery={delivery} total={total} />
        </div>
      </div>
    </div>
  );
}
