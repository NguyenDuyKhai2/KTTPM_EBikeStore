import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BatteryCharging, Bike, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "@ebike/shared-code/api";
import type { Product } from "@ebike/shared-code/types";
import { attachImageFallback, resolveProductImage } from "../utils/media";

const HERO_FALLBACK_IMAGE = "/images/hero-fallback.svg";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productAPI.list();
        setProducts(data);
      } catch {
        setProducts([]);
      }
    };

    void loadProducts();
  }, []);

  const featuredProducts = useMemo(() => {
    const featured = products.filter((item) => item.featured);
    const source = featured.length >= 2 ? featured : products;
    return source.slice(0, 2);
  }, [products]);

  const categoryCards = useMemo(() => {
    const first = featuredProducts[0];
    const second = featuredProducts[1];

    return [
      {
        title: first?.category?.name || "Xe may dien",
        label: "Hieu nang & Suc manh",
        text: first?.description || "Trai nghiem toc do va cong nghe dot pha tren moi cung duong.",
        image: first?.images?.[0] || "https://images.unsplash.com/photo-1614165933388-ad7f20989655?auto=format&fit=crop&q=80&w=800",
        to: first ? `/product/${first.slug}` : "/products"
      },
      {
        title: second?.category?.name || "Xe dap dien",
        label: "Linh hoat & Thong minh",
        text: second?.description || "Giai phap toi uu cho di chuyen do thi nhe nhang, ben bi va thoi trang.",
        image: second?.images?.[0] || "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?auto=format&fit=crop&q=80&w=800",
        to: second ? `/product/${second.slug}` : "/products"
      }
    ];
  }, [featuredProducts]);

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            className="h-full w-full object-cover grayscale-[10%]"
            src={resolveProductImage(featuredProducts[0]?.images?.[0]) || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1920"}
            alt="Kinetic Hero"
            onError={(event) => attachImageFallback(event, featuredProducts[0]?.name || "Kinetic Hero", HERO_FALLBACK_IMAGE)}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="mono-label mb-4 text-primary">The Future of Personal Mobility</p>
            <h1 className="mb-8 text-6xl font-bold leading-[0.9] tracking-tighter md:text-8xl">
              Khai pha Ky nguyen <br /> <span className="text-primary">Di chuyen Xanh</span>
            </h1>
            <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
              Tu nhung hanh trinh do thi linh hoat den nhung chuyen di xa day phong cach. Kham pha dong xe dien the he moi
              danh cho nhip song hien dai.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={featuredProducts[0] ? `/product/${featuredProducts[0].slug}` : "/products"} className="btn-primary group">
                Kham pha san pham noi bat
                <Bike className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/products" className="btn-secondary group">
                Xem tat ca san pham
                <Bike className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">San pham noi bat tu API</h2>
            <div className="mx-auto h-1 w-20 bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {categoryCards.map((item) => (
              <Link key={item.title + item.to} to={item.to} className="group relative h-[600px] overflow-hidden rounded-2xl">
                <img
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={resolveProductImage(item.image)}
                  alt={item.title}
                  onError={(event) => attachImageFallback(event, item.title)}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-12 text-white">
                  <span className="mono-label mb-4 inline-block rounded bg-white/10 px-3 py-1 text-primary backdrop-blur-md">
                    {item.label}
                  </span>
                  <h3 className="mb-6 text-5xl font-bold">{item.title}</h3>
                  <p className="mb-8 max-w-xs text-lg text-white/70 line-clamp-4">{item.text}</p>
                  <span className="inline-flex rounded bg-white px-8 py-3 font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    Xem chi tiet
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-surface-container-low py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 md:px-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <img
              className="relative z-10 rounded-2xl shadow-2xl"
              src={resolveProductImage(featuredProducts[0]?.images?.[0]) || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800"}
              alt="Technology"
              onError={(event) => attachImageFallback(event, featuredProducts[0]?.name || "Kinetic Technology", HERO_FALLBACK_IMAGE)}
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 z-20 max-w-xs rounded-xl bg-surface-container-lowest p-8 shadow-lg">
              <div className="mb-4 flex items-center gap-4">
                <Zap className="text-primary" fill="currentColor" />
                <span className="text-xl font-bold">GTR Engine</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Dong co nam cham vinh cuu the he moi, toi uu cho su em ai, manh me va tiet kiem nang luong.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-5xl font-bold leading-tight">
              Cong nghe doc quyen <br />
              <span className="text-primary">Dan dau hieu nang</span>
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BatteryCharging className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold">Lithium Max Core</h4>
                  <p className="text-muted-foreground">
                    Pin lithium mat do cao voi he thong quan ly nhiet thong minh, giup tang do ben va thoi gian su dung.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold">He dieu hanh Kinetic OS</h4>
                  <p className="text-muted-foreground">
                    Ket noi thong minh, dinh vi thoi gian thuc va cap nhat phan mem tu xa cho toan bo he sinh thai xe.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/products" className="inline-flex items-center gap-2 border-b-2 border-primary pb-1 font-bold text-primary">
              Kham pha cong nghe GTR
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
