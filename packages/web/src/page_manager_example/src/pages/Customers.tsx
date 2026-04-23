import { Search, Filter, UserPlus, MoreVertical, Star, ShieldCheck } from 'lucide-react';
import { customers } from '../mockData';

export default function Customers() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-display">Customer Directory</h2>
          <p className="text-slate-500 mt-1">Manage individual and enterprise fleet clients.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm">
          <UserPlus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-4 items-center">
            {['All Clients', 'Active', 'Enterprise', 'Lead'].map((tab, i) => (
              <button 
                key={tab}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  i === 0 ? 'bg-primary-container text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
         </div>
         <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
           <input
             type="text"
             placeholder="Search directory..."
             className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
           />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm group hover:border-primary-container/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary-container flex items-center justify-center font-bold text-xl">
                 {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-900 transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-slate-900">{customer.name}</h4>
                <ShieldCheck className="w-4 h-4 text-primary-container" />
              </div>
              <p className="text-sm text-slate-500 mt-1">{customer.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-50">
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
                  <p className="font-bold text-slate-900 mt-0.5">{customer.ordersCount}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spend Value</p>
                  <p className="font-bold text-slate-900 mt-0.5">${customer.totalPurchase.toLocaleString()}</p>
               </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="text-sm font-bold text-slate-900">4.9</span>
              </div>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                {customer.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
