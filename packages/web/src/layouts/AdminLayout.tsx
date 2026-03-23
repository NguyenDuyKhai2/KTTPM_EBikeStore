import { NavLink, Outlet } from "react-router-dom";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/users", label: "Users" }
];

const AdminLayout = () => (
  <section className="portal-shell">
    <div className="section-heading">
      <span className="section-label">Admin Area</span>
      <h1>Control center for the e-bike storefront and backend operations.</h1>
      <p>Use this route group to separate admin tasks from guest and customer features while the team develops in parallel.</p>
    </div>

    <div className="portal-nav">
      {adminNavItems.map((item) => (
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

export default AdminLayout;
