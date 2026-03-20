import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../api";
import type { AuthResponse, LoginRequest, User } from "../../types";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null
};

export const loginThunk = createAsyncThunk<AuthResponse, LoginRequest>(
  "auth/login",
  async (payload) => authAPI.login(payload)
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Login failed";
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
