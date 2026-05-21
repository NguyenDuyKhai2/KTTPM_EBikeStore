import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Zap, Info, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const sidebarContent = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-8 h-8 text-white fill-white" />
        <span className="font-display text-2xl font-bold text-white tracking-tight">KiNETiC Management</span>
      </div>
      
      <p className="text-white/80 text-lg mb-12 max-w-md">
        Secure access to the next generation of electric infrastructure management. Precision control at your fingertips.
      </p>
      
      <div className="bg-primary-container/20 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
          <ShieldCheck className="w-16 h-16 text-white" />
        </div>
        <h3 className="font-display text-xl font-bold text-white mb-2 relative z-10">Enterprise Security</h3>
        <p className="text-white/70 text-sm relative z-10">
          Our administrative interface employs end-to-end encryption and multi-factor authentication to ensure operational integrity.
        </p>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout backgroundImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2000" sidebarContent={sidebarContent}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-bold mb-2">Create Administrator Account</h2>
        <p className="text-on-surface-variant mb-8">
          Enter your professional details to request access to the management dashboard.
        </p>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="label-caps">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input 
                type="text" 
                placeholder="e.g. Robert J. Sterling"
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="label-caps">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input 
                type="email" 
                placeholder="name@lumina-electric.com"
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-caps">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div>
              <label className="label-caps">Confirm</label>
              <div className="relative">
                <Eye className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 bg-surface-container rounded-lg border border-outline-variant/30">
            <Info className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Password must be at least 12 characters and include a special character, number, and uppercase letter.
            </p>
          </div>

          <button type="submit" className="btn-primary w-full" id="create-account-button">
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col items-center gap-6">
          <p className="text-sm text-on-surface-variant">
            Already have an administrative account? {' '}
            <Link to="/" className="text-primary-container font-bold hover:underline">
              Login here
            </Link>
          </p>
          
          <div className="flex items-center gap-2 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface">Authorized Personnel Only</span>
            <span className="w-1 h-1 rounded-full bg-on-surface"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface">Secure 256-bit AES Encryption</span>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
