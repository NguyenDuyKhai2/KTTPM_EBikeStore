import SectionShell from "../../components/common/SectionShell";

const AdminProductsPage = () => (
  <SectionShell
    eyebrow="Sản phẩm quản trị"
    title="Quản lý danh mục xe điện từ tuyến đường quản trị riêng."
    description="Tuyến đường này sau này có thể lưu trữ quản lý bảng sản phẩm, biểu mẫu upsert, tải lên phương tiện và kiểm soát kho."
  >
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 sm:p-8">
      Giao diện quản lý sản phẩm quản trị sẽ được đặt tại đây.
    </div>
  </SectionShell>
);

export default AdminProductsPage;
