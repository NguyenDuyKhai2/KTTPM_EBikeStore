type BadgeTone = "blue" | "orange" | "green" | "red" | "purple" | "slate";

const toneClasses: Record<BadgeTone, string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  orange: "border-orange-100 bg-orange-50 text-orange-700",
  green: "border-green-100 bg-green-50 text-green-700",
  red: "border-red-100 bg-red-50 text-red-700",
  purple: "border-purple-100 bg-purple-50 text-purple-700",
  slate: "border-slate-200 bg-slate-100 text-slate-700"
};

export const orderTone = (status?: string | null): BadgeTone => {
  switch (status) {
    case "DELIVERED":
      return "green";
    case "CONFIRMED":
    case "PROCESSING":
      return "orange";
    case "SHIPPED":
      return "purple";
    case "CANCELLED":
      return "red";
    default:
      return "blue";
  }
};

export const paymentTone = (status?: string | null): BadgeTone => {
  switch (status) {
    case "PAID":
      return "green";
    case "FAILED":
      return "red";
    case "REFUNDED":
      return "slate";
    case "AUTHORIZED":
      return "blue";
    default:
      return "orange";
  }
};

export const formatManagerLabel = (value?: string | null) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Unknown";

const ManagerStatusBadge = ({
  label,
  tone
}: {
  label?: string | null;
  tone: BadgeTone;
}) => (
  <span
    className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${toneClasses[tone]}`}
  >
    {formatManagerLabel(label)}
  </span>
);

export default ManagerStatusBadge;
