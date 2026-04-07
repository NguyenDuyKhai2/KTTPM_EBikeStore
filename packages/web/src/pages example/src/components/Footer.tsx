import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-container-low w-full py-20 px-6 md:px-12 mt-auto border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="text-xl font-bold font-headline text-foreground uppercase">KINETIC</div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Leading the transition to sustainable urban mobility with precision engineering and high-tech design.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Globe size={20} className="cursor-pointer hover:text-primary transition-colors" />
              <Share2 size={20} className="cursor-pointer hover:text-primary transition-colors" />
              <Mail size={20} className="cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="mono-label text-foreground/40 mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/models" className="text-muted-foreground text-sm hover:text-primary transition-colors">Models</Link></li>
              <li><Link to="/technology" className="text-muted-foreground text-sm hover:text-primary transition-colors">Technology</Link></li>
              <li><Link to="/network" className="text-muted-foreground text-sm hover:text-primary transition-colors">Store Locator</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mono-label text-foreground/40 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-muted-foreground text-sm hover:text-primary transition-colors">Investor Relations</Link></li>
              <li><Link to="/support" className="text-muted-foreground text-sm hover:text-primary transition-colors">Support</Link></li>
              <li><Link to="/warranty" className="text-muted-foreground text-sm hover:text-primary transition-colors">Warranty</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mono-label text-foreground/40 mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm">© 2024 Kinetic Precision. All rights reserved.</p>
          <div className="flex gap-8 text-muted-foreground text-xs uppercase tracking-widest">
            <span>Global Headquarter: Berlin, DE</span>
            <span>Vietnam Office: HCMC, VN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
