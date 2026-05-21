export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    enhancedLogin: "/auth/login/enhanced",
    register: "/auth/register",
    logout: "/auth/logout",
    session: "/auth/session",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
    userFromToken: "/auth/user-from-token",
    emailRegistered: "/auth/email-registered"
  },
  products: {
    list: "/products",
    filterOptions: "/products/filter-options",
    detail: (id: string) => `/products/${id}`,
    search: "/products/search"
  },
  adminProductImages: {
    list: "/admin/product-images",
    detail: (imageId: number | string) => `/admin/product-images/${imageId}`
  },
  favorites: {
    list: "/favorites",
    add: "/favorites",
    remove: (productId: number) => `/favorites/${productId}`
  },
  orders: {
    list: "/orders",
    create: "/orders",
    quote: "/orders/quote",
    detail: (id: string | number) => `/orders/${id}`,
    cancellationRequest: (id: string | number) => `/orders/${id}/cancellation-request`,
    shipmentTimeline: (id: string | number) => `/orders/${id}/shipment/timeline`,
    shipmentUpdate: (id: string | number) => `/orders/${id}/shipment`
  },
  manager: {
    dashboard: "/manager/dashboard",
    payments: "/manager/payments",
    paymentConfirm: (paymentId: number | string) => `/manager/payments/${paymentId}/confirm`,
    cancellationApprove: (orderId: number | string) => `/manager/orders/${orderId}/cancellation/approve`,
    cancellationReject: (orderId: number | string) => `/manager/orders/${orderId}/cancellation/reject`,
    customers: "/manager/customers"
  },
  showrooms: {
    list: "/showrooms"
  },
  chat: {
    message: "/chatbot/ask",
    history: "/chat/history"
  },
  payments: {
    vnpayCreate: "/payments/vnpay/create",
    vnpayReturn: "/payments/vnpay/return"
  }
} as const;
