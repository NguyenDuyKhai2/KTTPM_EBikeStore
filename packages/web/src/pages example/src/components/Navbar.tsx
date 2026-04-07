import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Models', path: '/models' },
    { name: 'Technology', path: '/technology' },
    { name: 'Experience', path: '/experience' },
    { name: 'Network', path: '/network' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b border-outline-variant/10">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-foreground font-headline uppercase">
            KINETIC
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-headline tracking-tight transition-all duration-300 hover:text-primary",
                  location.pathname === link.path ? "text-primary border-b-2 border-primary pb-1" : "text-foreground/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-foreground/70">
            <Link to="/cart" className="hover:text-primary transition-colors">
              <ShoppingCart size={20} />
            </Link>
            <button className="hover:text-primary transition-colors">
              <User size={20} />
            </button>
          </div>
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-headline font-bold hover:opacity-90 transition-all text-sm hidden sm:block">
            Book Test Drive
          </button>
          <button className="md:hidden text-foreground">
            <Menu size={24} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
