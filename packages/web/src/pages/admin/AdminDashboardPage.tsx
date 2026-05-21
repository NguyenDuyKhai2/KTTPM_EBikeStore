import SectionShell from "../../components/common/SectionShell";

const AdminDashboardPage = () => (
  <SectionShell
    eyebrow="Bảng điều khiển quản trị"
    title="Giám sát hoạt động sản phẩm, khách hàng và chatbot từ một nơi."
    description="Tuyến đường này cung cấp cho nhóm một nhánh quản trị dành riêng cho báo cáo trong tương lai và kiểm soát hoạt động."
  >
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 sm:p-8">
      KPI quản trị, biểu đồ và tóm tắt hoạt động sẽ được thêm tại đây.
    </div>
  </SectionShell>
);

export default AdminDashboardPage;
