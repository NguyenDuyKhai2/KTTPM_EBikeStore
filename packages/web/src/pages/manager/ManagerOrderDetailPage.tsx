import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CreditCard, MapPin, Package, Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { orderAPI } from "@ebike/shared-code/api";
import type { Order } from "@ebike/shared-code/types";
import ManagerStatusBadge, { formatManagerLabel, orderTone, paymentTone } from "../../components/manager/ManagerStatusBadge";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

const formatDateTime = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value))
    : "-";

const statusTimeline = (order?: Order | null) => {
  if (!order) {
    return [];
  }

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = statuses.indexOf(order.status);
  return statuses.map((status, index) => ({
    status,
    completed: currentIndex >= index,
    active: currentIndex === index
  }));
};

const ManagerOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError("Thiếu mã đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setOrder(await orderAPI.getDetail(id));
        setError("");
      } catch (orderError) {
        setError(orderError instanceof Error ? orderError.message : "Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [id]);

  const itemTotal = useMemo(() => order?.items.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0) ?? 0, [order]);

  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error || !order) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-sm text-red-700">{error || "Không tìm thấy đơn hàng."}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/manager/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to orders</span>
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-950">{order.orderNumber}</h2>
            <ManagerStatusBadge label={order.status} tone={orderTone(order.status)} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h3 className="text-lg font-bold text-slate-950">Purchased Products</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id ?? item.productId} className="flex items-start gap-4 px-6 py-5">
                  <div className="rounded-lg bg-slate-100 p-3 text-slate-500">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-950">{item.productName || `Product #${item.productId}`}</p>
                    <p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-950">{formatCurrency(item.lineTotal ?? item.unitPrice ?? 0)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-slate-200 bg-slate-50 px-6 py-5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(itemTotal || order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Registration Fee</span>
                <span>{formatCurrency(order.registrationFee)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Order Notes</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{order.notes || "Khách hàng chưa để lại ghi chú cho đơn hàng này."}</p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Customer Details</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Name</p>
                <p className="mt-2 font-semibold text-slate-950">{order.shipment?.recipientName || "Guest order"}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>{order.shipment?.phoneNumber || "-"}</span>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>{order.customerEmail || "-"}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>{order.shipment?.detailedAddress || "-"}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Pickup Showroom</h3>
            <div className="mt-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{order.shipment?.pickupShowroom?.name || "-"}</p>
              <p className="mt-2 leading-7">{order.shipment?.pickupShowroom?.address || "-"}</p>
              <p className="mt-2 text-slate-500">{order.shipment?.pickupShowroom?.phone || ""}</p>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Payment</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-950">{formatManagerLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <ManagerStatusBadge label={order.paymentStatus} tone={paymentTone(order.paymentStatus)} />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Status Timeline</h3>
            <div className="mt-6 space-y-5">
              {statusTimeline(order).map((step) => (
                <div key={step.status} className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-3 w-3 rounded-full ${
                      step.completed ? "bg-[#003b93]" : "bg-slate-200"
                    }`}
                  />
                  <div>
                    <p className={`text-sm font-semibold ${step.active ? "text-slate-950" : "text-slate-500"}`}>
                      {formatManagerLabel(step.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-400">
              Created: {formatDateTime(order.createdAt)}
              <br />
              Updated: {formatDateTime(order.updatedAt)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ManagerOrderDetailPage;
