
import { Prisma } from '@prisma/client';

// Define types based on Prisma models
export type Profile = Prisma.ProfileGetPayload<{}>;
export type InventoryItem = Prisma.InventoryItemGetPayload<{}>;
export type Worker = Prisma.WorkerGetPayload<{}>;
export type Order = Prisma.OrderGetPayload<{
  include: {
    assignedWorker: true;
    orderItems: {
      include: {
        item: true;
      };
    };
  };
}>;
export type OrderItem = Prisma.OrderItemGetPayload<{}>;

// Enums
export type UserRole = Prisma.UserRole;
export type StockMethod = Prisma.StockMethod;
export type OrderType = Prisma.OrderType;
export type OrderStatus = Prisma.OrderStatus;

// Input types for creating/updating records
export type CreateInventoryItemInput = Prisma.InventoryItemCreateInput;
export type UpdateInventoryItemInput = Prisma.InventoryItemUpdateInput;
export type CreateWorkerInput = Prisma.WorkerCreateInput;
export type CreateOrderInput = Prisma.OrderCreateInput;
