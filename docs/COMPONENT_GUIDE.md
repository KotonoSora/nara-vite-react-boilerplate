# Component Library Guide

This comprehensive guide covers the component system used in the NARA boilerplate, including shadcn/ui components, custom components, Clean Architecture integration, React 19.1.0 patterns, TypeScript 5.8.3 best practices, and enterprise-grade development patterns.

## Table of Contents

1. [🎨 Component System Overview](#-component-system-overview)
2. [🏗️ Clean Architecture Integration](#️-clean-architecture-integration)
3. [⚛️ React 19.1.0 Patterns](#️-react-1910-patterns)
4. [🎯 TypeScript 5.8.3 Best Practices](#-typescript-583-best-practices)
5. [🧩 shadcn/ui Components](#-shadcnui-components)
6. [🎨 Custom Components](#-custom-components)
7. [📱 Responsive Design Patterns](#-responsive-design-patterns)
8. [📋 Form Components & Validation](#-form-components--validation)
9. [⚡ Performance Optimization](#-performance-optimization)
10. [🔒 Security & Accessibility](#-security--accessibility)
11. [🎯 Component Best Practices](#-component-best-practices)
12. [🎨 Styling Guidelines](#-styling-guidelines)
13. [🧪 Testing Components](#-testing-components)
14. [📚 Component Documentation](#-component-documentation)
15. [🧪 Enhanced Testing Components](#-enhanced-testing-components)
16. [📚 Enhanced Component Documentation](#-enhanced-component-documentation)

---

## 🎨 Component System Overview

The NARA boilerplate uses a **hybrid component architecture** based on Clean Architecture principles:

- **shadcn/ui** - Copy-paste components built on Radix UI primitives
- **Domain Components** - Pure business logic components (no React dependencies)
- **Application Components** - Feature-specific components with business logic
- **Infrastructure Components** - API integration and external service components
- **Shared Components** - Reusable UI components across features

### Component Architecture Structure

```text
/app/
├── /components/              # Shared UI components (presentation layer)
│   ├── /ui/                 # shadcn/ui components (Radix + Tailwind)
│   │   ├── button.tsx       # Primitive components
│   │   ├── card.tsx         # Layout components  
│   │   ├── dialog.tsx       # Overlay components
│   │   └── ...
│   ├── mode-switcher.tsx    # Custom shared components
│   └── error-boundary.tsx   # Error handling components
├── /features/[feature]/     # Feature-specific components (Clean Architecture)
│   ├── /domain/            # Pure business logic (no React)
│   │   ├── entities/       # Domain entities and value objects
│   │   └── events/         # Domain events
│   ├── /application/       # Use cases and business logic hooks
│   │   ├── hooks/          # Custom hooks for business logic
│   │   └── commands/       # Command handlers
│   ├── /infrastructure/    # External integrations
│   │   ├── api/           # API clients and data fetching
│   │   └── repositories/   # Data repositories
│   └── /components/        # Feature UI components
│       ├── forms/          # Form components
│       ├── layouts/        # Layout components
│       └── widgets/        # Complex UI widgets
├── /hooks/                  # Shared custom hooks
├── /lib/                   # Shared utilities and configurations
└── /routes/                # Route components (Framework Mode)
```

### Component Layer Dependencies

Following Clean Architecture principles:

- **Domain**: No dependencies (pure TypeScript/business logic)
- **Application**: Depends only on Domain (custom hooks, use cases)
- **Infrastructure**: Depends on Application and Domain (API clients, data fetching)
- **Components**: Depends on Application and Domain (UI components, forms)
- **Routes**: Can depend on all layers but should primarily use Application layer

---

## 🏗️ Clean Architecture Integration

### Feature-Based Component Organization

Components in the NARA boilerplate follow Clean Architecture principles within each feature:

```typescript
// Example: Transaction feature structure
app/features/finance/
├── domain/
│   ├── entities/
│   │   ├── Transaction.ts           # Pure business entity
│   │   └── Money.ts                 # Value object
│   └── events/
│       └── TransactionCreated.ts    # Domain event
├── application/
│   ├── hooks/
│   │   ├── useTransactions.ts       # Business logic hook
│   │   └── useCreateTransaction.ts  # Command hook
│   └── commands/
│       └── CreateTransactionCommand.ts
├── infrastructure/
│   ├── api/
│   │   └── transactionApi.ts        # API client
│   └── repositories/
│       └── TransactionRepository.ts  # Data access
└── components/
    ├── TransactionList.tsx          # List component
    ├── TransactionForm.tsx          # Form component
    └── TransactionCard.tsx          # Card component
```

### Domain-Driven Component Design

```typescript
// Domain Entity (Pure TypeScript - No React)
// app/features/finance/domain/entities/Transaction.ts
export class Transaction {
  private constructor(
    public readonly id: TransactionId,
    public readonly amount: Money,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly type: TransactionType
  ) {}

  public static create(props: CreateTransactionProps): Transaction {
    return new Transaction(
      TransactionId.generate(),
      new Money(props.amount, props.currency),
      props.description,
      new Date(),
      props.type
    );
  }

  public isExpense(): boolean {
    return this.type === TransactionType.EXPENSE;
  }

  public formatAmount(): string {
    return this.amount.format();
  }
}

// Application Hook (Business Logic with React)
// app/features/finance/application/hooks/useTransactions.ts
import { type FC, use, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionRepository } from "../../infrastructure/repositories/TransactionRepository";
import { CreateTransactionCommand } from "../commands/CreateTransactionCommand";

export function useTransactions() {
  const queryClient = useQueryClient();
  const repository = new TransactionRepository();

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => repository.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (command: CreateTransactionCommand) => 
      repository.create(command.execute()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const createTransaction = useCallback(
    (props: CreateTransactionProps) => {
      const command = new CreateTransactionCommand(props);
      return createMutation.mutateAsync(command);
    },
    [createMutation]
  );

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    isCreating: createMutation.isPending,
  };
}

// Component (Presentation Layer)
// app/features/finance/components/TransactionList.tsx
import { type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useTransactions } from "../application/hooks/useTransactions";
import { Transaction } from "../domain/entities/Transaction";

interface TransactionListProps {
  className?: string;
  onTransactionSelect?: (transaction: Transaction) => void;
}

export const TransactionList: FC<TransactionListProps> = ({ 
  className, 
  onTransactionSelect 
}) => {
  const { transactions, isLoading, error } = useTransactions();

  if (isLoading) return <TransactionListSkeleton />;
  if (error) return <TransactionListError error={error} />;

  return (
    <div className={cn("space-y-4", className)}>
      {transactions.map((transaction) => (
        <Card key={transaction.id.value} className="cursor-pointer hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {transaction.description}
            </CardTitle>
            <Badge variant={transaction.isExpense() ? "destructive" : "default"}>
              {transaction.formatAmount()}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {transaction.createdAt.toLocaleDateString()}
            </p>
            {onTransactionSelect && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => onTransactionSelect(transaction)}
              >
                View Details
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

### Component Dependency Rules

1. **Domain Components**: No React dependencies, pure TypeScript
2. **Application Components**: Can use React hooks and domain components
3. **Infrastructure Components**: Can use external APIs and services
4. **UI Components**: Focus on presentation, minimal business logic

---

## ⚛️ React 19.1.0 Patterns

### Using the `use` Hook for Data Fetching

React 19's `use` hook enables direct promise handling in components:

```typescript
import { type FC, use, Suspense } from "react";

// Data fetching with use hook
interface UserProfileProps {
  userPromise: Promise<User>;
}

export const UserProfile: FC<UserProfileProps> = ({ userPromise }) => {
  const user = use(userPromise); // Suspends until promise resolves
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
    </Card>
  );
};

// Usage with Suspense boundary
export const UserPage: FC = () => {
  const userPromise = fetchUser(userId);
  
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
};
```

### Advanced Suspense Patterns

```typescript
import { type FC, Suspense, ErrorBoundary } from "react";

// Multiple resource loading
interface DashboardProps {
  transactionsPromise: Promise<Transaction[]>;
  accountsPromise: Promise<Account[]>;
  summaryPromise: Promise<Summary>;
}

export const Dashboard: FC<DashboardProps> = ({
  transactionsPromise,
  accountsPromise,
  summaryPromise,
}) => {
  const transactions = use(transactionsPromise);
  const accounts = use(accountsPromise);
  const summary = use(summaryPromise);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SummaryCard summary={summary} />
      <TransactionList transactions={transactions} />
      <AccountList accounts={accounts} />
    </div>
  );
};

// Nested Suspense boundaries for progressive loading
export const DashboardPage: FC = () => {
  const summaryPromise = fetchSummary();
  const transactionsPromise = fetchTransactions();
  const accountsPromise = fetchAccounts();

  return (
    <ErrorBoundary fallback={<DashboardError />}>
      <div className="space-y-6">
        <Suspense fallback={<SummaryCardSkeleton />}>
          <Dashboard 
            transactionsPromise={transactionsPromise}
            accountsPromise={accountsPromise}
            summaryPromise={summaryPromise}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};
```

### Form Actions with React 19

```typescript
import { type FC, useActionState, useOptimistic } from "react";

interface CreateTransactionFormProps {
  onSuccess?: (transaction: Transaction) => void;
}

// Server action for form submission
async function createTransactionAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const transaction = await createTransaction({
      amount: Number(formData.get("amount")),
      description: String(formData.get("description")),
      type: formData.get("type") as TransactionType,
    });

    return {
      success: true,
      transaction,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      transaction: null,
      errors: parseValidationErrors(error),
    };
  }
}

export const CreateTransactionForm: FC<CreateTransactionFormProps> = ({ 
  onSuccess 
}) => {
  const [state, formAction, isPending] = useActionState(
    createTransactionAction,
    { success: false, transaction: null, errors: null }
  );

  // Optimistic updates
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    transactions,
    (state, newTransaction: Transaction) => [...state, newTransaction]
  );

  const handleSubmit = async (formData: FormData) => {
    // Add optimistic transaction
    const optimisticTransaction = Transaction.create({
      amount: Number(formData.get("amount")),
      description: String(formData.get("description")),
      type: formData.get("type") as TransactionType,
    });
    
    addOptimisticTransaction(optimisticTransaction);
    
    // Submit form
    await formAction(formData);
    
    if (state.success && onSuccess) {
      onSuccess(state.transaction);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          required
          aria-describedby={state.errors?.amount ? "amount-error" : undefined}
        />
        {state.errors?.amount && (
          <p id="amount-error" className="text-destructive text-sm mt-1">
            {state.errors.amount}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          required
          aria-describedby={state.errors?.description ? "description-error" : undefined}
        />
        {state.errors?.description && (
          <p id="description-error" className="text-destructive text-sm mt-1">
            {state.errors.description}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Transaction"}
      </Button>
    </form>
  );
};
```

---

## 🎯 TypeScript 5.8.3 Best Practices

### Strict Type Definitions

```typescript
// Strict interface definitions with branded types
type UserId = string & { readonly brand: unique symbol };
type TransactionId = string & { readonly brand: unique symbol };

interface User {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly settings: UserSettings;
}

interface UserSettings {
  readonly theme: 'light' | 'dark' | 'system';
  readonly currency: CurrencyCode;
  readonly notifications: NotificationSettings;
}

// Component props with strict typing
interface UserCardProps {
  readonly user: User;
  readonly variant?: 'default' | 'compact' | 'detailed';
  readonly onEdit?: (userId: UserId) => void;
  readonly onDelete?: (userId: UserId) => void;
  readonly className?: string;
  readonly 'data-testid'?: string;
}

export const UserCard: FC<UserCardProps> = ({
  user,
  variant = 'default',
  onEdit,
  onDelete,
  className,
  'data-testid': testId,
}) => {
  return (
    <Card className={cn("w-full", className)} data-testid={testId}>
      {/* Implementation */}
    </Card>
  );
};
```

### Advanced Generic Patterns

```typescript
// Generic component with constraints
interface ListProps<T extends Record<string, unknown>> {
  readonly items: readonly T[];
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly keyExtractor: (item: T) => string;
  readonly emptyMessage?: string;
  readonly className?: string;
}

export function List<T extends Record<string, unknown>>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items found",
  className,
}: ListProps<T>): JSX.Element {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// Usage with type inference
<List
  items={transactions}
  renderItem={(transaction) => (
    <TransactionCard transaction={transaction} />
  )}
  keyExtractor={(transaction) => transaction.id}
  emptyMessage="No transactions found"
/>
```

### Form Validation with Zod Integration

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Strict schema definition
const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  categoryId: z.string().uuid("Invalid category ID"),
  date: z.date().max(new Date(), "Date cannot be in the future"),
});

type CreateTransactionData = z.infer<typeof createTransactionSchema>;

interface TransactionFormProps {
  readonly onSubmit: (data: CreateTransactionData) => Promise<void>;
  readonly defaultValues?: Partial<CreateTransactionData>;
  readonly disabled?: boolean;
}

export const TransactionForm: FC<TransactionFormProps> = ({
  onSubmit,
  defaultValues,
  disabled = false,
}) => {
  const form = useForm<CreateTransactionData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      type: "expense",
      date: new Date(),
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      if (error instanceof ValidationError) {
        // Set form errors from server validation
        error.fieldErrors.forEach(({ field, message }) => {
          form.setError(field as keyof CreateTransactionData, { message });
        });
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={disabled}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={disabled || form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Transaction"}
        </Button>
      </form>
    </Form>
  );
};
```

---

## 🧩 shadcn/ui Components

The NARA boilerplate includes a comprehensive set of shadcn/ui components built on Radix UI primitives with TailwindCSS 4.x styling.

### Installation and Management

The project comes with shadcn/ui pre-configured. To add new components:

```bash
# Add individual components
bunx --bun shadcn@latest add [component-name]

# Examples:
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add card  
bunx --bun shadcn@latest add dialog
bunx --bun shadcn@latest add form

# Add multiple components at once
bunx --bun shadcn@latest add button card dialog form input label
```

### Core Components Reference

#### **Enhanced Button Patterns**

```tsx
import { Button } from "~/components/ui/button"
import { Loader2, Plus, Download } from "lucide-react"

// Basic variants and sizes
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes with proper TypeScript
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>

// Loading states with React 19 patterns
interface LoadingButtonProps {
  readonly loading?: boolean;
  readonly children: React.ReactNode;
  readonly onClick?: () => Promise<void> | void;
}

export const LoadingButton: FC<LoadingButtonProps> = ({ 
  loading = false, 
  children, 
  onClick,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  const handleClick = async () => {
    if (!onClick) return;
    
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

// Usage
<LoadingButton 
  onClick={async () => await saveData()} 
  variant="default"
  loading={isSaving}
>
  Save Changes
</LoadingButton>

// Button groups with proper spacing
<div className="flex items-center space-x-2">
  <Button variant="outline">Cancel</Button>
  <Button variant="default">Save</Button>
</div>

// Responsive button patterns
<Button className="w-full sm:w-auto">
  <Download className="mr-2 h-4 w-4" />
  Download Report
</Button>
```

#### **Enhanced Card Patterns**

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"

// Basic card structure
<Card>
  <CardHeader>
    <CardTitle>Transaction Details</CardTitle>
    <CardDescription>Review transaction information</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Amount</span>
        <span className="text-lg font-bold">$1,234.56</span>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Date</span>
          <p className="font-medium">March 15, 2024</p>
        </div>
        <div>
          <span className="text-muted-foreground">Category</span>
          <p className="font-medium">Groceries</p>
        </div>
      </div>
    </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Edit</Button>
    <Button variant="destructive">Delete</Button>
  </CardFooter>
</Card>

// Interactive card with hover states
<Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">Monthly Budget</CardTitle>
      <Badge variant="default">Active</Badge>
    </div>
    <CardDescription>
      Track your spending across categories
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>Spent this month</span>
        <span className="font-medium">$2,847.50</span>
      </div>
      <Progress value={68} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$2,847.50 of $4,200.00</span>
        <span>68%</span>
      </div>
    </div>
  </CardContent>
</Card>

// Skeleton card for loading states
export const CardSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-2 w-full" />
      </div>
    </CardContent>
  </Card>
);

// Error card component
interface ErrorCardProps {
  readonly error: Error;
  readonly onRetry?: () => void;
}

export const ErrorCard: FC<ErrorCardProps> = ({ error, onRetry }) => (
  <Card className="border-destructive">
    <CardHeader>
      <CardTitle className="text-destructive">Error</CardTitle>
      <CardDescription>{error.message}</CardDescription>
    </CardHeader>
    {onRetry && (
      <CardFooter>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </CardFooter>
    )}
  </Card>
);
```

#### **Dialog**

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### **Form Components**

```tsx
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

// Input with label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// Textarea
<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Enter your message" />
</div>

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### **Data Display**

```tsx
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Separator } from "~/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

// Badge
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Progress
<Progress value={33} className="w-full" />

// Separator
<div>
  <p>Section 1</p>
  <Separator className="my-4" />
  <p>Section 2</p>
</div>

// Avatar
<Avatar>
  <AvatarImage src="/avatars/01.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### **Navigation**

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb"

// Tabs
<Tabs defaultValue="tab1" className="w-full">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>

// Breadcrumb
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Components</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Advanced Components

#### **Data Table**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### **Command Menu**

```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Dashboard</CommandItem>
      <CommandItem>Settings</CommandItem>
      <CommandItem>Profile</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

## 🎨 Custom Components

### Theme Switcher

The boilerplate includes a custom mode switcher component:

```tsx
import { ModeSwitcher } from "~/components/mode-switcher"

// Usage
<ModeSwitcher />
```

**Implementation:**

```tsx
// app/components/mode-switcher.tsx
import { Theme, useTheme } from "remix-themes"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"

export function ModeSwitcher() {
  const [theme, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.SYSTEM)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 📱 Responsive Design Patterns

### Breakpoint System

TailwindCSS provides a mobile-first breakpoint system:

```tsx
// Mobile-first responsive design
<div className="
  grid 
  grid-cols-1      // 1 column on mobile
  md:grid-cols-2   // 2 columns on tablet
  lg:grid-cols-3   // 3 columns on desktop
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Mobile-Specific Components

```tsx
// Use mobile hook for conditional rendering
import { useMobile } from "~/hooks/use-mobile"

export function ResponsiveLayout() {
  const isMobile = useMobile()
  
  return (
    <div>
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <DesktopNavigation />
      )}
    </div>
  )
}
```

### Responsive Typography

```tsx
// Responsive text sizing
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Heading
</h1>

<p className="text-sm md:text-base lg:text-lg text-muted-foreground">
  Responsive paragraph text
</p>
```

---

## 📋 Form Components & Validation

### React Hook Form with Zod Integration

The NARA boilerplate uses React Hook Form with Zod for type-safe form validation:

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

// Comprehensive form schema
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18").max(120, "Invalid age"),
  country: z.string().min(1, "Please select a country"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    sms: z.boolean().default(false),
  }),
  preferences: z.array(z.enum(["newsletter", "updates", "promotions"])).default([]),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  readonly defaultValues?: Partial<ProfileFormData>;
  readonly onSubmit: (data: ProfileFormData) => Promise<void>;
  readonly loading?: boolean;
}

export const ProfileForm: FC<ProfileFormProps> = ({
  defaultValues,
  onSubmit,
  loading = false,
}) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
      country: "",
      bio: "",
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      preferences: [],
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      if (error instanceof ApiValidationError) {
        // Handle server-side validation errors
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof ProfileFormData, { message });
        });
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Input with validation */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number Input */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={18}
                  max={120}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Input */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Textarea */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Share a brief description about yourself.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkbox Group */}
        <FormField
          control={form.control}
          name="notifications.email"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Email notifications</FormLabel>
                <FormDescription>
                  Receive email notifications about your account activity.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={loading || form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};
```

### Advanced Form Patterns

#### Multi-Step Forms

```typescript
interface MultiStepFormProps {
  readonly steps: FormStep[];
  readonly onComplete: (data: CompleteFormData) => Promise<void>;
}

export const MultiStepForm: FC<MultiStepFormProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CompleteFormData>>({});

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleStepSubmit = async (stepData: unknown) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (isLastStep) {
      await onComplete(updatedData as CompleteFormData);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <Progress value={(currentStep + 1) / steps.length * 100} className="mt-2" />
      </div>

      {/* Current step form */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <currentStepData.component
            defaultValues={formData}
            onSubmit={handleStepSubmit}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button type="submit" form={currentStepData.formId}>
            {isLastStep ? "Complete" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
```

#### Form Field Components

```typescript
// Reusable form field wrapper
interface FormFieldWrapperProps {
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly error?: string;
  readonly children: React.ReactNode;
}

export const FormFieldWrapper: FC<FormFieldWrapperProps> = ({
  label,
  description,
  required,
  error,
  children,
}) => (
  <div className="space-y-2">
    <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
      {label}
    </Label>
    {children}
    {description && (
      <p className="text-sm text-muted-foreground">{description}</p>
    )}
    {error && (
      <p className="text-sm text-destructive">{error}</p>
    )}
  </div>
);

// Currency input component
interface CurrencyInputProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly currency?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency = "USD",
  placeholder = "0.00",
  disabled = false,
}) => {
  const formatValue = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="relative">
      <Input
        type="number"
        step="0.01"
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="pr-16"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-muted-foreground text-sm">{currency}</span>
      </div>
    </div>
  );
};
```

---

## ⚡ Performance Optimization

### React 19 Performance Patterns

```typescript
import { memo, useMemo, useCallback, startTransition, useDeferredValue } from "react";

// Memoized components with proper comparison
interface ExpensiveComponentProps {
  readonly data: ComplexData[];
  readonly onItemClick: (id: string) => void;
}

export const ExpensiveComponent = memo<ExpensiveComponentProps>(
  ({ data, onItemClick }) => {
    // Memoize expensive calculations
    const processedData = useMemo(() => {
      return data
        .filter((item) => item.isActive)
        .sort((a, b) => a.priority - b.priority)
        .map((item) => ({
          ...item,
          formattedValue: formatCurrency(item.value),
        }));
    }, [data]);

    // Memoize callback functions
    const handleItemClick = useCallback(
      (id: string) => {
        startTransition(() => {
          onItemClick(id);
        });
      },
      [onItemClick]
    );

    return (
      <div className="space-y-2">
        {processedData.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={handleItemClick}
          />
        ))}
      </div>
    );
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.data.length === nextProps.data.length &&
      prevProps.data.every((item, index) => 
        item.id === nextProps.data[index]?.id &&
        item.version === nextProps.data[index]?.version
      )
    );
  }
);

// Deferred value for search
export const SearchableList: FC<SearchableListProps> = ({ items, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Expensive filtering is deferred
  const filteredItems = useMemo(() => {
    if (!deferredSearchTerm) return items;
    
    return items.filter(item =>
      item.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [items, deferredSearchTerm]);

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};
```

### Virtual Scrolling for Large Lists

```typescript
import { FixedSizeList as List } from "react-window";

interface VirtualizedListProps {
  readonly items: ListItem[];
  readonly itemHeight: number;
  readonly height: number;
  readonly onItemClick: (item: ListItem) => void;
}

export const VirtualizedList: FC<VirtualizedListProps> = ({
  items,
  itemHeight,
  height,
  onItemClick,
}) => {
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = items[index];
      
      return (
        <div style={style} className="px-4">
          <Card 
            className="h-full cursor-pointer hover:shadow-md"
            onClick={() => onItemClick(item)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </CardContent>
          </Card>
        </div>
      );
    },
    [items, onItemClick]
  );

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      className="scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
    >
      {Row}
    </List>
  );
};
```

### Lazy Loading Components

```typescript
import { lazy, Suspense } from "react";

// Lazy load heavy components
const HeavyChart = lazy(() => import("./charts/HeavyChart"));
const DataTable = lazy(() => import("./tables/DataTable"));
const AdvancedEditor = lazy(() => import("./editors/AdvancedEditor"));

// Loading wrapper with proper skeleton
const LazyComponentWrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<ComponentSkeleton />}>
    {children}
  </Suspense>
);

// Usage in route components
export const DashboardPage: FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewContent />
        </TabsContent>

        <TabsContent value="charts">
          <LazyComponentWrapper>
            <HeavyChart />
          </LazyComponentWrapper>
        </TabsContent>

        <TabsContent value="data">
          <LazyComponentWrapper>
            <DataTable />
          </LazyComponentWrapper>
        </TabsContent>

        <TabsContent value="editor">
          <LazyComponentWrapper>
            <AdvancedEditor />
          </LazyComponentWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

## 🔒 Security & Accessibility

### Accessibility Best Practices

```typescript
// Comprehensive accessibility implementation
interface AccessibleButtonProps {
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly ariaLabel?: string;
  readonly ariaDescribedBy?: string;
  readonly variant?: ButtonVariant;
}

export const AccessibleButton: FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  variant = "default",
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      variant={variant}
    >
      {loading && (
        <Loader2 
          className="mr-2 h-4 w-4 animate-spin" 
          aria-hidden="true"
        />
      )}
      {children}
      {loading && <span className="sr-only">Loading...</span>}
    </Button>
  );
};

// Accessible form with ARIA labels
export const AccessibleForm: FC<FormProps> = ({ onSubmit, schema }) => {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={form.formState.isSubmitting}>
        <legend className="sr-only">User Registration Form</legend>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.error ? "email-error" : "email-help"}
                  {...field}
                />
              </FormControl>
              <FormDescription id="email-help">
                We'll use this email to send you updates.
              </FormDescription>
              {fieldState.error && (
                <FormMessage id="email-error" role="alert">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" aria-describedby="submit-help">
          Create Account
        </Button>
        <p id="submit-help" className="sr-only">
          Creates a new user account with the provided information
        </p>
      </fieldset>
    </form>
  );
};
```

### Security Patterns

```typescript
// Input sanitization and validation
import DOMPurify from 'dompurify';

interface SecureTextDisplayProps {
  readonly content: string;
  readonly allowHtml?: boolean;
  readonly maxLength?: number;
}

export const SecureTextDisplay: FC<SecureTextDisplayProps> = ({
  content,
  allowHtml = false,
  maxLength = 1000,
}) => {
  const sanitizedContent = useMemo(() => {
    // Truncate content to prevent DoS
    const truncated = content.substring(0, maxLength);
    
    if (allowHtml) {
      // Sanitize HTML content
      return DOMPurify.sanitize(truncated, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href'],
      });
    }
    
    // Escape plain text
    return truncated
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }, [content, allowHtml, maxLength]);

  if (allowHtml) {
    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  }

  return <div>{sanitizedContent}</div>;
};

// Secure file upload component
interface SecureFileUploadProps {
  readonly onUpload: (files: File[]) => Promise<void>;
  readonly maxSize?: number; // in bytes
  readonly allowedTypes?: string[];
  readonly maxFiles?: number;
}

export const SecureFileUpload: FC<SecureFileUploadProps> = ({
  onUpload,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxFiles = 5,
}) => {
  const validateFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Check file count
    if (fileArray.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }
    
    // Validate each file
    fileArray.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`);
      }
      
      // Check file name for security
      if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
        throw new Error(`File name ${file.name} contains invalid characters`);
      }
    });
    
    return fileArray;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      const validatedFiles = validateFiles(files);
      await onUpload(validatedFiles);
    } catch (error) {
      console.error('File upload error:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
      <Input
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <Label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center space-y-2"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span>Click to upload files</span>
        <span className="text-xs text-muted-foreground">
          Max {maxFiles} files, {maxSize / 1024 / 1024}MB each
        </span>
      </Label>
    </div>
  );
};
```

---

## 🎯 Component Best Practices

### 1. **Clean Architecture Component Design**

Components should follow the dependency flow: Domain → Application → Infrastructure → Components

```typescript
// ❌ Component with business logic mixed in
function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct API call in component
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  const deleteTransaction = async (id) => {
    // Business logic in component
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return <div>{/* render logic */}</div>;
}

