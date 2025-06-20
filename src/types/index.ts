
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export type UserRole = 'admin' | 'warehouse_manager' | 'warehouse_staff' | 'finance';

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  description: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
  method: 'FIFO' | 'FEFO' | 'LIFO';
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'inbound' | 'outbound';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  assignedWorker?: string;
}

export interface OrderItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  position: string;
  performance: {
    ordersProcessed: number;
    accuracy: number;
    productivity: number;
  };
  isActive: boolean;
  shift?: string;
}

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  pendingOrders: number;
  activeWorkers: number;
  totalValue: number;
}
