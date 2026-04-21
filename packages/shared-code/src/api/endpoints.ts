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
    detail: (id: string) => `/orders/${id}`
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
