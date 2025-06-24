
# Warehouse Management Backend

A Node.js backend API for the Warehouse Management System, built with Express.js and Prisma ORM.

## Features

- 🚀 Express.js REST API
- 🗄️ Prisma ORM with PostgreSQL
- 🔒 CORS enabled for frontend integration
- 📊 Comprehensive inventory management
- 👷 Worker management system
- 📦 Order processing system
- 👤 Profile management
- 🌱 Database seeding

## Quick Start

### Prerequisites

- Node.js (14.x or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and setup**
   ```bash
   git clone <your-repo-url>
   cd warehouse-management-backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/warehouse_db?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get single inventory item
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `GET /api/inventory/stats` - Get inventory statistics

### Worker Management
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get single worker
- `POST /api/workers` - Create new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Order Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `PUT /api/orders/:id/status` - Update order status

### Profile Management
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get single profile
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Soft delete profile

## Database Schema

The application uses the following main entities:

- **InventoryItem** - Product inventory management
- **Worker** - Employee information and performance
- **Order** - Inbound/outbound order processing
- **OrderItem** - Individual items within orders
- **Profile** - User profiles and roles

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Frontend Integration

This backend is designed to work with the Warehouse Management frontend. Update your frontend's API configuration to point to this backend:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### Heroku
1. Create new Heroku app
2. Set environment variables
3. Deploy using Git or GitHub integration

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
