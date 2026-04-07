import { Menu, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@ebike/shared-code/hooks";

const navItems = [
  { to: "/products", label: "Models" },
  { to: "/chatbot", label: "Advisory" },
  { to: "/favorites", label: "Saved" }
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="glass-effect fixed left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-12">
          <NavLink to="/" className="font-headline text-2xl font-bold uppercase tracking-tight text-foreground">
            KINETIC
          </NavLink>
          <div className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `font-headline tracking-tight transition-all duration-300 hover:text-primary ${
                  isActive ? "border-b-2 border-primary pb-1 text-primary" : "text-foreground/70"
                }`
              }
            >
              Home
            </NavLink>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `font-headline tracking-tight transition-all duration-300 hover:text-primary ${
                    isActive ? "border-b-2 border-primary pb-1 text-primary" : "text-foreground/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 lg:flex">
            <button
              onClick={() => navigate("/favorites")}
              className="text-foreground/70 transition-colors hover:text-primary"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? "/customer/profile" : "/auth")}
              className="text-foreground/70 transition-colors hover:text-primary"
              aria-label="User"
            >
              <User size={18} />
            </button>
          </div>
          <NavLink to={isAuthenticated ? "/products" : "/auth"} className="btn-primary hidden text-sm sm:inline-flex">
            {isAuthenticated ? "Book Test Drive" : "Sign In"}
          </NavLink>
          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="text-foreground md:hidden"
            aria-label="Toggle navigation"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-outline-variant/20 bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              end
              className="font-headline text-foreground/70 hover:text-primary"
            >
              Home
            </NavLink>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="font-headline text-foreground/70 hover:text-primary">
                {item.label}
              </NavLink>
            ))}
            <NavLink to={isAuthenticated ? "/products" : "/auth"} className="btn-primary mt-2 w-full">
              {isAuthenticated ? "Book Test Drive" : "Sign In"}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
