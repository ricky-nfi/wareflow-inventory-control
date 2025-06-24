
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.profile.deleteMany();

  // Seed profiles
  console.log('👤 Seeding profiles...');
  const profiles = await prisma.profile.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@warehouse.com',
        role: 'ADMIN',
        isActive: true
      },
      {
        username: 'manager1',
        email: 'manager@warehouse.com',
        role: 'WAREHOUSE_MANAGER',
        isActive: true
      },
      {
        username: 'staff1',
        email: 'staff@warehouse.com',
        role: 'WAREHOUSE_STAFF',
        isActive: true
      },
      {
        username: 'finance1',
        email: 'finance@warehouse.com',
        role: 'FINANCE',
        isActive: true
      }
    ]
  });

  // Seed inventory items
  console.log('📦 Seeding inventory items...');
  const inventoryItems = await prisma.inventoryItem.createMany({
    data: [
      {
        itemCode: 'ITM-001',
        name: 'Industrial Bearings',
        description: 'Heavy-duty ball bearings for machinery',
        category: 'Mechanical Parts',
        currentStock: 5,
        minStockLevel: 20,
        unitPrice: 45.99,
        location: 'A1-B2-C3',
        method: 'FIFO'
      },
      {
        itemCode: 'ITM-002',
        name: 'Steel Bolts M12',
        description: 'M12 x 50mm steel bolts',
        category: 'Fasteners',
        currentStock: 150,
        minStockLevel: 100,
        unitPrice: 0.85,
        location: 'B2-C1-D4',
        method: 'FIFO'
      },
      {
        itemCode: 'ITM-003',
        name: 'Safety Helmets',
        description: 'OSHA approved safety helmets',
        category: 'Safety Equipment',
        currentStock: 8,
        minStockLevel: 25,
        unitPrice: 25.50,
        location: 'C3-D2-E1',
        method: 'FIFO'
      },
      {
        itemCode: 'ITM-004',
        name: 'Work Gloves',
        description: 'Cut-resistant work gloves',
        category: 'Safety Equipment',
        currentStock: 22,
        minStockLevel: 30,
        unitPrice: 12.75,
        location: 'C3-D2-E2',
        method: 'FIFO'
      },
      {
        itemCode: 'ITM-005',
        name: 'Hydraulic Oil',
        description: 'High-performance hydraulic fluid',
        category: 'Fluids',
        currentStock: 45,
        minStockLevel: 20,
        unitPrice: 89.99,
        location: 'D1-E2-F3',
        method: 'FEFO'
      }
    ]
  });

  // Seed workers
  console.log('👷 Seeding workers...');
  const workers = await prisma.worker.createMany({
    data: [
      {
        name: 'John Smith',
        email: 'john.smith@warehouse.com',
        position: 'Senior Warehouse Associate',
        shift: 'Morning (6AM-2PM)',
        ordersProcessed: 156,
        accuracy: 98.5,
        productivity: 95.2,
        isActive: true
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@warehouse.com',
        position: 'Warehouse Associate',
        shift: 'Afternoon (2PM-10PM)',
        ordersProcessed: 142,
        accuracy: 96.8,
        productivity: 88.7,
        isActive: true
      },
      {
        name: 'Mike Davis',
        email: 'mike.davis@warehouse.com',
        position: 'Forklift Operator',
        shift: 'Morning (6AM-2PM)',
        ordersProcessed: 89,
        accuracy: 99.1,
        productivity: 92.3,
        isActive: true
      },
      {
        name: 'Lisa Chen',
        email: 'lisa.chen@warehouse.com',
        position: 'Warehouse Associate',
        shift: 'Night (10PM-6AM)',
        ordersProcessed: 134,
        accuracy: 97.2,
        productivity: 91.5,
        isActive: true
      },
      {
        name: 'Robert Brown',
        email: 'robert.brown@warehouse.com',
        position: 'Team Lead',
        shift: 'Morning (6AM-2PM)',
        ordersProcessed: 98,
        accuracy: 98.9,
        productivity: 93.8,
        isActive: false
      }
    ]
  });

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${profiles.count} profiles`);
  console.log(`   - ${inventoryItems.count} inventory items`);
  console.log(`   - ${workers.count} workers`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
