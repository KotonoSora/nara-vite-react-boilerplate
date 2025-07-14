---
applyTo: 'app/**/*.{ts,tsx}'
---

# TailwindCSS and shadcn/ui Instructions - Copilot Guidelines

This document outlines the rules and best practices for using **TailwindCSS** (4.1.11) with **@tailwindcss/vite** (4.1.11), **prettier-plugin-tailwindcss** (0.6.14), and **shadcn/ui** (using `radix-ui@1.4.2`, `lucide-react@0.525.0`, `class-variance-authority@0.7.1`, `tailwind-merge@3.3.1`) in the NARA Boilerplate project, focusing on the `app` directory for React Router v7 components. Per project rules, **all Tailwind configuration is done in `app/styles/tailwind.css` using CSS-first directives (`@theme`, `@utility`)**, and **no `tailwind.config.js` or `prettier.config.js` files are used**. These guidelines ensure **type safety**, **performance**, **accessibility**, and alignment with the project's motto: "quality over quantity."

---

## 🚨 CRITICAL: Type-Safe TailwindCSS and shadcn/ui Usage - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS use TailwindCSS utility classes with `class-variance-authority` (cva) and `tailwind-merge` in `className` props for styling shadcn/ui components, ensure type-safe `className` props with TypeScript, and configure Tailwind exclusively in `app/styles/tailwind.css` using `@theme` and `@utility`.**

```tsx
// ✅ CORRECT - Use Tailwind with cva and typed props:
import { type FC } from "react";
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded px-4 py-2", {
  variants: {
    intent: {
      primary: "bg-primary text-white hover:bg-opacity-80",
      secondary: "bg-secondary text-white hover:bg-opacity-80",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
    },
  },
  defaultVariants: { intent: "primary", size: "md" },
});

interface Props {
  className?: string;
  intent?: "primary" | "secondary";
  size?: "sm" | "md";
}

const Button: FC<Props> = ({ className, intent, size }) => {
  return <button className={cn(buttonVariants({ intent, size }), className)}>Click me</button>;
};

// app/styles/tailwind.css
@import "tailwindcss";
@theme {
  --color-primary: #1E40AF;
  --color-secondary: #4B5563;
}

// ❌ NEVER use inline styles, untyped props, or tailwind.config.js:
const Button = ({ className }) => { // ❌ Untyped prop
  return <button style={{ backgroundColor: "blue", color: "white" }}>Click me</button>; // ❌ Inline styles
};
```

**If you see TypeScript errors about `className` or styling issues:**
1. **IMMEDIATELY check `app/styles/tailwind.css`** for correct `@theme` or `@utility` directives.
2. **Run `bun run typecheck`** to verify TypeScript types.
3. **NEVER use `any` or bypass TypeScript** for `className` props.
4. **NEVER create `tailwind.config.js` or `prettier.config.js`**; use `app/styles/tailwind.css` and default Prettier settings.
5. **Ensure `tsconfig.json` includes `app/**/*`** for React components.

---

## Setup & Workflow

- **Location**:
  - **Tailwind Configuration**: Exclusively in `app/styles/tailwind.css` using `@import "tailwindcss"`, `@theme`, and `@utility`.
  - **shadcn/ui Components**: Installed in `app/components/ui/` (e.g., `button.tsx`, `dialog.tsx`) and styled with Tailwind and cva.
  - **Styles**: Applied in `app/routes/*.tsx` (React Router components) via `className`.
  - **CSS Entry**: Imported in `app/root.tsx` (e.g., `app/styles/tailwind.css`).
  - **Utility Functions**: `cn` helper in `app/lib/utils.ts` for merging classes with `tailwind-merge`.
