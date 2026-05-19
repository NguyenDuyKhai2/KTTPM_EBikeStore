import { NavLink, Outlet } from "react-router-dom";

const customerNavItems = [
  { to: "/customer", label: "Overview", end: true },
  { to: "/customer/orders", label: "Orders" },
  { to: "/customer/notifications", label: "Thông báo" },
  { to: "/customer/profile", label: "Profile" }
];

const CustomerLayout = () => (
  <section className="flex flex-col gap-5 px-4 py-8 sm:px-6 lg:px-14">
    <div className="flex max-w-[920px] flex-col gap-3">
      <span className="inline-block text-[0.74rem] uppercase tracking-[0.16em] text-[#d71920]">Customer Area</span>
      <h1 className="[font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[0.96] text-[#111]">
        Your electric mobility account center.
      </h1>
      <p className="m-0 leading-[1.7] text-[#6a6a6a]">
        Manage orders, track profile details, and continue the shopping flow from a dedicated customer workspace.
      </p>
    </div>

    <div className="flex flex-wrap gap-3 rounded-[20px] border border-[rgba(17,17,17,0.08)] bg-white/80 p-[14px] backdrop-blur-[10px]">
      {customerNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `rounded-full px-3.5 py-2.5 transition ${isActive ? "bg-black/5 text-[#111]" : "text-[#6a6a6a] hover:bg-black/5 hover:text-[#111]"}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>

    <Outlet />
  </section>
);

export default CustomerLayout;
