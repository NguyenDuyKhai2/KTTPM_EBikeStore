import { useEffect, useMemo, useState } from "react";
import { Battery, RotateCcw, Star, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { productAPI } from "@ebike/shared-code/api";
import type { ProductDetail } from "@ebike/shared-code/types";
import { attachImageFallback, resolveProductImage } from "../utils/media";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Thieu ma san pham");
        setLoading(false);
        return;
      }

      try {
        const data = await productAPI.getDetail(id);
        setProduct(data);
        setSelectedColor(data.variants?.[0]?.colorName || "Midnight");
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Khong the tai san pham");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const colors = useMemo(() => {
    if (!product?.variants?.length) {
      return [
        { name: "Midnight", code: "#18181b" },
        { name: "Silver", code: "#cbd5e1" },
        { name: "Electric Blue", code: "#1d4ed8" }
      ];
    }

    return product.variants.map((variant) => ({
      name: variant.colorName || "Default",
      code: variant.colorHex || "#cbd5e1"
    }));
  }, [product]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center text-muted-foreground">Dang tai du lieu san pham...</main>;
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="text-3xl font-bold">{error || "San pham khong tim thay"}</h1>
        <button onClick={() => navigate("/products")} className="btn-primary">Quay lai san pham</button>
      </main>
    );
  }

  const priceValue = product.discountPrice ?? product.price;
  const images = product.images?.length
    ? product.images
    : ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200"];
  const specs = [
    { label: "Model code", value: product.specification?.modelCode || product.slug },
    { label: "Thuong hieu", value: product.specification?.brand || "YADEA" },
    { label: "Loai xe", value: product.specification?.vehicleType || product.category?.name || "E-Bike" },
    { label: "Quang duong toi da", value: product.specification?.maxRangeKm ? `${product.specification.maxRangeKm} km` : "150 km" },
    { label: "Van toc toi da", value: product.specification?.maxSpeedKmh ? `${product.specification.maxSpeedKmh} km/h` : "95 km/h" },
    { label: "Cong suat dong co", value: product.specification?.motorPowerWatts ? `${product.specification.motorPowerWatts} W` : "5000 W" },
    { label: "Thoi gian sac day", value: product.specification?.chargingTimeHours ? `${product.specification.chargingTimeHours} gio` : "3 - 4 gio" },
    { label: "Loai pin", value: product.specification?.batteryType || "Lithium-ion NMC" },
    { label: "Dung luong pin", value: product.specification?.batteryCapacityAh ? `${product.specification.batteryCapacityAh} Ah` : "60 Ah" },
    { label: "He thong phanh", value: product.specification?.brakeType || "Disc brake" },
    { label: "Truyen dong", value: product.specification?.driveType || "Hub drive" },
    { label: "Bao hanh", value: product.specification?.warrantyMonths ? `${product.specification.warrantyMonths} thang` : "60 thang" },
    { label: "Tinh nang thong minh", value: product.specification?.smartFeatures || "Smart dashboard & app connectivity" }
  ];

  return (
    <div className="pb-20 pt-24">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 py-12 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="space-y-6 lg:col-span-7">
          <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container-low">
            <img
              className="h-full w-full object-cover"
              src={resolveProductImage(images[0])}
              alt={product.name}
              onError={(event) => attachImageFallback(event, product.name)}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/20 bg-white/40 px-6 py-3 backdrop-blur-md">
              <RotateCcw size={16} />
              <span className="mono-label text-foreground">Interact to rotate</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`aspect-square overflow-hidden rounded-lg ${index === 0 ? "ring-2 ring-primary" : "opacity-60"}`}
              >
                <img
                  className="h-full w-full object-cover"
                  src={resolveProductImage(image)}
                  alt={`${product.name} ${index + 1}`}
                  onError={(event) => attachImageFallback(event, product.name)}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10 lg:col-span-5">
          <div className="space-y-4">
            <span className="mono-label text-primary">{product.category?.name || "Prestige Series"}</span>
            <h1 className="text-5xl font-bold leading-none tracking-tighter lg:text-6xl">{product.name}</h1>
            <p className="text-3xl text-muted-foreground">{priceValue.toLocaleString("vi-VN")} VND</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="mono-label text-foreground/50">Exterior Finish</h3>
              <div className="flex gap-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-10 w-10 rounded-full transition-all ${selectedColor === color.name ? "ring-2 ring-primary ring-offset-4" : "hover:scale-110"}`}
                    style={{ backgroundColor: color.code }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mono-label text-foreground/50">Key Deliverables</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Zap size={18} className="text-primary" />
                  {product.specification?.motorPowerWatts
                    ? `${product.specification.motorPowerWatts}W motor output`
                    : product.specification?.smartFeatures || "0-60 km/h in 3.9 seconds"}
                </li>
                <li className="flex items-center gap-2">
                  <Battery size={18} className="text-primary" />
                  {product.specification?.maxRangeKm ? `${product.specification.maxRangeKm}km range on single charge` : "150km range on single charge"}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              className="btn-primary"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    product: {
                      id: Number(product.id),
                      name: product.name,
                      slug: product.slug,
                      price: priceValue,
                      image: images[0],
                      categoryName: product.category?.name || "E-Bike"
                    },
                    selectedColor,
                    quantity: 1
                  }
                })
              }
            >
              Mua ngay
            </button>
            <button className="btn-secondary">Dang ky lai thu</button>
          </div>

          <div className="rounded-xl border-l-4 border-primary bg-surface-container-low p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Chinh sach bao hanh 5 nam hoac 50.000km. Mien phi cuu ho 24/7 trong nam dau tien su dung.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-4xl font-bold">Tinh nang dot pha</h2>
            <p className="mt-2 text-muted-foreground">Ky thuat chinh xac gap go cong nghe tuong lai.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative overflow-hidden rounded-xl bg-white p-10 md:col-span-8">
              <div className="z-10 max-w-sm">
                <h3 className="mb-4 text-3xl font-bold">Man hinh LCD 7 inch</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Giao dien dieu khien thong minh tich hop ban do thoi gian thuc, quan ly pin va ket noi smartphone.
                </p>
              </div>
              <img
                className="absolute bottom-0 right-0 h-2/3 w-2/3 rounded-tl-3xl object-cover opacity-20"
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                alt="LCD Display"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 rounded-xl bg-white p-8 text-center md:col-span-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="text-primary" size={32} />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">Den LED thong minh</h3>
                <p className="text-sm text-muted-foreground">
                  He thong chieu sang thich ung tu dong dieu chinh cuong do theo moi truong xung quanh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">Thong so ky thuat chi tiet</h2>
        <div className="overflow-hidden rounded-xl border border-outline-variant/15">
          <div className="grid grid-cols-2 border-b border-outline-variant/10 bg-surface-container-low p-6">
            <span className="mono-label text-muted-foreground">Hang muc</span>
            <span className="mono-label text-muted-foreground">Thong so</span>
          </div>
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`grid grid-cols-2 p-6 transition-colors hover:bg-surface-container-low ${index % 2 === 1 ? "bg-surface-container-low/30" : ""}`}
            >
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold">Danh gia thuc te</h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8/5 dua tren 124 danh gia</span>
              </div>
            </div>
            <button className="font-bold text-primary underline underline-offset-8">Viet danh gia</button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              "Xe van hanh rat em, kha nang but toc an tuong va man hinh hien thi truc quan.",
              "Mau sac sang trong, pin dung lau va rat hop cho di chuyen hang ngay.",
              "He thong an toan tot, cam giac lai tu tin ngay ca khi di chuyen trong mua."
            ].map((text, index) => (
              <div key={index} className="space-y-6 rounded-xl bg-surface-container-low/50 p-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest" />
                  <div>
                    <h4 className="font-bold">Kinetic Owner</h4>
                    <p className="text-xs text-muted-foreground">Verified buyer</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
