import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl font-headline font-bold tracking-tighter mb-12">Your <span className="text-primary">Selection.</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-8">
          {/* Cart Item */}
          <div className="flex flex-col sm:flex-row gap-8 p-8 bg-white rounded-2xl border border-outline-variant/10 shadow-sm">
            <div className="w-full sm:w-48 aspect-square bg-surface-container-low rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400" 
                alt="Product" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-grow flex flex-col justify-between py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold font-headline mb-1">KINETIC PULSE S1</h3>
                  <p className="text-muted-foreground text-sm">Color: Midnight Black</p>
                </div>
                <button className="text-muted-foreground hover:text-error transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="flex justify-between items-end mt-8 sm:mt-0">
                <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-lg">
                  <button className="text-muted-foreground hover:text-primary"><Minus size={16} /></button>
                  <span className="font-bold w-4 text-center">1</span>
                  <button className="text-muted-foreground hover:text-primary"><Plus size={16} /></button>
                </div>
                <span className="text-2xl font-bold font-headline text-primary">74.900.000₫</span>
              </div>
            </div>
          </div>

          <div className="p-8 border-2 border-dashed border-outline-variant/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-muted-foreground">Muốn thêm phụ kiện cho hành trình của bạn?</p>
            <Link to="/models" className="text-primary font-bold hover:underline">Tiếp tục mua sắm</Link>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-low p-8 rounded-2xl sticky top-32">
            <h3 className="text-xl font-bold mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">74.900.000₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-bold">Calculated at next step</span>
              </div>
              <div className="h-px bg-outline-variant/20 my-4"></div>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold font-headline tracking-tighter">74.900.000₫</span>
              </div>
            </div>
            
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>
            
            <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
              Giá đã bao gồm VAT. Phí đăng ký biển số sẽ được tính toán dựa trên địa chỉ nhận hàng của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
