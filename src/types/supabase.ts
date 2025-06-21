
export interface SupabaseInventoryItem {
  id: string;
  item_code: string;
  name: string;
  description: string | null;
  category: string;
  current_stock: number;
  min_stock_level: number;
  unit_price: number;
  location: string;
  method: 'FIFO' | 'FEFO' | 'LIFO';
  last_updated: string;
  created_at: string;
}

export interface SupabaseWorker {
  id: string;
  name: string;
  email: string;
  position: string;
  shift: string | null;
  orders_processed: number;
  accuracy: number;
  productivity: number;
  is_active: boolean;
  created_at: string;
}

export interface SupabaseOrder {
  id: string;
  order_number: string;
  type: 'inbound' | 'outbound';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  assigned_worker_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface SupabaseProfile {
  id: string;
  username: string | null;
  email: string | null;
  role: 'admin' | 'warehouse_manager' | 'warehouse_staff' | 'finance';
  is_active: boolean;
  created_at: string;
}