// ✅ Clean separation with application layer
function TransactionList() {
  // Use application layer hook
  const { 
    transactions, 
    isLoading, 
    deleteTransaction,
    error 
  } = useTransactions();

  if (isLoading) return <TransactionListSkeleton />;
  if (error) return <ErrorBoundary error={error} />;

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onDelete={deleteTransaction}
        />
      ))}
    </div>
  );
}
```

### 2. **Component Composition Over Configuration**

Build flexible components through composition:

```typescript
// ❌ Large, inflexible component with many props
interface UserProfileProps {
  user: User;
  showAvatar?: boolean;
  showBadge?: boolean;
  showActions?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  badgeVariant?: BadgeVariant;
  actionsVariant?: ButtonVariant;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

function UserProfile(props: UserProfileProps) {
  // Complex conditional rendering based on props
  return <div>{/* complex implementation */}</div>;
}

// ✅ Composable components with clear responsibilities
function UserProfile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("flex items-center space-x-4 p-4", className)}>
      {children}
    </Card>
  );
}

function UserAvatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Avatar className={cn(
      "flex-shrink-0",
      size === 'sm' && "h-8 w-8",
      size === 'md' && "h-12 w-12", 
      size === 'lg' && "h-16 w-16"
    )}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}

function UserInfo({ user }: { user: User }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-sm truncate">{user.name}</h3>
      <p className="text-muted-foreground text-xs truncate">{user.email}</p>
    </div>
  );
}

