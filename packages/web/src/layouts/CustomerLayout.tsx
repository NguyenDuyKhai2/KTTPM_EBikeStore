import { NavLink, Outlet } from "react-router-dom";

const customerNavItems = [
  { to: "/customer", label: "Tổng quan", end: true },
  { to: "/customer/orders", label: "Đơn hàng" },
  { to: "/customer/profile", label: "Hồ sơ" }
];

const CustomerLayout = () => (
  <section className="mx-auto flex min-h-screen max-w-screen-2xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:px-14">
    <div className="grid gap-5 border-b border-outline-variant/10 pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="max-w-3xl">
        <span className="mono-label mb-3 inline-block text-primary">Khu vực khách hàng</span>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Trung tâm tài khoản Kinetic
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Theo dõi đơn hàng, cập nhật hồ sơ và tiếp tục mua sắm trong một không gian riêng cho khách hàng.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-outline-variant/15 bg-white p-1.5 shadow-sm">
        {customerNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-md px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>

    <Outlet />
  </section>
);

export default CustomerLayout;
