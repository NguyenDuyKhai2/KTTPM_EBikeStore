import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { managerAPI } from "@ebike/shared-code/api";
import type { ManagerDashboard } from "@ebike/shared-code/types";
import type { Order } from "@ebike/shared-code/types";
import ManagerStatusBadge, { orderTone, paymentTone } from "../../components/manager/ManagerStatusBadge";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));

const emptyDashboard: ManagerDashboard = {
  totalOrders: 0,
  pendingOrders: 0,
  unpaidPayLaterOrders: 0,
  todayRevenue: 0,
  weekRevenue: 0,
  monthRevenue: 0,
  recentOrders: []
};

const ManagerDashboardPage = () => {
  const [dashboard, setDashboard] = useState<ManagerDashboard>(emptyDashboard);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setDashboard(await managerAPI.getDashboard());
        setError("");
      } catch (dashboardError) {
        setError(dashboardError instanceof Error ? dashboardError.message : "Không thể tải dashboard.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: String(dashboard.totalOrders),
        icon: ShoppingCart,
        tone: "text-blue-700 bg-blue-50"
      },
      {
        label: "Pending Confirmation",
        value: String(dashboard.pendingOrders),
        icon: Clock3,
        tone: "text-orange-700 bg-orange-50"
      },
      {
        label: "Unpaid Pay Later",
        value: String(dashboard.unpaidPayLaterOrders),
        icon: AlertCircle,
        tone: "text-purple-700 bg-purple-50"
      },
      {
        label: "Revenue This Month",
        value: formatCurrency(dashboard.monthRevenue),
        icon: CheckCircle2,
        tone: "text-green-700 bg-green-50"
      }
    ],
    [dashboard]
  );

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2 ${stat.tone}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Revenue Snapshot</h2>
              <p className="mt-1 text-sm text-slate-500">Theo dõi doanh thu đã thanh toán trong các mốc gần nhất.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Today</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{formatCurrency(dashboard.todayRevenue)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Last 7 Days</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{formatCurrency(dashboard.weekRevenue)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Month To Date</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{formatCurrency(dashboard.monthRevenue)}</p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Action Required</h2>
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
              <p className="text-sm font-bold text-slate-950">Pending orders cần xác nhận</p>
              <p className="mt-1 text-sm text-slate-600">{dashboard.pendingOrders} đơn đang chờ manager xử lý.</p>
            </div>
            <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
              <p className="text-sm font-bold text-slate-950">PAY_LATER chưa đối soát</p>
              <p className="mt-1 text-sm text-slate-600">{dashboard.unpaidPayLaterOrders} giao dịch đang ở trạng thái chờ.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Recent Orders</h2>
            <p className="mt-1 text-sm text-slate-500">Các đơn mới nhất đang cần manager theo dõi.</p>
          </div>
          <Link to="/manager/orders" className="text-sm font-bold text-[#003b93] transition hover:opacity-80">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-sm text-slate-500">Đang tải dữ liệu...</div>
        ) : dashboard.recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">Chưa có đơn hàng nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Order</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Payment</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard.recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link to={`/manager/orders/${order.id}`} className="font-bold text-slate-950 transition hover:text-[#003b93]">
                        {order.orderNumber}
                      </Link>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">{order.shipment?.recipientName || "Guest order"}</p>
                      <p className="mt-1 text-xs text-slate-400">{order.customerEmail || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <ManagerStatusBadge label={order.status} tone={orderTone(order.status)} />
                    </td>
                    <td className="px-6 py-4">
                      <ManagerStatusBadge label={order.paymentStatus} tone={paymentTone(order.paymentStatus)} />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-950">{formatCurrency(order.totalAmount)}</td>
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

export default ManagerDashboardPage;