- **Dependencies**:
  - `tailwindcss` (4.1.11): Core styling library with CSS-first configuration.
  - `@tailwindcss/vite` (4.1.11): Vite plugin for Tailwind integration.
  - `prettier-plugin-tailwindcss` (0.6.14): Auto-formats Tailwind classes.
  - `radix-ui` (1.4.2): Accessible UI primitives for shadcn/ui.
  - `lucide-react` (0.525.0): Icons for shadcn/ui components.
  - `class-variance-authority` (0.7.1): Variant-based styling.
  - `tailwind-merge` (3.3.1): Merges Tailwind classes.
  - Related: `react-hook-form@7.60.0`, `zod@4.0.2`, `input-otp@1.4.2` for forms; `sonner@2.0.6` for toasts.
- **Setup Commands**:
  - Install dependencies: `bun add tailwindcss@4.1.11 @tailwindcss/vite@4.1.11 prettier-plugin-tailwindcss@0.6.14 radix-ui@1.4.2 lucide-react@0.525.0 class-variance-authority@0.7.1 tailwind-merge@3.3.1`
  - Create CSS file: Manually create `app/styles/tailwind.css` with `@import "tailwindcss";`.
  - Install shadcn/ui components: `bunx shadcn-ui@latest add button dialog` (example).
  - Format code: `bunx prettier --write . --plugin=prettier-plugin-tailwindcss`
  - Build styles: `bun run dev` (handled by Vite).
- **Vite Configuration** (`vite.config.ts`):
```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

- **CSS Configuration** (`app/styles/tailwind.css`):
```css
@import "tailwindcss";
@theme {
  --color-primary: #1E40AF;
  --color-secondary: #4B5563;
  --font-sans: "Inter", sans-serif;
  --breakpoint-md: 768px;
}
```

- **Utility Function** (`app/lib/utils.ts`):
```ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}
```

- **Import in Root** (`app/root.tsx`):
```tsx
import "~/styles/tailwind.css";
```

- **Prettier Formatting**:
  - Run: `bunx prettier --write . --plugin=prettier-plugin-tailwindcss`
  - No `prettier.config.js`; rely on default Prettier settings with `prettier-plugin-tailwindcss`.
- **Best Practice**:
  - Configure Tailwind in `app/styles/tailwind.css` using `@theme` and `@utility`.
  - Install shadcn/ui components individually to `app/components/ui/`.
  - Import `app/styles/tailwind.css` in `app/root.tsx`.
  - Use `cn` helper for merging Tailwind classes in shadcn/ui components.
  - Run `bunx prettier --write .` to auto-sort Tailwind classes.
  - Restart `bun run dev` after updating `app/styles/tailwind.css`.

---

## Critical Package Guidelines

### ✅ CORRECT Packages:
- `tailwindcss` (4.1.11): Core styling with CSS-first configuration.
- `@tailwindcss/vite` (4.1.11): Vite integration for JIT compilation.
- `prettier-plugin-tailwindcss` (0.6.14): Auto-formatting for Tailwind classes.
- `radix-ui` (1.4.2): Accessible UI primitives for shadcn/ui.
- `lucide-react` (0.525.0): Icons for shadcn/ui components.
- `class-variance-authority` (0.7.1): Variant-based styling.
- `tailwind-merge` (3.3.1): Merges Tailwind classes.

### ❌ NEVER Use:
- Inline styles (`style={{}}`) - Lacks maintainability and tree-shaking.
- Older Tailwind versions (<4.1.11) - May lack CSS-first configuration.
- `@tailwind` directives (e.g., `@tailwind base`) - Deprecated in v4; use `@import "tailwindcss"`.
- `tailwind.config.js` or `prettier.config.js` - Against project rules.
- Other CSS frameworks (e.g., Bootstrap) - Not compatible with NARA’s setup.

---

## Essential TailwindCSS and shadcn/ui Architecture

### CSS-First Configuration (`app/styles/tailwind.css`)
```css
@import "tailwindcss";
@theme {
  --color-primary: #1E40AF;
  --color-secondary: #4B5563;
  --font-sans: "Inter", sans-serif;
  --breakpoint-md: 768px;
}
@utility custom-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

