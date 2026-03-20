import { useAppDispatch, useAppSelector } from "../redux";
import { loginThunk, logout } from "../redux/slices/authSlice";
import type { LoginRequest } from "../types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    login: (payload: LoginRequest) => dispatch(loginThunk(payload)),
    logout: () => dispatch(logout())
  };
};
