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
  orders: {
    list: "/orders",
    create: "/orders",
    detail: (id: string) => `/orders/${id}`
  },
  showrooms: {
    list: "/showrooms"
  },
  cart: {
    current: "/cart",
    addItem: "/cart/items",
    removeItem: (productId: string) => `/cart/items/${productId}`
  },
  chat: {
    message: "/chat/message",
    history: "/chat/history"
  },
  payments: {
    create: "/payments",
    verify: (paymentId: string) => `/payments/${paymentId}/verify`
  }
} as const;
