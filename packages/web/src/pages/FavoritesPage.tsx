import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 pb-24 pt-32 md:px-12">
      <h1 className="mb-12 text-5xl font-bold tracking-tighter">
        Your <span className="text-primary">Selection.</span>
      </h1>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="flex flex-col gap-8 rounded-2xl border border-outline-variant/10 bg-white p-8 shadow-sm sm:flex-row">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-surface-container-low sm:w-48">
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400"
                alt="Product"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-grow flex-col justify-between py-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-2xl font-bold">KINETIC PULSE S1</h3>
                  <p className="text-sm text-muted-foreground">Color: Midnight Black</p>
                </div>
                <button className="text-muted-foreground transition-colors hover:text-error">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mt-8 flex items-end justify-between sm:mt-0">
                <div className="flex items-center gap-4 rounded-lg bg-surface-container-low px-4 py-2">
                  <button className="text-muted-foreground hover:text-primary"><Minus size={16} /></button>
                  <span className="w-4 text-center font-bold">1</span>
                  <button className="text-muted-foreground hover:text-primary"><Plus size={16} /></button>
                </div>
                <span className="text-2xl font-bold text-primary">74.900.000ð</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-outline-variant/30 p-8 text-center">
            <p className="text-muted-foreground">Muon them phu kien cho hanh trinh cua ban?</p>
            <Link to="/products" className="font-bold text-primary hover:underline">
              Tiep tuc mua sam
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 rounded-2xl bg-surface-container-low p-8">
            <h3 className="mb-8 text-xl font-bold">Order Summary</h3>
            <div className="mb-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">74.900.000ð</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-primary">Calculated at next step</span>
              </div>
              <div className="my-4 h-px bg-outline-variant/20" />
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold tracking-tighter">74.900.000ð</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full">
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              Gia da bao gom VAT. Phi dang ky bien so se duoc tinh toan dua tren dia chi nhan hang cua ban.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
