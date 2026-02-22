---
title: "Package @kotonosora/utils Shared Functions"
description: "Utility functions and helpers for common tasks across the application"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["utils", "utilities", "helpers", "shared-functions"]
---

# @kotonosora/utils Shared Functions

## Overview

`@kotonosora/utils` provides reusable utility functions and helpers for common operations across the NARA ecosystem.

## Package Information

- **Name**: `@kotonosora/utils`
- **Version**: 0.0.1
- **Type**: Utility library (zero dependencies)
- **Location**: `packages/utils/`
- **Dependencies**: None (pure utility functions)
- **Main Export**: `src/index.ts`

## Package Structure

```
packages/utils/
├── src/
│   ├── array.ts                # Array manipulation utilities
│   ├── object.ts               # Object utilities
│   ├── string.ts               # String manipulation
│   ├── validation.ts           # Validation helpers
│   ├── crypto.ts               # Cryptographic utilities
│   ├── formatting.ts           # Formatting functions
│   ├── http.ts                 # HTTP/URL utilities
│   ├── types.ts                # Type definitions
│   └── index.ts                # Main exports
└── package.json
```

## Array Utilities

### Common Array Operations

```typescript
import {
  chunk,
  deduplicate,
  findDuplicates,
  flatten,
  groupBy,
  rotate,
  shuffle,
  sortBy,
} from "@kotonosora/utils";

// Chunk array into smaller arrays
const chunked = chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

// Remove duplicates
const unique = deduplicate([1, 2, 2, 3, 3, 3]);
// [1, 2, 3]

// Flatten nested arrays
const flat = flatten([
  [1, 2],
  [3, [4, 5]],
]);
// [1, 2, 3, 4, 5]

// Group by property
const grouped = groupBy(users, "role");
// { admin: [...], user: [...] }

// Sort by property
const sorted = sortBy(users, "name", "asc");

// Find duplicates
const dupes = findDuplicates([1, 2, 2, 3]);
// [2]

// Rotate array
const rotated = rotate([1, 2, 3, 4], 2);
// [3, 4, 1, 2]

// Shuffle array
const shuffled = shuffle([1, 2, 3, 4, 5]);
```

### Array Selection

```typescript
import {
  compact,
  drop,
  first,
  last,
  nth,
  pickRandom,
  take,
  unique,
} from "@kotonosora/utils";

// Get first/last elements
const firstItem = first([1, 2, 3]); // 1
const lastItem = last([1, 2, 3]); // 3

// Get nth element (supports negative indexing)
const second = nth([1, 2, 3, 4], 1); // 2
const last2 = nth([1, 2, 3, 4], -1); // 4

// Take/drop n elements
const taken = take([1, 2, 3, 4], 2); // [1, 2]
const dropped = drop([1, 2, 3, 4], 2); // [3, 4]

// Random element
const random = pickRandom([1, 2, 3, 4]); // 3 (random)

// Remove duplicates
const unique = unique([1, 2, 2, 3]); // [1, 2, 3]

// Remove falsy values
const clean = compact([0, 1, false, 2, "", 3]); // [1, 2, 3]
```

## Object Utilities

### Object Manipulation

```typescript
import {
  deepMerge,
  entries,
  filterByValues,
  fromEntries,
  invertKeys,
  mapValues,
  merge,
  omit,
  pick,
} from "@kotonosora/utils";

// Pick specific keys
const subset = pick({ a: 1, b: 2, c: 3 }, ["a", "c"]);
// { a: 1, c: 3 }

// Omit specific keys
const filtered = omit({ a: 1, b: 2, c: 3 }, ["b"]);
// { a: 1, c: 3 }

// Shallow merge objects
const merged = merge({ a: 1 }, { b: 2 }, { c: 3 });
// { a: 1, b: 2, c: 3 }

// Deep merge (recursive)
const deep = deepMerge({ a: { x: 1 } }, { a: { y: 2 } });
// { a: { x: 1, y: 2 } }

// Swap keys and values
const inverted = invertKeys({ a: "first", b: "second" });
// { first: 'a', second: 'b' }

// Filter by values
const cleaned = filterByValues({ a: 1, b: 0, c: 2 }, (v) => v > 0);
// { a: 1, c: 2 }

// Map over values
const doubled = mapValues({ a: 1, b: 2 }, (v) => v * 2);
// { a: 2, b: 4 }

// Convert to entries
const list = entries({ a: 1, b: 2 });
// [['a', 1], ['b', 2]]

// Convert from entries
const obj = fromEntries([
  ["a", 1],
  ["b", 2],
]);
// { a: 1, b: 2 }
```

## String Utilities

### String Manipulation

