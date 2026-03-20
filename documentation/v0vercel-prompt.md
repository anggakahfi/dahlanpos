**Role & Context:**
Act as a Senior Next.js 14 Developer and UI/UX Expert. Your task is to build the user interface for a single-tenant open source F&B POS application named "Small Things Coffee POS". Strictly adhere to a Low-Fidelity wireframe style: grayscale palette, minimalist design, clear borders for containers, and reserve the accent color (`bg-blue-500`) exclusively for primary interactive elements (e.g., main call-to-action buttons).

**Tech Stack:**
Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons.

**Architecture & Code Quality Guidelines:**

1. **Clean Code & SOLID Principles:** Write readable, modular, and highly structured code. Use descriptive and meaningful names for variables and functions.
2. **Component-Driven Architecture:** Break down the UI into small, reusable components (DRY principle). Do not dump all code into a single massive `page.tsx` file.
3. **Separation of Concerns:** Strictly separate Business Logic (state management, generic mock APIs) from the Presentation Layer (UI). Extract complex state logic into Custom Hooks (e.g., `useCart`, `usePOS`).
4. **Strict TypeScript:** Clearly define `interface` or `type` for all Props and data structures (e.g., `Product`, `CartItem`, `Transaction`). **The use of the `any` type is strictly prohibited.**
5. **Next.js 14 Best Practices:** Strategically use the `"use client"` directive only at the top of components that truly require interactivity (state, hooks, event listeners). Keep layout wrappers and static UI as Server Components to optimize rendering.
6. **Production-Ready Mocking:** Define all static dummy data and mock API functions outside of the component rendering cycle. Mark them clearly with `// TODO: Replace with real API` to ensure seamless backend integration later.
7. **Responsive & Device-Specific Layouts:** Pay close attention to the layout constraints based on the module: Desktop-optimized for the Backoffice, and Touch-friendly Tablet Landscape for the Cashier module.
8. **UI/UX States & Utilities:** Always account for Empty States and Loading States where applicable. When combining Tailwind classes dynamically, utilize the standard shadcn `cn()` utility function (clsx + tailwind-merge) to avoid styling conflicts.
