
-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  role TEXT DEFAULT 'warehouse_staff' CHECK (role IN ('admin', 'warehouse_manager', 'warehouse_staff', 'finance')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create inventory items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  method TEXT DEFAULT 'FIFO' CHECK (method IN ('FIFO', 'FEFO', 'LIFO')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workers table
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  shift TEXT,
  orders_processed INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 100,
  productivity DECIMAL(5,2) DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  assigned_worker_id UUID REFERENCES public.workers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for inventory_items (accessible to authenticated users)
CREATE POLICY "Authenticated users can view inventory" ON public.inventory_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage inventory" ON public.inventory_items
  FOR ALL TO authenticated USING (true);

-- Create RLS policies for workers (accessible to authenticated users)
CREATE POLICY "Authenticated users can view workers" ON public.workers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage workers" ON public.workers
  FOR ALL TO authenticated USING (true);

-- Create RLS policies for orders (accessible to authenticated users)
CREATE POLICY "Authenticated users can view orders" ON public.orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage orders" ON public.orders
  FOR ALL TO authenticated USING (true);

-- Create RLS policies for order_items (accessible to authenticated users)
CREATE POLICY "Authenticated users can view order items" ON public.order_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage order items" ON public.order_items
  FOR ALL TO authenticated USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data
INSERT INTO public.inventory_items (item_code, name, description, category, current_stock, min_stock_level, unit_price, location, method) VALUES
('ITM-001', 'Industrial Bearings', 'Heavy-duty ball bearings for machinery', 'Mechanical Parts', 5, 20, 45.99, 'A1-B2-C3', 'FIFO'),
('ITM-002', 'Steel Bolts M12', 'M12 x 50mm steel bolts', 'Fasteners', 150, 100, 0.85, 'B2-C1-D4', 'FIFO'),
('ITM-003', 'Safety Helmets', 'OSHA approved safety helmets', 'Safety Equipment', 8, 25, 25.50, 'C3-D2-E1', 'FIFO'),
('ITM-004', 'Work Gloves', 'Cut-resistant work gloves', 'Safety Equipment', 22, 30, 12.75, 'C3-D2-E2', 'FIFO'),
('ITM-005', 'Hydraulic Oil', 'High-performance hydraulic fluid', 'Fluids', 45, 20, 89.99, 'D1-E2-F3', 'FEFO');

INSERT INTO public.workers (name, email, position, shift, orders_processed, accuracy, productivity, is_active) VALUES
('John Smith', 'john.smith@warehouse.com', 'Senior Warehouse Associate', 'Morning (6AM-2PM)', 156, 98.5, 95.2, true),
('Sarah Johnson', 'sarah.johnson@warehouse.com', 'Warehouse Associate', 'Afternoon (2PM-10PM)', 142, 96.8, 88.7, true),
('Mike Davis', 'mike.davis@warehouse.com', 'Forklift Operator', 'Morning (6AM-2PM)', 89, 99.1, 92.3, true),
('Lisa Chen', 'lisa.chen@warehouse.com', 'Warehouse Associate', 'Night (10PM-6AM)', 134, 97.2, 91.5, true),
('Robert Brown', 'robert.brown@warehouse.com', 'Team Lead', 'Morning (6AM-2PM)', 98, 98.9, 93.8, false);
