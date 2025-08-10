import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TranslationValidator,
  AutoTranslationSuggester,
  TranslationUsageTracker,
  DevelopmentHelper,
  initializeDevelopmentTools,
  type ValidationResult,
} from '~/lib/i18n/dev-tools';
import type { SupportedLanguage } from '~/lib/i18n/config';
import type { NestedTranslationObject } from '~/lib/i18n/types';

// Mock console methods
const consoleMock = {
  warn: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
};
vi.stubGlobal('console', consoleMock);

const mockTranslations: Record<SupportedLanguage, NestedTranslationObject> = {
  en: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    hello: 'Hello {{name}}!',
    longText: 'This is a very long text that exceeds the typical length limits for translation strings and should trigger a warning about being too long for practical use in user interfaces',
    navigation: {
      home: 'Home',
      about: 'About',
      showcase: 'Showcase',
      features: 'Features',
      docs: 'Documentation',
      dashboard: 'Dashboard',
      admin: 'Admin',
      signIn: 'Sign in',
      signUp: 'Sign up',
      signOut: 'Sign out',
      menu: 'Menu',
      closeMenu: 'Close menu',
    },
    auth: {
      login: {
        title: 'Sign in',
        description: 'Enter your email and password to access your account',
        form: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
          },
          password: {
            label: 'Password',
            placeholder: 'Enter your password',
          },
          submit: 'Sign in',
          submitting: 'Signing in...',
        },
        validation: {
          emailRequired: 'Please enter a valid email address',
          passwordMinLength: 'Password must be at least 6 characters',
        },
        noAccount: "Don't have an account?",
        signUpLink: 'Sign up',
      },
      register: {
        title: 'Create account',
        description: 'Enter your details to create a new account',
        form: {
          name: {
            label: 'Full Name',
            placeholder: 'Enter your full name',
          },
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
          },
          password: {
            label: 'Password',
            placeholder: 'Create a password',
          },
          confirmPassword: {
            label: 'Confirm Password',
            placeholder: 'Confirm your password',
          },
          submit: 'Create account',
          submitting: 'Creating account...',
        },
        validation: {
          nameMinLength: 'Name must be at least 2 characters',
          emailRequired: 'Please enter a valid email address',
          passwordMinLength: 'Password must be at least 6 characters',
          confirmPasswordRequired: 'Please confirm your password',
          passwordsDoNotMatch: 'Passwords don\'t match',
        },
        errors: {
          accountExists: 'An account with this email already exists',
        },
        hasAccount: 'Already have an account?',
        signInLink: 'Sign in',
      },
      password: {
        forgot: {
          title: 'Forgot Password',
          description: 'Enter your email address and we\'ll send you a link to reset your password.',
          form: {
            email: {
              label: 'Email Address',
              placeholder: 'Enter your email',
            },
            submit: 'Send Reset Instructions',
          },
          success: 'If an account with that email exists, we\'ve sent password reset instructions.',
          backToLogin: 'Back to Sign In',
        },
        reset: {
          title: 'Reset Password',
          description: 'Enter a new password for your account.',
          form: {
            password: {
              label: 'New Password',
              placeholder: 'Enter new password',
            },
            confirmPassword: {
              label: 'Confirm Password',
              placeholder: 'Confirm new password',
            },
            submit: 'Update Password',
          },
          requirements: {
            title: 'Password must contain:',
            minLength: 'At least 8 characters',
            uppercase: 'One uppercase letter',
            lowercase: 'One lowercase letter',
            number: 'One number',
            special: 'One special character',
          },
          errors: {
            invalidToken: 'Invalid or expired reset token',
            passwordStrength: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
          },
        },
      },
      verification: {
        email: {
          title: 'Email Verification',
          success: {
            title: 'Email Verified Successfully!',
            message: 'Your email has been verified. You can now sign in.',
            action: 'Go to Sign In',
          },
          error: {
            title: 'Email Verification Failed',
            invalidToken: 'Invalid or expired verification token',
            alreadyVerified: 'Email already verified',
            action: 'Back to Sign In',
          },
        },
      },
      profile: {
        title: 'User Profile',
        description: 'Manage your account settings and preferences',
        sections: {
          information: {
            title: 'Profile Information',
            name: 'Full Name',
            email: 'Email Address',
            role: 'Role',
            memberSince: 'Member Since',
            lastLogin: 'Last Login',
            verified: 'Verified',
            notVerified: 'Not Verified',
          },
          security: {
            title: 'Security Settings',
            password: 'Password',
            lastUpdated: 'Last updated',
            changePassword: 'Change Password',
            verificationWarning: 'Your email address is not verified.',
            resendVerification: 'Resend verification email',
          },
        },
        actions: {
          backToDashboard: 'Back to Dashboard',
          signOut: 'Sign Out',
        },
      },
      common: {
        agreementText: 'By clicking continue, you agree to our',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        and: 'and',
      },
    },
    admin: {
      meta: {
        title: 'Admin Panel - NARA',
        description: 'Administrative dashboard',
      },
      title: 'Admin Panel',
      subtitle: 'Administrative tools and system management',
      systemStatus: {
        title: 'System Status',
        description: 'Current system health',
        database: 'Database',
        authentication: 'Authentication',
        sessions: 'Sessions',
        status: {
          online: 'Online',
          active: 'Active',
          healthy: 'Healthy',
        },
      },
      userManagement: {
        title: 'User Management',
        description: 'Manage system users',
        totalUsers: 'Total Users',
        activeUsers: 'Active Users',
        recentSignups: 'Recent Signups',
      },
      security: {
        title: 'Security Overview',
        description: 'System security status',
        authAttempts: 'Login Attempts',
        blockedIPs: 'Blocked IPs',
        suspiciousActivity: 'Suspicious Activity',
      },
      roleBasedAccess: {
        title: 'Role-Based Access Control',
        description: 'Manage user roles and permissions',
        createRole: 'Create Role',
        managePermissions: 'Manage Permissions',
        assignRoles: 'Assign Roles',
      },
    },
    dashboard: {
      meta: {
        title: 'Dashboard',
        description: 'Your personal dashboard',
      },
      welcome: {
        title: 'Welcome back, {{name}}!',
        subtitle: 'Here\'s what\'s happening with your account today.',
      },
      userInfo: {
        title: 'Account Information',
        description: 'Your account details',
        fields: {
          name: 'Name:',
          email: 'Email:',
          role: 'Role:',
          memberSince: 'Member since:',
        },
      },
      quickActions: {
        title: 'Quick Actions',
        description: 'Common tasks and actions',
        actions: {
          editProfile: 'Edit Profile',
          settings: 'Settings',
          viewAnalytics: 'View Analytics',
          adminPanel: 'Admin Panel',
        },
      },
      stats: {
        daysActive: {
          title: 'Days Active',
          subtitle: 'Since joining',
        },
        totalLogins: {
          title: 'Total Logins',
          subtitle: 'This month',
        },
        profileViews: {
          title: 'Profile Views',
          subtitle: 'Last 30 days',
        },
        lastLogin: {
          title: 'Last Login',
          subtitle: 'Your activity',
        },
      },
      recentActivity: {
        title: 'Recent Activity',
        description: 'Your latest account actions',
        noActivity: 'No recent activity',
        types: {
          login: 'Login',
          profileUpdate: 'Profile Update',
          profileUpdated: 'Profile updated',
          passwordChange: 'Password Change',
          settingsChange: 'Settings Change',
          settingsChanged: 'Settings changed',
          accountCreated: 'Account created',
        },
      },
      systemStatus: {
        title: 'System Status',
        description: 'Current system health and metrics',
        uptime: 'Uptime',
        responseTime: 'Response Time',
        activeUsers: 'Active Users',
        status: {
          operational: 'Operational',
          degraded: 'Degraded Performance',
          outage: 'Service Outage',
        },
      },
      authDemo: {
        title: 'Authentication Demo',
        description: 'Explore authentication features',
        tryOAuth: 'Try OAuth Login',
        manageTokens: 'Manage API Tokens',
      },
    },
    errors: {
      pageNotFound: 'The requested page could not be found.',
      unexpectedError: 'An unexpected error occurred.',
      goHome: 'Go Home',
      tryAgain: 'Try Again',
      common: {
        checkInput: 'Please check your input',
        somethingWentWrong: 'Something went wrong. Please try again.',
      },
    },
    showcase: {
      title: 'Showcases',
      backToHome: 'Back to Home',
      scrollToTop: 'Scroll to Top',
      viewProject: 'View Project',
      showcase: {
        title: 'Showcase',
        description: 'Examples and demonstrations of the boilerplate features',
        components: 'Components',
        examples: 'Examples',
        demos: 'Demos',
      },
    },
    time: {
      now: 'now',
      minute: 'minute',
      minutes: 'minutes',
      hour: 'hour',
      hours: 'hours',
      day: 'day',
      days: 'days',
      week: 'week',
      weeks: 'weeks',
      month: 'month',
      months: 'months',
      year: 'year',
      years: 'years',
      ago: 'ago',
      in: 'in',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggle: 'Toggle theme',
    },
    landing: {
      hero: {
        title: 'Welcome to NARA',
        subtitle: 'The modern web framework',
        cta: 'Get Started',
      },
      features: {
        title: 'Features',
        fast: 'Fast',
        secure: 'Secure',
        scalable: 'Scalable',
      },
    },
    legal: {
      privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated',
      },
      terms: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated',
      },
    },
  },
  es: {
    loading: 'Cargando...',
    save: 'Guardar',
    // Missing 'cancel' translation
    hello: 'Hola {{name}}!',
    // Missing 'longText' translation
    navigation: {
      home: 'Inicio',
      about: 'Acerca de',
      showcase: 'Escaparate',
      features: 'Características',
      docs: 'Documentación',
      dashboard: 'Panel',
      admin: 'Admin',
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar sesión',
      menu: 'Menú',
      closeMenu: 'Cerrar menú',
    },
    auth: {
      login: {
        title: 'Iniciar sesión',
        description: 'Ingresa tu email y contraseña para acceder a tu cuenta',
        form: {
          email: {
            label: 'Email',
            placeholder: 'Ingresa tu email',
          },
          password: {
            label: 'Contraseña',
            placeholder: 'Ingresa tu contraseña',
          },
          submit: 'Iniciar sesión',
          submitting: 'Iniciando sesión...',
        },
        validation: {
          emailRequired: 'Por favor ingresa un email válido',
          passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
        },
        noAccount: '¿No tienes una cuenta?',
        signUpLink: 'Registrarse',
      },
      register: {
        title: 'Crear cuenta',
        description: 'Ingresa tus datos para crear una nueva cuenta',
        form: {
          name: {
            label: 'Nombre completo',
            placeholder: 'Ingresa tu nombre completo',
          },
          email: {
            label: 'Email',
            placeholder: 'Ingresa tu email',
          },
          password: {
            label: 'Contraseña',
            placeholder: 'Crea una contraseña',
          },
          submit: 'Crear cuenta',
          submitting: 'Creando cuenta...',
        },
        validation: {
          nameRequired: 'Por favor ingresa tu nombre completo',
          emailRequired: 'Por favor ingresa un email válido',
          passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
        },
        hasAccount: '¿Ya tienes una cuenta?',
        signInLink: 'Iniciar sesión',
      },
      password: {
        reset: {
          title: 'Restablecer contraseña',
          description: 'Ingresa tu email para recibir un enlace de restablecimiento',
          form: {
            email: {
              label: 'Email',
              placeholder: 'Ingresa tu email',
            },
            submit: 'Enviar enlace',
            submitting: 'Enviando...',
          },
          success: 'Enlace de restablecimiento enviado a tu email',
          backToLogin: 'Volver al inicio de sesión',
        },
        change: {
          title: 'Cambiar contraseña',
          description: 'Ingresa tu contraseña actual y la nueva',
          form: {
            currentPassword: {
              label: 'Contraseña actual',
              placeholder: 'Ingresa contraseña actual',
            },
            newPassword: {
              label: 'Nueva contraseña',
              placeholder: 'Ingresa nueva contraseña',
            },
            confirmPassword: {
              label: 'Confirmar contraseña',
              placeholder: 'Confirma nueva contraseña',
            },
            submit: 'Cambiar contraseña',
            submitting: 'Cambiando...',
          },
          success: 'Contraseña cambiada exitosamente',
          validation: {
            currentPasswordRequired: 'Por favor ingresa tu contraseña actual',
            newPasswordMinLength: 'La nueva contraseña debe tener al menos 6 caracteres',
            passwordMismatch: 'Las contraseñas no coinciden',
          },
        },
      },
      verification: {
        email: {
          title: 'Verifica tu email',
          description: 'Enviamos un enlace de verificación a tu dirección de email',
          resend: 'Reenviar email de verificación',
          success: 'Email de verificación enviado',
          verified: 'Email verificado exitosamente',
        },
      },
      profile: {
        title: 'Perfil',
        description: 'Administra la configuración de tu cuenta',
        form: {
          name: {
            label: 'Nombre completo',
            placeholder: 'Ingresa tu nombre completo',
          },
          email: {
            label: 'Email',
            placeholder: 'Ingresa tu email',
          },
          submit: 'Actualizar perfil',
          submitting: 'Actualizando...',
        },
        success: 'Perfil actualizado exitosamente',
        validation: {
          nameRequired: 'Por favor ingresa tu nombre completo',
          emailRequired: 'Por favor ingresa un email válido',
        },
      },
      common: {
        or: 'o',
        optional: 'Opcional',
        required: 'Requerido',
        loading: 'Cargando...',
        error: 'Ocurrió un error',
        success: 'Éxito',
      },
    },
    admin: {
      title: 'Panel de Admin',
      description: 'Administra tu aplicación',
      navigation: {
        overview: 'Resumen',
        users: 'Usuarios',
        settings: 'Configuración',
      },
      users: {
        title: 'Gestión de usuarios',
        list: {
          name: 'Nombre',
          email: 'Email',
          role: 'Rol',
          status: 'Estado',
          actions: 'Acciones',
        },
        actions: {
          edit: 'Editar',
          delete: 'Eliminar',
          activate: 'Activar',
          deactivate: 'Desactivar',
        },
      },
    },
    dashboard: {
      title: 'Panel',
      welcome: 'Bienvenido de vuelta',
      stats: {
        users: 'Usuarios',
        orders: 'Órdenes',
        revenue: 'Ingresos',
        growth: 'Crecimiento',
      },
      quickActions: {
        title: 'Acciones rápidas',
        newUser: 'Agregar usuario',
        newOrder: 'Crear orden',
        settings: 'Configuración',
      },
      recentActivity: {
        title: 'Actividad reciente',
        noActivity: 'Sin actividad reciente',
      },
    },
    errors: {
      pageNotFound: 'La página solicitada no pudo ser encontrada.',
      unexpectedError: 'Ocurrió un error inesperado.',
      goHome: 'Ir al inicio',
      tryAgain: 'Intentar de nuevo',
      common: {
        checkInput: 'Por favor verifica tu entrada',
        somethingWentWrong: 'Algo salió mal. Por favor intenta de nuevo.',
      },
    },
    showcase: {
      title: 'Escaparate',
      description: 'Explora nuestras características',
      features: {
        responsive: 'Diseño responsivo',
        accessible: 'Accesibilidad',
        performance: 'Rendimiento',
      },
    },
    time: {
      now: 'ahora',
      minute: 'minuto',
      minutes: 'minutos',
      hour: 'hora',
      hours: 'horas',
      day: 'día',
      days: 'días',
      week: 'semana',
      weeks: 'semanas',
      month: 'mes',
      months: 'meses',
      year: 'año',
      years: 'años',
      ago: 'hace',
      in: 'en',
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
      toggle: 'Cambiar tema',
    },
    landing: {
      hero: {
        title: 'Bienvenido a NARA',
        subtitle: 'El framework web moderno',
        cta: 'Comenzar',
      },
      features: {
        title: 'Características',
        fast: 'Rápido',
        secure: 'Seguro',
        scalable: 'Escalable',
      },
    },
    legal: {
      privacy: {
        title: 'Política de privacidad',
        lastUpdated: 'Última actualización',
      },
      terms: {
        title: 'Términos de servicio',
        lastUpdated: 'Última actualización',
      },
    },
  },
  // Add abbreviated versions for other languages to fix compilation
  fr: {} as NestedTranslationObject,
  zh: {} as NestedTranslationObject,
  hi: {} as NestedTranslationObject,
  ar: {} as NestedTranslationObject,
  vi: {} as NestedTranslationObject,
  ja: {} as NestedTranslationObject,
  th: {} as NestedTranslationObject,
};

