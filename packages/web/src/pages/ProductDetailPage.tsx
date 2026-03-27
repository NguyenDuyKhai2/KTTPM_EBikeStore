import { useState } from "react";
import { ArrowLeft, Star, Heart, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  specs: {
    range: string;
    charge: string;
    weight: string;
  };
  colors: {
    name: string;
    code: string;
  }[];
  inStock: boolean;
  warranty?: string;
  features?: string[];
}

const productsData: Record<number, ProductDetail> = {
  1: {
    id: 1,
    name: "Đô thị Commuter Pro",
    price: 450,
    category: "Đô thị di động",
    rating: 4.8,
    reviews: 124,
    description: "Hoàn hảo cho đi lại hàng ngày trong thành phố với sạc nhanh thông minh và xử lý linh hoạt.",
    specs: { range: "70km", charge: "3.5 giờ", weight: "16kg" },
    colors: [
      { name: "Đen", code: "#000000" },
      { name: "Trắng", code: "#FFFFFF" },
      { name: "Cam", code: "#FF7A00" },
      { name: "Xanh", code: "#1698E5" }
    ],
    inStock: true,
    warranty: "36 tháng",
    features: [
      "Sạc nhanh thông minh",
      "Xử lý linh hoạt",
      "Động cơ cao cấp",
      "Pin bền bỉ",
      "Hệ thống phanh an toàn"
    ]
  },
  3: {
    id: 3,
    name: "Street Beast 3000",
    price: 750,
    category: "Hiệu suất đường phố",
    rating: 4.9,
    reviews: 156,
    description: "Động cơ hiệu suất cao với đèn cao cấp cho những tay lái có kinh nghiệm.",
    specs: { range: "100km", charge: "4 giờ", weight: "22kg" },
    colors: [
      { name: "Đen", code: "#000000" },
      { name: "Đỏ", code: "#DC2626" },
      { name: "Cam", code: "#FF7A00" }
    ],
    inStock: true,
    warranty: "36 tháng",
    features: [
      "Động cơ hiệu suất cao",
      "Đèn LED cao cấp",
      "Giảm xốc nâu cao",
      "Phanh đĩa đôi",
      "Hỗ trợ ứng dụng di động"
    ]
  }
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const productId = id ? parseInt(id) : 1;
  const product = productsData[productId];

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tìm thấy</h1>
        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          Quay lại sản phẩm
        </button>
      </main>
    );
  }

  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0].name);
  }

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        product,
        selectedColor,
        quantity
      }
    });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-14">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="mb-8 inline-flex items-center gap-2 text-orange-600 font-semibold transition hover:gap-3"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-9xl opacity-10 font-bold text-gray-400">
                {product.name.substring(0, 1)}
              </div>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="absolute right-4 top-4 rounded-full bg-white p-3 text-orange-600 transition hover:bg-orange-50 shadow-lg"
              >
                <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Color Preview */}
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.code}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-16 w-16 rounded-lg border-2 transition ${
                    selectedColor === color.name
                      ? "border-orange-600 ring-2 ring-orange-100"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Category & Name */}
            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-orange-600">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="rounded-lg bg-orange-50 px-4 py-4">
              <p className="text-sm text-gray-600 mb-1">Giá bán</p>
              <p className="text-4xl font-bold text-orange-600">
                {product.price.toLocaleString()}đ
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Tầm</p>
                <p className="font-bold text-gray-900">{product.specs.range}</p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Sạc</p>
                <p className="font-bold text-gray-900">{product.specs.charge}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Trọng lượng</p>
                <p className="font-bold text-gray-900">{product.specs.weight}</p>
              </div>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="mb-3 font-bold text-gray-900">Tính năng chính:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 flex-shrink-0 text-green-600" size={20} />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <label className="mb-3 block font-bold text-gray-900">
                Chọn màu sắc: <span className="text-orange-600">{selectedColor}</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color.code}
                    onClick={() => setSelectedColor(color.name)}
                    className={`rounded-lg border-2 px-4 py-2 font-medium transition ${
                      selectedColor === color.name
                        ? "border-orange-600 bg-orange-50 text-orange-600"
                        : "border-gray-200 text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="font-bold text-gray-900">Số lượng:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center border-0 outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {product.inStock ? (
                <>
                  <button
                    onClick={handleCheckout}
                    className="w-full rounded-lg bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700 active:scale-95"
                  >
                    Mua Ngay
                  </button>
                  <p className="text-center text-sm text-green-600 font-medium">
                    ✓ Còn hàng - Giao hàng nhanh
                  </p>
                </>
              ) : (
                <button
                  disabled
                  className="w-full rounded-lg bg-gray-300 px-6 py-3 font-bold text-gray-600 cursor-not-allowed"
                >
                  Sắp ra mắt
                </button>
              )}
            </div>

            {/* Warranty Info */}
            {product.warranty && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Bảo hành:</strong> {product.warranty}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
