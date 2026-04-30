# 🛍️ Luxe Market

A full-stack e-commerce platform built with Next.js 16, TypeScript, and modern web technologies. Features a complete shopping experience with product catalog, cart, checkout, user accounts, and admin dashboard.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (Prisma ORM) — easily switchable to PostgreSQL
- **Auth**: NextAuth v5 (credentials + Google OAuth)
- **Payments**: Stripe
- **State**: Zustand (persistent cart & wishlist)
- **UI**: Framer Motion, Radix UI, Lucide Icons

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/sirajwahaj/fruit.git
cd fruit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up the database
npx prisma migrate dev
npx prisma generate

# Seed demo data
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- **Admin**: admin@luxemarket.com / admin123456
- **Customer**: customer@example.com / customer123

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shop pages)        # Home, Shop, Product detail
│   ├── account/            # User account & orders
│   ├── admin/              # Admin dashboard
│   ├── api/                # REST API routes
│   ├── checkout/           # Cart & payment
│   └── (static pages)     # About, Contact, FAQ, etc.
├── components/             # Reusable React components
│   ├── cart/               # Cart drawer
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer
│   ├── product/            # Product card & detail
│   └── ui/                 # Button, Input, Toast, etc.
├── lib/                    # Utilities & configs
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   ├── store.ts            # Zustand stores
│   └── env.ts              # Environment validation
├── types/                  # TypeScript declarations
└── middleware.ts           # Auth route protection
```

## Features

### Customer Features
- Product browsing with filters, search, sorting, pagination
- Product detail with image gallery and reviews
- Persistent cart & wishlist (localStorage)
- User registration & login
- Order history with status tracking
- Address management
- Responsive design (mobile-first)

### Admin Features
- Dashboard with revenue stats, order overview, low stock alerts
- Product management (CRUD, stock tracking)
- Order management with status updates
- Customer list
- Category management

### Technical Features
- Route protection via Next.js middleware
- Input validation with Zod on all API endpoints
- Proper error handling & error boundaries
- SEO (sitemap.xml, robots.txt, Open Graph)
- Loading states & skeleton screens
- TypeScript strict mode throughout
- Accessible UI components

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset & re-seed database |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List products (filters, sort, pagination) |
| GET | `/api/products/[slug]` | Get single product |
| POST | `/api/products/[slug]/reviews` | Submit a review |
| GET | `/api/categories` | List all categories |
| POST | `/api/register` | Create account |
| GET | `/api/orders` | User's orders |
| POST | `/api/checkout` | Create payment intent |
| POST | `/api/webhooks/stripe` | Stripe webhook |
| GET/POST | `/api/addresses` | Address CRUD |
| GET/POST | `/api/admin/products` | Admin product management |
| PATCH/DELETE | `/api/admin/products/[id]` | Update/delete product |
| PATCH | `/api/admin/orders/[id]` | Update order status |
| GET | `/api/admin/stats` | Dashboard statistics |

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Switch DATABASE_URL to PostgreSQL (Neon/Supabase)
5. Update `prisma/schema.prisma` provider to `"postgresql"`

## License

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
