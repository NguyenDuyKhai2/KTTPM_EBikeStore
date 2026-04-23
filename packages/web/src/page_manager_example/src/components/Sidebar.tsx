import { LayoutDashboard, FileText, CreditCard, Users, Car } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Orders', path: '/orders' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Car, label: 'Products', path: '/products' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-65 border-r border-slate-100 bg-white dark:bg-slate-900 shadow-sm flex flex-col py-8 z-50">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold tracking-tight text-primary-container font-display">
          KINETIC
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? 'text-primary-container font-bold border-l-4 border-primary-container bg-surface-container-low'
                  : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <div className="p-3 rounded-xl bg-surface-container-low border border-slate-100 flex items-center gap-3">
          <img
            src="https://picsum.photos/seed/admin/100/100"
            alt="Marcus Chen"
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">Marcus Chen</p>
            <p className="text-[10px] text-slate-500 truncate font-semibold uppercase tracking-wider">Fleet Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
