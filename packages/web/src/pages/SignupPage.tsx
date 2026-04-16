import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { authAPI } from "@ebike/shared-code/api";
import { useAuth } from "@ebike/shared-code/hooks";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const initialFormData: SignupFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: ""
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Tao tai khoan that bai. Vui long kiem tra lai thong tin.";
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError("Username, email va mat khau la bat buoc.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Email khong hop le.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mat khau phai co it nhat 6 ky tu.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Xac nhan mat khau khong khop.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await authAPI.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined
      });

      await login({
        usernameOrEmail: formData.username.trim(),
        password: formData.password
      }).unwrap();

      navigate("/customer/profile");
    } catch (signupError) {
      setError(getErrorMessage(signupError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || isLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3faf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Tạo Tài Khoản</h1>
          <p className="text-lg text-slate-600">Bắt đầu mua sắm và theo dõi đơn hàng của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-8 shadow-xl">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-slate-900">
                Họ
              </label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                disabled={disabled}
                placeholder="Nguyen"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-slate-900">
                Tên
              </label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                disabled={disabled}
                placeholder="An"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-900">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
              disabled={disabled}
              placeholder="nguyenvana"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
              disabled={disabled}
              placeholder="ban@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-900">
              Mật Khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
              disabled={disabled}
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-900">
              Xác Nhận Mật Khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
              disabled={disabled}
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <button
            type="submit"
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {disabled ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <NavLink to="/auth" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Đăng nhập
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
