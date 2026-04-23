import { Package, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { products } from '../mockData';

export default function Products() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-display">Fleet Inventory</h2>
          <p className="text-slate-500 mt-1">Monitor and managing available Lumina electric vehicle units.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Model</span>
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-4 items-center overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All Units', 'Sedans', 'SUVs', 'Accessory', 'Archive'].map((tab, i) => (
              <button 
                key={tab}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                  i === 0 ? 'bg-primary-container text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
         </div>
         <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input
               type="text"
               placeholder="Search models..."
               className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
             />
           </div>
           <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
              <Filter className="w-5 h-5" />
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex transition-all hover:shadow-md hover:border-slate-200">
            <div className="w-48 bg-slate-100 flex-shrink-0 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-slate-900 shadow-sm">
                 {product.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-slate-900">{product.name}</h4>
                  <button className="text-slate-300 hover:text-slate-900 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-1.5 mb-4">
                  {product.colors.map(color => (
                    <div 
                      key={color} 
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" 
                      style={{ backgroundColor: color }} 
                    />
                  ))}
                </div>
                <div className="flex items-center gap-6">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Price</p>
                     <p className="font-bold text-slate-900 mt-0.5">${product.price.toLocaleString()}</p>
                   </div>
                   <div className="h-8 w-[1px] bg-slate-100" />
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Stock</p>
                     <p className={`font-bold mt-0.5 ${product.status === 'Low Stock' ? 'text-error' : 'text-slate-900'}`}>{product.stock} Units</p>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                   product.status === 'Live' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                 }`}>
                   {product.status}
                 </span>
                 <button className="text-sm font-bold text-primary-container hover:underline">Edit Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