```typescript
import {
  camelCase,
  capitalize,
  humanize,
  kebabCase,
  pascalCase,
  slugify,
  snakeCase,
  stripHtml,
  stripMarkdown,
  truncate,
} from "@kotonosora/utils";

// Capitalize
capitalize("hello"); // 'Hello'

// Case conversions
camelCase("hello-world"); // 'helloWorld'
snakeCase("hello world"); // 'hello_world'
kebabCase("hello world"); // 'hello-world'
pascalCase("hello world"); // 'HelloWorld'

// Truncate with ellipsis
truncate("Long text here", 8); // 'Long te...'

// Create URL slug
slugify("My Blog Post!"); // 'my-blog-post'

// Remove HTML tags
stripHtml("<p>Hello</p>"); // 'Hello'

// Remove markdown
stripMarkdown("# **Bold** text"); // 'Bold text'

// Humanize variable names
humanize("user_name"); // 'user name'
humanize("firstName"); // 'first name'
```

### String Searching

```typescript
import {
  countOccurrences,
  endsWith,
  findAll,
  includes,
  levenshteinDistance,
  replaceAll,
  startsWith,
} from "@kotonosora/utils";

// Case-insensitive includes
includes("Hello World", "world", { case: false }); // true

// Check prefix/suffix
startsWith("hello.js", "hello"); // true
endsWith("hello.js", ".js"); // true

// Find all occurrences
findAll("aaa", "a"); // [0, 1, 2]

// Replace all instances
replaceAll("hello hello", "hello", "hi"); // 'hi hi'

// Count occurrences
countOccurrences("aaa", "a"); // 3

// String similarity (Levenshtein distance)
levenshteinDistance("cat", "hat"); // 1
```

## Validation Utilities

### Data Validation

```typescript
import {
  isCreditCard,
  isEmail,
  isEmpty,
  isIPAddress,
  isPhoneNumber,
  isStrongPassword,
  isUrl,
  isUUID,
  isValidDate,
} from "@kotonosora/utils";

// Email validation
isEmail("user@example.com"); // true
isEmail("invalid.email"); // false

// URL validation
isUrl("https://example.com"); // true

// Phone number
isPhoneNumber("+1-555-0123"); // true

// IP address
isIPAddress("192.168.1.1"); // true

// UUID
isUUID("550e8400-e29b-41d4-a716-446655440000"); // true

// Credit card (Luhn algorithm)
isCreditCard("4532015112830366"); // true

// Password strength
isStrongPassword("MyP@ssw0rd!"); // true

// Empty checks
isEmpty(""); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(null); // true

// Date validation
isValidDate("2026-02-22"); // true
isValidDate("invalid"); // false
```

## HTTP & URL Utilities

### URL Handling

```typescript
import {
  addQueryParam,
  buildUrl,
  getQueryParams,
  isAbsoluteUrl,
  joinPaths,
  parseUrl,
  removeQueryParam,
  setQueryParams,
} from "@kotonosora/utils";

// Parse URL
const parsed = parseUrl("https://example.com:8080/path?key=value#hash");
// { protocol: 'https', host: 'example.com', port: 8080, ... }

// Build URL from components
const url = buildUrl({
  protocol: "https",
  host: "example.com",
  path: "/api/users",
  query: { id: "123" },
});
// 'https://example.com/api/users?id=123'

// Get query parameters
const params = getQueryParams("?user=alice&role=admin");
// { user: 'alice', role: 'admin' }

// Set query parameters (replaces existing)
const updated = setQueryParams("?old=value", { new: "value" });
// '?new=value'

// Add query parameter
const added = addQueryParam("?id=1", "sort", "asc");
// '?id=1&sort=asc'

// Remove query parameter
const removed = removeQueryParam("?id=1&sort=asc", "sort");
// '?id=1'

// Check if absolute URL
isAbsoluteUrl("https://example.com"); // true
isAbsoluteUrl("/relative"); // false

// Join path segments
joinPaths("/api", "users", "123"); // '/api/users/123'
```

## Formatting Utilities

### Number & Currency

```typescript
import {
  byteSize,
  formatBytes,
  formatCurrency,
  formatDuration,
  formatNumber,
  formatPercent,
  toFixed,
} from "@kotonosora/utils";

// Format numbers with localization
formatNumber(1234567.89); // '1,234,567.89'
formatNumber(1234567.89, "es-ES"); // '1.234.567,89'

// Format currency
formatCurrency(99.99, "USD"); // '$99.99'
formatCurrency(99.99, "EUR", "de-DE"); // '99,99 €'

// Format bytes
formatBytes(1024); // '1 KB'
formatBytes(1048576); // '1 MB'
formatBytes(1073741824); // '1 GB'

// Format durations
formatDuration(3661); // '1h 1m 1s'
formatDuration(120); // '2m'

// Format percentage
formatPercent(0.75); // '75%'
formatPercent(0.333, 2); // '33.33%'

// Fixed decimal places
toFixed(3.14159, 2); // 3.14

// Byte size calculation
byteSize("Hello"); // 5
```

