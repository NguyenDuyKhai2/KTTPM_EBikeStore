import SectionShell from "../../components/common/SectionShell";

const CustomerProfilePage = () => (
  <SectionShell
    eyebrow="Hồ sơ"
    title="Quản lý thông tin tài khoản và sở thích mua sắm."
    description="Tuyến đường này dành cho hồ sơ, địa chỉ và cài đặt thông báo sau khi các API khách hàng được kết nối."
  >
    <div className="py-8 px-6">
      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
        Biểu mẫu hồ sơ và giao diện cài đặt tài khoản sẽ được đặt tại đây.
      </div>
    </div>
  </SectionShell>
);

export default CustomerProfilePage;
