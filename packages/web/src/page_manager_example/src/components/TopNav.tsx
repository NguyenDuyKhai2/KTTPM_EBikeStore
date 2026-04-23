import { Search, Bell, HelpCircle, Plus } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="fixed top-0 right-0 left-65 h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100 z-40 flex justify-between items-center px-8">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders, VIN, or customers..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500">
          <button className="relative hover:text-primary transition-all p-1">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-primary transition-all p-1">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="h-8 w-[1px] bg-slate-100 mx-2" />
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>
    </header>
  );
}
