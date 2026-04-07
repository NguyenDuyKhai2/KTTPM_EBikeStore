import React, { useState, useEffect } from 'react';
import { Star, Shield, Zap, Battery, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState('Midnight');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const colors = [
    { name: 'Midnight', class: 'bg-zinc-900' },
    { name: 'Silver', class: 'bg-slate-300' },
    { name: 'Electric Blue', class: 'bg-blue-900' }
  ];

  const specs = [
    { label: 'Loại động cơ', value: 'Mid-Drive BLDC Motor' },
    { label: 'Công suất danh định', value: '5.000 Watts' },
    { label: 'Tốc độ tối đa', value: '95 km/h' },
    { label: 'Loại Pin', value: 'Lithium-ion NMC (72V - 60Ah)' },
    { label: 'Thời gian sạc đầy', value: '3 - 4 giờ (Sạc nhanh)' },
    { label: 'Trọng lượng', value: '115 kg' }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Product Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden group"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200" 
              alt="Kinetic Pulse S1"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <RotateCcw size={16} />
              <span className="mono-label text-foreground font-bold">Interact to rotate</span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square bg-surface-container-high rounded-lg overflow-hidden cursor-pointer transition-all ${i === 1 ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}>
                <img 
                  className="w-full h-full object-cover" 
                  src={`https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=300&sig=${i}`} 
                  alt={`Thumb ${i}`}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="mono-label text-primary">Prestige Series</span>
            <h1 className="text-5xl lg:text-6xl font-headline font-bold tracking-tighter leading-none">KINETIC PULSE S1</h1>
            <p className="text-3xl font-headline text-muted-foreground">74.900.000 VNĐ</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="mono-label text-foreground/50">Exterior Finish</h3>
              <div className="flex gap-4">
                {colors.map((color) => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full ${color.class} transition-all ${selectedColor === color.name ? 'ring-2 ring-primary ring-offset-4' : 'hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mono-label text-foreground/50">Key Deliverables</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Zap size={18} className="text-primary" />
                  0-60 km/h in 3.9 seconds
                </li>
                <li className="flex items-center gap-2">
                  <Battery size={18} className="text-primary" />
                  150km range on single charge
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="btn-primary">Mua ngay</button>
            <button className="btn-secondary">Đăng ký lái thử</button>
          </div>

          <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-primary">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chính sách bảo hành vàng 5 năm hoặc 50.000km. Miễn phí cứu hộ 24/7 trong năm đầu tiên sử dụng.
            </p>
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-4xl font-headline font-bold tracking-tight">Tính năng đột phá</h2>
            <p className="text-muted-foreground mt-2">Kỹ thuật chính xác gặp gỡ công nghệ tương lai.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white p-10 rounded-xl flex flex-col justify-between overflow-hidden relative group">
              <div className="z-10 max-w-sm">
                <h3 className="text-3xl font-headline font-bold mb-4">Màn hình LCD 7 inch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Giao diện điều khiển thông minh tích hợp bản đồ thời gian thực, quản lý pin và kết nối smartphone qua Bluetooth 5.0.
                </p>
              </div>
              <img 
                className="absolute bottom-0 right-0 w-2/3 h-2/3 object-cover rounded-tl-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-700" 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                alt="LCD Display"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="md:col-span-4 bg-white p-8 rounded-xl flex flex-col items-center text-center justify-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="text-primary" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold mb-2">Đèn LED thông minh</h3>
                <p className="text-sm text-muted-foreground">
                  Hệ thống chiếu sáng thích ứng tự động điều chỉnh cường độ theo môi trường xung quanh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Table */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-headline font-bold mb-12 text-center">Thông số kỹ thuật chi tiết</h2>
        <div className="border border-outline-variant/15 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 p-6 bg-surface-container-low border-b border-outline-variant/10">
            <span className="mono-label text-muted-foreground">Hạng mục</span>
            <span className="mono-label text-muted-foreground">Thông số</span>
          </div>
          {specs.map((spec, idx) => (
            <div key={idx} className={`grid grid-cols-2 p-6 hover:bg-surface-container-low transition-colors ${idx % 2 === 0 ? '' : 'bg-surface-container-low/30'}`}>
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-headline font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-headline font-bold tracking-tight">Đánh giá thực tế</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill={i < 5 ? "currentColor" : "none"} />)}
                </div>
                <span className="text-muted-foreground text-sm">4.8/5 dựa trên 124 đánh giá</span>
              </div>
            </div>
            <button className="text-primary font-headline font-bold underline underline-offset-8">Viết đánh giá</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Trần Minh Quân', text: 'Xe vận hành cực kỳ êm, khả năng bứt tốc ấn tượng hơn hẳn các dòng xe xăng cùng phân khúc. Màn hình rất trực quan.' },
              { name: 'Lê Hồng Nhung', text: 'Màu sắc bên ngoài rất sang trọng, đặc biệt là bản màu Đen nhám. Pin dùng khá lâu, đi làm cả tuần mới cần sạc 1 lần.' },
              { name: 'Nguyễn Hoàng Nam', text: 'Hệ thống ABS cứu tôi mấy lần khi phanh gấp lúc trời mưa. Đáng đồng tiền bát gạo cho một mẫu xe cao cấp.' }
            ].map((review, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-surface-container-low/50 space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest"></div>
                  <div>
                    <h4 className="font-headline font-bold">{review.name}</h4>
                    <p className="text-xs text-muted-foreground">Pulse S1 Owner</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
