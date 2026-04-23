import { useEffect, useState } from "react";
import { productAPI } from "@ebike/shared-code/api";
import type { Product } from "@ebike/shared-code/types";
import { attachImageFallback, createProductImageFallback, resolveProductImage } from "../../utils/media";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

const ManagerProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setProducts(await productAPI.list());
        setError("");
      } catch (productsError) {
        setError(productsError instanceof Error ? productsError.message : "Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-5 xl:grid-cols-2">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 md:grid-cols-[240px,1fr]">
              <div className="h-[220px] bg-slate-100 md:h-full">
                <img
                  src={resolveProductImage(product.images?.[0]) || createProductImageFallback(product.name)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(event) => attachImageFallback(event, product.name)}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{product.category?.name || "Vehicle"}</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950">{product.name}</h3>
                  </div>
                  <span className="rounded-md bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
                    Live
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Price</p>
                    <p className="mt-2 text-base font-bold text-slate-950">{formatCurrency(product.discountPrice ?? product.price)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Stock</p>
                    <p className="mt-2 text-base font-bold text-slate-950">{product.stockQuantity ?? 0} units</p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-600">{product.description}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default ManagerProductsPage;
