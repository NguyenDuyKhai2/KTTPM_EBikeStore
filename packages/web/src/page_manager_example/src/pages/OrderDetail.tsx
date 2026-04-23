import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Printer, Edit, QrCode, Package, Truck, Store, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { orders } from '../mockData';

export default function OrderDetail() {
  const { id } = useParams();
  const order = orders.find(o => o.id === id) || orders[0];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            <Link to="/orders" className="hover:text-primary transition-all">ORDERS</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">{order.id}</span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-bold font-display text-on-surface">Order {order.id}</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">Confirmed</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm">
            <Edit className="w-4 h-4" />
            <span>Edit Order</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center text-sm font-bold text-on-surface">
              <h3 className="font-display">Purchased Products</h3>
              <span className="text-slate-400">2 Items</span>
            </div>
            <div className="divide-y divide-slate-50">
              <div className="p-6 flex gap-6 items-start">
                <div className="w-24 h-24 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 shadow-inner">
                  <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">VEHICLE</p>
                      <h4 className="text-xl font-bold text-slate-900">{order.product.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{order.product.variant} / 21" Arachnid Wheels / Autopilot</p>
                    </div>
                    <p className="font-tabular font-bold text-slate-900">${order.product.price.toLocaleString()}.00</p>
                  </div>
                  <div className="mt-4 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> VIN: {order.product.vin}</span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /> In Stock</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex gap-6 items-start">
                 <div className="w-24 h-24 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
                    <Truck className="w-8 h-8 text-slate-400" />
                 </div>
                 <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ACCESSORY</p>
                      <h4 className="text-xl font-bold text-slate-900">Lumina Wall Connector - Gen 3</h4>
                      <p className="text-sm text-slate-500 mt-1">18' Cable / Hardwired / White Finish</p>
                    </div>
                    <p className="font-tabular font-bold text-slate-900">$550.00</p>
                  </div>
                  <div className="mt-4 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> SKU: LWC-G3-WH</span>
                    <span className="flex items-center gap-1.5 text-blue-600"><Truck className="w-3.5 h-3.5" /> Ready for Pickup</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 flex flex-col gap-3">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="font-tabular">$85,540.00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Taxes (8.5%)</span>
                <span className="font-tabular">$7,270.90</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-xl pt-4 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-tabular">$92,810.90</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display">Internal Notes</h3>
              <button className="text-primary-container font-bold text-sm hover:underline">Add Note</button>
            </div>
            <div className="space-y-4">
              <div className="p-5 bg-surface-container-low rounded-xl border-l-4 border-slate-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-slate-900">Sarah Jenkins</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oct 24, 14:20</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Customer requested a walk-through of the autopilot features upon pickup. Assigned specialist: Dave M.
                </p>
              </div>
              <div className="p-5 bg-surface-container-low rounded-xl border-l-4 border-slate-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-slate-900">System Bot</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oct 23, 09:12</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Financing approved by Lumina Credit Services. Credit score verified according to standard fleet protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6">
               <h3 className="text-lg font-bold font-display mb-6">Customer Details</h3>
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-lg">
                   {order.customer.initials}
                 </div>
                 <div className="overflow-hidden">
                   <p className="font-bold text-slate-900 truncate">{order.customer.name}</p>
                   <p className="text-sm text-slate-500 truncate">{order.customer.email}</p>
                 </div>
               </div>
               <div className="space-y-4 pt-6 border-t border-slate-50">
                 <div className="flex gap-4 items-start">
                   <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                   <p className="text-sm text-slate-600 font-medium">{order.customer.phone}</p>
                 </div>
                 <div className="flex gap-4 items-start">
                   <Store className="w-5 h-5 text-slate-400 flex-shrink-0" />
                   <p className="text-sm text-slate-600 leading-relaxed font-medium">4228 Oakwood Circle, San Jose, CA 95134</p>
                 </div>
               </div>
             </div>
             <div className="p-6 bg-slate-50/50 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Showroom</p>
                <div className="flex gap-4 items-start mb-4">
                  <Store className="w-5 h-5 text-primary-container flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">San Jose South - Lumina Experience</p>
                    <p className="text-slate-500 mt-1">1020 Innovation Drive, San Jose, CA 95110</p>
                  </div>
                </div>
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                  <img src="https://picsum.photos/seed/map/400/200" alt="Showroom Map" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
             </div>
           </div>

           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
             <h3 className="text-lg font-bold font-display mb-6">Payment Method</h3>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-container" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Lumina Financing</p>
                    <p className="text-[10px] text-slate-400 font-medium">Loan ID: LN-9201-B</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-primary-container rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Payment Status</span>
                  <span className="font-bold text-emerald-600">Paid in Full</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Transaction Date</span>
                  <span className="font-bold">Oct 24, 2023</span>
                </div>
             </div>
           </div>

           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
             <h3 className="text-lg font-bold font-display mb-8">Status Timeline</h3>
             <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
               {[
                 { label: 'Order Placed', date: 'Oct 22, 2023 - 11:45 AM', completed: true },
                 { label: 'Payment Verified', date: 'Oct 23, 2023 - 09:30 AM', completed: true },
                 { label: 'Ready for Pickup', date: 'Estimated: Oct 28, 2023', completed: false },
               ].map((step, i) => (
                 <div key={i} className="relative pl-10">
                   <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center ${
                     step.completed ? 'bg-primary-container' : 'bg-slate-200'
                   }`}>
                     {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                   </div>
                   <div>
                     <p className={`text-sm font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                     <p className="text-xs text-slate-500 mt-1">{step.date}</p>
                   </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-8 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                View Detailed Logs
             </button>
           </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-80px)] max-w-6xl z-40">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 text-white rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-10">
            <div>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Current Status</p>
              <p className="text-lg font-bold">Awaiting Delivery Appointment</p>
            </div>
            <div className="hidden md:block h-10 w-[1px] bg-white/10" />
            <div className="hidden md:block">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Assigned Agent</p>
              <p className="text-lg font-bold">Sarah Jenkins</p>
            </div>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-sm transition-all">Cancel Order</button>
            <button className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all shadow-lg">Schedule Delivery</button>
          </div>
        </div>
      </div>
    </div>
  );
}
