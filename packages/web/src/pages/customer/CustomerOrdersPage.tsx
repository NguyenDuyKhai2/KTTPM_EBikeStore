import SectionShell from "../../components/common/SectionShell";

const CustomerOrdersPage = () => (
  <SectionShell
    eyebrow="Đơn hàng của tôi"
    title="Theo dõi những lần mua xe điện hiện tại và quá khứ."
    description="Nhóm tuyến đường này cung cấp cho một đồng đội một nơi sạch sẽ để phát triển các luồng lịch sử đơn đặt hàng và chi tiết đơn đặt hàng mà không cần chạm vào các trang khách."
  >
    <div className="py-8 px-6">
      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
        Danh sách lịch sử đơn hàng và thẻ trạng thái sẽ được gắn tại đây.
      </div>
    </div>
  </SectionShell>
);

export default CustomerOrdersPage;
