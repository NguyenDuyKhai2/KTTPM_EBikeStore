import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI, setAuthToken } from "../../api";
import type { EnhancedAuthResponse, LoginRequest, User } from "../../types";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const AUTH_STORAGE_KEY = "ebike.web.auth";

const readStoredAuth = (): Pick<AuthState, "token" | "user"> => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw) as Pick<AuthState, "token" | "user">;
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null
    };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuth = (state: Pick<AuthState, "token" | "user">) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

const clearPersistedAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const mapAuthResponseToUser = (payload: EnhancedAuthResponse): User => ({
  id: String(payload.userId),
  username: payload.username,
  email: payload.email,
  fullName: payload.fullName,
  roles: payload.roles,
  active: payload.active,
  verified: payload.verified
});

const storedAuth = readStoredAuth();
setAuthToken(storedAuth.token ?? undefined);

const initialState: AuthState = {
  token: storedAuth.token,
  user: storedAuth.user,
  isLoading: false,
  error: null
};

export const loginThunk = createAsyncThunk<EnhancedAuthResponse, LoginRequest>(
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
      state.error = null;
      setAuthToken();
      clearPersistedAuth();
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
        state.token = action.payload.token;
        state.user = mapAuthResponseToUser(action.payload);
        setAuthToken(action.payload.token);
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Login failed";
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
