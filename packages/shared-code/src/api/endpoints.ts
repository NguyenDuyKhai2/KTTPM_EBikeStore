export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh"
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
