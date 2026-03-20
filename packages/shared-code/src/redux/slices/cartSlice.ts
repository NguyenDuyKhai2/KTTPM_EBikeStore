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
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    }
  }
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
