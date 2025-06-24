
# Backend Setup Guide for Prisma Integration

This guide shows how to set up a separate backend server with Prisma to work with your Lovable frontend.

## Prerequisites

- Node.js installed on your local machine
- PostgreSQL database (you can use the same database as your Supabase project)

## Step 1: Create Backend Project

```bash
mkdir warehouse-backend
cd warehouse-backend
npm init -y
```

## Step 2: Install Dependencies

```bash
npm install express cors dotenv
npm install prisma @prisma/client
npm install -D nodemon
```

## Step 3: Initialize Prisma

```bash
npx prisma init
```

## Step 4: Configure Environment

Create `.env` file:
```
DATABASE_URL="your-postgresql-connection-string"
PORT=3001
```

## Step 5: Copy Prisma Schema

Copy the `prisma/schema.prisma` from your Lovable project to the backend project.

## Step 6: Generate Prisma Client

```bash
npx prisma generate
npx prisma db push
```

## Step 7: Create Express Server

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 8: Create Routes Directory

```bash
mkdir routes
```

Copy the `inventory-routes.js` example to `routes/inventory.js`.

## Step 9: Update Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Step 10: Run the Backend

```bash
npm run dev
```

## Step 11: Update Frontend Environment

In your Lovable project, you can set the API URL by updating the environment variable in `usePrismaInventory.ts` or by adding it to your deployment environment variables:

```
REACT_APP_API_URL=http://localhost:3001/api
```

## Testing the Integration

1. Start your backend server
2. Your Lovable frontend will now make API calls to your backend
3. The backend uses Prisma to interact with your database
4. All CRUD operations will work through the API

## Deployment Considerations

- Deploy your backend to services like Railway, Render, or Heroku
- Update the `API_BASE_URL` in your frontend to point to your deployed backend
- Ensure your database is accessible from your deployed backend