function UserBadge({ user }: { user: User }) {
  return (
    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
      {user.role}
    </Badge>
  );
}

function UserActions({ user, onEdit, onDelete }: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex space-x-2">
      <Button size="sm" variant="outline" onClick={onEdit}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}

// Usage - Flexible composition
<UserProfile>
  <UserAvatar user={user} size="lg" />
  <UserInfo user={user} />
  <UserBadge user={user} />
  <UserActions user={user} onEdit={handleEdit} onDelete={handleDelete} />
</UserProfile>

// Different composition for different use cases
<UserProfile className="p-2">
  <UserAvatar user={user} size="sm" />
  <UserInfo user={user} />
</UserProfile>
```

### 3. **Strict TypeScript Patterns**

```typescript
// Use branded types for IDs
type UserId = string & { readonly brand: unique symbol };
type TransactionId = string & { readonly brand: unique symbol };

// Strict component props with readonly
interface TransactionCardProps {
  readonly transaction: Transaction;
  readonly variant?: 'default' | 'compact' | 'detailed';
  readonly onEdit?: (id: TransactionId) => void;
  readonly onDelete?: (id: TransactionId) => void;
  readonly className?: string;
  readonly 'data-testid'?: string;
}

// Use discriminated unions for variant types
type AlertVariant = 
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; details?: string }
  | { type: 'warning'; message: string; action?: () => void }
  | { type: 'info'; message: string; dismissible?: boolean };

