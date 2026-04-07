export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price?: number;
  unitPrice?: number;
  lineTotal?: number;
}

export interface Payment {
  id: number | string;
  method: string;
  status: string;
  amount: number;
}

export interface Showroom {
  id: number;
  name: string;
  city: string;
  district: string;
  address: string;
  phone?: string | null;
  openingHours?: string | null;
  active: boolean;
}

export interface Shipment {
  id: number;
  shipmentStatus: string;
  recipientName: string;
  phoneNumber: string;
  recipientEmail?: string | null;
  pickupDistrict?: string | null;
  detailedAddress?: string | null;
  shippingAddress?: string | null;
  trackingNumber?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  pickupShowroom?: Showroom | null;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string | null;
  customerEmail?: string | null;
  customerIdentityNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shipment?: Shipment | null;
}

export interface CreateOrderRequest {
  userId: number;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  customerIdentityNumber: string;
  pickupShowroomId: number;
  detailedAddress: string;
  shippingFee?: number;
  discountAmount?: number;
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}
