import type { ShipmentTimeline } from "@ebike/shared-code/types";

const formatDateTime = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value))
    : null;

type ShipmentTimelineProps = {
  timeline: ShipmentTimeline | null;
  loading?: boolean;
  emptyMessage?: string;
};

const ShipmentTimelineView = ({ timeline, loading, emptyMessage }: ShipmentTimelineProps) => {
  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải trạng thái giao hàng...</p>;
  }

  if (!timeline) {
    return <p className="text-sm text-slate-500">{emptyMessage || "Không có dữ liệu giao hàng."}</p>;
  }

  if (!timeline.hasShipment) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        {emptyMessage || "Đơn hàng chưa có thông tin giao hàng. Vui lòng quay lại sau."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Trạng thái hiện tại</p>
          <p className="mt-1 text-lg font-bold text-slate-950">{timeline.currentStatusLabel}</p>
        </div>
        {timeline.lastUpdatedAt && (
          <p className="text-sm text-slate-500">Cập nhật: {formatDateTime(timeline.lastUpdatedAt)}</p>
        )}
      </div>
      {timeline.trackingNumber && (
        <p className="text-sm text-slate-600">
          Mã vận đơn: <span className="font-semibold text-slate-900">{timeline.trackingNumber}</span>
        </p>
      )}
      <ol className="relative ml-1 space-y-0 border-l-2 border-slate-200 pl-5 sm:pl-6">
        {timeline.steps.map((step) => (
          <li key={step.status} className="relative pb-8 pl-1 last:pb-0 sm:pl-0">
            <span
              className={`absolute -left-[1.35rem] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 sm:-left-[31px] ${
                step.completed || step.active
                  ? "border-primary bg-primary"
                  : "border-slate-300 bg-white"
              }`}
            />
            <p className={`text-sm font-semibold ${step.active ? "text-primary" : step.completed ? "text-slate-900" : "text-slate-400"}`}>
              {step.label}
            </p>
            {step.occurredAt && (
              <p className="mt-1 text-xs text-slate-500">{formatDateTime(step.occurredAt)}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ShipmentTimelineView;
