import { Globe, Mail, Share2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/checkout")) {
    return null;
  }

  return (
    <footer className="mt-auto w-full border-t border-outline-variant/10 bg-surface-container-low px-6 py-20 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 space-y-6 md:col-span-1">
            <div className="font-headline text-xl font-bold uppercase text-foreground">KINETIC</div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Leading the transition to sustainable urban mobility with precision engineering and high-tech design.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Globe size={20} className="cursor-pointer transition-colors hover:text-primary" />
              <Share2 size={20} className="cursor-pointer transition-colors hover:text-primary" />
              <Mail size={20} className="cursor-pointer transition-colors hover:text-primary" />
            </div>
          </div>

          <div>
            <h4 className="mono-label mb-6 text-foreground/40">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-muted-foreground transition-colors hover:text-primary">Models</Link></li>
              <li><Link to="/chatbot" className="text-sm text-muted-foreground transition-colors hover:text-primary">Advisory</Link></li>
              <li><Link to="/favorites" className="text-sm text-muted-foreground transition-colors hover:text-primary">Saved</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mono-label mb-6 text-foreground/40">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">About Kinetic</Link></li>
              <li><Link to="/customer/orders" className="text-sm text-muted-foreground transition-colors hover:text-primary">Orders</Link></li>
              <li><Link to="/auth" className="text-sm text-muted-foreground transition-colors hover:text-primary">Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mono-label mb-6 text-foreground/40">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-outline-variant/10 pt-12 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Kinetic Precision. All rights reserved.</p>
          <div className="flex gap-8 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Global Headquarter: Berlin, DE</span>
            <span>Vietnam Office: HCMC, VN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
