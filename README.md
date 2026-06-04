# Karana Agency

A React/Vite public site, React/Vite admin dashboard, and Express backend powered by Supabase.

## Prerequisites

- Node.js 20 or newer
- A Supabase project
- Supabase project URL and service role key

## Supabase Setup

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Run the full SQL script from `server/supabase-schema.sql`.
4. Confirm these tables exist: `products`, `orders`, `service_orders`, and `settings`.

The schema creates the default `3dprint-colors` settings row. Store products are intentionally empty at first.

## Environment Setup

Create `server/.env` from `server/.env.example`:

```bash
cd server
copy .env.example .env
```

Fill in:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=change-this-admin-password
SERVER_PUBLIC_URL=http://localhost:4000
PORT=4000
```

Do not commit `server/.env`. The backend uses the service role key only on the server.

Optional frontend API overrides:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_ADMIN_API_BASE_URL=http://localhost:4000
```

## Install Dependencies

Install the public site dependencies:

```bash
npm install
```

Install the backend dependencies:

```bash
cd server
npm install
```

Install the admin dashboard dependencies:

```bash
cd ../admin
npm install
```

## Run Locally

Start the backend:

```bash
cd server
npm start
```

Start the public frontend from the repository root:

```bash
npm run dev
```

Start the admin dashboard in another terminal:

```bash
cd admin
npm run dev
```

The public site defaults to `http://localhost:5173`, the admin dashboard to `http://localhost:5174`, and the backend to `http://localhost:4000`.

## Products

Initial products must be added through the admin dashboard before the public store shows catalog items. Log in to the admin dashboard, open **Manage Catalog**, and add the first product.

## Production Build

From the repository root:

```bash
npm run build
```

This builds the public site, builds the admin dashboard, and copies the compiled admin artifacts into `server/public/admin` using `scripts/copy-admin-dist.js`.

## Project Structure

- `src/`: public user-facing site
- `admin/`: admin dashboard
- `server/`: Express API, Supabase client, SQL schema, and uploaded static files
- `scripts/copy-admin-dist.js`: copies `admin/dist` into `server/public/admin`
- `supabase/config.toml`: local Supabase CLI project configuration
