import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Bike, BatteryCharging, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover grayscale-[10%]" 
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1920" 
            alt="Kinetic Hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="mono-label text-primary mb-4">The Future of Personal Mobility</p>
            <h1 className="text-6xl md:text-8xl font-bold font-headline leading-[0.9] tracking-tighter mb-8">
              Khai phá Kỷ nguyên <br/> <span className="text-primary">Di chuyển Xanh</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-md leading-relaxed">
              Từ những hành trình đô thị linh hoạt đến những chuyến đi xa đầy phong cách. Khám phá dòng Xe máy điện và Xe đạp điện thế hệ mới nhất của KINETIC.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/models" className="btn-primary flex items-center gap-2 group">
                Khám phá Xe máy điện
                <Bike className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/models" className="btn-secondary flex items-center gap-2 group">
                Khám phá Xe đạp điện
                <Bike className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-bold tracking-tight mb-4">Giải pháp di chuyển cho mọi nhu cầu</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl h-[600px] cursor-pointer"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1614165933388-ad7f20989655?auto=format&fit=crop&q=80&w=800" 
                alt="Electric Motorbikes"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 text-white">
                <span className="mono-label text-primary mb-4 inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded">Hiệu năng & Sức mạnh</span>
                <h3 className="text-5xl font-headline font-bold mb-6">Xe máy điện</h3>
                <p className="text-white/70 max-w-xs mb-8 text-lg">Trải nghiệm tốc độ và công nghệ đột phá trên mọi cung đường trường.</p>
                <button className="bg-white text-primary px-8 py-3 rounded font-bold hover:bg-primary hover:text-white transition-all duration-300">Xem các dòng xe</button>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl h-[600px] cursor-pointer"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?auto=format&fit=crop&q=80&w=800" 
                alt="Electric Bicycles"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 text-white">
                <span className="mono-label text-primary mb-4 inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded">Linh hoạt & Thông minh</span>
                <h3 className="text-5xl font-headline font-bold mb-6">Xe đạp điện</h3>
                <p className="text-white/70 max-w-xs mb-8 text-lg">Giải pháp tối ưu cho di chuyển đô thị nhẹ nhàng, bền bỉ và thời trang.</p>
                <button className="bg-white text-primary px-8 py-3 rounded font-bold hover:bg-primary hover:text-white transition-all duration-300">Xem các dòng xe</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <img 
                className="rounded-2xl relative z-10 shadow-2xl" 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800" 
                alt="Technology"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-surface p-8 rounded-xl shadow-lg z-20 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <Zap className="text-primary" fill="currentColor" />
                  <span className="font-headline font-bold text-xl">GTR Engine</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Động cơ xoay chiều nam châm vĩnh cửu thế hệ mới, tối ưu cho cả xe máy và xe đạp điện.</p>
              </div>
            </div>
            
            <div className="space-y-12">
              <h2 className="text-5xl font-headline font-bold tracking-tight leading-tight">
                Công nghệ độc quyền <br/><span className="text-primary">Dẫn đầu hiệu năng</span>
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BatteryCharging className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Lithium Max Core</h4>
                    <p className="text-muted-foreground">Pin Lithium ion mật độ cao với hệ thống quản lý nhiệt thông minh, tích hợp hoàn hảo trên mọi khung sườn.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Hệ điều hành Kinetic OS</h4>
                    <p className="text-muted-foreground">Kết nối 5G, định vị thời gian thực và cập nhật phần mềm qua mạng (OTA) cho cả xe máy và xe đạp.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/technology" className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-primary pb-1 group">
                Khám phá công nghệ GTR
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
