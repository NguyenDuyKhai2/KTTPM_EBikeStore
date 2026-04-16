import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@ebike/shared-code/hooks";
import { attachImageFallback, resolveProductImage } from "../utils/media";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity } = useCart();
  const subtotal = items.reduce((sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity, 0);

  const checkoutFirstItem = () => {
    const firstItem = items[0];
    if (!firstItem) {
      return;
    }

    navigate("/checkout", {
      state: {
        product: {
          id: firstItem.product.id,
          name: firstItem.product.name,
          slug: firstItem.product.slug,
          price: firstItem.product.discountPrice ?? firstItem.product.price,
          image: firstItem.product.images?.[0],
          categoryName: firstItem.product.category?.name
        },
        selectedColor: "Mặc định",
        quantity: firstItem.quantity
      }
    });
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 pb-24 pt-32 md:px-12">
      <h1 className="mb-10 text-5xl font-bold tracking-tighter">
        Giỏ hàng <span className="text-primary">của bạn.</span>
      </h1>

      {items.length === 0 ? (
        <section className="rounded-xl border-2 border-dashed border-outline-variant/30 p-10 text-center">
          <p className="mb-4 text-muted-foreground">Bạn chưa thêm mẫu xe nào vào giỏ hàng.</p>
          <Link to="/products" className="font-bold text-primary hover:underline">
            Khám phá sản phẩm
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <section className="space-y-5 lg:col-span-8">
            {items.map((item) => {
              const price = item.product.discountPrice ?? item.product.price;
              return (
                <article key={item.product.id} className="flex flex-col gap-5 rounded-xl border border-outline-variant/15 bg-white p-5 sm:flex-row">
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-surface-container-low sm:w-40">
                    <img
                      src={resolveProductImage(item.product.images?.[0])}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(event) => attachImageFallback(event, item.product.name)}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{item.product.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.product.category?.name || "Xe điện"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground transition-colors hover:text-error"
                        aria-label={`Xóa ${item.product.name}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="inline-flex w-fit items-center rounded-lg border border-outline-variant/20">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-3 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          aria-label="Giảm số lượng"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-12 text-center font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-3"
                          aria-label="Tăng số lượng"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-2xl font-bold text-primary">{(price * item.quantity).toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 rounded-xl bg-surface-container-low p-8">
              <h2 className="mb-6 text-xl font-bold">Tóm tắt đơn hàng</h2>
              <div className="mb-8 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số sản phẩm</span>
                  <span className="font-bold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-bold">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="h-px bg-outline-variant/20" />
                <div className="flex items-baseline justify-between">
                  <span className="font-bold">Tổng</span>
                  <span className="text-3xl font-bold">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              <button type="button" onClick={checkoutFirstItem} className="btn-primary w-full">
                Tiếp tục thanh toán
                <ArrowRight size={20} />
              </button>
              <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                Checkout hiện xử lý từng mẫu xe. Hãy chọn mẫu đầu tiên trong giỏ để đặt hàng.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default CartPage;
