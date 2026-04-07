import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, SlidersHorizontal, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 'pulse-s1',
    name: 'KINETIC Pulse S1',
    type: 'SCOOTER',
    range: '95KM',
    price: '32.900.000₫',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
    badge: 'BEST SELLER',
    colors: ['#1a1a1a', '#3b82f6', '#d1d5db']
  },
  {
    id: 'velocity-x',
    name: 'APEX Velocity X',
    type: 'XE MÁY ĐIỆN',
    range: '120KM',
    price: '85.000.000₫',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600',
    badge: '',
    colors: ['#1a1a1a', '#ef4444']
  },
  {
    id: 'city-flow-pro',
    name: 'CITY Flow Pro',
    type: 'SCOOTER',
    range: '65KM',
    price: '24.500.000₫',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=600',
    badge: 'MỚI',
    colors: ['#1a1a1a', '#9ca3af']
  },
  {
    id: 'neo-retro-400',
    name: 'NEO Retro 400',
    type: 'XE MÁY ĐIỆN',
    range: '110KM',
    price: '68.200.000₫',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600',
    badge: '',
    colors: ['#3b82f6', '#1a1a1a']
  },
  {
    id: 'vibe-lite',
    name: 'VIBE Lite',
    type: 'SCOOTER',
    range: '45KM',
    price: '18.900.000₫',
    image: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?auto=format&fit=crop&q=80&w=600',
    badge: '',
    colors: ['#f97316', '#ffffff']
  },
  {
    id: 'grand-tour-gt',
    name: 'GRAND Tour GT',
    type: 'XE MÁY ĐIỆN',
    range: '150KM',
    price: '112.500.000₫',
    image: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=600',
    badge: '',
    colors: ['#064e3b', '#1a1a1a']
  }
];

const Models = () => {
  const [priceRange, setPriceRange] = useState(50);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&q=80&w=2000" 
          alt="Collection 2024" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6 md:px-12">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-bold tracking-widest text-sm mb-4 block">2024 COLLECTION</span>
              <h1 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter leading-none mb-6">
                Precision<br />
                <span className="text-primary">Engineering.</span>
              </h1>
              <p className="text-white/70 max-w-md text-lg leading-relaxed">
                Discover the next generation of electric mobility. Engineered for performance, designed for the future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Dòng xe</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" defaultChecked />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Scooter</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Xe máy điện</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Quãng đường</h3>
              <div className="space-y-3">
                {['Dưới 50km', '50 - 80km', 'Trên 80km'].map((range) => (
                  <label key={range} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="range" className="w-5 h-5 border-outline-variant text-primary focus:ring-primary" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Màu sắc</h3>
              <div className="flex flex-wrap gap-3">
                {['#1a1a1a', '#d1d5db', '#3b82f6', '#ef4444'].map((color) => (
                  <button 
                    key={color}
                    className="w-8 h-8 rounded-full border border-outline-variant/30 shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Phân khúc giá</h3>
              <input 
                type="range" 
                min="15" 
                max="180" 
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-4 text-xs font-bold text-muted-foreground">
                <span>15M VND</span>
                <span>180M VND</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-headline font-bold">Tất cả sản phẩm</h2>
                <p className="text-muted-foreground text-sm mt-1">Hiển thị {products.length} mẫu xe mới nhất</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors">
                <SlidersHorizontal size={16} />
                Sắp xếp
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl border border-outline-variant/10 overflow-hidden hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {product.badge && (
                      <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest rounded-full ${
                        product.badge === 'MỚI' ? 'bg-primary text-white' : 'bg-black text-white'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-headline font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                      <span className="text-primary font-bold">{product.price}</span>
                    </div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-6">
                      {product.type} | {product.range} RANGE
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {product.colors.map((color, i) => (
                          <div 
                            key={i}
                            className="w-3 h-3 rounded-full border border-outline-variant/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <Link 
                        to={`/models/${product.id}`} 
                        className="text-sm font-bold flex items-center gap-1 group/link"
                      >
                        XEM CHI TIẾT
                        <div className="w-8 h-[2px] bg-primary group-hover:w-12 transition-all ml-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low font-bold transition-colors">2</button>
              <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low font-bold transition-colors">3</button>
              <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low flex items-center justify-center transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Models;
