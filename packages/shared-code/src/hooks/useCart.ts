import { addItem, removeItem } from "../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux";
import type { CartItem } from "../types";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  return {
    ...cart,
    addItem: (item: CartItem) => dispatch(addItem(item)),
    removeItem: (productId: number) => dispatch(removeItem(productId))
  };
};
