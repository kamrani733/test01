# Xoos Next.js Project

یک پروژه Next.js مدرن با TypeScript، Zustand، و TanStack Query برای مدیریت state و data fetching.

## 🚀 ویژگی‌ها

- **Next.js 15** با App Router
- **TypeScript** برای type safety
- **Zustand** برای state management
- **TanStack Query** برای data fetching و caching
- **Tailwind CSS** برای styling
- **Radix UI** برای کامپوننت‌های accessible
- **React Hook Form** با Zod validation
- **Jest & Testing Library** برای testing
- **ESLint & Prettier** برای code quality
- **Error Boundaries** برای error handling
- **Internationalization** (i18n) support

## 📦 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18+ 
- pnpm (توصیه می‌شود)

### نصب dependencies

```bash
pnpm install
```

### اجرای پروژه در حالت development

```bash
pnpm dev
```

پروژه در آدرس [http://localhost:3000](http://localhost:3000) در دسترس خواهد بود.

## 🛠️ Scripts

```bash
# Development
pnpm dev          # اجرای پروژه در حالت development
pnpm build        # Build پروژه برای production
pnpm start        # اجرای پروژه در حالت production

# Code Quality
pnpm lint         # اجرای ESLint
pnpm lint:fix     # رفع خطاهای ESLint
pnpm format       # فرمت کردن کد با Prettier
pnpm format:check # بررسی فرمت کد

# Testing
pnpm test         # اجرای تست‌ها
pnpm test:watch   # اجرای تست‌ها در حالت watch
pnpm test:coverage # اجرای تست‌ها با coverage report
```

## 🏗️ ساختار پروژه

```
src/
├── app/                 # Next.js App Router
│   ├── [lang]/         # Internationalization routes
│   ├── (account)/      # Account group routes
│   └── (main)/         # Main group routes
├── components/         # React components
│   ├── account/        # Account-related components
│   ├── main/           # Main app components
│   ├── shared/         # Shared components
│   └── ui/             # UI components
├── core/               # Core functionality
│   ├── api/            # API functions
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utility functions
│   ├── models/         # TypeScript models
│   ├── schemas/        # Zod schemas
│   └── types/          # TypeScript types
├── contexts/           # React contexts
├── stores/             # Zustand stores
└── utils/              # Utility functions
```

## 🔧 پیکربندی

### Environment Variables

فایل `.env.local` را در root پروژه ایجاد کنید:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_APP_NAME=Xoos
```

### TypeScript

پروژه از TypeScript با strict mode استفاده می‌کند. فایل `tsconfig.json` برای پیکربندی TypeScript استفاده می‌شود.

### ESLint & Prettier

- **ESLint**: برای linting کد با قوانین Next.js و TypeScript
- **Prettier**: برای فرمت کردن کد

## 🧪 Testing

پروژه از Jest و React Testing Library برای testing استفاده می‌کند.

### اجرای تست‌ها

```bash
# اجرای تمام تست‌ها
pnpm test

# اجرای تست‌ها در حالت watch
pnpm test:watch

# اجرای تست‌ها با coverage report
pnpm test:coverage
```

### نوشتن تست

```typescript
// __tests__/components/Example.test.tsx
import { render, screen } from '@testing-library/react';
import Example from '@/components/Example';

describe('Example Component', () => {
  it('renders correctly', () => {
    render(<Example />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 📱 State Management

### Zustand Stores

پروژه از Zustand برای state management استفاده می‌کند:

```typescript
// استفاده از UI Store
import { useUIStore } from '@/stores';

const { theme, setTheme } = useUIStore();
```

### TanStack Query

برای data fetching و caching:

```typescript
// استفاده از TanStack Query
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

## 🌐 Internationalization

پروژه از Next.js App Router برای i18n استفاده می‌کند:

- مسیرها: `/[lang]/...`
- زبان‌های پشتیبانی شده: `fa`, `en`, `ar`
- فایل‌های ترجمه در `src/core/dictionaries/`

## 🚀 Deployment

### Vercel (توصیه شده)

1. پروژه را به GitHub/GitLab push کنید
2. در Vercel پروژه جدید ایجاد کنید
3. Environment variables را تنظیم کنید
4. Deploy کنید

### Docker

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 🤝 Contributing

1. Fork پروژه
2. Branch جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add some amazing feature'`)
4. Branch را push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## 📄 License

این پروژه تحت مجوز MIT منتشر شده است.

## 🆘 Support

برای پشتیبانی و سوالات:

- Issue در GitHub ایجاد کنید
- با تیم توسعه تماس بگیرید

## 🔄 Changelog

### v0.1.0
- راه‌اندازی اولیه پروژه
- اضافه کردن Zustand و TanStack Query
- پیاده‌سازی i18n
- اضافه کردن testing framework