interface AlertProps {
  readonly variant: AlertVariant;
  readonly className?: string;
}

export const Alert: FC<AlertProps> = ({ variant, className }) => {
  const renderContent = () => {
    switch (variant.type) {
      case 'success':
        return <span className="text-green-700">{variant.message}</span>;
      case 'error':
        return (
          <div>
            <span className="text-red-700">{variant.message}</span>
            {variant.details && (
              <p className="text-red-600 text-sm mt-1">{variant.details}</p>
            )}
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center justify-between">
            <span className="text-yellow-700">{variant.message}</span>
            {variant.action && (
              <Button size="sm" onClick={variant.action}>
                Action
              </Button>
            )}
          </div>
        );
      case 'info':
        return <span className="text-blue-700">{variant.message}</span>;
    }
  };

  return (
    <div className={cn("p-4 rounded-md border", className)}>
      {renderContent()}
    </div>
  );
};
```

### 4. **Error Boundaries and Error Handling**

```typescript
interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
  readonly fallback?: (error: Error, retry: () => void) => React.ReactNode;
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ComponentErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    
    // Log to monitoring service
    console.error('Component error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry);
      }

      return (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {this.state.error.message}
            </p>
            <Button onClick={this.retry} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Usage
<ComponentErrorBoundary
  fallback={(error, retry) => (
    <ErrorCard error={error} onRetry={retry} />
  )}
  onError={(error, errorInfo) => {
    // Send to monitoring service
    trackError(error, errorInfo);
  }}
>
  <ComplexComponent />
</ComponentErrorBoundary>
```

### 5. **Loading States and Skeletons**

```typescript
// Create skeleton versions of your components
export const TransactionCardSkeleton: FC = () => (
  <Card>
    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-3 w-1/3" />
    </CardContent>
  </Card>
);

export const TransactionListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }, (_, i) => (
      <TransactionCardSkeleton key={i} />
    ))}
  </div>
);

