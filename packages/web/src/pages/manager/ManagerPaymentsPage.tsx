import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { managerAPI } from "@ebike/shared-code/api";
import type { ManagerPayment } from "@ebike/shared-code/types";
import ManagerStatusBadge, { formatManagerLabel, paymentTone } from "../../components/manager/ManagerStatusBadge";

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

const ManagerPaymentsPage = () => {
  const [payments, setPayments] = useState<ManagerPayment[]>([]);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const loadPayments = async (params?: { paymentStatus?: string; paymentMethod?: string; search?: string }) => {
    try {
      setLoading(true);
      setPayments(await managerAPI.getPayments(params));
      setError("");
    } catch (paymentsError) {
      setError(paymentsError instanceof Error ? paymentsError.message : "Không thể tải payment records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPayments();
  }, []);

  const stats = useMemo(
    () => ({
      settled: payments.filter((payment) => payment.paymentStatus === "PAID").reduce((sum, payment) => sum + payment.amount, 0),
      pending: payments.filter((payment) => payment.paymentStatus === "PENDING").reduce((sum, payment) => sum + payment.amount, 0),
      failed: payments.filter((payment) => payment.paymentStatus === "FAILED").length,
      payLaterPending: payments.filter(
        (payment) => payment.paymentMethod === "PAY_LATER" && payment.paymentStatus === "PENDING"
      ).length
    }),
    [payments]
  );

  const applyFilters = async () => {
    await loadPayments({
      paymentStatus: paymentStatus || undefined,
      paymentMethod: paymentMethod || undefined,
      search: search.trim() || undefined
    });
  };

  const handleConfirm = async (paymentId: number) => {
    try {
      setSubmittingId(paymentId);
      await managerAPI.confirmPayment(paymentId, { note: "Đã xác nhận thanh toán bởi manager." });
      await applyFilters();
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Không thể xác nhận thanh toán.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Settled Volume", value: formatCurrency(stats.settled) },
          { label: "Pending Deposits", value: formatCurrency(stats.pending) },
          { label: "Failed Payments", value: String(stats.failed) },
          { label: "Pay Later Pending", value: String(stats.payLaterPending) }
        ].map((stat) => (
          <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-slate-950">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.3fr,1fr,1fr,auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order number, customer, transaction"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#003b93] focus:bg-white"
          />
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#003b93] focus:bg-white"
          >
            <option value="">All Methods</option>
            <option value="PAY_LATER">PAY_LATER</option>
            <option value="VNPAY">VNPAY</option>
          </select>
          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#003b93] focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-10 text-sm text-slate-500">Đang tải giao dịch...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Transaction</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Method</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-950">{payment.orderNumber}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDateTime(payment.orderCreatedAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{payment.customerName || "Guest order"}</p>
                      <p className="mt-1 text-xs text-slate-400">{payment.customerEmail || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatManagerLabel(payment.paymentMethod)}</td>
                    <td className="px-6 py-4">
                      <ManagerStatusBadge label={payment.paymentStatus} tone={paymentTone(payment.paymentStatus)} />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-950">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        {payment.paymentMethod === "PAY_LATER" && payment.paymentStatus === "PENDING" ? (
                          <button
                            type="button"
                            onClick={() => handleConfirm(payment.id)}
                            disabled={submittingId === payment.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#003b93] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {submittingId === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            <span>Confirm</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">{payment.paidAt ? formatDateTime(payment.paidAt) : "-"}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManagerPaymentsPage;
