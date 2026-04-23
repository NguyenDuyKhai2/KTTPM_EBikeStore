export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    initials: string;
    avatar?: string;
  };
  product: {
    name: string;
    variant: string;
    price: number;
    category: string;
    sku: string;
    vin?: string;
    image: string;
  };
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'In Transit';
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'Refunded';
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  customer: {
    name: string;
    email: string;
    initials: string;
  };
  method: 'VNPAY' | 'PAY_LATER' | 'BANK_TRANSFER';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  txId?: string;
  error?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Churn Risk' | 'Guest' | 'Inactive';
  totalPurchase: number;
  ordersCount: number;
  lastOrderDate: string;
  recentActivity: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  variations: number;
  status: 'Live' | 'Low Stock' | 'Hidden';
  image: string;
  colors: string[];
}