// Use with Suspense and loading states
export const TransactionList: FC = () => {
  return (
    <Suspense fallback={<TransactionListSkeleton />}>
      <TransactionListContent />
    </Suspense>
  );
};
```

### 6. **Accessibility First Design**

```typescript
// Always include proper ARIA attributes and semantic HTML
interface AccessibleModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
}

export const AccessibleModal: FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus management
      const modal = document.getElementById('modal-content');
      modal?.focus();
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div
        id="modal-content"
        className="bg-background rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {description && (
          <p id={descriptionId} className="text-muted-foreground mb-4">
            {description}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
};
```

---

## 🎨 Styling Guidelines

### 1. **TailwindCSS Utilities**

Use Tailwind utilities for consistent spacing and sizing:

```tsx
// Consistent spacing scale
<div className="p-4 m-2 space-y-4">     // Padding, margin, vertical space
<div className="px-6 py-3">             // Horizontal/vertical padding
<div className="mt-8 mb-4">             // Margin top/bottom

// Consistent sizing
<div className="w-full h-64">           // Full width, fixed height
<div className="max-w-2xl mx-auto">     // Max width with auto margins
```

### 2. **CSS Variables and Custom Properties**

Use CSS variables for theming:

```css
/* app/app.css */
:root {
  --brand-primary: 220 14% 93%;
  --brand-secondary: 220 13% 91%;
  --custom-spacing: 1.5rem;
}

