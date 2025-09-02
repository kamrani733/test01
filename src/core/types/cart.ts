export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_title: string;
};

export type CartData = {
  uuid: string;
  total_price: number;
  items_count: number;
  items: CartItem[];
};

export type CartResponse = {
  status: 'success' | 'error';
  data: CartData;
};
