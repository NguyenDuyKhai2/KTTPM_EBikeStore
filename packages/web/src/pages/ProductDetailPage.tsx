import { useEffect, useMemo, useState } from "react";
import { Battery, Heart, RotateCcw, Star, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { favoritesAPI, productAPI } from "@ebike/shared-code/api";
import type { ProductDetail } from "@ebike/shared-code/types";
import { attachImageFallback, resolveProductImage } from "../utils/media";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [favoriteSaving, setFavoriteSaving] = useState(false);
  const [favoriteAdded, setFavoriteAdded] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Thiếu mã sản phẩm");
        setLoading(false);
        return;
      }

      try {
        const data = await productAPI.getDetail(id);
        setProduct(data);
        const defaultVariant = data.variants?.find((variant) => variant.defaultVariant) ?? data.variants?.[0];
        setSelectedColor(defaultVariant?.colorName || "Midnight");
        setSelectedImage(defaultVariant?.imageUrl || data.images?.[0] || "");
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const variantMedia = useMemo(() => {
    if (!product?.variants?.length) {
      return [];
    }

    return product.variants.map((variant, index) => ({
      name: variant.colorName || variant.variantName || `Variant ${index + 1}`,
      code: variant.colorHex || "#cbd5e1",
      image: variant.imageUrl || product.images?.[index] || product.images?.[0] || ""
    }));
  }, [product]);

  const colors = useMemo(() => {
    if (!variantMedia.length) {
      return [
        { name: "Midnight", code: "#18181b" },
        { name: "Silver", code: "#cbd5e1" },
        { name: "Electric Blue", code: "#1d4ed8" }
      ];
    }

    return variantMedia.map(({ name, code }) => ({ name, code }));
  }, [variantMedia]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center text-muted-foreground">Đang tải dữ liệu sản phẩm...</main>;
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="text-3xl font-bold">{error || "Sản phẩm không tìm thấy"}</h1>
        <button onClick={() => navigate("/products")} className="btn-primary">Quay lại sản phẩm</button>
      </main>
    );
  }

  const priceValue = product.discountPrice ?? product.price;
  const images = product.images?.length
    ? product.images
    : ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200"];
  const galleryImages = variantMedia.length
    ? Array.from(new Set(variantMedia.map((item) => item.image).filter(Boolean)))
    : images;
  const mainImage = selectedImage || galleryImages[0] || images[0];
  const specs = [
    { label: "Model code", value: product.specification?.modelCode || product.slug },
    { label: "Thương hiệu", value: product.specification?.brand || "YADEA" },
    { label: "Loại xe", value: product.specification?.vehicleType || product.category?.name || "E-Bike" },
    { label: "Quãng đường tối đa", value: product.specification?.maxRangeKm ? `${product.specification.maxRangeKm} km` : "150 km" },
    { label: "Vận tốc tối đa", value: product.specification?.maxSpeedKmh ? `${product.specification.maxSpeedKmh} km/h` : "95 km/h" },
    { label: "Công suất động cơ", value: product.specification?.motorPowerWatts ? `${product.specification.motorPowerWatts} W` : "5000 W" },
    { label: "Thời gian sạc đầy", value: product.specification?.chargingTimeHours ? `${product.specification.chargingTimeHours} giờ` : "3 - 4 giờ" },
    { label: "Loại pin", value: product.specification?.batteryType || "Lithium-ion NMC" },
    { label: "Dung lượng pin", value: product.specification?.batteryCapacityAh ? `${product.specification.batteryCapacityAh} Ah` : "60 Ah" },
    { label: "Hệ thống phanh", value: product.specification?.brakeType || "Disc brake" },
    { label: "Truyền động", value: product.specification?.driveType || "Hub drive" },
    { label: "Bảo hành", value: product.specification?.warrantyMonths ? `${product.specification.warrantyMonths} tháng` : "60 tháng" },
    { label: "Tính năng thông minh", value: product.specification?.smartFeatures || "Bảng điều khiển thông minh và kết nối ứng dụng" }
  ];

  const handleAddFavorite = async () => {
    if (!product?.id || favoriteSaving) {
      return;
    }

    setFavoriteSaving(true);
    setFavoriteMessage("");

    try {
      await favoritesAPI.add(Number(product.id));
      setFavoriteAdded(true);
      setFavoriteMessage("Đã thêm vào danh sách yêu thích.");
    } catch (favoriteError) {
      const status = (favoriteError as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        setFavoriteMessage("Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
        navigate("/auth");
        return;
      }
      setFavoriteMessage("Không thể thêm vào yêu thích. Vui lòng thử lại.");
    } finally {
      setFavoriteSaving(false);
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        product: {
          id: Number(product.id),
          name: product.name,
          slug: product.slug,
          price: priceValue,
          image: mainImage,
          categoryName: product.category?.name || "E-Bike"
        },
        selectedColor,
        quantity: 1
      }
    });
  };

  return (
    <div className="pb-20 pt-24">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 py-12 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="space-y-6 lg:col-span-7">
          <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container-low">
            <img
              className="h-full w-full object-cover"
              src={resolveProductImage(mainImage)}
              alt={product.name}
              onError={(event) => attachImageFallback(event, product.name)}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/20 bg-white/40 px-6 py-3 backdrop-blur-md">
              <RotateCcw size={16} />
              <span className="mono-label text-foreground">Tương tác để xoay</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {galleryImages.slice(0, 4).map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square overflow-hidden rounded-lg transition-all ${mainImage === image ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}`}
              >
                <img
                  className="h-full w-full object-cover"
                  src={resolveProductImage(image)}
                  alt={`${product.name} ${index + 1}`}
                  onError={(event) => attachImageFallback(event, product.name)}
                  referrerPolicy="no-referrer"
                />
              </button>
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
              <h3 className="mono-label text-foreground/50">Màu ngoại thất</h3>
              <div className="flex gap-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      const nextImage = variantMedia.find((variant) => variant.name === color.name)?.image;
                      if (nextImage) {
                        setSelectedImage(nextImage);
                      }
                    }}
                    className={`h-10 w-10 rounded-full transition-all ${selectedColor === color.name ? "ring-2 ring-primary ring-offset-4" : "hover:scale-110"}`}
                    style={{ backgroundColor: color.code }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mono-label text-foreground/50">Thông số nổi bật</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Zap size={18} className="text-primary" />
                  {product.specification?.motorPowerWatts
                    ? `${product.specification.motorPowerWatts}W công suất động cơ`
                    : product.specification?.smartFeatures || "Tăng tốc 0-60 km/h trong 3,9 giây"}
                </li>
                <li className="flex items-center gap-2">
                  <Battery size={18} className="text-primary" />
                  {product.specification?.maxRangeKm ? `${product.specification.maxRangeKm}km cho một lần sạc` : "150km cho một lần sạc"}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="btn-primary" onClick={handleBuyNow}>
              Mua ngay
            </button>
            <button
              type="button"
              onClick={handleAddFavorite}
              disabled={favoriteSaving || favoriteAdded}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Heart size={20} fill={favoriteAdded ? "currentColor" : "none"} />
              {favoriteSaving ? "Đang thêm..." : favoriteAdded ? "Đã thêm yêu thích" : "Thêm vào yêu thích"}
            </button>
          </div>

          {favoriteMessage ? (
            <p className={`text-sm ${favoriteAdded ? "text-primary" : "text-muted-foreground"}`}>
              {favoriteMessage}
            </p>
          ) : null}

          <div className="rounded-xl border-l-4 border-primary bg-surface-container-low p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Chính sách bảo hành 5 năm hoặc 50.000km. Miễn phí cứu hộ 24/7 trong năm đầu tiên sử dụng.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-4xl font-bold">Tính năng đột phá</h2>
            <p className="mt-2 text-muted-foreground">Kỹ thuật chính xác gặp gỡ công nghệ tương lai.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative overflow-hidden rounded-xl bg-white p-10 md:col-span-8">
              <div className="z-10 max-w-sm">
                <h3 className="mb-4 text-3xl font-bold">Màn hình LCD 7 inch</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Giao diện điều khiển thông minh tích hợp bản đồ thời gian thực, quản lý pin và kết nối smartphone.
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
                <h3 className="mb-2 text-xl font-bold">Đèn LED thông minh</h3>
                <p className="text-sm text-muted-foreground">
                  Hệ thống chiếu sáng thích ứng tự động điều chỉnh cường độ theo môi trường xung quanh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">Thông số kỹ thuật chi tiết</h2>
        <div className="overflow-hidden rounded-xl border border-outline-variant/15">
          <div className="grid grid-cols-2 border-b border-outline-variant/10 bg-surface-container-low p-6">
            <span className="mono-label text-muted-foreground">Hạng mục</span>
            <span className="mono-label text-muted-foreground">Thông số</span>
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
              <h2 className="text-4xl font-bold">Đánh giá thực tế</h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8/5 dựa trên 124 đánh giá</span>
              </div>
            </div>
            <button className="font-bold text-primary underline underline-offset-8">Viết đánh giá</button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              "Xe vận hành rất êm, khả năng bứt tốc ấn tượng và màn hình hiển thị trực quan.",
              "Màu sắc sang trọng, pin dùng lâu và rất hợp cho di chuyển hàng ngày.",
              "Hệ thống an toàn tốt, cảm giác lái tự tin ngay cả khi di chuyển trong mưa."
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