.dark {
  --brand-primary: 220 13% 18%;
  --brand-secondary: 215 14% 34%;
}
```

```tsx
// Use in components
<div className="bg-[hsl(var(--brand-primary))]">
  Custom themed background
</div>
```

### 3. **Component Variants with CVA**

Use `class-variance-authority` for component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive",
        warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string
  children: React.ReactNode
}

export function Alert({ className, variant, children, ...props }: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## 🧪 Testing Components

### Component Testing with React Testing Library

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from './user-card'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user' as const
}

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
  
  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<UserCard user={mockUser} onEdit={onEdit} showActions />)
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith('1')
  })
})
```

### Visual Testing

For visual regression testing, consider tools like:

- **Storybook** for component documentation
- **Chromatic** for visual testing
- **Percy** for screenshot testing

---

## 📚 Component Documentation

### Documenting Components

Create clear documentation for custom components:

```tsx
/**
 * UserCard displays user information in a card format
 * 
 * @param user - User object containing id, name, email, and role
 * @param onEdit - Callback function called when edit button is clicked
 * @param onDelete - Callback function called when delete button is clicked
 * @param showActions - Whether to show edit/delete action buttons
 * @param className - Additional CSS classes to apply
 * 
 * @example
 * ```tsx
 * <UserCard 
 *   user={user} 
 *   onEdit={handleEdit}
 *   showActions={true}
 * />
 * ```
 */
export function UserCard({ user, onEdit, onDelete, showActions, className }: UserCardProps) {
  // Implementation
}
```

