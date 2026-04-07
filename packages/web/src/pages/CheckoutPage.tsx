import { Calendar, CreditCard, Landmark, Lock, MapPin, Phone, Store, Zap } from "lucide-react";
import { orderAPI, showroomAPI } from "@ebike/shared-code/api";
import { useAppSelector } from "@ebike/shared-code/redux";
import type { Showroom } from "@ebike/shared-code/types";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { attachImageFallback, resolveProductImage } from "../utils/media";

interface CheckoutState {
  product?: {
    id: number;
    name: string;
    slug?: string;
    price: number;
    image?: string;
    categoryName?: string;
  };
  selectedColor?: string;
  quantity?: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);
  const state = (location.state as CheckoutState | undefined) ?? {};
  const product = state.product;
  const quantity = state.quantity ?? 1;
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loadingShowrooms, setLoadingShowrooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("BANK_TRANSFER");
  const [form, setForm] = useState({
    customerName: authUser?.fullName ?? "",
    customerIdentityNumber: "",
    phoneNumber: "",
    customerEmail: authUser?.email ?? "",
    district: "",
    pickupShowroomId: "",
    detailedAddress: "",
    notes: ""
  });

  useEffect(() => {
    if (!product) {
      navigate("/products", { replace: true });
    }
  }, [navigate, product]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      customerName: current.customerName || authUser?.fullName || "",
      customerEmail: current.customerEmail || authUser?.email || ""
    }));
  }, [authUser?.email, authUser?.fullName]);

  useEffect(() => {
    const loadShowrooms = async () => {
      try {
        const data = await showroomAPI.list();
        setShowrooms(data);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Khong the tai danh sach showroom.");
      } finally {
        setLoadingShowrooms(false);
      }
    };

    void loadShowrooms();
  }, []);

  const subtotal = product ? product.price * quantity : 0;
  const ecoIncentive = 1_200_000;
  const registrationFee = 2_500_000;
  const total = subtotal - ecoIncentive + registrationFee;

  const districts = useMemo(
    () => Array.from(new Set(showrooms.map((showroom) => showroom.district))).sort((left, right) => left.localeCompare(right, "vi")),
    [showrooms]
  );
  const filteredShowrooms = useMemo(
    () => showrooms.filter((showroom) => showroom.district === form.district),
    [form.district, showrooms]
  );
  const selectedShowroom = filteredShowrooms.find((showroom) => String(showroom.id) === form.pickupShowroomId) ?? null;

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleDistrictChange = (district: string) => {
    setForm((current) => ({
      ...current,
      district,
      pickupShowroomId: ""
    }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!product) {
      setSubmitError("Khong co san pham de dat.");
      return;
    }
    if (!authUser?.id) {
      setSubmitError("Ban can dang nhap truoc khi dat hang.");
      return;
    }
    if (!form.customerName.trim() || !form.customerIdentityNumber.trim() || !form.phoneNumber.trim() || !form.customerEmail.trim()) {
      setSubmitError("Vui long dien day du thong tin khach hang.");
      return;
    }
    if (!form.district || !form.pickupShowroomId || !form.detailedAddress.trim()) {
      setSubmitError("Vui long chon quan, showroom nhan xe va dia chi cu the.");
      return;
    }

    setSubmitting(true);
    try {
      const notes = [form.notes.trim(), `Payment: ${selectedPaymentMethod}`].filter(Boolean).join(" | ");
      const createdOrder = await orderAPI.create({
        userId: Number(authUser.id),
        customerName: form.customerName.trim(),
        customerIdentityNumber: form.customerIdentityNumber.trim(),
        phoneNumber: form.phoneNumber.trim(),
        customerEmail: form.customerEmail.trim(),
        pickupShowroomId: Number(form.pickupShowroomId),
        detailedAddress: form.detailedAddress.trim(),
        shippingFee: 0,
        discountAmount: ecoIncentive,
        notes,
        items: [
          {
            productId: product.id,
            quantity
          }
        ]
      });

      setSubmitSuccess(`Dat hang thanh cong. Ma don: ${createdOrder.orderNumber}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Khong the tao don hang.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl px-6 pb-24 pt-32 md:px-12">
      <div className="mb-16">
        <span className="mono-label mb-4 block text-primary">Secure Checkout</span>
        <h1 className="text-5xl font-bold tracking-tighter md:text-6xl">
          Nhan xe tai showroom <br />
          phu hop cho ban o TP.HCM.
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          {submitError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{submitError}</div>
          ) : null}
          {submitSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{submitSuccess}</div>
          ) : null}

          <section>
            <h2 className="mb-8 text-2xl font-bold tracking-tight">Phuong thuc thanh toan</h2>
            <div className="space-y-4">
              <div className={`rounded-xl border-2 p-6 ${selectedPaymentMethod === "BANK_TRANSFER" ? "border-primary bg-surface-container-low" : "border-transparent bg-surface-container-low"}`}>
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPaymentMethod === "BANK_TRANSFER"}
                    onChange={() => setSelectedPaymentMethod("BANK_TRANSFER")}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-grow">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-lg font-bold">Chuyen khoan</span>
                      <Landmark className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Thanh toan qua tai khoan ngan hang cua ban.</p>
                  </div>
                </label>
              </div>

              <div className={`rounded-xl p-6 transition-all hover:bg-surface-container-high ${selectedPaymentMethod === "CREDIT_CARD" ? "border-2 border-primary bg-surface-container-low" : "bg-surface-container-low"}`}>
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPaymentMethod === "CREDIT_CARD"}
                    onChange={() => setSelectedPaymentMethod("CREDIT_CARD")}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-grow">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-lg font-bold">The tin dung</span>
                      <CreditCard className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard hoac cac the quoc te thong dung.</p>
                  </div>
                </label>
              </div>

              <div className={`rounded-xl p-6 transition-all hover:bg-surface-container-high ${selectedPaymentMethod === "INSTALLMENT" ? "border-2 border-primary bg-surface-container-low" : "bg-surface-container-low"}`}>
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPaymentMethod === "INSTALLMENT"}
                    onChange={() => setSelectedPaymentMethod("INSTALLMENT")}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-grow">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-lg font-bold">Tra gop</span>
                      <Calendar className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Showroom se lien he tu van goi tra gop khi xac nhan don.</p>
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/15 bg-white p-8">
            <h3 className="mb-6 text-xl font-bold">Thong tin khach hang</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">Ho va ten</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(event) => updateForm("customerName", event.target.value)}
                  className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-2 font-medium focus:border-primary focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">CMND / CCCD</label>
                <input
                  type="text"
                  value={form.customerIdentityNumber}
                  onChange={(event) => updateForm("customerIdentityNumber", event.target.value)}
                  className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-2 font-medium focus:border-primary focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">So dien thoai</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(event) => updateForm("phoneNumber", event.target.value)}
                  className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-2 font-medium focus:border-primary focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(event) => updateForm("customerEmail", event.target.value)}
                  className="w-full border-0 border-b-2 border-outline-variant bg-transparent px-0 py-2 font-medium focus:border-primary focus:ring-0"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/15 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <Store className="text-primary" />
              <h3 className="text-xl font-bold">Showroom nhan xe</h3>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">Thanh pho</label>
                <input
                  type="text"
                  value="TP. Ho Chi Minh"
                  disabled
                  className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm font-medium text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="mono-label text-muted-foreground">Chon quan / huyen</label>
                <select
                  value={form.district}
                  onChange={(event) => handleDistrictChange(event.target.value)}
                  className="w-full rounded-lg border border-outline-variant/20 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none"
                >
                  <option value="">{loadingShowrooms ? "Dang tai quan..." : "Chon quan / huyen"}</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="mono-label text-muted-foreground">Chon showroom</label>
                <select
                  value={form.pickupShowroomId}
                  onChange={(event) => updateForm("pickupShowroomId", event.target.value)}
                  disabled={!form.district}
                  className="w-full rounded-lg border border-outline-variant/20 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-container-low"
                >
                  <option value="">{form.district ? "Chon showroom nhan xe" : "Vui long chon quan truoc"}</option>
                  {filteredShowrooms.map((showroom) => (
                    <option key={showroom.id} value={showroom.id}>
                      {showroom.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="mono-label text-muted-foreground">Dia chi cu the</label>
                <textarea
                  rows={4}
                  value={form.detailedAddress}
                  onChange={(event) => updateForm("detailedAddress", event.target.value)}
                  placeholder="Nhap so nha, ten duong, phuong/xa tai TP.HCM de showroom lien he nhan xe."
                  className="w-full rounded-lg border border-outline-variant/20 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {selectedShowroom ? (
              <div className="mt-6 rounded-xl bg-surface-container-low p-5 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-bold text-foreground">
                  <MapPin size={16} className="text-primary" />
                  {selectedShowroom.name}
                </div>
                <p>{selectedShowroom.address}</p>
                <p className="mt-2 flex items-center gap-2">
                  <Phone size={14} />
                  {selectedShowroom.phone || "Dang cap nhat"}
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-xl border border-outline-variant/15 bg-white p-8">
            <h3 className="mb-4 text-xl font-bold">Thong tin bo sung</h3>
            <textarea
              rows={5}
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              placeholder="Ghi chu them cho showroom neu can."
              className="w-full rounded-lg border border-outline-variant/20 bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none"
            />
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-8">
            <div className="rounded-xl border border-outline-variant/15 bg-white p-8 shadow-sm">
              <div className="mb-8 aspect-[16/9] overflow-hidden rounded-lg bg-surface-container-low">
                <img
                  src={resolveProductImage(product.image) || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(event) => attachImageFallback(event, product.name)}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">Phien ban: {state.selectedColor || "Default"}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{product.categoryName || "E-Bike"}</p>
                </div>
                <span className="font-mono text-xl font-bold text-primary">{product.price.toLocaleString("vi-VN")}ð</span>
              </div>

              <div className="space-y-4 border-t border-outline-variant/15 pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">So luong</span>
                  <span className="font-mono font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tam tinh</span>
                  <span className="font-mono font-medium">{subtotal.toLocaleString("vi-VN")}ð</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uu dai showroom</span>
                  <span className="font-mono font-medium text-error">- {ecoIncentive.toLocaleString("vi-VN")}ð</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phi dang ky</span>
                  <span className="font-mono font-medium">{registrationFee.toLocaleString("vi-VN")}ð</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nhan tai showroom</span>
                  <span className="font-mono font-medium text-primary">Mien phi</span>
                </div>
              </div>

              <div className="mt-8 border-t-2 border-foreground pt-8">
                <div className="mb-8 flex items-baseline justify-between">
                  <span className="text-lg font-bold">Tong thanh toan</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold tracking-tighter">{total.toLocaleString("vi-VN")}ð</span>
                    <p className="mt-1 text-[10px] font-mono text-muted-foreground">VAT INCLUDED</p>
                  </div>
                </div>
                <button
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary py-5 text-lg font-bold tracking-tight text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Dang tao don hang..." : "Xac nhan dat hang"}
                </button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                  <Lock size={14} />
                  Encrypted Secure Payment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-xl bg-surface-container-low p-6">
              <div className="flex-grow">
                <div className="mb-2 flex items-center gap-2">
                  <Zap size={14} className="text-primary" fill="currentColor" />
                  <span className="mono-label text-primary">TP.HCM PICKUP ONLY</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  He thong hien chi ho tro nhan xe tai showroom trong TP.HCM. Khach hang chon quan va dia chi cu the de showroom lien he.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
