import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard, MapPin, Package, Phone, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { managerAPI, orderAPI } from "@ebike/shared-code/api";
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
  const [reviewingCancellation, setReviewingCancellation] = useState<"approve" | "reject" | null>(null);
  const [reviewDialogAction, setReviewDialogAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");

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

  const openReviewDialog = (action: "approve" | "reject") => {
    setReviewDialogAction(action);
    setReviewNote("");
    setError("");
  };

  const closeReviewDialog = () => {
    if (reviewingCancellation !== null) {
      return;
    }
    setReviewDialogAction(null);
    setReviewNote("");
  };

  const submitCancellationReview = async () => {
    if (!reviewDialogAction) {
      return;
    }
    if (!order) {
      return;
    }

    const normalizedNote = reviewNote.trim();
    try {
      setReviewingCancellation(reviewDialogAction);
      const updatedOrder =
        reviewDialogAction === "approve"
          ? await managerAPI.approveCancellation(order.id, { reviewNote: normalizedNote || undefined })
          : await managerAPI.rejectCancellation(order.id, { reviewNote: normalizedNote || undefined });
      setOrder(updatedOrder);
      setReviewDialogAction(null);
      setReviewNote("");
      setError("");
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Không thể xử lý yêu cầu hủy đơn.");
    } finally {
      setReviewingCancellation(null);
    }
  };

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
            <span>Quay lại danh sách đơn</span>
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-950">{order.orderNumber}</h2>
            <ManagerStatusBadge label={order.status} tone={orderTone(order.status)} />
          </div>
        </div>
        {order.status === "CANCELLATION_REQUESTED" && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openReviewDialog("reject")}
              disabled={reviewingCancellation !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              <span>{reviewingCancellation === "reject" ? "Đang xử lý..." : "Từ chối hủy"}</span>
            </button>
            <button
              type="button"
              onClick={() => openReviewDialog("approve")}
              disabled={reviewingCancellation !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              <span>{reviewingCancellation === "approve" ? "Đang xử lý..." : "Duyệt hủy"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h3 className="text-lg font-bold text-slate-950">Sản phẩm đã mua</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id ?? item.productId} className="flex items-start gap-4 px-6 py-5">
                  <div className="rounded-lg bg-slate-100 p-3 text-slate-500">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-950">{item.productName || `Sản phẩm #${item.productId}`}</p>
                    <p className="mt-1 text-sm text-slate-500">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-950">{formatCurrency(item.lineTotal ?? item.unitPrice ?? 0)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-slate-200 bg-slate-50 px-6 py-5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tạm tính</span>
                <span>{formatCurrency(itemTotal || order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Phí đăng ký</span>
                <span>{formatCurrency(order.registrationFee)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Giảm giá</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Ghi chú đơn hàng</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{order.notes || "Khách hàng chưa để lại ghi chú cho đơn hàng này."}</p>
          </section>

          {(order.cancellationRequestedAt || order.cancellationReviewNote) && (
            <section className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">Yêu cầu hủy đơn</h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Lý do khách hàng:</span>{" "}
                  {order.cancellationReason || "Khách hàng không nhập lý do."}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Gửi lúc:</span>{" "}
                  {formatDateTime(order.cancellationRequestedAt)}
                </p>
                {order.cancellationReviewNote && (
                  <p>
                    <span className="font-semibold text-slate-900">Ghi chú manager:</span>{" "}
                    {order.cancellationReviewNote}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Thông tin khách hàng</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Tên khách</p>
                <p className="mt-2 font-semibold text-slate-950">{order.shipment?.recipientName || "Đơn khách vãng lai"}</p>
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
            <h3 className="text-lg font-bold text-slate-950">Showroom nhận xe</h3>
            <div className="mt-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{order.shipment?.pickupShowroom?.name || "-"}</p>
              <p className="mt-2 leading-7">{order.shipment?.pickupShowroom?.address || "-"}</p>
              <p className="mt-2 text-slate-500">{order.shipment?.pickupShowroom?.phone || ""}</p>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Thanh toán</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phương thức</span>
                <span className="font-semibold text-slate-950">{formatManagerLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trạng thái</span>
                <ManagerStatusBadge label={order.paymentStatus} tone={paymentTone(order.paymentStatus)} />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Tiến trình đơn hàng</h3>
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
              Tạo lúc: {formatDateTime(order.createdAt)}
              <br />
              Cập nhật lúc: {formatDateTime(order.updatedAt)}
            </div>
          </section>
        </div>
      </div>

      {reviewDialogAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Xử lý yêu cầu hủy</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                {reviewDialogAction === "approve" ? "Duyệt hủy đơn" : "Từ chối yêu cầu hủy"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{order.orderNumber}</p>
            </div>

            <div className="space-y-4 px-6 py-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  {reviewDialogAction === "approve" ? "Ghi chú duyệt hủy" : "Lý do từ chối"}
                </span>
                <textarea
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  rows={5}
                  maxLength={1000}
                  placeholder={
                    reviewDialogAction === "approve"
                      ? "Ví dụ: Đơn đủ điều kiện hủy, chưa phát sinh thanh toán."
                      : "Ví dụ: Đơn đã được xác nhận xử lý tại showroom."
                  }
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#003b93] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <div className="text-right text-xs text-slate-400">{reviewNote.length}/1000</div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeReviewDialog}
                disabled={reviewingCancellation !== null}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => void submitCancellationReview()}
                disabled={reviewingCancellation !== null}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  reviewDialogAction === "approve" ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {reviewingCancellation === reviewDialogAction ? "Đang xử lý..." : reviewDialogAction === "approve" ? "Duyệt hủy" : "Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOrderDetailPage;
