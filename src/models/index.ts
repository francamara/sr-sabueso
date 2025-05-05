// models.ts

export interface Role {
  id: number;
  name: string;
}

export interface Address {
  id: number;
  address: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  role_id: number;
  phone_number: string | null;
  created_at: string;
  email_verified: string | null;
  addresses: Address[];
}

export interface Animal {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  brand_id: number;
  description: string;
  sku: string;
  barcode: string;
  stock: number;
  retail_price: number;
  wholesale_price: number;
  weight: number;
  extra_weight: number;
  animal_id: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface Distributor {
  id: number;
  name: string;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface PriceHistory {
  id: number;
  product_id: number;
  distributor_id: number;
  price_type_id: number;
  price: number;
  changed_at: Date;
  is_deleted: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt_text: string;
  created_at: Date;
}

export interface OrderStatus {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  order_status_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface Delivery {
  id: number;
  order_id: number;
  delivered_at: Date;
  status: string;
  notes: string;
}

export interface MovementType {
  id: number;
  name: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  user_id: number;
  movement_type_id: number;
  change: number;
  reference_id: number;
  created_at: Date;
}
