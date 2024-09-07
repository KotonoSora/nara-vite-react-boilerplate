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
    - images/
      - logo_small.png
      - background_image.jpg
    - icons/
      - icon_menu.svg
      - icon_calendar.svg

  - core/
    - domain/
      - entities/
        - user.ts
        - auth.ts
      - interfaces/
        - iUserRepository.ts
        - iAuthService.ts
      - use-cases/
        - authenticateUser.ts
        - registerUser.ts

    - infrastructure/
      - repositories/
        - userRepository.ts
      - services/
        - authService.ts
      - providers/
        - apiProvider.ts

    - application/
      - services/
        - userService.ts
      - mappers/
        - userMapper.ts

    - presentation/
      - components/
        - appShell/
          - header.tsx
          - sidebar.tsx
        - layout/
          - pageContainer.tsx
      - hooks/
        - useAuth.ts
      - pages/
        - home/
          - homePage.tsx
        - login/
          - loginPage.tsx

  - features/
    - auth/
      - domain/
        - entities/
          - user.ts
        - use-cases/
          - login.ts
          - logout.ts

      - infrastructure/
        - services/
          - authService.ts
        - repositories/
          - authRepository.ts

      - application/
        - services/
          - authFacade.ts

      - presentation/
        - components/
          - loginForm.tsx
        - hooks/
          - useAuth.ts
        - pages/
          - loginPage.tsx

    - billing/
      - domain/
        - entities/
          - invoice.ts
        - use-cases/
          - createInvoice.ts
          - getBillingInfo.ts

      - infrastructure/
        - services/
          - billingService.ts
        - repositories/
          - billingRepository.ts

      - application/
        - services/
          - billingFacade.ts

      - presentation/
        - components/
          - billingInfo.tsx
        - pages/
          - billingPage.tsx

    - calendar/
      - domain/
        - entities/
          - event.ts
        - use-cases/
          - createEvent.ts
          - getEvents.ts

      - infrastructure/
        - repositories/
          - calendarRepository.ts

      - application/
        - services/
          - calendarService.ts

      - presentation/
        - components/
          - calendarView.tsx
        - pages/
          - calendarPage.tsx

    - notification-center/
      - domain/
        - entities/
          - notification.ts
        - use-cases/
          - sendNotification.ts
          - getNotifications.ts

      - infrastructure/
        - services/
          - notificationService.ts
        - repositories/
          - notificationRepository.ts

      - application/
        - services/
          - notificationFacade.ts

      - presentation/
        - components/
          - notificationList.tsx
        - pages/
          - notificationPage.tsx

    - tools/
      - qr-scan/
        - domain/
          - entities/
            - qrCode.ts
          - use-cases/
            - scanQRCode.ts
        - infrastructure/
          - services/
            - qrScanner.ts
        - presentation/
          - components/
            - qrScannerComponent.tsx

    - progress-photo/
      - domain/
        - entities/
          - photo.ts
        - use-cases/
          - uploadPhoto.ts
        - infrastructure/
          - repositories/
            - photoRepository.ts
        - presentation/
          - components/
            - photoGallery.tsx

  - main.tsx
  - vite-env.d.ts

- index.html
- vite.config.ts
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- tailwind.config.js
- package.json
- yarn.lock
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
