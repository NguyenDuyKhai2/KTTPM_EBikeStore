import { Order, Payment, Customer, Product } from './types';

export const orders: Order[] = [
  {
    id: 'ORD-90210',
    customer: {
      name: 'Julianne Davis',
      email: 'j.davis@example.com',
      phone: '+1 555-0129',
      initials: 'JD',
    },
    product: {
      name: 'Lumina S-Series',
      variant: 'Pearl White',
      price: 64500,
      category: 'Luxury Sedan',
      sku: 'LMX-SPEC-772',
      vin: '5YJSA1E28LFXXXXXX',
      image: 'https://picsum.photos/seed/car1/400/300',
    },
    date: 'Oct 24, 2023',
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-90211',
    customer: {
      name: 'Robert King',
      email: 'r.king@example.com',
      phone: '+1 555-0943',
      initials: 'RK',
    },
    product: {
      name: 'Lumina X-Truck',
      variant: 'Matte Black',
      price: 82000,
      category: 'Adventure SUV',
      sku: 'LMX-XTRK-041',
      image: 'https://picsum.photos/seed/car2/400/300',
    },
    date: 'Oct 25, 2023',
    status: 'Confirmed',
    paymentStatus: 'Partial',
  },
  {
    id: 'ORD-90212',
    customer: {
      name: 'Elena Moreno',
      email: 'e.moreno@example.com',
      phone: '+1 555-8821',
      initials: 'EM',
    },
    product: {
      name: 'Lumina E-Sport',
      variant: 'Rapid Red',
      price: 48200,
      category: 'Sport Coupe',
      sku: 'LMX-SPORT-299',
      image: 'https://picsum.photos/seed/car3/400/300',
    },
    date: 'Oct 26, 2023',
    status: 'Pending',
    paymentStatus: 'Unpaid',
  },
  {
    id: 'ORD-90213',
    customer: {
      name: 'Thomas Crane',
      email: 't.crane@example.com',
      phone: '+1 555-4432',
      initials: 'TC',
    },
    product: {
      name: 'Lumina S-Series',
      variant: 'Sky Blue',
      price: 61000,
      category: 'Luxury Sedan',
      sku: 'LMX-SPEC-773',
      image: 'https://picsum.photos/seed/car4/400/300',
    },
    date: 'Oct 26, 2023',
    status: 'In Transit',
    paymentStatus: 'Paid',
  },
];

export const payments: Payment[] = [
  {
    id: '1',
    invoiceId: 'LUM-94821',
    date: 'Oct 24, 2023 • 14:22',
    customer: { name: 'Jameson Douglas', email: 'j.douglas@example.com', initials: 'JD' },
    method: 'VNPAY',
    amount: 1240,
    status: 'Success',
    txId: '99421033',
  },
  {
    id: '2',
    invoiceId: 'LUM-94820',
    date: 'Oct 24, 2023 • 13:05',
    customer: { name: 'Sarah Rivera', email: 's.rivera@corp.tech', initials: 'SR' },
    method: 'PAY_LATER',
    amount: 4850,
    status: 'Pending',
  },
  {
    id: '3',
    invoiceId: 'LUM-94819',
    date: 'Oct 23, 2023 • 16:45',
    customer: { name: 'Michael Kross', email: 'm.kross@webmail.com', initials: 'MK' },
    method: 'VNPAY',
    amount: 920,
    status: 'Failed',
    error: 'AUTH_ERROR_04',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Lumina Spectre X',
    category: 'Luxury Sedan',
    price: 89400,
    stock: 12,
    variations: 4,
    status: 'Live',
    image: 'https://picsum.photos/seed/spectre/600/400',
    colors: ['#0f172a', '#94a3b8', '#2563eb', '#991b1b'],
  },
  {
    id: '2',
    name: 'Lumina Horizon 7',
    category: 'Adventure SUV',
    price: 104200,
    stock: 2,
    variations: 2,
    status: 'Low Stock',
    image: 'https://picsum.photos/seed/horizon/600/400',
    colors: ['#1e293b', '#064e3b'],
  },
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Julianne Smith',
    email: 'j.smith@techflow.io',
    phone: '+1 (555) 012-4412',
    status: 'Active',
    totalPurchase: 14290,
    ordersCount: 8,
    lastOrderDate: 'May 12',
    recentActivity: 'Lumina Pro X Charging Station',
  },
];
