import type { ReactNode } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@ebike/shared-code/hooks";

const navItems = [
  { to: "/", label: "Trang Chủ", end: true },
  { to: "/products", label: "Sản Phẩm" },
  { to: "/chatbot", label: "Tư Vấn" },
  { to: "/orders", label: "Đơn Hàng" }
];

interface HeaderProps {
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
}

export const Header = ({ showSearch = true, onSearchChange }: HeaderProps): ReactNode => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleUserClick = () => {
    navigate(token ? "/customer/profile" : "/auth");
  };

  const handleCartClick = () => {
    navigate("/favorites");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 text-center text-sm text-white sm:px-6 lg:px-14">
        <p>Miễn phí giao hàng cho đơn hàng trên 5.000.000đ | Hotline: 1900636803</p>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4 sm:px-6 lg:px-14">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/" className="inline-flex items-center gap-2.5 flex-shrink-0">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-[18px_18px_18px_4px] bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-extrabold text-white">
              E
            </div>
            <div className="hidden sm:flex flex-col gap-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                E-Bike
              </span>
              <strong className="text-lg font-bold tracking-tight text-gray-900">
                YADEA
              </strong>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm xe, phụ kiện..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!token && (
              <NavLink
                to="/auth"
                className="hidden md:inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Đăng Nhập
              </NavLink>
            )}
            {/* Desktop Actions */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={handleUserClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                aria-label="User account"
                title="Hồ sơ người dùng"
              >
                <User size={18} />
              </button>
              <button
                onClick={handleCartClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                aria-label="Shopping cart"
                title="Giỏ hàng"
              >
                <ShoppingCart size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg lg:hidden border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Actions */}
            <div className="flex md:hidden gap-1">
              <NavLink
                to="/auth"
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
              >
                Đăng Nhập
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Mobile Search */}
        {showSearch && isMobileMenuOpen && (
          <div className="mt-4 flex md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
