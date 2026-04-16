import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../../types";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
}

const initialState: CartState = {
  items: [],
  couponCode: null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.product.id === action.payload.product.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        return;
      }
      state.items.push(action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.items.find((cartItem) => cartItem.product.id === action.payload.productId);
      if (!item) {
        return;
      }
      item.quantity = Math.max(1, action.payload.quantity);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
    }
  }
});

export const { addItem, clearCart, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
