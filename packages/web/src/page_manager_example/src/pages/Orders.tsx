import { useState } from 'react';
import { ShoppingCart, Clock, Truck, CheckCircle, Search, Filter, Eye, MoreVertical } from 'lucide-react';
import { orders } from '../mockData';
import { Link } from 'react-router-dom';

const quickStats = [
  { label: 'Total Orders', value: '1,284', trend: '+12%', icon: ShoppingCart, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Pending Confirmation', value: '43', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { label: 'In Transit', value: '156', icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { label: 'Completed', value: '1,085', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
];

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-display">Order Management</h2>
        <p className="text-slate-500 mt-1">Track and manage Lumina fleet acquisitions and customer deliveries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-full">{stat.trend}</span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Order Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Shipped</option>
            <option>In Transit</option>
            <option>Delivered</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Payment</label>
          <select className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all cursor-pointer">
            <option>All Payments</option>
            <option>Paid</option>
            <option>Partial</option>
            <option>Unpaid</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Showroom</label>
          <select className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all cursor-pointer">
            <option>Global View</option>
            <option>Downtown Hub</option>
            <option>Northside Station</option>
          </select>
        </div>
        <div className="flex gap-2 pb-0.5">
          <button className="px-6 py-2.5 text-primary-container font-bold text-sm hover:bg-slate-50 rounded-xl transition-all">Reset</button>
          <button className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-sm">Apply Filters</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Payment</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 font-tabular">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-container flex items-center justify-center font-bold text-[10px]">
                        {order.customer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
                        <p className="text-[10px] text-slate-400">{order.customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.product.name}</p>
                    <p className="text-[10px] text-slate-400">{order.product.variant}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                      order.status === 'Confirmed' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      order.status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      order.paymentStatus === 'Paid' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      order.paymentStatus === 'Partial' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold font-tabular text-sm text-slate-900">
                    ${order.product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <Link to={`/orders/${order.id}`} className="p-1.5 hover:text-primary-container transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 hover:text-slate-600 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Showing 1 to 4 of 1,284 orders</p>
          <div className="flex gap-2">
             <button className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-lg shadow-sm">1</button>
             <button className="px-3 py-1 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-all">2</button>
             <button className="px-3 py-1 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-all">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
