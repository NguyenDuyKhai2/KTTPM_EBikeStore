import type { CartItem } from "../types";

export const cartService = {
  calculateTotal: (items: CartItem[]) => items.reduce((total, item) => total + item.product.price * item.quantity, 0)
};
