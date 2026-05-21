import SectionShell from "../../components/common/SectionShell";

const AdminUsersPage = () => (
  <SectionShell
    eyebrow="Người dùng quản trị"
    title="Xem xét các tài khoản người dùng, quyền và các hành động tài khoản liên quan đến hỗ trợ."
    description="Tách biệt tuyến đường này sớm giúp dễ dàng tiến hóa hướng tới công cụ quản trị nhận biết PBAC sau này."
  >
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 sm:p-8">
      Bảng quản lý người dùng và kiểm soát quyền sẽ được thêm tại đây.
    </div>
  </SectionShell>
);

export default AdminUsersPage;
