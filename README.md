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
        - User.ts
        - Billing.ts
      - valueObjects/
        - Email.ts
        - Money.ts
      - repositories/
        - userRepository.ts
        - billingRepository.ts
      - services/
        - authService.ts
        - billingService.ts

    - infrastructure/
      - providers/
        - forceUpgradeVersion.ts
      - routing/
        - ApplicationRouterProvider.tsx  # Quản lý điều hướng sử dụng react-router-dom và React.lazy
      - persistence/
        - database.ts         # Cấu hình database hoặc các persistent storage
      - shadcn-ui/
        - app/
          - ui/
        - components/
        - lib/
          - utils.ts
        - hooks/
      - tailwind/
        - global.css        # Các import của TailwindCSS

    - presentation/
      - components/
        - App.tsx             # Thành phần gốc của ứng dụng
        - Layout.tsx          # Layout chính của ứng dụng
        - Header.tsx
        - Footer.tsx
      - hooks/
        - useAuth.ts
        - useBilling.ts
      - routes/
        - AppRoutes.tsx       # Định nghĩa các route không phụ thuộc vào react-router-dom (nội dung logic route)
      - pages/
        - HomePage.tsx
        - LoginPage.tsx
        - DashboardPage.tsx

    - application/
      - useCases/
        - loginUser.ts        # Use case đăng nhập người dùng
        - generateBilling.ts  # Use case tạo hóa đơn

  - features/
    - auth/
      - domain/
        - entities/
          - AuthToken.ts
        - repositories/
          - authRepository.ts
        - services/
          - authService.ts
      - infrastructure/
        - persistence/
          - authLocalStorage.ts
      - presentation/
        - components/
          - AuthProvider.tsx  # High Order Component (HOC) cho Auth
        - hooks/
          - useAuthContext.ts
        - routes/
          - AuthRouter.tsx
      - application/
        - useCases/
          - login.ts

    - billing/
      - domain/
        - entities/
          - Invoice.ts
        - repositories/
          - invoiceRepository.ts
        - services/
          - invoiceService.ts
      - infrastructure/
        - persistence/
          - invoiceAPI.ts
      - presentation/
        - components/
          - BillingProvider.tsx  # High Order Component cho Billing
        - hooks/
          - useInvoice.ts
        - routes/
          - BillingRouter.tsx
      - application/
        - useCases/
          - generateInvoice.ts

    - calendar/
      - domain/
        - entities/
          - Event.ts
        - repositories/
          - eventRepository.ts
      - infrastructure/
        - persistence/
          - calendarAPI.ts
      - presentation/
        - components/
          - CalendarProvider.tsx
        - hooks/
          - useCalendar.ts
        - routes/
          - CalendarRouter.tsx
      - application/
        - useCases/
          - createEvent.ts

    - qr-scan/
      - domain/
        - entities/
          - QRCode.ts
        - repositories/
          - qrCodeRepository.ts
      - infrastructure/
        - services/
          - qrScannerService.ts
      - presentation/
        - components/
          - QRScanner.tsx
        - hooks/
          - useQRScanner.ts
      - application/
        - useCases/
          - scanQRCode.ts

    - finance/
      - domain/
        - entities/
          - Transaction.ts
        - repositories/
          - transactionRepository.ts
      - infrastructure/
        - persistence/
          - financeAPI.ts
      - presentation/
        - components/
          - FinanceProvider.tsx
        - hooks/
          - useFinance.ts
      - application/
        - useCases/
          - calculateBudget.ts

    - tools/
      - domain/
        - entities/
          - Tool.ts
      - infrastructure/
        - persistence/
          - toolAPI.ts
      - presentation/
        - components/
          - ToolList.tsx
        - hooks/
          - useTools.ts
      - application/
        - useCases/
          - fetchTools.ts

    - inbox/
      - domain/
        - entities/
          - Message.ts
        - repositories/
          - inboxRepository.ts
      - infrastructure/
        - persistence/
          - inboxAPI.ts
      - presentation/
        - components/
          - Inbox.tsx
        - hooks/
          - useInbox.ts
      - application/
        - useCases/
          - fetchMessages.ts

    - notification-center/
      - domain/
        - entities/
          - Notification.ts
        - repositories/
          - notificationRepository.ts
      - infrastructure/
        - persistence/
          - notificationAPI.ts
      - presentation/
        - components/
          - NotificationList.tsx
        - hooks/
          - useNotifications.ts
      - application/
        - useCases/
          - sendNotification.ts

    - resources/
      - domain/
        - entities/
          - Resource.ts
      - infrastructure/
        - persistence/
          - resourceAPI.ts
      - presentation/
        - components/
          - ResourceList.tsx
        - hooks/
          - useResources.ts
      - application/
        - useCases/
          - fetchResources.ts

    - progress-photo/
      - domain/
        - entities/
          - Photo.ts
        - repositories/
          - photoRepository.ts
      - infrastructure/
        - persistence/
          - photoAPI.ts
      - presentation/
        - components/
          - ProgressPhoto.tsx
        - hooks/
          - useProgressPhoto.ts
      - application/
        - useCases/
          - uploadPhoto.ts

  - main.tsx                  # Điểm bắt đầu ứng dụng

- tests/                      # Thư mục chứa tất cả các file kiểm thử
  - unit/                     # Kiểm thử đơn vị
    - core/
      - domain/
        - entities/
          - UserEntity.test.ts
          - BillingEntity.test.ts
        - valueObjects/
          - EmailValueObject.test.ts
          - MoneyValueObject.test.ts
        - services/
          - AuthService.test.ts
          - BillingService.test.ts

    - features/
      - auth/
        - domain/
          - AuthToken.test.ts
        - application/
          - useCases/
            - loginUser.test.ts
        - infrastructure/
          - persistence/
            - authLocalStorage.test.ts
        - presentation/
          - components/
            - AuthProvider.test.ts
          - hooks/
            - useAuthContext.test.ts
      - billing/
        - application/
          - useCases/
            - generateInvoice.test.ts

  - integration/                # Kiểm thử tích hợp
    - core/
      - domain/
        - services/
          - AuthServiceIntegration.test.ts
          - BillingServiceIntegration.test.ts
      - infrastructure/
        - persistence/
          - databaseIntegration.test.ts

  - e2e/                       # Kiểm thử đầu cuối
    - auth/
      - loginE2E.test.ts
    - billing/
      - generateInvoiceE2E.test.ts

  - vitestGlobalSetup.ts       # Cấu hình thiết lập cho Vitest

- index.html                   # Cấu hình trang gốc HTML
- vite.config.ts               # Cấu hình Vite.js
- vitest.config.ts             # Cấu hình Vitest
- playwright.config.ts         # Cấu hình Playwright
- tsconfig.app.json            # Cấu hình TypeScript
- tsconfig.json                # Cấu hình TypeScript
- tsconfig.node.json           # Cấu hình TypeScript
- tailwind.config.js           # Cấu hình Tailwind CSS
- package.json                 # Quản lý các package và scripts
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
