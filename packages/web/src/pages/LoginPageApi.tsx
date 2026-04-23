import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@ebike/shared-code/hooks";

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
};

const LoginPageApi = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<LoginFormData>({
    usernameOrEmail: "",
    password: "",
    rememberMe: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.usernameOrEmail.trim()) {
      setError("Tên đăng nhập hoặc email là bắt buộc");
      return false;
    }
    if (!formData.password) {
      setError("Mật khẩu là bắt buộc");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await login({
        usernameOrEmail: formData.usernameOrEmail.trim(),
        password: formData.password
      }).unwrap();

      navigate(
        result.roles.includes("ADMIN")
          ? "/admin"
          : result.roles.includes("MANAGER")
            ? "/manager"
            : "/customer/profile"
      );
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.18),_transparent_30%),linear-gradient(135deg,_#eefbf4_0%,_#f8f7ef_48%,_#f1f9ff_100%)] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Chào mừng quay lại</h1>
          <p className="text-lg text-slate-600">Đăng nhập vào tài khoản e-bike của bạn để xem hồ sơ và đơn hàng</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="usernameOrEmail" className="mb-2 block text-sm font-semibold text-slate-900">
              Tên đăng nhập hoặc email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="johndoe hoặc john.doe@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-slate-500">Tài khoản mẫu: johndoe, staff.user, manager.user, admin.user</p>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-900">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Ví dụ: SecurePassword123</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="cursor-pointer text-sm font-medium text-slate-600">
              Ghi nhớ phiên đăng nhập của tôi
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500">Chưa có tài khoản?</span>
            </div>
          </div>

          <NavLink
            to="/signup"
            className="block w-full rounded-lg border-2 border-emerald-600 py-3 text-center font-semibold text-emerald-600 transition duration-200 hover:bg-emerald-50"
          >
            Tạo tài khoản
          </NavLink>
        </form>

        <div className="mt-6 text-center">
          <button className="font-semibold text-emerald-700 transition hover:text-emerald-800">Quên mật khẩu?</button>
        </div>

        <div className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-600">Truy cập nhanh sau khi đăng nhập:</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">+</span>
              <span>Xem hồ sơ tài khoản với trạng thái xác minh và quyền truy cập thật từ API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">+</span>
              <span>Theo dõi các đơn hàng và tiến trình xử lý dành cho khách hàng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">+</span>
              <span>Dùng lại phiên đăng nhập nhờ JWT đã được lưu trong trình duyệt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600">+</span>
              <span>Đăng nhập bằng username hoặc email giống như backend đang hỗ trợ</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="absolute left-0 top-0 -z-10 h-96 w-96 rounded-full bg-emerald-200 opacity-20 blur-3xl"></div>
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-cyan-200 opacity-20 blur-3xl"></div>
    </div>
  );
};

export default LoginPageApi;
