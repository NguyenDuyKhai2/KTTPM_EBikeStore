import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock } from "lucide-react";

interface CheckoutState {
  product: {
    id: number;
    name: string;
    price: number;
  };
  selectedColor: string;
  quantity: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  if (!state?.product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thông tin thanh toán không hợp lệ
        </h1>
        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          Quay lại sản phẩm
        </button>
      </main>
    );
  }

  const totalPrice = state.product.price * state.quantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      alert("Vui lòng đồng ý với Điều khoản và Chính sách");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert("✓ Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
      navigate("/");
      setIsProcessing(false);
    }, 2000);
  };

  const paymentMethods = [
    { id: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: "🚚" },
    { id: "vnpay", label: "VNPay - Thẻ/Ví điện tử", icon: "💳" },
    { id: "bank", label: "Chuyển khoản ngân hàng", icon: "🏦" },
    { id: "debit", label: "Thẻ tín dụng/Debit", icon: "💰" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 lg:px-14">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-orange-600 font-semibold transition hover:gap-3"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Thông tin giao hàng
                </h2>

                <div className="space-y-4">
                  {/* Name & Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="0912345678"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="123 Đường ABC"
                    />
                  </div>

                  {/* City, District, Ward */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Tỉnh/Thành phố *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="bac-ninh">Bắc Ninh</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Quận/Huyện *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        placeholder="Quận/Huyện"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-900">
                        Phường/Xã *
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        placeholder="Phường/Xã"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-4 cursor-pointer rounded-lg border-2 p-4 transition ${
                        paymentMethod === method.id
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1.5"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {method.icon} {method.label}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment Info */}
                {paymentMethod === "bank" && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                    <p><strong>Số tài khoản:</strong> 1234567890</p>
                    <p><strong>Chủ tài khoản:</strong> YADEA VIETNAM</p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Tôi đđồng ý với <a href="#" className="text-orange-600 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-orange-600 hover:underline">Chính sách bảo mật</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !agreeTerms}
                className="w-full rounded-lg bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={20} />
                {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 sticky top-6">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Tóm tắt đơn hàng
            </h2>

            {/* Product */}
            <div className="space-y-4 border-b border-gray-200 pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Sản phẩm</span>
                <span className="font-semibold text-gray-900">
                  {state.product.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Màu sắc</span>
                <span className="font-semibold text-gray-900">
                  {state.selectedColor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng</span>
                <span className="font-semibold text-gray-900">
                  {state.quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giá</span>
                <span className="font-semibold text-gray-900">
                  {state.product.price.toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3 py-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="text-gray-900">{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-green-600 font-semibold">Miễn phí</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-3xl font-bold text-orange-600">
                  {totalPrice.toLocaleString()}đ
                </span>
              </div>

              {/* Benefits */}
              <div className="space-y-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                <div className="flex items-start gap-2">
                  <Check size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Miễn phí giao hàng</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Bảo hành 36 tháng</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
