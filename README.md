# @kotonosora/nara-vite-react-boilerplate

## Folder Structure

[The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html):

- `domain/`: Core business entities and models (Domain Layer).
- `actions/`: Application logic and business rules (Application Layer).
- `interfaces/`: Adapters for UI and external system communication (Adapters Layer).
- `infrastructure/`: External system integrations and framework-specific implementations (Infrastructure Layer).

## Simple Example

1. Root Folder Structure

```
my-app/
├── public/                     # Static assets
├── src/                        # Source code directory
│   ├── domain/                 # Core business logic (Domain Layer)
│   ├── actions/                # Application-specific business rules (Application Layer)
│   ├── interfaces/             # Adapters (UI, API, etc.) (Adapters Layer)
│   └── infrastructure/         # Frameworks, APIs, and utilities (Infrastructure Layer)
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

2. Detailed src Folder Structure

```
src/
├── domain/
│   ├── models/             # Data models (e.g., User, Product)
│   └── interfaces/         # Interfaces for models and repositories
├── actions/
│   ├── userActions.ts       # Actions related to User management
│   └── authActions.ts       # Actions related to Authentication
├── interfaces/
│   ├── controllers/         # Controllers managing inputs/outputs
│   ├── ui/                  # UI components, pages, and layouts
│   ├── hooks/               # React hooks for state and side effects
│   └── api/                 # API implementations (e.g., REST, GraphQL)
├── infrastructure/
│   ├── api/                 # API clients and services
│   ├── redux/               # Redux setup and store
│   ├── context/             # Context API providers
│   ├── tailwind/            # Tailwind CSS configurations
│   ├── storybook/           # Storybook configuration and stories
│   └── vitest/              # Vitest configurations and tests

```

## Real-case example

1. Root src Folder Structure

```
src/
├── core/                   # Core business logic and shared utilities
├── features/               # Specialized features
│   ├── qr-code/            # QR Code specific feature
│   │   ├── domain/         # Domain logic specific to QR Code
│   │   ├── actions/        # Application logic for QR Code
│   │   ├── interfaces/     # Adapters (UI components, controllers) for QR Code
│   │   └── infrastructure/ # Infrastructure for QR Code feature (API, etc.)
│   ├── ai/                 # AI specific feature
│   │   ├── domain/
│   │   ├── actions/
│   │   ├── interfaces/
│   │   └── infrastructure/
│   ├── tree-family/        # Tree Family specific feature
│   │   ├── domain/
│   │   ├── actions/
│   │   ├── interfaces/
│   │   └── infrastructure/
│   ├── landing-page/       # Landing Page feature
│   │   ├── domain/
│   │   ├── actions/
│   │   ├── interfaces/
│   │   └── infrastructure/
└── infrastructure/         # Shared infrastructure components (e.g., global API configs, shared services)
```

2. Feature-Specific Folder Example (qr-code):

```
src/
└── features/
    └── qr-code/
        ├── domain/              # Core models and entities for QR Code feature
        │   └── QRCode.ts        # QR Code specific entity/model
        ├── actions/             # Use cases or business logic specific to QR Code
        │   └── scanQRCode.ts    # Example action for scanning QR Codes
        ├── interfaces/          # Adapters for UI, API, or other external interactions
        │   ├── controllers/     # Controllers handling input/output for QR Code
        │   ├── ui/              # UI components (React components) for QR Code
        │   │   └── QRScanner.tsx # QR Code scanner component
        │   └── api/             # API service implementations for QR Code feature
        └── infrastructure/      # Feature-specific infrastructure like API configurations or utilities
            └── apiClient.ts     # QR Code API client
```

3. Shared Infrastructure Folder Example:

```
src/
└── infrastructure/
    ├── api/                     # Global API configurations and base clients
    │   └── axiosInstance.ts     # Example Axios configuration
    ├── redux/                   # Redux setup and store configuration
    ├── context/                 # Global Context API providers
    ├── tailwind/                # Global Tailwind CSS configurations
    └── utils/                   # Shared utilities and helpers
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
