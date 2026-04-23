import { Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/manager": {
    title: "Dashboard Overview",
    description: "Tổng quan vận hành đơn hàng, thanh toán và khách hàng."
  },
  "/manager/orders": {
    title: "Order Management",
    description: "Theo dõi và xử lý toàn bộ đơn hàng của khách."
  },
  "/manager/payments": {
    title: "Payment Transactions",
    description: "Đối soát và xác nhận các giao dịch thanh toán."
  },
  "/manager/customers": {
    title: "Customer Directory",
    description: "Tra cứu khách hàng và giá trị mua hàng."
  },
  "/manager/products": {
    title: "Product Inventory",
    description: "Kiểm tra danh mục xe đang hiển thị trong hệ thống."
  }
};

const ManagerTopNav = () => {
  const location = useLocation();
  const page =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith("/manager/orders/")
      ? {
          title: "Order Detail",
          description: "Xem chi tiết đơn hàng, thanh toán và showroom nhận xe."
        }
      : pageTitles["/manager"]);

  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div>
        <h1 className="text-[28px] font-bold text-slate-950">{page.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{page.description}</p>
      </div>

      <div className="hidden w-full max-w-sm items-center justify-end md:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, customers, payments"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#003b93] focus:bg-white"
          />
        </div>
      </div>
    </header>
  );
};

export default ManagerTopNav;
