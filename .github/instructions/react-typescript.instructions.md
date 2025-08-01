---
applyTo: 'app/**/*.{ts,tsx}'
---

# React 19.1.1 and TypeScript 5.9.2 Instructions - Copilot Guidelines

This document outlines the rules and best practices for using **React 19.1.1** with **TypeScript 5.9.2** in the NARA Boilerplate project, focusing on the `app` directory. It leverages `react@19.1.1`, `react-dom@19.1.1`, `@types/react@19.1.8`, `@types/react-dom@19.1.6`, and `typescript@5.9.2`. These guidelines ensure **type safety**, **performance**, **accessibility**, and alignment with the project's motto: "quality over quantity."

---

## 🚨 CRITICAL: Type-Safe React and TypeScript Usage - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS use functional components with strictly typed props and hooks in TypeScript 5.9.2, leverage React 19.1.1 features like `use` and `Suspense`, and avoid untyped props or non-strict TypeScript configurations.**

```tsx
// ✅ CORRECT - Typed functional component with React 19 use hook:
import { type FC, use } from "react";

interface Item {
  id: string;
  name: string;
}

interface Props {
  data: Promise<Item>;
}

export const Component: FC<Props> = ({ data }) => {
  const item = use(data);
  return <div>{item.name}</div>;
};

// ❌ NEVER use untyped props or class components:
class Component extends React.Component { // ❌ Class component
  render() {
    const { data } = this.props; // ❌ Untyped props
    return <div>{data.name}</div>;
  }
}
```

**If you see TypeScript errors or React runtime issues:**
1. **IMMEDIATELY check `tsconfig.json`** for `strict: true` and `app/**/*` inclusion.
2. **Run `bun run typecheck`** to verify TypeScript types.
3. **NEVER use `any` or bypass TypeScript** with `// @ts-ignore`.
4. **Ensure `@types/react@19.1.8` and `@types/react-dom@19.1.6`** are installed.

---

## Setup & Workflow

- **Location**:
  - **Components**: Defined in `app/**/*.{ts,tsx}`.
  - **TypeScript Config**: `tsconfig.json` at project root.
- **Dependencies**:
  - `react` (19.1.1): Core React library with concurrent rendering and new hooks.
  - `react-dom` (19.1.1): React DOM for rendering.
  - `@types/react` (19.1.8), `@types/react-dom` (19.1.6): TypeScript type definitions.
  - `typescript` (5.9.2): Type checking and compilation.
- **Setup Commands**:
  - Install dependencies: `bun add react@19.1.1 react-dom@19.1.1 @types/react@19.1.8 @types/react-dom@19.1.6 typescript@5.9.2`
  - Initialize TypeScript: `bunx tsc --init` (if `tsconfig.json` not present).
  - Typecheck: `bun run typecheck` (e.g., `tsc --noEmit`).
  - Build and run: `bun run dev` (handled by Vite).
