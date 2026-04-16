import { addItem, clearCart, removeItem, updateQuantity } from "../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux";
import type { CartItem } from "../types";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  return {
    ...cart,
    addItem: (item: CartItem) => dispatch(addItem(item)),
    updateQuantity: (productId: number, quantity: number) => dispatch(updateQuantity({ productId, quantity })),
    removeItem: (productId: number) => dispatch(removeItem(productId)),
    clearCart: () => dispatch(clearCart())
  };
};
