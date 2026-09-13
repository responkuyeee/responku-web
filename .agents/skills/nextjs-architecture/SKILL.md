---
name: nextjs-architecture
description: Teaches how to build new features following the exact architecture, coding style, conventions, abstractions, and patterns established in this Next.js codebase.
---

# Next.js Project Coding Skill

## 1. Core Principles
- The repository uses a strict feature-based architecture where the `app/` directory solely acts as a routing layer.
- Components are cleanly divided between globally reusable UI components (`components/ui`) and feature-specific components (`features/<feature>/components`).
- API interactions are centralized in the `services/` directory using native `fetch`. Do not use `axios`.
- React Query is completely unused; do not implement `useQuery` or `useMutation`.
- Code style heavily relies on 4-space indentation, single quotes, and semicolons.

## 2. Architecture
The codebase strictly separates routing from implementation. The `app/` directory routes requests but the UI code, layout wrappers, and logic live inside `features/`. API logic is encapsulated in `services/`. Data fetching occurs in Server Components which pass data down to Client Components.

## 3. Feature-Based Architecture
All domain-specific code belongs in the `features/` directory. Features are organized into:
- `components/`: Client and Server UI components specific to the feature.
- `pages/`: Server components acting as the page implementation.
- `layout/`: Server components acting as the layout implementation.
Do not use barrel `index.ts` files inside features.

## 4. Feature Boundaries
- **`features/<feature>`**: Feature-specific UI, layouts, and page implementations.
- **`components/ui`**: Globally reusable, generic UI components (shadcn/ui).
- **`services/`**: API fetching logic and HTTP client abstraction.
- **`types/`**: Global interfaces and types representing API payloads and responses.

## 5. Folder Structure
```text
app/             # Next.js App Router (re-exports implementations only)
components/      # Global UI primitives (shadcn)
features/        # Domain-specific implementation
  └── auth/
      ├── components/
      ├── layout/
      └── pages/
lib/             # Shared utilities (cn, server-utils)
services/        # API communication logic
  └── auth/
types/           # Global type definitions
```

## 6. Services Architecture
Services encapsulate all API calls and throw structured exceptions.
- Export services as constant objects, not classes (e.g., `export const authService = { ... }`).
- Handle serialization (JSON.stringify) and deserialization natively.
- Services should throw `ApiException` (from `services/types.ts`) for non-ok responses.
- Payload and response types must be imported from the `types/` folder.

## 7. API Communication
- Always use native `fetch`. Do NOT use `axios` (even though it exists in package.json).
- Use `API_BASE_URL` from `process.env.NEXT_PUBLIC_API_URL` or fallback to `http://localhost:3000`.
- Include `credentials: 'include'` for endpoints requiring cookies.
- To access cookies for SSR requests, call `await getCookie({ cookieName: 'nestsession' })` imported from `@/lib/utils`.

## 8. Data Fetching
- **Server Data Fetching**: Call service methods directly in Server Components (e.g., in `features/<feature>/pages/<name>-page.tsx`) and pass the fetched data to Client Components as props.
- **Client Data Mutations**: Call service methods directly on form submit inside Client Components (e.g., in `features/<feature>/components/<name>-form.tsx`). Wrap with try/catch.

## 9. React Query
DO NOT use `@tanstack/react-query`. It is strictly not used in this repository.

## 10. Components
- Feature-specific UI goes into `features/<feature>/components/`.
- Client components must explicitly include `'use client';` at the top of the file.
- Use shadcn/ui components from `@/components/ui/` for generic UI elements (Buttons, Inputs, etc.).

## 11. Hooks
- Do not create a generic `hooks/` folder.
- Favor standard React hooks (`useState`, `useEffect`) and `react-hook-form` over complex custom hooks unless absolutely necessary.

## 12. Forms
- Always use `react-hook-form` in combination with `@hookform/resolvers/zod`.
- Track submission loading state manually with `const [isLoading, setIsLoading] = useState(false)`.
- Use the Shadcn `Input`, `Label`, and `Button` components to build the form layout.

## 13. Validation / Zod
- Use `zod` for all form validations.
- Define the schema directly in the same file as the component using it. Do not create separate `schemas/` directories.
- Extract the form type directly via `type FormValues = z.infer<typeof schema>`.

## 14. TypeScript
- Define request payloads and response structures in the global `types/` directory (e.g., `types/auth.ts`).
- Avoid `any`. Type `catch` exceptions as `unknown` and check if they are an instance of `ApiException`.

## 15. State Management
- Manage server state by passing props down from Server Components.
- Manage client state locally via `useState`.
- Avoid adding global state managers like Zustand or Redux unless explicitly requested.

## 16. Authentication
- Read authentication cookies in Server Components or Services using the `getCookie` Server Action (`lib/server-utils.ts`).
- When API calls return `401 Unauthorized`, catch the error and redirect to `/login` if on the server, or use `router.push('/login')` on the client.

## 17. Middleware
Middleware is not currently utilized for route protection in this repository. Route protection is handled in Server Components directly via `redirect()`.

## 18. Server Components
- Server Components live in `features/<feature>/pages/` and `features/<feature>/layout/`.
- Use them for initial data fetching via `services/`.
- Use `next/navigation`'s `redirect` to handle server-side unauthenticated states.

## 19. Client Components
- Located in `features/<feature>/components/`.
- Must start with `'use client';`.
- Handle interactivity, forms, and client-side mutations (submitting data to services).

## 20. Server Actions
Server actions (`'use server';`) are strictly reserved for server-side utilities (e.g., interacting with `next/headers` to read `cookies()` in `lib/server-utils.ts`). Do not use Server Actions for standard API mutations.