- **TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "baseUrl": ".",
    "paths": {
      "~/*": ["app/*"]
    },
    "types": ["@types/react", "@types/react-dom"],
    "noEmit": true
  },
  "include": ["app/**/*"]
}
```

- **Vite Configuration** (`vite.config.ts`):
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

- **Best Practice**:
  - Use `react-jsx` for JSX transformation in TypeScript 5.9.2.
  - Enable `strict: true` in `tsconfig.json` for maximum type safety.
  - Use `~/*` path aliases for imports (e.g., `~/components/*`).
  - Run `bun run typecheck` regularly to catch type errors.

---

## Critical Package Guidelines

### ✅ CORRECT Packages:
- `react` (19.1.1): Core React library.
- `react-dom` (19.1.1): React DOM for rendering.
- `@types/react` (19.1.8), `@types/react-dom` (19.1.6): TypeScript types.
- `typescript` (5.9.2): Type checking and compilation.

### ❌ NEVER Use:
- Older React versions (<19.1.1): Lack concurrent rendering and new hooks.
- Class components or `React.createClass`: Obsolete in React 19.
- `PropTypes`: Use TypeScript interfaces instead.
- JavaScript files (`.js`, `.jsx`): Use `.ts` or `.tsx` for type safety.

---

## Essential React and TypeScript Architecture

### Type-Safe Component (`app/components/item.tsx`)
```tsx
import { type FC } from "react";

interface Item {
  id: string;
  name: string;
}

interface Props {
  item: Item;
}

export const ItemCard: FC<Props> = ({ item }) => {
  return <div>{item.name}</div>;
};
```

- **Best Practice**: Use `FC` for typed functional components; define interfaces for props.

### Type-Safe Hook (`app/hooks/use-item.ts`)
```tsx
import { useState, useEffect } from "react";

interface Item {
  id: string;
  name: string;
}

export const useItem = (id: string): { item: Item | null; loading: boolean } => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulated fetch
    setTimeout(() => {
      setItem({ id, name: "Sample Item" });
      setLoading(false);
    }, 1000);
  }, [id]);

  return { item, loading };
};
```

- **Best Practice**: Type hook inputs and outputs; use strict null checks.

---

## Universal React and TypeScript Patterns

### React 19 Concurrent Rendering with Suspense
```tsx
import { type FC, Suspense, use } from "react";

interface Item {
  id: string;
  name: string;
}

interface Props {
  itemPromise: Promise<Item>;
}

export const ItemPage: FC<Props> = ({ itemPromise }) => {
  const item = use(itemPromise);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>{item.name}</div>
    </Suspense>
  );
};
```

- **Best Practice**: Use `Suspense` with `use` for async rendering; provide fallback UI.

### React 19 Hooks
```tsx
import { type FC, use, startTransition, useState } from "react";

interface Props {
  fetchItems: () => Promise<string[]>;
}

export const ItemList: FC<Props> = ({ fetchItems }) => {
  const [isPending, setPending] = useState(false);
  const items = use(fetchItems());

  const handleRefresh = () => {
    startTransition(() => {
      setPending(true);
      fetchItems().then(() => setPending(false));
    });
  };

  return (
    <div>
      {isPending ? <p>Loading...</p> : (
        <ul>
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      <button onClick={handleRefresh} disabled={isPending}>Refresh</button>
    </div>
  );
};
```

- **Best Practice**: Use `use` for async data, `startTransition` for non-blocking updates; type all hook states.

### TypeScript Discriminated Unions
```tsx
import { type FC } from "react";

type ItemState =
  | { status: "loading" }
  | { status: "success"; data: { id: string; name: string } }
  | { status: "error"; message: string };

interface Props {
  state: ItemState;
}

export const ItemStatus: FC<Props> = ({ state }) => {
  switch (state.status) {
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return <div>{state.data.name}</div>;
    case "error":
      return <div>Error: {state.message}</div>;
  }
};
```

- **Best Practice**: Use discriminated unions for state management; leverage TypeScript’s narrowing.

### TypeScript Mapped Types
```tsx
import { type FC } from "react";

type Item = {
  id: string;
  name: string;
  price: number;
};

type ReadOnlyItem = {
  readonly [K in keyof Item]: Item[K];
};

interface Props {
  item: ReadOnlyItem;
}

export const ItemDisplay: FC<Props> = ({ item }) => {
  return <div>{item.name} - ${item.price}</div>;
};
```

- **Best Practice**: Use mapped types for transforming interfaces (e.g., making properties readonly).

### TypeScript Conditional Types
```tsx
import { type FC } from "react";

type ItemData<T> = T extends { id: string } ? T : never;

interface Item {
  id: string;
  name: string;
}

interface Props {
  data: ItemData<Item>;
}

export const ItemComponent: FC<Props> = ({ data }) => {
  return <div>{data.name}</div>;
};
```

- **Best Practice**: Use conditional types to enforce constraints on props.

### TypeScript Template Literal Types
```tsx
import { type FC } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "lg";
type ButtonClass = `btn-${Variant}-${Size}`;

interface Props {
  className: ButtonClass;
}

export const Button: FC<Props> = ({ className }) => {
  return <button className={className}>Click me</button>;
};

// Usage: <Button className="btn-primary-sm" />
```

- **Best Practice**: Use template literal types for type-safe string literals.

### TypeScript Satisfies Operator
```tsx
import { type FC } from "react";

interface Config {
  theme: "light" | "dark";
  settings: Record<string, string>;
}

const config = {
  theme: "light",
  settings: { font: "Inter" },
} satisfies Config;

interface Props {
  config: Config;
}

export const Settings: FC<Props> = ({ config }) => {
  return <div>Theme: {config.theme}</div>;
};
```

- **Best Practice**: Use `satisfies` for type checking without losing inference.

### TypeScript Type Inference Improvements
```tsx
import { type FC } from "react";

const items = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
] as const;

type Item = typeof items[number];

interface Props {
  item: Item;
}

export const ItemCard: FC<Props> = ({ item }) => {
  return <div>{item.name}</div>;
};
```

- **Best Practice**: Use `as const` and `typeof` for precise type inference.

### Accessibility
```tsx
import { type FC } from "react";

interface Props {
  label: string;
  onClick: () => void;
}

export const AccessibleButton: FC<Props> = ({ label, onClick }) => {
  return (
    <button onClick={onClick} aria-label={label}>
      {label}
    </button>
  );
};
```

- **Best Practice**: Add `aria-*` attributes for accessibility; test with screen readers.

### Performance Optimization
```tsx
import { type FC, useMemo } from "react";

interface Item {
  id: string;
  name: string;
}

interface Props {
  items: Item[];
}

export const ItemList: FC<Props> = ({ items }) => {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <div>
      {sortedItems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

- **Best Practice**: Use `useMemo` for expensive computations; leverage React 19’s concurrent rendering.

### Debugging
```tsx
import { type FC, useEffect } from "react";

export const DebugComponent: FC = () => {
  useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component unmounted");
  }, []);

  return <div>Debug this</div>;
};
```

- **Best Practice**: Use `useEffect` for lifecycle debugging; check TypeScript errors with `bun run typecheck`.

### Testing with Vitest
```ts
// app/__tests__/item.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ItemCard } from "~/components/item";

describe("ItemCard Component", () => {
  it("renders item name", () => {
    const item = { id: "1", name: "Test Item" };
    render(<ItemCard item={item} />);
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });
});
```

- **Setup**: Use `@testing-library/react` and `vitest@3.2.4`.
- **Run**: `bun run test` or `bun run coverage`.
- **Best Practice**: Test component rendering and TypeScript types.

---

## Best Practices and Anti-Patterns

### ✅ Best Practices:
- Use functional components with `FC` and strictly typed props.
- Leverage React 19 hooks (`use`, `startTransition`, `Suspense`) with typed return values.
- Define interfaces in `app/lib/types.ts` for reuse.
- Use TypeScript 5.9.2 features like discriminated unions, mapped types, and `satisfies`.
- Ensure accessibility with `aria-*` attributes.
- Optimize performance with `useMemo` and concurrent rendering.

### ❌ Anti-Patterns:
- Using untyped props: `const Component = ({ data }) => {}` // ❌ Missing TypeScript.
- Using class components: `class Component extends React.Component` // ❌ Obsolete.
- Bypassing TypeScript: Using `any` or `// @ts-ignore` // ❌ Breaks type safety.
- Ignoring Suspense: Rendering async data without fallbacks // ❌ Poor UX.
- Using JavaScript files: Prefer `.tsx` for type safety.

---

## AI Assistant Guidelines

When working with React 19.1.1 and TypeScript 5.9.2 in NARA Boilerplate:
- **If TypeScript errors occur, suggest checking `tsconfig.json`, prop types, hook return types, and running `bun run typecheck`.**
- **NEVER suggest class components**; use functional components with `FC`.
- **Suggest React 19 features** like `use`, `Suspense`, and `startTransition`.
- **Recommend TypeScript 5.9.2 patterns** like discriminated unions, mapped types, conditional types, template literals, and `satisfies`.
- **After updating `tsconfig.json`, remind to run `bun run typecheck`.**
- **Suggest accessibility** with `aria-*` attributes.
- **Ensure compatibility** with `app/**/*.{ts,tsx}`.
- **Focus on type safety** for components, hooks, and state.