import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const sidebarContent = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-8 h-8 text-white fill-white" />
        <span className="font-display text-2xl font-bold text-white tracking-tight">KiNETiC Electric</span>
      </div>
      
      <h1 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
        Operational Excellence for the Electric Era.
      </h1>
      <p className="text-white/80 text-lg mb-8 max-w-md">
        Manage your fleet, monitor infrastructure, and optimize energy distribution with kinetic precision and technical mastery.
      </p>
      
      <div className="flex gap-12">
        <div>
          <span className="text-white/60 label-caps">Fleet Uptime</span>
          <div className="text-white font-display text-3xl font-bold">99.9%</div>
        </div>
        <div>
          <span className="text-white/60 label-caps">Network Load</span>
          <div className="text-white font-display text-3xl font-bold">Optimized</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout backgroundImage="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2000" sidebarContent={sidebarContent}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-on-surface-variant mb-10">
          Enter your credentials to access the management dashboard.
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="label-caps">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input 
                type="email" 
                placeholder="name@lumina.com"
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end">
              <label className="label-caps">Secure Password</label>
              <button type="button" className="text-primary-container text-xs font-semibold hover:underline mb-2">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="input-field pl-12 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                id="toggle-password"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="remember"
              className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container"
            />
            <label htmlFor="remember" className="text-sm text-on-surface-variant">
              Remember this device for 30 days
            </label>
          </div>

          <button type="submit" className="btn-primary w-full group" id="login-button">
            Login to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Don't have an administrator account? {' '}
            <Link to="/register" className="text-primary-container font-bold hover:underline">
              Request Access
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
