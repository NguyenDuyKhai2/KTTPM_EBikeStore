import React, { useState } from 'react';
import { Search, MapPin, Phone, Clock, Navigation, Plus, Minus } from 'lucide-react';

const stores = [
  {
    id: 1,
    name: 'Kinetic HCMC Central',
    type: 'Flagship Store',
    address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    phone: '+84 28 3821 1234',
    hours: '08:00 - 21:00 (Mon - Sun)',
    coords: { lat: 10.7769, lng: 106.7009 },
    isFlagship: true
  },
  {
    id: 2,
    name: 'Kinetic South Saigon',
    type: 'Service Center',
    address: '456 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    phone: '+84 28 3775 5678',
    hours: '09:00 - 20:00 (Mon - Sat)',
    coords: { lat: 10.7294, lng: 106.7006 },
    isFlagship: false
  },
  {
    id: 3,
    name: 'Kinetic Thu Duc',
    type: 'Pop-up Boutique',
    address: '789 Võ Văn Ngân, Thủ Đức, TP. Hồ Chí Minh',
    phone: '+84 28 3991 9999',
    hours: '10:00 - 22:00 (Mon - Sun)',
    coords: { lat: 10.8512, lng: 106.7721 },
    isFlagship: false
  }
];

const StoreLocator = () => {
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header */}
      <section className="px-6 md:px-12 py-12 bg-surface-container-low mt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-headline font-bold tracking-tighter mb-8">Find your local <span className="text-primary">Kinetic Center.</span></h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <select className="w-full h-14 px-6 bg-white appearance-none border-none focus:ring-2 focus:ring-primary/20 font-medium text-muted-foreground transition-all rounded-lg">
                <option>Tỉnh / Thành phố</option>
                <option>Hồ Chí Minh</option>
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
              </select>
            </div>
            <div className="relative">
              <select className="w-full h-14 px-6 bg-white appearance-none border-none focus:ring-2 focus:ring-primary/20 font-medium text-muted-foreground transition-all rounded-lg">
                <option>Quận / Huyện</option>
                <option>Quận 1</option>
                <option>Quận 7</option>
                <option>Quận Thủ Đức</option>
              </select>
            </div>
            <button className="h-14 px-8 bg-primary text-white font-headline font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all rounded-lg">
              <Search size={20} />
              SEARCH STORES
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Map & Store List */}
      <section className="flex-1 flex flex-col lg:flex-row min-h-[700px]">
        {/* Sidebar: Store List */}
        <div className="w-full lg:w-[450px] bg-white overflow-y-auto max-h-[700px] lg:max-h-none custom-scrollbar border-r border-outline-variant/10">
          <div className="p-8 border-b border-surface-container">
            <p className="mono-label text-muted-foreground mb-1">Showing</p>
            <h2 className="text-2xl font-headline font-bold">3 Centers in Ho Chi Minh</h2>
          </div>
          
          {stores.map((store) => (
            <div 
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`p-8 border-b border-surface-container hover:bg-surface-container-low transition-colors group cursor-pointer ${selectedStore.id === store.id ? 'bg-surface-container-low' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-tighter mb-2 rounded ${store.isFlagship ? 'bg-primary/10 text-primary' : 'bg-secondary-container text-muted-foreground'}`}>
                    {store.type}
                  </span>
                  <h3 className={`text-xl font-headline font-bold group-hover:text-primary transition-colors ${selectedStore.id === store.id ? 'text-primary' : ''}`}>
                    {store.name}
                  </h3>
                </div>
                <MapPin className={store.isFlagship ? 'text-primary' : 'text-muted-foreground'} fill={store.isFlagship ? 'currentColor' : 'none'} />
              </div>
              
              <div className="space-y-3 text-muted-foreground text-sm mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  <p>{store.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0" />
                  <p>{store.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="shrink-0" />
                  <p>{store.hours}</p>
                </div>
              </div>
              
              <button className="w-full py-3 bg-surface-container-highest text-primary font-headline font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 rounded-lg">
                <Navigation size={18} />
                CHỈ ĐƯỜNG
              </button>
            </div>
          ))}
        </div>

        {/* Map View (Mock) */}
        <div className="flex-1 bg-surface-container relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200')" }}
          >
            <div className="absolute inset-0 bg-primary/5"></div>
          </div>
          
          {/* Mock Map Pins */}
          {stores.map((store) => (
            <div 
              key={store.id}
              className="absolute transition-all duration-500"
              style={{ 
                top: `${30 + store.id * 15}%`, 
                left: `${40 + store.id * 10}%` 
              }}
            >
              <div className="flex flex-col items-center">
                <div className={`px-4 py-2 rounded-lg font-headline font-bold text-xs shadow-xl mb-1 flex items-center gap-2 transition-all ${selectedStore.id === store.id ? 'bg-primary text-white scale-110' : 'bg-white text-foreground opacity-80'}`}>
                  {store.name.toUpperCase()}
                </div>
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${selectedStore.id === store.id ? 'bg-primary scale-125 animate-pulse' : 'bg-muted-foreground'}`}></div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            <button className="w-12 h-12 bg-white flex items-center justify-center shadow-lg hover:bg-surface-container-low rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <button className="w-12 h-12 bg-white flex items-center justify-center shadow-lg hover:bg-surface-container-low rounded-lg transition-colors">
              <Minus size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreLocator;
