import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "@ebike/shared-code/api";
import type { Product, ProductFilter } from "@ebike/shared-code/types";
import { attachImageFallback, resolveProductImage } from "../utils/media";

type SortKey = "default" | "price-asc" | "price-desc";

const PAGE_SIZE = 9;

const PRICE_OPTIONS = [
  { label: "Tất cả", value: "all", minPrice: undefined, maxPrice: undefined },
  { label: "Dưới 20 triệu", value: "under20", minPrice: undefined, maxPrice: 20_000_000 },
  { label: "20 - 50 triệu", value: "20-50", minPrice: 20_000_000, maxPrice: 50_000_000 },
  { label: "Trên 50 triệu", value: "over50", minPrice: 50_000_000, maxPrice: undefined }
] as const;

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedPriceKey, setSelectedPriceKey] = useState<(typeof PRICE_OPTIONS)[number]["value"]>("all");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchText.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const items = await productAPI.list();
        const uniqueCategories = Array.from(
          new Map(
            items
              .filter((item) => item.category?.id && item.category?.name)
              .map((item) => [item.category.id, { id: item.category.id, name: item.category.name }])
          ).values()
        );
        setAllCategories(uniqueCategories);
      } catch {
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const selectedPrice = PRICE_OPTIONS.find((option) => option.value === selectedPriceKey);
    const filters: ProductFilter = {
      query: debouncedQuery || undefined,
      categoryId: selectedCategoryId ?? undefined,
      minPrice: selectedPrice?.minPrice,
      maxPrice: selectedPrice?.maxPrice
    };

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productAPI.list(filters);
        setProducts(data);
        setError(null);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Không thể tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [debouncedQuery, selectedCategoryId, selectedPriceKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedCategoryId, selectedPriceKey, sortBy]);

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];
    if (sortBy === "price-asc") {
      nextProducts.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    }
    if (sortBy === "price-desc") {
      nextProducts.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    }
    return nextProducts;
  }, [products, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, sortedProducts]);

  const displayProducts = useMemo(
    () =>
      paginatedProducts.map((item, index) => ({
        id: item.slug || String(item.id),
        name: item.name,
        type: item.category?.name || "E-BIKE",
        price: `${(item.discountPrice ?? item.price).toLocaleString("vi-VN")}đ`,
        image:
          item.images?.[0] ||
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600",
        badge: item.featured ? "FEATURED" : index === 0 ? "BEST SELLER" : "",
        colors: ["#1a1a1a", "#3b82f6", "#d1d5db"],
        meta: item.reviewCount ? `${item.reviewCount} đánh giá` : item.stockQuantity ? `${item.stockQuantity} trong kho` : "Sản phẩm mới"
      })),
    [paginatedProducts]
  );

  return (
    <div className="pt-20">
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&q=80&w=2000"
          alt="Collection"
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/60 to-transparent px-6 md:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <span className="mb-4 block text-sm font-bold tracking-widest text-primary">2026 COLLECTION</span>
            <h1 className="mb-6 text-6xl font-bold leading-none tracking-tighter text-white md:text-8xl">
              Precision
              <br />
              <span className="text-primary">Engineering.</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-white/70">
              Discover the next generation of electric mobility. Engineered for performance, designed for the future.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="w-full flex-shrink-0 space-y-10 lg:w-72">
            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider">Tìm kiếm</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Tên xe, mô tả..."
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider">Dòng xe</h3>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedCategoryId === null}
                    onChange={() => setSelectedCategoryId(null)}
                    className="h-5 w-5 border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground">Tất cả</span>
                </label>
                {allCategories.map((category) => (
                  <label key={category.id} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      checked={selectedCategoryId === category.id}
                      onChange={() => setSelectedCategoryId(category.id)}
                      className="h-5 w-5 border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider">Phân khúc giá</h3>
              <div className="space-y-3">
                {PRICE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="price-range"
                      checked={selectedPriceKey === option.value}
                      onChange={() => setSelectedPriceKey(option.value)}
                      className="h-5 w-5 border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-grow">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-3xl font-bold">Tất cả sản phẩm</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hiển thị {displayProducts.length} / {sortedProducts.length} mẫu xe
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-muted-foreground">
                  <SlidersHorizontal size={16} />
                  Filter API
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortKey)}
                  className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-bold focus:border-primary focus:outline-none"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-muted-foreground">Đang tải sản phẩm...</div>
            ) : error ? (
              <div className="py-16 text-center text-red-500">{error}</div>
            ) : displayProducts.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">Không có sản phẩm phù hợp với bộ lọc API hiện tại.</div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-outline-variant/10 bg-white transition-all duration-500 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
                      <img
                        src={resolveProductImage(product.image)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(event) => attachImageFallback(event, product.name)}
                        referrerPolicy="no-referrer"
                      />
                      {product.badge ? (
                        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-widest text-white">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>

                    <div className="p-6">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold transition-colors group-hover:text-primary">{product.name}</h3>
                        <span className="font-bold text-primary">{product.price}</span>
                      </div>
                      <p className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">
                        {product.type} | {product.meta}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {product.colors.map((color, index) => (
                            <div
                              key={`${product.id}-${index}`}
                              className="h-3 w-3 rounded-full border border-outline-variant/20"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Link to={`/product/${product.id}`} className="flex items-center gap-1 text-sm font-bold">
                          XEM CHI TIẾT
                          <div className="ml-2 h-[2px] w-8 bg-primary transition-all group-hover:w-12" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <div className="mt-16 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-lg font-bold transition-colors ${
                      currentPage === page ? "bg-primary text-white" : "hover:bg-surface-container-low"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Go to next page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
