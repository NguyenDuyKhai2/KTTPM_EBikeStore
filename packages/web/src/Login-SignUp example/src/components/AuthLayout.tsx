import React from 'react';
import { motion } from 'motion/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  sidebarContent: React.ReactNode;
}

export default function AuthLayout({ children, backgroundImage, sidebarContent }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left Panel */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-end p-12"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full">
          {sidebarContent}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-16 flex flex-wrap gap-4 text-xs text-on-surface-variant opacity-60 justify-center">
          <span>© 2024 Lumina Electric. All rights reserved.</span>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </nav>
        </div>
      </div>
    </div>
  );
}