## 21. Routing
- The `app/` directory is purely a routing container.
- Inside `app/(group)/my-route/page.tsx`, you must only re-export the feature page: 
  `export { default } from '@/features/<feature>/pages/<feature>-page';`

## 22. Layouts
- Layout implementations live in `features/<feature>/layout/`.
- Re-export them in the `app/` directory exactly like pages.

## 23. Providers
- Global providers are placed directly in `app/layout.tsx`.
- Keep providers minimal; currently, only `sonner` Toaster is used.

## 24. Error Handling
- Service methods must catch network/fetch errors, parse the JSON exception response, and throw an `ApiException`:
  `throw new ApiException(message, statusCode, errors);`
- Client components must check: `if (exception instanceof ApiException)` and use `toast.error()` or `toast.info()` via `sonner` to display the message.

## 25. Loading / Empty / Error States
- Track loading states inside components manually via `useState`.
- Pass the loading boolean to the `disabled` prop of Submit buttons.

## 26. URL / Search Params
- No custom URL state libraries exist. Use standard React and Next.js `useRouter` or `searchParams` for routing.

## 27. Styling
- Use `tailwindcss` and `shadcn/ui`.
- Use `cn()` from the `cn` package for merging classes (imported from `cn`, re-exported in `lib/utils.ts` as `export { cn } from 'cn'`).

## 28. Utils / Lib
- `lib/utils.ts` is used for global utility re-exports.
- `lib/server-utils.ts` contains utilities that require `'use server'` (e.g., reading cookies).

## 29. Constants / Config
No global config or constants pattern exists. Use standard `process.env` when needed.

## 30. Imports / Exports
- Do not use barrel files (`index.ts`) inside features.
- Use the `@/` alias for global paths (`@/components/ui/button`, `@/services/...`, `@/types/...`).
- Use relative paths (`./` and `../`) for intra-feature component imports.

## 31. Naming Conventions
- **Files**: kebab-case (e.g., `product-form.tsx`, `product.service.ts`).
- **Components**: PascalCase (e.g., `ProductForm`).
- **Variables/Methods**: camelCase (e.g., `productService`, `getProducts`).
- **Types**: PascalCase (e.g., `GetProductResponse`).

## 32. Code Style
- **Indentation**: 4 spaces (`tabWidth: 4`).
- **Quotes**: Single quotes (`'use client'`).
- **Semicolons**: Required.
- **Trailing Commas**: None.
- **Arrow Functions**: Avoid parentheses when there's a single argument (e.g., `x => x * 2`).

## 33. Reusable Abstractions
Always reuse:
- `ApiException` for error throwing.
- `@/components/ui/` primitives instead of creating custom generic UI.
- `toast` from `sonner` for notifications.
- `getCookie` from `@/lib/utils` for server-side token access.

## 34. Anti-Patterns
- **DO NOT** use `axios`. Use native `fetch`.
- **DO NOT** use `@tanstack/react-query`.
- **DO NOT** place implementation logic inside `app/`. It belongs in `features/`.
- **DO NOT** create complex folder structures (`schemas/`, `hooks/`) inside features unless strictly necessary. Keep schemas inline with forms.

## 35. New Feature Workflow
1. Identify the new feature (e.g., `products`).
2. Add global API types to `types/products.ts`.
3. Create the API service at `services/products/product.service.ts`.
4. Create the feature folder `features/products/`.
5. Create UI components in `features/products/components/` (e.g., `product-list.tsx`). Define Zod schemas inline if forms are needed.
6. Create page components in `features/products/pages/` (e.g., `products-page.tsx`), fetching data via the service if required.
7. Re-export the page component in the `app/` router (e.g., `app/products/page.tsx`).

## 36. Complete Feature Example
**`types/products.ts`**
```typescript
export type GetProductsResponse = {
    data: { id: string; name: string }[];
    message: string;
};
```

**`services/products/product.service.ts`**
```typescript
import { ApiException, ExceptionResponse, SuccessResponse } from '../types';
import { GetProductsResponse } from '@/types/products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const productService = {
    async getProducts(): Promise<GetProductsResponse['data']> {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText,
                    errors: {}
                }));
                throw new ApiException(data.message, data.statusCode, data.errors);
            }

            const data: SuccessResponse<GetProductsResponse['data']> = await response.json();
            return data.data;
        } catch (exception) {
            throw exception;
        }
    }
};
```

**`features/products/components/product-list.tsx`**
```typescript
'use client';

import React from 'react';
import { GetProductsResponse } from '@/types/products';

type ProductListProps = {
    products: GetProductsResponse['data'];
};

export function ProductList({ products }: ProductListProps) {
    return (
        <div className="space-y-4">
            {products.map(p => (
                <div key={p.id}>{p.name}</div>
            ))}
        </div>
    );
}
```

**`features/products/pages/products-page.tsx`**
```typescript
import React from 'react';
import { productService } from '@/services/products/product.service';
import { ProductList } from '../components/product-list';

export default async function ProductsPage() {
    let products = [];
    try {
        products = await productService.getProducts();
    } catch (e) {
        // Handle error if needed
    }

    return <ProductList products={products} />;
}
```

**`app/products/page.tsx`**
```typescript
export { default } from '@/features/products/pages/products-page';
```

## 37. AI Code Generation Rules
1. Inspect the existing repository first.
2. Find the closest existing feature (e.g., `auth`).
3. Follow the strict re-export routing pattern for `app/`.
4. Use `fetch` exclusively for API communication inside `services/`.
5. Use 4-space indentation and single quotes.
6. Do NOT use React Query.
7. Inline Zod schemas inside component files instead of creating separate schema files.
8. Reuse `ApiException` for API errors and `sonner` for UI toasts.
9. Verify Server/Client boundaries: `features/.../pages/` are Server Components, `features/.../components/` are Client Components if they contain interactivity.