---

## 🧪 Enhanced Testing Components

### Component Testing with Vitest and React Testing Library

The NARA boilerplate uses Vitest with React Testing Library for comprehensive component testing:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionForm } from './TransactionForm';

// Test utilities
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('TransactionForm', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderWithProviders(<TransactionForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create transaction/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<TransactionForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create transaction/i });
    await user.click(submitButton);

    expect(await screen.findByText(/amount is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    renderWithProviders(<TransactionForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/amount/i), '100.50');
    await user.type(screen.getByLabelText(/description/i), 'Test transaction');
    await user.selectOptions(screen.getByLabelText(/type/i), 'expense');
    
    await user.click(screen.getByRole('button', { name: /create transaction/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 100.50,
        description: 'Test transaction',
        type: 'expense',
      });
    });
  });

  it('handles loading state', () => {
    renderWithProviders(<TransactionForm onSubmit={mockOnSubmit} loading />);
    
    const submitButton = screen.getByRole('button', { name: /creating/i });
    expect(submitButton).toBeDisabled();
  });

  it('displays server validation errors', async () => {
    const mockOnSubmitWithError = vi.fn().mockRejectedValue(
      new ValidationError({
        amount: 'Amount must be positive',
        description: 'Description too long',
      })
    );

    renderWithProviders(<TransactionForm onSubmit={mockOnSubmitWithError} />);
    
    await user.type(screen.getByLabelText(/amount/i), '-100');
    await user.type(screen.getByLabelText(/description/i), 'Valid description');
    await user.click(screen.getByRole('button', { name: /create transaction/i }));

    await waitFor(() => {
      expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
      expect(screen.getByText(/description too long/i)).toBeInTheDocument();
    });
  });
});
```

### Visual Testing with Storybook

```typescript
// TransactionCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionCard } from './TransactionCard';
import { Transaction } from '../domain/entities/Transaction';

