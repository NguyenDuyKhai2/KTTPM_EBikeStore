import { paymentAPI } from "@ebike/shared-code/api";
import type { VnPayReturnResponse } from "@ebike/shared-code/types";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentReturnPage = () => {
  const location = useLocation();
  const [result, setResult] = useState<VnPayReturnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      const queryString = location.search.replace(/^\?/, "");
      if (!queryString) {
        setError("Không tìm thấy thông tin thanh toán.");
        setLoading(false);
        return;
      }

      try {
        const data = await paymentAPI.getVnPayReturnResult(queryString);
        setResult(data);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Không thể kiểm tra kết quả thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    void loadResult();
  }, [location.search]);

  const success = Boolean(result?.success);

  return (
    <div className="container-responsive page-offset-header mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
      {loading ? (
        <>
          <Loader2 className="mb-6 h-12 w-12 animate-spin text-primary" />
          <h1 className="heading-section tracking-tight">Đang kiểm tra thanh toán</h1>
          <p className="mt-3 text-muted-foreground">Vui lòng đợi trong giây lát.</p>
        </>
      ) : (
        <>
          {success ? (
            <CheckCircle2 className="mb-6 h-14 w-14 text-emerald-600 sm:h-16 sm:w-16" />
          ) : (
            <XCircle className="mb-6 h-14 w-14 text-red-600 sm:h-16 sm:w-16" />
          )}
          <h1 className="heading-section tracking-tight">
            {success ? "Thanh toan thanh cong" : "Thanh toan chua hoan tat"}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {success
              ? "Đơn hàng của bạn đã được xác nhận thanh toán qua VNPay."
              : error || "Giao dịch không thành công hoặc chữ ký phản hồi không hợp lệ."}
          </p>

          {result ? (
            <div className="mt-8 w-full rounded-lg border border-outline-variant/20 bg-white p-5 text-left text-sm sm:p-6">
              <div className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-muted-foreground">Mã đơn</span>
                <span className="font-medium">{result.orderNumber || "-"}</span>
              </div>
              <div className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-muted-foreground">Mã giao dịch</span>
                <span className="font-medium break-all">{result.transactionNo || result.txnRef || "-"}</span>
              </div>
              <div className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-muted-foreground">Số tiền</span>
                <span className="font-medium">{result.amount ? `${result.amount.toLocaleString("vi-VN")}d` : "-"}</span>
              </div>
              <div className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="font-medium">{result.paymentStatus || "-"}</span>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link to="/customer/orders" className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">
              Xem đơn hàng
            </Link>
            <Link to="/products" className="rounded-lg border border-outline-variant/30 px-5 py-3 text-sm font-bold">
              Tiếp tục mua sắm
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentReturnPage;
