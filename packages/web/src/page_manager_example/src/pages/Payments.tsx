import { Search, Filter, Download, CheckCircle, Clock, AlertCircle, FileText, MoreVertical } from 'lucide-react';
import { payments } from '../mockData';

export default function Payments() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface">Payment Transactions</h2>
          <p className="text-slate-500 mt-1">Review and reconcile financial records for all fleet transactions.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Settled Volume (30d)', value: '$1.4M', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: 'Pending Deposits', value: '$242K', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Failed Payments', value: '12', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
          { label: 'Available Balance', value: '$84.2K', icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Invoice ID or Transaction Hash..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">Date Range</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-900 font-tabular">{payment.invoiceId}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{payment.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                        {payment.customer.initials}
                      </div>
                      <span className="text-sm text-slate-900 font-medium">{payment.customer.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-500">{payment.method}</span>
                  </td>
                  <td className="px-8 py-5 font-bold font-tabular text-sm text-slate-900">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      payment.status === 'Success' ? 'bg-green-50 text-green-700 border-green-100' :
                      payment.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-900">
                      <FileText className="w-4 h-4" />
                    </button>
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
