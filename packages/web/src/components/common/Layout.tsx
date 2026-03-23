import type { PropsWithChildren } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "E-Bikes" },
  { to: "/chatbot", label: "Smart Advisor" }
];

const Layout = ({ children }: PropsWithChildren) => (
  <div className="site-shell">
    <div className="site-ambient site-ambient-left" />
    <div className="site-ambient site-ambient-right" />

    <header className="site-header">
      <div className="site-header__brand">
        <span className="site-header__eyebrow">E-Bike Multiplatform</span>
        <NavLink className="site-header__logo" to="/">
          YADEA-INSPIRED
        </NavLink>
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `site-nav__link${isActive ? " site-nav__link--active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="site-header__actions">
        <a className="button button--ghost" href="#experience">
          Explore
        </a>
        <NavLink className="button button--primary" to="/chatbot">
          Ask the Bot
        </NavLink>
      </div>
    </header>

    <main className="site-main">{children ?? <Outlet />}</main>
  </div>
);

export default Layout;
