<!-- BEGIN:project-tech-stack -->

# Project Technology Stack & Versions

Please respect the capabilities, restrictions, and APIs of the following major versions:

- **Node.js**: `v22.x` or higher (LTS)
- **React**: `v19.2.4` (Uses React 19 features like Action Hooks, Server Actions)
- **Next.js**: `v16.2.7` (Uses `src/proxy.ts` instead of `middleware.ts`)
- **Tailwind CSS**: `v4.0.0` (Uses the new CSS-first configuration system and compiler architecture)
- **Database / Auth**: `@supabase/supabase-js v2.x` & `@supabase/ssr v0.12.x`
- **Animation**: `motion v12.x` (Framer Motion v12)
- **UI Utilities**: `shadcn v4.x`, `radix-ui v1.x`, `tailwind-merge v3.x`, `class-variance-authority v0.7.x`

<!-- END:project-tech-stack -->

<!-- BEGIN:nextjs-agent-rules -->

# Next.js 16 Specific Conventions

- This version has breaking changes — APIs, conventions, and file structure may differ from traditional Next.js configurations.
- **Middleware Deprecation**: The `middleware.ts` file convention is deprecated. You **MUST** use `src/proxy.ts` (using `export async function proxy`) for any routing proxies or middleware logic.
- Under `src/app/`, only use fixed file conventions: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `proxy.ts`.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-coding-conventions -->

# Project Coding & Component Conventions

Please strictly adhere to the following rules when creating, modifying, or reviewing code in this workspace. These rules are synthesized from [coding-convention.md](file:///home/yeon/ys_archive/ys-archive/docs/coding-convention.md) and [component-guidelines.md](file:///home/yeon/ys_archive/ys-archive/docs/component-guidelines.md).

## 1. Naming & Case Rules

- **React Components / Types / Interfaces / Classes**: `PascalCase` (e.g., `TodoItem`, `UserDetail`, `ApiClient`)
- **Functions / General Variables / File names (except components)**: `camelCase` (e.g., `formatDate.ts`, `useAuth.ts`, `getUserData`)
- **Constants & Env Variables**: `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT`, `NEXT_PUBLIC_API_URL`)
- **Boolean variables/functions**: Prefix with `is`, `has`, `should`, or `can` (e.g., `isLoading`, `hasToken`, `shouldRedirect`)
- **Event handlers**: `handle[Event]` inside components (e.g., `handleSubmit`), `on[Event]` in props interface (e.g., `onSubmit`).
- **Database Tables & Fields**: `snake_case` (e.g., `user_profiles`, `created_at`).
- **CSS / Asset Files**: `kebab-case` (e.g., `button.module.css`, `default-avatar.png`).

## 2. Directory Structure & Architecture (Feature-driven)

We follow **Feature-driven Architecture (Co-location)**. Keep related codes physically close:

- **Domain-specific logic**: Place components, hooks, services, and types inside `src/features/[feature_name]/`
  - Components: `src/features/[feature_name]/components/` (e.g., `todo-list.tsx`, `todo-item.tsx`)
  - Hooks: `src/features/[feature_name]/hooks/` (e.g., `use-todo-list.ts`)
  - Services (API client calls): `src/features/[feature_name]/services/` (e.g., `todo-api.ts`)
  - Types: `src/features/[feature_name]/types/`
- **Global Common UI**: Reusable, pure UI components with no business context go to `src/components/ui/` (e.g., `button.tsx`, `input.tsx`).
- **App Router (`src/app/`)**: Acts only as routing page entry points and server component data-fetching adapters. Keep page files lean and delegate UI composition to features.

## 3. Component Design & Separation Rules (SRP)

- **Single Responsibility Principle (SRP)**: Extract API calls & core states to Custom Hooks. React components should focus on rendering and simple UI state.
- **Dependency Inversion**: Common UI components in `src/components/ui/` must NOT depend on domain-specific DTOs or APIs. Use primitive/generic props.
- **Component Separation Triggers**:
  - The file length exceeds **150-200 lines**.
  - Nesting depth (e.g., maps, conditional branches) in JSX reaches **3 levels or deeper**.
  - A component controls **4 or more** local `useState` states.
  - Performance optimization (preventing redundant rendering) is needed.
- **Inline Type Declarations**: Forbidden. Define types/interfaces at the top of the file.

## 4. Component Structure & Order

Order elements inside a React component as follows:

1. `useState` / `useReducer` (State variables)
2. `useRef` (Refs)
3. External state/context hooks (`useContext`, React Query's `useQuery`, `useSelector`)
4. `useMemo` / `useCallback` (Memoization)
5. `useEffect` / `useLayoutEffect` (Side effects)
6. Local event handlers and helpers (`handle...`)
7. JSX return statement (`return (...)`)

## 5. Type System & TypeScript Rules

- **Interface vs Type**:
  - Use `interface` for object structures (Props, DTOs, API responses, States) to support extension and declaration merging.
  - Use `type` for unions (`type Status = 'idle' | 'loading'`), tuples, and primitives.
- **Strict Checks**:
  - No `any`. Use `unknown` with Type Guarding (`is` keyword or checks) for uncertain types.
  - No type assertions (`as ...`) or non-null assertions (`!`). Use Optional Chaining `?.` and Nullish Coalescing `??` to safe-guard nullish states.
- **Implicit vs Explicit**:
  - Do NOT specify redundant types for self-evident variables (e.g., `const count = 5`).
  - **Explicit Return Types** are mandatory for all functions (including hooks/APIs) to act as a contract.

## 6. Coding, Styles & Error Handling

- **Function Style**: Use Arrow Functions (`const foo = () => {}`) in Frontend/Hooks/Utils. Use Function Declarations (`async function bar() {}`) for Backend/API routes.
- **Asynchronous Code**: Use `async/await` exclusively. Do not use `.then()/.catch()` chaining.
- **Error Handling Architecture**:
  - Global/Rendering Errors: Handled by Next.js `error.tsx` and React `ErrorBoundary`.
  - API Request Errors: Handled globally via Axios/Fetch interceptors (e.g., auth tokens, global toasts).
  - Business Errors: Handled locally via `try/catch` inside components/hooks to display inline errors or local toasts.
  - **Contextual Logging**: When catching errors, specify the function context in the message:
    `console.error('[FeatureName.FunctionName] Helpful descriptive text:', error)`
- **Export Rules**: Default Named Exports (`export const ...`) for utility files. Default Export (`export default ...`) only for React components and Custom Hook entry files.
- **Styling**: No inline styles (`style={{ ... }}`). For CSS Modules, use `camelCase` class names. For Tailwind CSS, ensure classes are sorted automatically using `prettier-plugin-tailwindcss`.

<!-- END:project-coding-conventions -->
