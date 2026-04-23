export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
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

export interface VnPayCreatePaymentRequest {
  orderId: number;
  bankCode?: string;
  language?: "vn" | "en";
}

export interface VnPayCreatePaymentResponse {
  paymentUrl: string;
  paymentId: number;
  txnRef: string;
  amount: number;
  expireTime: string;
  orderNumber: string;
}

export interface VnPayReturnResponse {
  valid: boolean;
  success: boolean;
  responseCode?: string | null;
  txnRef?: string | null;
  amount?: number | null;
  transactionNo?: string | null;
  bankCode?: string | null;
  cardType?: string | null;
  paymentId?: number | null;
  orderId?: number | null;
  orderNumber?: string | null;
  paymentStatus?: string | null;
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
  userId?: number | null;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  registrationFee: number;
  totalAmount: number;
  paymentMethod?: "PAY_LATER" | "VNPAY" | string | null;
  paymentStatus?: string | null;
  notes?: string | null;
  customerEmail?: string | null;
  customerIdentityNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shipment?: Shipment | null;
}

export interface CreateOrderRequest {
  userId?: number | null;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  customerIdentityNumber: string;
  pickupShowroomId: number;
  detailedAddress: string;
  paymentMethod: "PAY_LATER" | "VNPAY";
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface OrderQuoteRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface OrderQuote {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  registrationFee: number;
  totalAmount: number;
}
