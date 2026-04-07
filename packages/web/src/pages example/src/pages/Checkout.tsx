import React from 'react';
import { CreditCard, Landmark, Calendar, ShieldCheck, Lock, ArrowRight, Zap } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto min-h-screen">
      <div className="mb-16">
        <span className="mono-label text-primary mb-4 block">Secure Checkout</span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Completing your <br/>high-performance journey.</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Payment Form */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8">Select Payment Method</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-xl border-2 border-primary bg-surface-container-low">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="mt-1 text-primary focus:ring-primary" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Bank Transfer</span>
                      <Landmark className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Direct transfer from your verified bank account. Secure and instant.</p>
                  </div>
                </label>
              </div>

              <div className="p-6 rounded-xl border-2 border-transparent bg-surface-container-low hover:bg-surface-container-high transition-all">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input type="radio" name="payment" className="mt-1 text-primary focus:ring-primary" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Credit Card</span>
                      <CreditCard className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, or American Express. Secured via 256-bit encryption.</p>
                  </div>
                </label>
              </div>

              <div className="p-6 rounded-xl border-2 border-transparent bg-surface-container-low hover:bg-surface-container-high transition-all">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input type="radio" name="payment" className="mt-1 text-primary focus:ring-primary" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Finance / Installment</span>
                      <Calendar className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Flexible monthly plans starting from 0% APR for qualified buyers.</p>
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/15">
            <h3 className="text-xl font-bold mb-6">Billing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">Full Name</label>
                <input type="text" defaultValue="Nguyen Hoang Long" className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-0 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">Email Address</label>
                <input type="email" defaultValue="hoanglong.n@lumina.com" className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 px-0 font-medium" />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-outline-variant/15 shadow-sm">
              <div className="aspect-[16/9] bg-surface-container-low mb-8 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800" 
                  alt="Product" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Lumina Neon S</h3>
                  <p className="text-sm text-muted-foreground">Edition: Matte Carbon</p>
                </div>
                <span className="font-mono text-xl font-bold text-primary">85.000.000₫</span>
              </div>

              <div className="space-y-4 border-t border-outline-variant/15 pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-medium">85.000.000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Eco-Incentive Tax</span>
                  <span className="font-mono font-medium text-error">- 1.200.000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Registration Fee</span>
                  <span className="font-mono font-medium">2.500.000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-mono font-medium text-primary">Free</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-foreground">
                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-lg font-bold">Total Amount</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-headline tracking-tighter">86.300.000₫</span>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">VAT INCLUDED</p>
                  </div>
                </div>
                <button className="w-full py-5 bg-primary text-white rounded-lg font-bold tracking-tight text-lg hover:opacity-90 transition-all">
                  Xác nhận đặt hàng
                </button>
                <p className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Lock size={14} />
                  Encrypted Secure Payment
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-surface-container-low rounded-xl flex items-center gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-primary" fill="currentColor" />
                  <span className="mono-label text-primary">READY TO DEPLOY</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Your Neon S is reserved for 24 hours. Once confirmed, production tracking begins.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
