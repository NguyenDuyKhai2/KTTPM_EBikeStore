import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/manager": {
    title: "Tổng quan quản lý",
    description: "Theo dõi nhanh tình hình đơn hàng, thanh toán và khách hàng."
  },
  "/manager/orders": {
    title: "Quản lý đơn hàng",
    description: "Theo dõi và xử lý toàn bộ đơn hàng của khách."
  },
  "/manager/payments": {
    title: "Quản lý thanh toán",
    description: "Đối soát và xác nhận các giao dịch thanh toán."
  },
  "/manager/customers": {
    title: "Khách hàng",
    description: "Tra cứu hồ sơ khách hàng và giá trị mua sắm."
  },
  "/manager/products": {
    title: "Sản phẩm",
    description: "Kiểm tra danh mục xe đang hiển thị trong hệ thống."
  }
};

type ManagerTopNavProps = {
  onMenuClick?: () => void;
};

const ManagerTopNav = ({ onMenuClick }: ManagerTopNavProps) => {
  const location = useLocation();
  const page =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith("/manager/orders/")
      ? {
          title: "Chi tiết đơn hàng",
          description: "Xem đầy đủ thông tin đơn hàng, thanh toán và showroom nhận xe."
        }
      : pageTitles["/manager"]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[64px] flex-wrap items-center gap-3 px-4 py-3 sm:min-h-[72px] sm:gap-4 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-slate-950 sm:text-2xl lg:text-[28px]">{page.title}</h1>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 sm:mt-1 sm:text-sm">{page.description}</p>
        </div>

        <div className="hidden w-full max-w-sm items-center md:flex md:w-auto md:flex-1 md:justify-end">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm đơn hàng, khách hàng, thanh toán"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#003b93] focus:bg-white"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerTopNav;
