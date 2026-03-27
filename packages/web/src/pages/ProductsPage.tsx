import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, ShoppingCart, Star } from "lucide-react";

type PriceRange = {
  label: string;
  min: number;
  max: number;
};

const products = [
  {
    id: 1,
    name: "Đô thị Commuter Pro",
    category: "Đô thị di động",
    price: 450,
    rating: 4.8,
    reviews: 124,
    specs: { range: "70km", charge: "3.5 giờ", weight: "16kg" },
    image: "Scooter",
    inStock: true,
    description: "Hoàn hảo cho đi lại hàng ngày trong thành phố với sạc nhanh thông minh và xử lý linh hoạt."
  },
  {
    id: 2,
    name: "Xe City Cruiser Lite",
    category: "Đô thị di động",
    price: 350,
    rating: 4.6,
    reviews: 89,
    specs: { range: "50km", charge: "2.5 giờ", weight: "14kg" },
    image: "Cruiser",
    inStock: true,
    description: "Nhỏ gọn và nhẹ nhàng, lý tưởng cho du lịch khoảng cách ngắn trong thành phố."
  },
  {
    id: 3,
    name: "Street Beast 3000",
    category: "Hiệu suất đường phố",
    price: 750,
    rating: 4.9,
    reviews: 156,
    specs: { range: "100km", charge: "4 giờ", weight: "22kg" },
    image: "Sport",
    inStock: true,
    description: "Động cơ hiệu suất cao với đèn cao cấp cho những tay lái có kinh nghiệm."
  },
  {
    id: 4,
    name: "Performance Max",
    category: "Hiệu suất đường phố",
    price: 650,
    rating: 4.7,
    reviews: 102,
    specs: { range: "90km", charge: "3.5 giờ", weight: "20kg" },
    image: "Boost",
    inStock: true,
    description: "Thiết kế khung sáo với gia tốc mạnh mẽ và xử lý đáp ứng."
  },
  {
    id: 5,
    name: "Sinh viên Budget Plus",
    category: "Sinh viên thông minh",
    price: 280,
    rating: 4.5,
    reviews: 203,
    specs: { range: "60km", charge: "3 giờ", weight: "15kg" },
    image: "Student",
    inStock: true,
    description: "Giá rẻ và đáng tin cậy cho sinh viên và những người có tâm lý tiết kiệm."
  },
  {
    id: 6,
    name: "Campus Rider",
    category: "Sinh viên thông minh",
    price: 250,
    rating: 4.4,
    reviews: 178,
    specs: { range: "55km", charge: "2.5 giờ", weight: "13kg" },
    image: "Campus",
    inStock: true,
    description: "Siêu nhỏ gọn và dễ dàng bảo quản trong ký túc xá hoặc căn hộ nhỏ."
  },
  {
    id: 7,
    name: "Extended Range Pro",
    category: "Hiệu suất đường phố",
    price: 899,
    rating: 4.9,
    reviews: 98,
    specs: { range: "150km", charge: "5 giờ", weight: "25kg" },
    image: "Max",
    inStock: false,
    description: "Thời lượng pin siêu dài với các thành phần cao cấp. Sắp ra mắt!"
  },
  {
    id: 8,
    name: "eco-Rider 2000",
    category: "Đô thị di động",
    price: 520,
    rating: 4.8,
    reviews: 145,
    specs: { range: "75km", charge: "3 giờ", weight: "17kg" },
    image: "Eco",
    inStock: true,
    description: "Chất liệu thân thiện với môi trường với hệ thống quản lý năng lượng thông minh."
  }
];

const categories = ["Tất cả", "Đô thị di động", "Hiệu suất đường phố", "Sinh viên thông minh"];
const priceRanges: PriceRange[] = [
  { label: "Dưới $300", min: 0, max: 300 },
  { label: "$300-$500", min: 300, max: 500 },
  { label: "$500-$800", min: 500, max: 800 },
  { label: "$800+", min: 800, max: 10000 }
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchPrice = !selectedPrice || (product.price >= selectedPrice.min && product.price <= selectedPrice.max);
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchPrice && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Bộ sưu tập xe điện của chúng tôi</h1>
            <p className="text-lg text-slate-600">Tìm chiếc xe hoàn hảo cho lối sống của bạn</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm xe điện..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bộ lọc
              </h3>

              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 mb-4">Danh mục</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                        selectedCategory === category ? "bg-blue-100 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 mb-4">Khoảng giá</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPrice(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                      selectedPrice === null ? "bg-blue-100 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Tất cả giá
                  </button>
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPrice(range)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                        selectedPrice === range ? "bg-blue-100 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Sắp xếp theo</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="featured">Sản phẩm nổi bật</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="rating">Xếp hạng cao nhất</option>
                </select>
              </div>

              {(selectedCategory !== "Tất cả" || selectedPrice || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory("Tất cả");
                    setSelectedPrice(null);
                    setSearchTerm("");
                  }}
                  className="w-full mt-6 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold border-t border-slate-200 pt-6"
                >
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <>
                <p className="text-sm text-slate-600 mb-6">Hiển thị {sortedProducts.length} trong {products.length} sản phẩm</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition duration-300 animate-slideInUp"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                        <div className="text-3xl font-bold tracking-[0.2em] text-slate-400 group-hover:scale-110 transition duration-300">
                          {product.image}
                        </div>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold">Sắp ra mắt</span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-2">
                          {product.category}
                        </span>

                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">{product.name}</h3>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{product.rating}</span>
                          <span className="text-xs text-slate-500">({product.reviews})</span>
                        </div>

                        <div className="space-y-2 mb-4 p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Tầm:</span>
                            <span className="font-semibold text-slate-900">{product.specs.range}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Sạc:</span>
                            <span className="font-semibold text-slate-900">{product.specs.charge}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Trọng lượng:</span>
                            <span className="font-semibold text-slate-900">{product.specs.weight}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-orange-600">{product.price.toLocaleString()}đ</span>
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            disabled={!product.inStock}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                              product.inStock ? "bg-orange-600 text-white hover:bg-orange-700 active:scale-95" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {product.inStock ? "Mua ngay" : "Sắp ra mắt"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-slate-600 mb-4">Không tìm thấy sản phẩm</p>
                <button
                  onClick={() => {
                    setSelectedCategory("Tất cả");
                    setSelectedPrice(null);
                    setSearchTerm("");
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