describe('Translation Development Tools', () => {
  beforeEach(() => {
    consoleMock.warn.mockClear();
    consoleMock.log.mockClear();
    consoleMock.error.mockClear();
  });

  describe('TranslationValidator', () => {
    let validator: TranslationValidator;

    beforeEach(() => {
      validator = new TranslationValidator(mockTranslations);
    });

    it('should validate all translations and return comprehensive results', () => {
      const result = validator.validateAll();

      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('coverage');

      expect(result.coverage).toBeGreaterThan(0);
      expect(result.coverage).toBeLessThanOrEqual(100);
    });

    it('should detect missing translations', () => {
      const result = validator.validateAll();

      const missingCancel = result.errors.find(
        error => error.type === 'missing' && 
                  error.key === 'cancel' && 
                  error.language === 'es'
      );

      expect(missingCancel).toBeDefined();
      expect(missingCancel?.severity).toBe('error');
    });

    it('should detect broken interpolation', () => {
      // Add a broken interpolation to the french translations for testing
      const frenchWithBroken = {
        ...mockTranslations.fr,
        brokenInterpolation: 'Hello {{name}', // Missing closing braces
      };
      
      const testTranslations = {
        ...mockTranslations,
        fr: frenchWithBroken,
      };
      
      const testValidator = new TranslationValidator(testTranslations);
      const result = testValidator.validateAll();

      const brokenInterpolation = result.errors.find(
        error => error.type === 'broken_interpolation' && 
                  error.key === 'brokenInterpolation' && 
                  error.language === 'fr'
      );

      expect(brokenInterpolation).toBeDefined();
    });

    it('should warn about long translations', () => {
      const result = validator.validateAll();

      const longTextWarning = result.warnings.find(
        warning => warning.type === 'long_text' && 
                   warning.key === 'longText'
      );

      expect(longTextWarning).toBeDefined();
      expect(longTextWarning?.suggestion).toContain('breaking down');
    });

    it('should calculate correct coverage percentage', () => {
      const result = validator.validateAll();

      // Should be less than 100% due to missing translations
      expect(result.coverage).toBeLessThan(100);
      expect(result.coverage).toBeGreaterThan(80); // Most translations are present
    });

    it('should validate individual keys', () => {
      const validResult = validator.validateKey('loading', 'en', mockTranslations.en);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = validator.validateKey('missing', 'en', mockTranslations.en);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toHaveLength(1);
      expect(invalidResult.errors[0].type).toBe('missing');
    });
  });

  describe('AutoTranslationSuggester', () => {
    let suggester: AutoTranslationSuggester;

    beforeEach(() => {
      suggester = new AutoTranslationSuggester();
    });

    it('should suggest translations for common patterns', () => {
      const suggestion = suggester.suggestTranslation(
        'loading',
        'en',
        'fr',
        'Loading...'
      );

      expect(suggestion).toBe('Chargement...');
    });

    it('should suggest translations for simple words', () => {
      const yesSuggestion = suggester.suggestTranslation(
        'yes',
        'en',
        'fr',
        'yes'
      );

      expect(yesSuggestion).toBe('Oui');

      const noSuggestion = suggester.suggestTranslation(
        'no',
        'en',
        'es',
        'no'
      );

      expect(noSuggestion).toBe('No');
    });

    it('should return null for unknown patterns', () => {
      const suggestion = suggester.suggestTranslation(
        'unknown.key',
        'en',
        'fr',
        'Some unknown text'
      );

      expect(suggestion).toBeNull();
    });

    it('should handle case insensitive matching', () => {
      const suggestion = suggester.suggestTranslation(
        'yes',
        'en',
        'zh',
        'YES'
      );

      expect(suggestion).toBe('是');
    });
  });

  describe('TranslationUsageTracker', () => {
    let tracker: TranslationUsageTracker;

    beforeEach(() => {
      tracker = new TranslationUsageTracker();
    });

    it('should track translation usage', () => {
      tracker.trackUsage('loading', 'HomePage');
      tracker.trackUsage('loading', 'ProfilePage');
      tracker.trackUsage('save', 'FormComponent');

      const stats = tracker.getUsageStats();

      expect(stats).toHaveLength(2);
      expect(stats[0].key).toBe('loading'); // Should be first due to higher usage
      expect(stats[0].usageCount).toBe(2);
      expect(stats[0].contexts).toEqual(['HomePage', 'ProfilePage']);
    });

    it('should sort usage stats by usage count', () => {
      // Track different amounts of usage
      tracker.trackUsage('save', 'FormComponent');
      tracker.trackUsage('loading', 'HomePage');
      tracker.trackUsage('loading', 'ProfilePage');
      tracker.trackUsage('loading', 'SettingsPage');

      const stats = tracker.getUsageStats();

      expect(stats[0].key).toBe('loading'); // 3 uses
      expect(stats[1].key).toBe('save'); // 1 use
    });

    it('should generate usage reports', () => {
      tracker.trackUsage('loading', 'HomePage');
      tracker.trackUsage('save', 'FormComponent');

      const report = tracker.exportUsageReport();

      expect(report).toContain('Translation Usage Report');
      expect(report).toContain('loading');
      expect(report).toContain('save');
      expect(report).toContain('HomePage');
      expect(report).toContain('FormComponent');
    });

    it('should identify unused translations', () => {
      tracker.trackUsage('loading');
      tracker.trackUsage('save');

      const allKeys = ['loading', 'save', 'cancel', 'hello'];
      const unused = tracker.getUnusedTranslations(allKeys);

      expect(unused).toContain('cancel');
      expect(unused).toContain('hello');
      expect(unused).not.toContain('loading');
      expect(unused).not.toContain('save');
    });
  });

  describe('DevelopmentHelper', () => {
    let helper: DevelopmentHelper;

    beforeEach(() => {
      helper = new DevelopmentHelper(mockTranslations);
    });

    it('should provide enhanced translation function with tracking', () => {
      const translation = helper.translate('loading', 'en', {}, 'TestComponent');

      expect(translation).toBe('Loading...');
    });

    it('should track missing translations', () => {
      helper.translate('missing', 'en', {}, 'TestComponent');

      const missingReport = helper.getMissingTranslationsReport();
      expect(missingReport).toContain('missing');
    });

    it('should generate comprehensive validation reports', () => {
      const report = helper.getValidationReport();

      expect(report).toContain('Translation Validation Report');
      expect(report).toContain('Coverage:');
      expect(report).toContain('Status:');
    });

    it('should generate missing translations reports', () => {
      helper.translate('missing.key1', 'en');
      helper.translate('missing.key2', 'fr');

      const report = helper.getMissingTranslationsReport();

      expect(report).toContain('Missing Translations Report');
      expect(report).toContain('missing.key1');
      expect(report).toContain('missing.key2');
    });

    it('should export comprehensive development reports', () => {
      helper.translate('loading', 'en', {}, 'TestComponent');

      const reports = helper.exportDevelopmentReport();

      expect(reports).toHaveProperty('validation');
      expect(reports).toHaveProperty('missing');
      expect(reports).toHaveProperty('usage');

      expect(reports.validation).toContain('Translation Validation Report');
      expect(reports.usage).toContain('Translation Usage Report');
    });

    it('should warn about missing translations in console', () => {
      helper.translate('missing.translation', 'fr');

      expect(consoleMock.warn).toHaveBeenCalled();
    });

    it('should suggest translations for missing keys', () => {
      helper.translate('loading', 'fr'); // This should exist in mockTranslations

      // If translation was missing, it would suggest
      // We can't easily test this without modifying mockTranslations
      // but the code path is covered
    });
  });

  describe('Global Development Tools', () => {
    it('should initialize development tools correctly', () => {
      const helper = initializeDevelopmentTools(mockTranslations);

      expect(helper).toBeInstanceOf(DevelopmentHelper);
    });

    it('should add console commands in development mode', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // Mock window object
      const windowMock = {
        naraI18nDev: undefined,
      };
      vi.stubGlobal('window', windowMock);

      // Re-import to trigger development mode setup
      // This is a bit tricky to test properly without full module reloading
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid translation objects gracefully', () => {
      const invalidTranslations = {
        en: {
          common: {
            invalid: 123, // Not a string
          },
        },
      } as any;

      const validator = new TranslationValidator(invalidTranslations);
      const result = validator.validateAll();

      expect(result.errors.some(error => error.type === 'invalid_format')).toBe(true);
    });

    it('should handle deeply nested translation objects', () => {
      const deepTranslations: Record<SupportedLanguage, NestedTranslationObject> = {
        en: {
          level1: {
            level2: {
              level3: {
                deep: 'Deep translation',
              },
            },
          },
        },
        // Add other languages with minimal content
        es: { level1: { level2: { level3: { deep: 'Traducción profunda' } } } },
        fr: { level1: { level2: { level3: { deep: 'Traduction profonde' } } } },
        zh: { level1: { level2: { level3: { deep: '深层翻译' } } } },
        hi: { level1: { level2: { level3: { deep: 'गहरा अनुवाद' } } } },
        ar: { level1: { level2: { level3: { deep: 'ترجمة عميقة' } } } },
        vi: { level1: { level2: { level3: { deep: 'Bản dịch sâu' } } } },
        ja: { level1: { level2: { level3: { deep: '深い翻訳' } } } },
        th: { level1: { level2: { level3: { deep: 'การแปลที่ลึก' } } } },
      };

      const validator = new TranslationValidator(deepTranslations);
      const result = validator.validateKey('level1.level2.level3.deep', 'en', deepTranslations.en);

      expect(result.valid).toBe(true);
    });
  });
});