import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountAmount: number;
}

export interface Cart {
  items: CartItem[];
  coupon?: Coupon;
  total: number;
}
