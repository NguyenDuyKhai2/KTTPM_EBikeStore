import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { orderAPI } from "@ebike/shared-code/api";
import type { Order, ShipmentTimeline } from "@ebike/shared-code/types";
import ShipmentTimelineView from "../../components/orders/ShipmentTimeline";
import SectionShell from "../../components/common/SectionShell";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLATION_REQUESTED: "Chờ duyệt hủy",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy"
};

const canRequestCancellation = (order: Order) => {
  if (order.status === "CANCELLED" || order.status === "CANCELLATION_REQUESTED" || order.status === "DELIVERED") {
    return false;
  }
  const shipmentStatus = order.shipment?.shipmentStatus;
  if (shipmentStatus === "SHIPPED" || shipmentStatus === "IN_TRANSIT" || shipmentStatus === "DELIVERED") {
    return false;
  }
  return order.status === "PENDING" || order.status === "CONFIRMED" || order.status === "PROCESSING";
};

const CustomerOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<ShipmentTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellationOrder, setCancellationOrder] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationError, setCancellationError] = useState("");
  const [submittingCancellation, setSubmittingCancellation] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Thiếu mã đơn hàng.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const orderData = await orderAPI.getDetail(id);
        setOrder(orderData);
        setError("");
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  useEffect(() => {
    const loadTimeline = async () => {
      if (!id || !order) {
        return;
      }
      try {
        setTimelineLoading(true);
        setTimeline(await orderAPI.getShipmentTimeline(id));
      } catch {
        setTimeline(null);
      } finally {
        setTimelineLoading(false);
      }
    };
    void loadTimeline();
  }, [id, order?.id, order?.status]);

  const submitCancellation = async () => {
    if (!order) {
      return;
    }
    setSubmittingCancellation(true);
    setCancellationError("");
    try {
      const updated = await orderAPI.requestCancellation(order.id, {
        reason: cancellationReason.trim() || undefined
      });
      setOrder(updated);
      setCancellationOrder(false);
      setCancellationReason("");
      setTimeline(await orderAPI.getShipmentTimeline(order.id));
    } catch (cancelError) {
      setCancellationError(cancelError instanceof Error ? cancelError.message : "Không thể gửi yêu cầu hủy.");
    } finally {
      setSubmittingCancellation(false);
    }
  };

  if (loading) {
    return <div className="px-6 py-16 text-center text-slate-500">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error || !order) {
    return <div className="px-6 py-16 text-center text-red-600">{error || "Không tìm thấy đơn hàng."}</div>;
  }

  return (
    <SectionShell
      eyebrow="Chi tiết đơn hàng"
      title={order.orderNumber}
      description="Theo dõi trạng thái giao hàng và thông tin thanh toán của đơn."
    >
      <div className="space-y-6">
        <Link to="/customer/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách đơn
        </Link>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-outline-variant/15 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Thông tin đơn</p>
            <p className="mt-2 text-2xl font-bold">{STATUS_LABELS[order.status] || order.status}</p>
            <p className="mt-2 text-sm text-slate-500">Tạo lúc {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
            <p className="price-display mt-4 text-primary">{order.totalAmount.toLocaleString("vi-VN")}đ</p>
            {order.cancellationReason && (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
                Lý do hủy: {order.cancellationReason}
              </p>
            )}
            {canRequestCancellation(order) && (
              <button
                type="button"
                onClick={() => setCancellationOrder(true)}
                className="mt-4 rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                Yêu cầu hủy đơn
              </button>
            )}
          </article>

          <article className="rounded-xl border border-outline-variant/15 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Tiến trình giao hàng</p>
            <ShipmentTimelineView timeline={timeline} loading={timelineLoading} />
          </article>
        </div>

        <article className="rounded-xl border border-outline-variant/15 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold">Sản phẩm</p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={`${order.id}-${item.id ?? item.productId}`} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{item.productName || `Sản phẩm #${item.productId}`}</p>
                  <p className="text-sm text-slate-500">SL: {item.quantity}</p>
                </div>
                <p className="font-semibold">{(item.lineTotal ?? 0).toLocaleString("vi-VN")}đ</p>
              </div>
            ))}
          </div>
        </article>

        {cancellationOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-bold">Yêu cầu hủy đơn</h3>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Nhập lý do hủy (tùy chọn)"
                className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              />
              {cancellationError && <p className="mt-2 text-sm text-red-600">{cancellationError}</p>}
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setCancellationOrder(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold">
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={submittingCancellation}
                  onClick={() => void submitCancellation()}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {submittingCancellation ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
};

export default CustomerOrderDetailPage;