## Cryptographic Utilities

### Hashing & Encoding

```typescript
import {
  base64Decode,
  base64Encode,
  generateRandomString,
  generateUUID,
  hashPassword,
  md5,
  sha256,
  sha512,
  verifyPassword,
} from "@kotonosora/utils";

// Hash functions
md5("Hello"); // '8b1a9953c4611296aaf7a3c4ab8f4f'
sha256("Hello"); // '185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969'

// Base64 encoding/decoding
base64Encode("Hello"); // 'SGVsbG8='
base64Decode("SGVsbG8="); // 'Hello'

// Password hashing (bcrypt-like)
const hash = hashPassword("myPassword"); // '$2a$10$...'
verifyPassword("myPassword", hash); // true

// Generate random strings
generateRandomString(16); // 'a3f2x9k1m2b4p7q0'

// Generate UUID
generateUUID(); // '550e8400-e29b-41d4-a716-446655440000'
```

## Type Guards

### Runtime Type Checking

```typescript
import {
  isArray,
  isBoolean,
  isDate,
  isDefined,
  isError,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isPromise,
  isString,
  isUndefined,
} from "@kotonosora/utils";

// Type guards for runtime checking
isString("hello"); // true
isNumber(42); // true
isBoolean(true); // true
isObject({}); // true
isArray([]); // true
isFunction(() => {}); // true
isNull(null); // true
isUndefined(undefined); // true
isDefined(value); // true if not null/undefined
isPromise(Promise.resolve()); // true
isDate(new Date()); // true
isError(new Error()); // true
```

## Functional Utilities

### Function Composition

```typescript
import {
  compose,
  curry,
  debounce,
  delay,
  memoize,
  pipe,
  retry,
  throttle,
} from "@kotonosora/utils";

// Function composition
const add = (a: number, b: number) => a + b;
const multiply = (a: number) => a * 2;
const composed = compose(multiply, add);
composed(3, 2); // (3 + 2) * 2 = 10

// Function piping (left-to-right)
const piped = pipe(add, multiply);
piped(3, 2); // (3 + 2) * 2 = 10

// Currying
const curriedAdd = curry(add);
const add5 = curriedAdd(5);
add5(3); // 8

// Memoization
const expensiveCalc = memoize((n) => {
  console.log("Calculating...");
  return n * n;
});
expensiveCalc(5); // Calculates, logs
expensiveCalc(5); // Returns cached, no log

// Debouncing (wait after last call)
const debounced = debounce((query) => {
  search(query);
}, 300);
input.addEventListener("input", (e) => debounced(e.target.value));

// Throttling (max once per interval)
const throttled = throttle(() => {
  onScroll();
}, 1000);
window.addEventListener("scroll", throttled);

// Delay execution
delay(() => {
  console.log("Delayed");
}, 1000);

// Retry with backoff
retry(() => fetch("/api/data"), {
  maxAttempts: 3,
  backoff: 100,
  exponential: true,
});
```

## Usage in Application

```typescript
import {
  capitalize,
  formatCurrency,
  isEmail,
  chunk,
  debounce,
  generateUUID
} from '@kotonosora/utils'

// In components
export function UserList({ users }: { users: User[] }) {
  const chunked = chunk(users, 10)  // Paginate

  return (
    <>
      {chunked.map((page, idx) => (
        <div key={idx}>
          {page.map(user => (
            <p key={user.id}>{capitalize(user.name)}</p>
          ))}
        </div>
      ))}
    </>
  )
}

// In forms
const validate = (email: string) => isEmail(email)

// In transformations
const displayPrice = (price: number) => formatCurrency(price, 'USD')

// In event handlers
const handleSearch = debounce((query: string) => {
  performSearch(query)
}, 500)

// In data processing
const createUser = (user: User) => ({
  ...user,
  id: generateUUID()
})
```

## Best Practices

1. **Use specific imports**: Import only what you need

   ```typescript
   // ✅ Good
   import { capitalize, isEmail } from "@kotonosora/utils";
   // ❌ Avoid
   import * as utils from "@kotonosora/utils";
   ```

2. **Leverage type guards**: Use for runtime validation
3. **Memoize expensive operations**: Cache calculations
4. **Debounce/throttle event handlers**: Optimize performance
5. **Use array utilities for collections**: More readable than native methods
6. **Validate user input**: Use validation utilities before processing

---

The utils package provides essential helper functions for cleaner, more maintainable code across the NARA ecosystem.
