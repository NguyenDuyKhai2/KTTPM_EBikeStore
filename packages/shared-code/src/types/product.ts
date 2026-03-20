export interface Category {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: Category;
  images: string[];
  reviews: Review[];
}

export interface ProductFilter {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}
