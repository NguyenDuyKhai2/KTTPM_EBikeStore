export type NotificationType = "ORDER_CREATED" | "ORDER_STATUS_CHANGED" | "PAYMENT_STATUS_CHANGED";

export interface NotificationItem {
  id: number;
  type: NotificationType | string;
  title: string;
  message: string;
  targetUrl?: string | null;
  orderId?: number | null;
  paymentId?: number | null;
  readAt?: string | null;
  createdAt: string;
}

export interface UnreadNotificationCount {
  count: number;
}
