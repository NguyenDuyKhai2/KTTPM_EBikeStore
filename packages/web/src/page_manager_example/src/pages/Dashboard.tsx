import { ShoppingCart, Clock, Truck, CheckCircle, AlertCircle, Package, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { orders } from '../mockData';

const stats = [
  { label: 'New Orders', value: '42', trend: '+12%', icon: ShoppingCart, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Pending Confirmation', value: '18', trend: '+2 critical', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { label: 'Unpaid PAY_LATER', value: '09', icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { label: 'Total Revenue (MTD)', value: '$142,500', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
];

const actions = [
  { title: 'Verify Payment #9921', sub: 'PAY_LATER expired 2h ago', icon: AlertCircle, color: 'text-error', bgColor: 'bg-red-50' },
  { title: 'Assign VIN: Model S', sub: '3 units pending delivery', icon: Package, color: 'text-primary', bgColor: 'bg-blue-50' },
  { title: 'New Customer KYC', sub: 'Enterprise account: Zenith Corp', icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Real-time operational metrics for Lumina Fleet operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-full">
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold font-display">Revenue Performance</h3>
              <p className="text-sm text-slate-500">Comparison of Daily vs Target revenue</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    tab === 'Daily' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3 px-2">
             {[40, 60, 50, 85, 70, 95, 45].map((val, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2">
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${val}%` }}
                   className={`w-full rounded-t-lg transition-all ${i === 5 ? 'bg-primary-container' : 'bg-primary-container/20 hover:bg-primary-container/40'}`}
                 />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                 </span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold font-display mb-6">Action Required</h3>
          <div className="space-y-4 flex-1">
            {actions.map((action, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-slate-50 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.bgColor} ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 text-sm font-bold text-primary-container border border-primary-container rounded-lg hover:bg-primary-container/5 transition-all">
            View All Tasks
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-slate-50">
          <h3 className="text-xl font-bold font-display">Recent Orders Needing Processing</h3>
          <button className="text-primary-container font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.slice(0, 3).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-4 font-tabular text-sm font-bold text-slate-900">{order.id}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-[10px]">
                        {order.customer.initials}
                      </div>
                      <span className="text-sm font-medium">{order.customer.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-600">{order.product.name}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-primary-container text-sm font-bold hover:underline">Process</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