- **Purpose**: Defines custom colors, fonts, breakpoints, and utilities for Tailwind and shadcn/ui.
- **Best Practice**: Use `--color-`, `--font-`, `--breakpoint-` prefixes; keep `@theme` minimal.

### shadcn/ui Component Example (`app/components/ui/button.tsx`)
```tsx
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { type FC, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded text-sm font-medium transition-colors disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "bg-primary text-white hover:bg-opacity-80",
        secondary: "bg-secondary text-white hover:bg-opacity-80",
        ghost: "bg-transparent hover:bg-gray-100",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button: FC<ButtonProps> = ({ className, intent, size, ...props }) => {
  return <button className={cn(buttonVariants({ intent, size }), className)} {...props} />;
};

export { Button, buttonVariants };
```

- **Best Practice**: Use cva for variant-based styling; export variants for composition.

### Using shadcn/ui with Lucide Icons (`app/routes/index.tsx`)
```tsx
import type { Route } from "./+types/index";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export const Component: FC<Route.ComponentProps> = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary">Welcome to NARA</h1>
      <Button intent="secondary" size="lg" className="gap-2">
        <Plus className="h-5 w-5" /> Add Item
      </Button>
    </div>
  );
};
```

- **Best Practice**: Combine Lucide icons with Tailwind classes; use `cn` for class merging.

### Integration with React Router
```tsx
// app/routes/products.$id.tsx
import type { Route } from "./+types/products.$id";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { Edit } from "lucide-react";

export const Loader: Route.Loader = async ({ params }) => {
  return { product: { id: params.id, name: "Laptop" } };
};

export const Component: FC<Route.ComponentProps> = ({ data }) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold">{data.product.name}</h2>
      <p className="text-gray-600 mt-2">Product ID: {data.product.id}</p>
      <Button intent="ghost" className="mt-4">
        <Edit className="h-4 w-4 mr-2" /> Edit
      </Button>
    </div>
  );
};
```

- **Best Practice**: Use shadcn/ui components with Tailwind for responsive layouts; align with `@theme`.

### Form Integration with shadcn/ui (`app/components/ui/form.tsx`)
```tsx
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

const Form: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    toast.success("Form submitted!");
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register("email")}
          className="w-full"
          placeholder="Email"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export { Form };
```

- **Best Practice**: Use `react-hook-form` and `zod` with shadcn/ui’s `Input` and `Button`; style with Tailwind.

---

## Universal TailwindCSS and shadcn/ui Patterns

### Responsive Design
```tsx
import { type FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

const ResponsiveCard: FC<{ title: string }> = ({ title }) => {
  return (
    <Card className="p-4 sm:p-6 md:p-8 lg:p-10">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl md:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm sm:text-base md:text-lg text-gray-600">
        Responsive content
      </CardContent>
    </Card>
  );
};
```

- **Best Practice**:
  - Use Tailwind’s responsive prefixes (`sm:`, `md:`, `lg:`) with shadcn/ui components.
  - Define custom breakpoints in `@theme` (e.g., `--breakpoint-md: 768px`).

### Custom Utilities
- **Define in CSS** (`app/styles/tailwind.css`):
```css
@import "tailwindcss";
@theme {
  --color-primary: #1E40AF;
  --color-secondary: #4B5563;
}
@utility custom-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
@utility rotate-y-180 {
  transform: rotateY(180deg);
}
```

- **Usage with shadcn/ui**:
```tsx
import { Button } from "~/components/ui/button";

<Button className="custom-shadow rotate-y-180">Custom Button</Button>
```

- **Best Practice**: Use `@utility` for shadcn/ui-specific styles; avoid external plugins.

### Performance Optimization
- **Tree-Shaking**: Tailwind 4.1.11 auto-detects content in `app/**/*.{ts,tsx}`.
- **shadcn/ui**: Components are lightweight; only install needed components (e.g., `bunx shadcn-ui@latest add button`).
- **Safelist Dynamic Classes** (`app/styles/tailwind.css`):
```css
@import "tailwindcss";
@theme {
  --color-primary: #1E40AF;
}
@safelist bg-primary bg-secondary text-3xl
```

