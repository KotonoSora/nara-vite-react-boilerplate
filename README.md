# @kotonosora/nara-vite-react-boilerplate

## Folder Structure

### Knowledge

1. [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Rule

```bash
- public/
  - favicon.ico
  - logo.png

- src/
  - assets/
    - icons/
      - logo.svg
    - images/
      - background_image.jpg

  - core/
    - domain/
      - entities/
        - user.ts
        - billing.ts
      - value-objects/
        - email.ts
        - money.ts
      - repositories/
        - user-repository.ts
        - billing-repository.ts
      - services/
        - auth-service.ts
        - billing-service.ts

    - infrastructure/
      - providers/
        - force-upgrade-version.ts
      - routing/
        - application-router-provider.tsx
      - persistence/
        - database.ts
      - shadcn-ui/
        - app/
          - ui/
        - components/
        - lib/
          - utils.ts
        - hooks/
      - tailwind/
        - global.css

    - presentation/
      - components/
        - app.tsx
        - layout.tsx
        - header.tsx
        - footer.tsx
      - hooks/
        - use-auth.ts
        - use-billing.ts
      - routes/
        - app-routes.tsx
      - pages/
        - home-page.tsx
        - login-page.tsx
        - dashboard-page.tsx

    - application/
      - use-cases/
        - login-user.ts
        - generate-billing.ts

  - features/
    - auth/
      - domain/
        - entities/
          - auth-token.ts
        - repositories/
          - auth-repository.ts
        - services/
          - auth-service.ts
      - infrastructure/
        - persistence/
          - auth-local-storage.ts
      - presentation/
        - components/
          - auth-provider.tsx
        - hooks/
          - use-auth-context.ts
        - routes/
          - auth-router.tsx
      - application/
        - use-cases/
          - login.ts

    - billing/
      - domain/
        - entities/
          - invoice.ts
        - repositories/
          - invoice-repository.ts
        - services/
          - invoice-service.ts
      - infrastructure/
        - persistence/
          - invoice-api.ts
      - presentation/
        - components/
          - billing-provider.tsx
        - hooks/
          - use-invoice.ts
        - routes/
          - billing-router.tsx
      - application/
        - use-cases/
          - generate-invoice.ts

    - calendar/
      - domain/
        - entities/
          - event.ts
        - repositories/
          - event-repository.ts
      - infrastructure/
        - persistence/
          - calendar-api.ts
      - presentation/
        - components/
          - calendar-provider.tsx
        - hooks/
          - use-calendar.ts
        - routes/
          - calendar-router.tsx
      - application/
        - use-cases/
          - create-event.ts

    - qr-scan/
      - domain/
        - entities/
          - qr-code.ts
        - repositories/
          - qr-code-repository.ts
      - infrastructure/
        - services/
          - qr-scanner-service.ts
      - presentation/
        - components/
          - qr-scanner.tsx
        - hooks/
          - use-qr-scanner.ts
      - application/
        - use-cases/
          - scan-qr-code.ts

    - finance/
      - domain/
        - entities/
          - transaction.ts
        - repositories/
          - transaction-repository.ts
      - infrastructure/
        - persistence/
          - finance-api.ts
      - presentation/
        - components/
          - finance-provider.tsx
        - hooks/
          - use-finance.ts
      - application/
        - use-cases/
          - calculate-budget.ts

    - tools/
      - domain/
        - entities/
          - tool.ts
      - infrastructure/
        - persistence/
          - tool-api.ts
      - presentation/
        - components/
          - tool-list.tsx
        - hooks/
          - use-tools.ts
      - application/
        - use-cases/
          - fetch-tools.ts

    - inbox/
      - domain/
        - entities/
          - message.ts
        - repositories/
          - inbox-repository.ts
      - infrastructure/
        - persistence/
          - inbox-api.ts
      - presentation/
        - components/
          - inbox.tsx
        - hooks/
          - use-inbox.ts
      - application/
        - use-cases/
          - fetch-messages.ts

    - notification-center/
      - domain/
        - entities/
          - notification.ts
        - repositories/
          - notification-repository.ts
      - infrastructure/
        - persistence/
          - notification-api.ts
      - presentation/
        - components/
          - notification-list.tsx
        - hooks/
          - use-notifications.ts
      - application/
        - use-cases/
          - send-notification.ts

    - resources/
      - domain/
        - entities/
          - resource.ts
      - infrastructure/
        - persistence/
          - resource-api.ts
      - presentation/
        - components/
          - resource-list.tsx
        - hooks/
          - use-resources.ts
      - application/
        - use-cases/
          - fetch-resources.ts

    - progress-photo/
      - domain/
        - entities/
          - photo.ts
        - repositories/
          - photo-repository.ts
      - infrastructure/
        - persistence/
          - photo-api.ts
      - presentation/
        - components/
          - progress-photo.tsx
        - hooks/
          - use-progress-photo.ts
      - application/
        - use-cases/
          - upload-photo.ts

  - main.tsx

- tests/
  - unit/
    - core/
      - domain/
        - entities/
          - user-entity.test.ts
          - billing-entity.test.ts
        - valueObjects/
          - email-value-object.test.ts
          - money-value-object.test.ts
        - services/
          - auth-service.test.ts
          - billing-service.test.ts

    - features/
      - auth/
        - domain/
          - auth-token.test.ts
        - application/
          - use-cases/
            - login-user.test.ts
        - infrastructure/
          - persistence/
            - auth-local-storage.test.ts
        - presentation/
          - components/
            - auth-provider.test.ts
          - hooks/
            - use-auth-context.test.ts
      - billing/
        - application/
          - use-cases/
            - generate-invoice.test.ts

  - integration/
    - core/
      - domain/
        - services/
          - auth-service-integration.test.ts
          - billing-service-integration.test.ts
      - infrastructure/
        - persistence/
          - database-integration.test.ts

  - e2e/
    - auth/
      - login-e2e.test.ts
    - billing/
      - generate-invoice-e2e.test.ts

  - vitestGlobalSetup.ts

- index.html
- vite.config.ts
- vitest.config.ts
- playwright.config.ts
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- tailwind.config.js
- package.json
```

### Sample

```bash
src/
├── domain/
│   ├── auth/
│   │   ├── Role.js
│   │   ├── User.js
│   │   └── AuthService.js
│   ├── route/
│   │   ├── Router.js
│   │   ├── DynamicRouteHandler.js
│   │   └── RouteGuard.js
│   └── state/
│       ├── AppState.js
│       └── ErrorHandler.js
├── infrastructure/
│   ├── http/
│   │   └── BasicAuth.js
│   └── i18n/
│       └── LanguageService.js
├── application/
│   ├── useCase/
│   │   ├── InitializeRouter.js
│   │   ├── SyncStateWithURL.js
│   │   └── ValidateUserAccess.js
│   └── middleware/
│       └── ErrorHandlingMiddleware.js
└── presentation/
    ├── components/
    │   ├── ProtectedRoute.js
    │   ├── DynamicRouter.js
    │   ├── ErrorPage.js
    │   └── NotFoundPage.js
    ├── views/
    │   ├── HomePage.js
    │   ├── DashboardPage.js
    │   └── LoginPage.js
    └── routes/
        └── AppRoutes.js
```

---

## React + TypeScript + Vite

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
