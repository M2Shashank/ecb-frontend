# ECB Frontend

The frontend for the ECB clothing storefront. It is built with React and Vite and provides product browsing, search, authentication, wishlist, cart, and order pages.

## Requirements

- Node.js 18 or newer
- npm
- The ECB backend running at `http://localhost:3000`

The frontend sends API requests to `http://localhost:3000/api` and expects the
backend to provide the authentication, product, wishlist, cart, and order
endpoints used by the application.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL printed by Vite, usually
   `http://localhost:5173`.

## Application routes

- `/` - Browse products and search the catalogue
- `/product/:productId` - View product details
- `/auth` - Register or sign in
- `/cart` - View and update the authenticated user's cart
- `/orders` - View the authenticated user's orders
