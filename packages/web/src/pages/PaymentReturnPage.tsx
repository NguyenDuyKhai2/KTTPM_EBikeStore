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
        setError("Khong tim thay thong tin thanh toan.");
        setLoading(false);
        return;
      }

      try {
        const data = await paymentAPI.getVnPayReturnResult(queryString);
        setResult(data);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Khong the kiem tra ket qua thanh toan.");
      } finally {
        setLoading(false);
      }
    };

    void loadResult();
  }, [location.search]);

  const success = Boolean(result?.success);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      {loading ? (
        <>
          <Loader2 className="mb-6 h-12 w-12 animate-spin text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Dang kiem tra thanh toan</h1>
          <p className="mt-3 text-muted-foreground">Vui long doi trong giay lat.</p>
        </>
      ) : (
        <>
          {success ? (
            <CheckCircle2 className="mb-6 h-16 w-16 text-emerald-600" />
          ) : (
            <XCircle className="mb-6 h-16 w-16 text-red-600" />
          )}
          <h1 className="text-4xl font-bold tracking-tight">
            {success ? "Thanh toan thanh cong" : "Thanh toan chua hoan tat"}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {success
              ? "Don hang cua ban da duoc xac nhan thanh toan qua VNPay."
              : error || "Giao dich khong thanh cong hoac chu ky phan hoi khong hop le."}
          </p>

          {result ? (
            <div className="mt-8 w-full rounded-lg border border-outline-variant/20 bg-white p-6 text-left text-sm">
              <div className="flex justify-between gap-4 py-2">
                <span className="text-muted-foreground">Ma don</span>
                <span className="font-medium">{result.orderNumber || "-"}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-muted-foreground">Ma giao dich</span>
                <span className="font-medium">{result.transactionNo || result.txnRef || "-"}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-muted-foreground">So tien</span>
                <span className="font-medium">{result.amount ? `${result.amount.toLocaleString("vi-VN")}d` : "-"}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span className="text-muted-foreground">Trang thai</span>
                <span className="font-medium">{result.paymentStatus || "-"}</span>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/customer/orders" className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">
              Xem don hang
            </Link>
            <Link to="/products" className="rounded-lg border border-outline-variant/30 px-5 py-3 text-sm font-bold">
              Tiep tuc mua sam
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentReturnPage;
