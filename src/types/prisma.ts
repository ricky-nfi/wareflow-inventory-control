
// Manual TypeScript interfaces based on Prisma schema
// These replace Prisma-generated types for API-based integration

// Enums from Prisma schema
export type UserRole = 'admin' | 'warehouse_manager' | 'warehouse_staff' | 'finance';
export type StockMethod = 'FIFO' | 'FEFO' | 'LIFO';
export type OrderType = 'inbound' | 'outbound';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// Model interfaces based on Prisma schema
export interface Profile {
  id: string;
  username?: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  description?: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  location: string;
  method: StockMethod;
  lastUpdated: Date;
  createdAt: Date;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  position: string;
  shift?: string;
  ordersProcessed: number;
  accuracy: number;
  productivity: number;
  isActive: boolean;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  item?: InventoryItem;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  assignedWorkerId?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedWorker?: Worker;
  orderItems: OrderItem[];
}

// Input types for creating/updating records
export interface CreateInventoryItemInput {
  itemCode: string;
  name: string;
  description?: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  location: string;
  method: StockMethod;
}

export interface UpdateInventoryItemInput {
  itemCode?: string;
  name?: string;
  description?: string;
  category?: string;
  currentStock?: number;
  minStockLevel?: number;
  unitPrice?: number;
  location?: string;
  method?: StockMethod;
}

export interface CreateWorkerInput {
  name: string;
  email: string;
  position: string;
  shift?: string;
  ordersProcessed?: number;
  accuracy?: number;
  productivity?: number;
  isActive?: boolean;
}

export interface CreateOrderInput {
  orderNumber: string;
  type: OrderType;
  status?: OrderStatus;
  assignedWorkerId?: string;
}