- **Best Practice**: Use `@safelist` for cva variants; minimize bundle size.

### Accessibility
```tsx
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "~/components/ui/dialog";
import { Edit } from "lucide-react";

const AccessibleDialog: FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white focus:ring-3 focus:ring-blue-300" aria-label="Open edit dialog">
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <p className="text-gray-600">Edit content</p>
      </DialogContent>
    </Dialog>
  );
};
```

- **Best Practice**:
  - Use Radix UI’s accessible primitives (e.g., `Dialog`) with Tailwind’s `focus:ring-*`.
  - Add `aria-*` attributes for screen readers.
  - Test with Lighthouse or axe DevTools.

### Debugging and Formatting
- **Prettier Auto-Formatting**:
```bash
bunx prettier --write . --plugin=prettier-plugin-tailwindcss
```

- **Debugging Styling Issues**:
```tsx
import { Button } from "~/components/ui/button";

<Button className="debug-class bg-red-500 text-white">Debug this</Button>
```

- **Best Practice**:
  - Use temporary classes (e.g., `debug-class`) to isolate issues.
  - Check `app/styles/tailwind.css` for `@theme` or `@utility` errors.
  - Verify cva variants in shadcn/ui components.
  - Run `bun run dev` to check JIT compilation.

---

## Testing with Vitest

```ts
// app/__tests__/button.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "~/components/ui/button";

describe("Button Component", () => {
  it("renders with Tailwind and cva classes", () => {
    render(<Button intent="primary" size="md">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary", "text-white");
  });
});
```

- **Setup**: Use `@testing-library/react` for component tests.
- **Run**: `bun run test` or `bun run coverage`.
- **Best Practice**: Test Tailwind classes and cva variants with `toHaveClass`.

---

## Best Practices and Anti-Patterns

### ✅ Best Practices:
- Configure Tailwind in `app/styles/tailwind.css` using `@theme` and `@utility`.
- Use shadcn/ui components with cva and `tailwind-merge` for variant-based styling.
- Auto-format with `bunx prettier --write . --plugin=prettier-plugin-tailwindcss`.
- Ensure accessibility with Radix UI primitives and Tailwind’s `focus:` utilities.
- Use `@safelist` for dynamic cva variants to prevent purging.

### ❌ Anti-Patterns:
- Using inline styles: `<div style={{ color: "blue" }}>` // ❌ No tree-shaking.
- Untyped `className` props: `const Component = ({ className }) => {}` // ❌ Missing TypeScript.
- Using deprecated `@tailwind` directives: `@tailwind base;` // ❌ Removed in v4.
- Creating `tailwind.config.js` or `prettier.config.js`: Against project rules.
- Overriding shadcn/ui styles with custom CSS: Use cva instead.

---

## AI Assistant Guidelines

When working with TailwindCSS and shadcn/ui in NARA Boilerplate:
- **If TypeScript errors occur, suggest checking `className` prop types, cva variants, and running `bun run typecheck`.**
- **NEVER suggest inline styles**; use Tailwind utility classes with cva and `tailwind-merge`.
- **NEVER suggest `tailwind.config.js` or `prettier.config.js`**; use `app/styles/tailwind.css` and default Prettier settings.
- **After updating `app/styles/tailwind.css`, remind to restart `bun run dev`.**
- **Suggest responsive utilities** (`sm:`, `md:`) for shadcn/ui components.
- **Recommend accessibility** with Radix UI primitives, `aria-*`, and `focus:` utilities.
- **Ensure compatibility** with React Router v7, Hono APIs, and dependencies like `react-hook-form`.
- **Suggest Prettier formatting** with `bunx prettier --write . --plugin=prettier-plugin-tailwindcss`.