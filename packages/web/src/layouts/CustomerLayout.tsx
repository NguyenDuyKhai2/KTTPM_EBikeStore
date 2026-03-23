import { NavLink, Outlet } from "react-router-dom";

const customerNavItems = [
  { to: "/customer", label: "Overview", end: true },
  { to: "/customer/orders", label: "Orders" },
  { to: "/customer/profile", label: "Profile" }
];

const CustomerLayout = () => (
  <section className="portal-shell">
    <div className="section-heading">
      <span className="section-label">Customer Area</span>
      <h1>Your electric mobility account center.</h1>
      <p>Manage orders, track profile details, and continue the shopping flow from a dedicated customer workspace.</p>
    </div>

    <div className="portal-nav">
      {customerNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `site-nav__link${isActive ? " site-nav__link--active" : ""}`}
        >
          {item.label}
        </NavLink>
      ))}
    </div>

    <Outlet />
  </section>
);

export default CustomerLayout;
