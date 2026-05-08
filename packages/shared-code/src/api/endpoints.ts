export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    enhancedLogin: "/auth/login/enhanced",
    register: "/auth/register",
    logout: "/auth/logout",
    session: "/auth/session",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
    userFromToken: "/auth/user-from-token"
  },
  products: {
    list: "/products",
    detail: (id: string) => `/products/${id}`,
    search: "/products/search"
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
