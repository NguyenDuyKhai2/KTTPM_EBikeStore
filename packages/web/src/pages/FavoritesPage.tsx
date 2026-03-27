import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

const mockFavorites: FavoriteProduct[] = [
  {
    id: 1,
    name: "Đô thị Commuter Pro",
    price: 450,
    image: "Scooter",
    rating: 4.8,
    category: "Đô thị di động"
  },
  {
    id: 3,
    name: "Street Beast 3000",
    price: 750,
    image: "Sport",
    rating: 4.9,
    category: "Hiệu suất đường phố"
  }
];

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(mockFavorites);

  const handleRemove = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const handleBuyNow = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-14">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Heart className="text-orange-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Sản Phẩm Yêu Thích
          </h1>
          <p className="mt-2 text-gray-600">
            {favorites.length} sản phẩm đã lưu
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 py-16">
            <Heart className="mb-4 text-gray-300" size={48} />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Chưa có sản phẩm yêu thích
            </h2>
            <p className="mb-6 text-gray-600">
              Khám phá các sản phẩm xe điện của chúng tôi
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Xem Sản Phẩm
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group animate-slideInUp overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {/* Product Image Placeholder */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-6xl opacity-20 font-bold text-gray-400">
                    {product.image}
                  </div>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                    title="Xóa khỏi yêu thích"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-orange-600 mb-1">
                    {product.category}
                  </p>
                  <h3 className="mb-2 font-bold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      {product.price.toLocaleString()}đ
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 active:scale-95"
                  >
                    <ShoppingCart size={18} />
                    Mua Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 text-orange-600 font-semibold transition hover:gap-3"
          >
            Tiếp tục mua sắm
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default FavoritesPage;
