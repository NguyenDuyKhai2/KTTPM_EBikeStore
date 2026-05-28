export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    enhancedLogin: "/auth/login/enhanced",
    register: "/auth/register",
    logout: "/auth/logout",
    session: "/auth/session",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
    password: "/auth/change-password",
    userFromToken: "/auth/user-from-token"
  },
  products: {
    list: "/products",
    detail: (id: string) => `/products/${id}`,
    related: (id: string) => `/products/${id}/related`,
    search: "/products/search",
    reviews: (slug: string) => `/products/${slug}/reviews`
  },
  reviews: {
    update: (reviewId: number | string) => `/reviews/${reviewId}`,
    remove: (reviewId: number | string) => `/reviews/${reviewId}`
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
    cancellationRequest: (id: string | number) => `/orders/${id}/cancellation-request`
  },
  manager: {
    dashboard: "/manager/dashboard",
    payments: "/manager/payments",
    paymentConfirm: (paymentId: number | string) => `/manager/payments/${paymentId}/confirm`,
    productStock: (productId: number | string) => `/manager/products/${productId}/stock`,
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
    history: "/payments/history",
    vnpayCreate: "/payments/vnpay/create",
    vnpayReturn: "/payments/vnpay/return"
  }
  ,
  notifications: {
    list: "/notifications",
    unreadCount: "/notifications/unread-count",
    markRead: (id: number | string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all"
  }
} as const;
