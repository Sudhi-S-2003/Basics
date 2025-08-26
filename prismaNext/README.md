/my-app
├── .next/                 # Build output (auto-generated)
├── public/                # Static files (images, fonts, icons, robots.txt, etc.)
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── logos/
│
├── src/                   # Source code (recommended for larger apps)
│   ├── app/               # Next.js App Router (pages, layouts, routes)
│   │   ├── (marketing)/   # Route groups - for public/marketing pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── about/page.tsx
│   │   ├── (dashboard)/   # Authenticated section
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/           # API routes (server actions or REST endpoints)
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   ├── products/
│   │   │   │   └── route.ts
│   │   │   └── ...
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Global styles
│   │
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Atoms & molecules (buttons, inputs, modals, etc.)
│   │   ├── layouts/       # Shared layouts (auth layout, dashboard layout)
│   │   ├── forms/         # Reusable form components
│   │   └── charts/        # Chart components
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   │
│   ├── lib/               # Utilities & helpers
│   │   ├── axios.ts       # Axios client config
│   │   ├── auth.ts        # Auth helpers
│   │   ├── constants.ts   # Global constants
│   │   ├── utils.ts       # Generic utility functions
│   │   └── validations.ts # Joi/Zod/Yup validations
│   │
│   ├── services/          # Business logic & API integrations
│   │   ├── userService.ts
│   │   ├── productService.ts
│   │   └── orderService.ts
│   │
│   ├── store/             # State management
│   │   ├── redux/         # Redux Toolkit slices
│   │   │   ├── userSlice.ts
│   │   │   └── productSlice.ts
│   │   └── query/         # TanStack Query configs
│   │       ├── client.ts
│   │       └── productQueries.ts
│   │
│   ├── styles/            # SCSS/Tailwind configs
│   │   ├── globals.css
│   │   ├── tailwind.css
│   │   └── variables.scss
│   │
│   ├── middleware.ts      # Middleware (auth, redirects, etc.)
│   └── types/             # TypeScript types & interfaces
│       ├── next-auth.d.ts
│       ├── user.ts
│       └── product.ts
│
├── .env                   # Environment variables
├── .env.local             # Local-only env variables
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config (if using Tailwind)
├── postcss.config.js      # PostCSS config
├── tsconfig.json          # TypeScript config
├── package.json
└── README.md


1️⃣ Install Prisma & database client

```bash
npm install prisma --save-dev
npm install @prisma/client
```


prisma → CLI for migrations, generating client

@prisma/client → runtime client to query DB


2️⃣ Initialize Prisma

```bash 
npx prisma init
```

This creates:

```bash

prisma/
  schema.prisma  <-- define your models
.env             <-- database URL

```

c) Run Prisma generate

```bash
npx prisma generate
```
```bash
npx prisma migrate dev --name init
npx prisma generate
```


# Connect to the PostgreSQL server running on my machine (localhost) on port 5432, using the user postgres, and open the database called postgres

```bash
psql -h localhost -p 5432 -U postgres -d postgres
```