const meta: Meta<typeof TransactionCard> = {
  title: 'Components/TransactionCard',
  component: TransactionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTransaction = Transaction.create({
  amount: 1234.56,
  description: 'Grocery shopping at Whole Foods',
  type: 'expense',
  currency: 'USD',
});

export const Default: Story = {
  args: {
    transaction: mockTransaction,
  },
};

export const Compact: Story = {
  args: {
    transaction: mockTransaction,
    variant: 'compact',
  },
};

export const WithActions: Story = {
  args: {
    transaction: mockTransaction,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const Loading: Story = {
  render: () => <TransactionCardSkeleton />,
};

export const Error: Story = {
  render: () => (
    <ErrorCard 
      error={new Error('Failed to load transaction')} 
      onRetry={() => console.log('Retry clicked')} 
    />
  ),
};
```

### Integration Testing

```typescript
// TransactionList.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { TransactionListPage } from './TransactionListPage';
import { createTestProviders } from '~/test-utils';

const server = setupServer(
  http.get('/api/transactions', () => {
    return HttpResponse.json([
      {
        id: '1',
        amount: 100.50,
        description: 'Test transaction 1',
        type: 'expense',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        amount: 250.00,
        description: 'Test transaction 2',
        type: 'income',
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  http.delete('/api/transactions/:id', ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TransactionList Integration', () => {
  it('loads and displays transactions', async () => {
    render(<TransactionListPage />, { wrapper: createTestProviders() });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test transaction 1')).toBeInTheDocument();
      expect(screen.getByText('Test transaction 2')).toBeInTheDocument();
    });

    expect(screen.getByText('$100.50')).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });

  it('handles transaction deletion', async () => {
    const user = userEvent.setup();
    
    render(<TransactionListPage />, { wrapper: createTestProviders() });

    await waitFor(() => {
      expect(screen.getByText('Test transaction 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText(/delete/i)[0];
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test transaction 1')).not.toBeInTheDocument();
    });
  });
});
```

---

## 📚 Enhanced Component Documentation

### Comprehensive Component Documentation

Document components using JSDoc with TypeScript integration:

```typescript
/**
 * TransactionCard displays transaction information in a card format.
 * 
 * This component follows Clean Architecture principles and handles
 * transaction display with proper accessibility and type safety.
 * 
 * @example
 * ```tsx
 * <TransactionCard 
 *   transaction={transaction}
 *   variant="detailed"
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 * 
 * @param transaction - Transaction domain entity
 * @param variant - Visual variant of the card ('default' | 'compact' | 'detailed')
 * @param onEdit - Callback fired when edit action is triggered
 * @param onDelete - Callback fired when delete action is triggered
 * @param className - Additional CSS classes
 * @param data-testid - Test identifier for testing
 * 
 * @since 1.0.0
 * @category Components
 */
export const TransactionCard: FC<TransactionCardProps> = ({
  transaction,
  variant = 'default',
  onEdit,
  onDelete,
  className,
  'data-testid': testId,
}) => {
  // Implementation
};

/**
 * Props for the TransactionCard component.
 * 
 * @interface TransactionCardProps
 */
export interface TransactionCardProps {
  /** Transaction domain entity containing all transaction data */
  readonly transaction: Transaction;
  
  /** Visual variant that controls the card's appearance and information density */
  readonly variant?: 'default' | 'compact' | 'detailed';
  
  /** Callback function invoked when the user clicks the edit button */
  readonly onEdit?: (transactionId: TransactionId) => void;
  
  /** Callback function invoked when the user clicks the delete button */
  readonly onDelete?: (transactionId: TransactionId) => void;
  
  /** Additional CSS classes to apply to the card container */
  readonly className?: string;
  
  /** Test identifier for automated testing and debugging */
  readonly 'data-testid'?: string;
}
```

### Component API Documentation

Create comprehensive API documentation for component libraries:

```typescript
// components/api/index.ts
/**
 * NARA Component Library API
 * 
 * This module exports all public components and their types
 * for use in applications built with the NARA boilerplate.
 * 
 * @packageDocumentation
 */

// Core Components
export { Button, type ButtonProps } from '../ui/button';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from '../ui/card';
export { Input, type InputProps } from '../ui/input';
export { Label, type LabelProps } from '../ui/label';

// Form Components
export { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  type FormProps 
} from '../ui/form';

// Custom Components  
export { ModeSwitcher } from '../mode-switcher';
export { LoadingButton, type LoadingButtonProps } from '../loading-button';
export { AccessibleModal, type AccessibleModalProps } from '../accessible-modal';

// Feature Components
export { TransactionCard, type TransactionCardProps } from '../features/finance/TransactionCard';
export { TransactionForm, type TransactionFormProps } from '../features/finance/TransactionForm';
export { TransactionList, type TransactionListProps } from '../features/finance/TransactionList';

// Layout Components
export { ErrorBoundary, type ErrorBoundaryProps } from '../error-boundary';
export { ComponentErrorBoundary } from '../component-error-boundary';

// Utility Components
export { VirtualizedList, type VirtualizedListProps } from '../virtualized-list';
export { LazyComponentWrapper } from '../lazy-component-wrapper';

/**
 * Component library version information
 */
export const VERSION = '1.0.0';

/**
 * Supported React versions
 */
export const REACT_VERSION_SUPPORT = '^19.1.0';

/**
 * TypeScript version requirement
 */
export const TYPESCRIPT_VERSION_REQUIREMENT = '^5.8.3';
```

### Component Usage Guidelines

```markdown
# Component Usage Guidelines

## General Principles

1. **Type Safety First**: Always use TypeScript with strict mode enabled
2. **Accessibility**: Ensure all components meet WCAG 2.1 AA standards
3. **Performance**: Use React 19 features for optimal performance
4. **Clean Architecture**: Follow domain-driven design principles
5. **Testing**: Write comprehensive tests for all components

## Component Categories

### UI Components (`~/components/ui/`)
- Primitive components from shadcn/ui
- Highly reusable across features
- Minimal business logic
- Focus on presentation and interaction

### Custom Components (`~/components/`)
- Project-specific shared components
- Cross-feature functionality
- Enhanced versions of UI components

### Feature Components (`~/features/[feature]/components/`)
- Domain-specific components
- Business logic integration
- Feature-specific user interfaces

## Best Practices

### Component Design
- Single Responsibility Principle
- Composition over inheritance
- Props should be readonly interfaces
- Use branded types for IDs

### Performance
- Memoize expensive calculations
- Use React 19's `use` hook for data fetching
- Implement proper loading states
- Virtual scrolling for large lists

### Accessibility
- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility

### Testing
- Unit tests for business logic
- Component tests for user interactions
- Integration tests for feature workflows
- Visual regression tests with Storybook
```

---

This comprehensive component guide provides enterprise-grade patterns and best practices for building scalable, maintainable, and accessible React applications with the NARA boilerplate. It covers Clean Architecture integration, React 19.1.0 features, TypeScript 5.8.3 patterns, performance optimization, security considerations, and comprehensive testing strategies.

---

Built with ❤️ by KotonoSora — to help you ship faster and with confidence.
