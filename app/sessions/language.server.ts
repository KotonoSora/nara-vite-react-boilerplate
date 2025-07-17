import { createCookieSessionStorage } from 'react-router';
import type { SupportedLanguage } from '~/lib/i18n';
import { DEFAULT_LANGUAGE, isSupportedLanguage } from '~/lib/i18n';

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: '__nara_language',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
    secrets: ['language-session-secret'], // In production, use environment variable
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getLanguageSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return {
    getLanguage(): SupportedLanguage {
      const language = session.get('language');
      return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
    },
    setLanguage(language: SupportedLanguage) {
      session.set('language', language);
    },
    commit() {
      return commitSession(session);
    },
  };
}