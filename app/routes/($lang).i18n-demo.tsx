import type { Route } from "./+types/($lang).i18n-demo";

import { useI18n, useFormatting, usePluralization } from "~/lib/i18n";
import { LanguageSwitcher } from "~/components/language-switcher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Internationalization Demo - NARA" },
    { name: "description", content: "Demonstration of advanced i18n features" },
  ];
}

export default function I18nDemo() {
  const { t, language } = useI18n();
  const { 
    formatNumber, 
    formatCurrency, 
    formatDate, 
    formatTime, 
    formatPercentage,
    formatList,
    getRelativeTimeString 
  } = useFormatting();
  const plural = usePluralization();

  const sampleNumber = 1234567.89;
  const sampleDate = new Date();
  const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
  const fruits = ['apple', 'banana', 'cherry', 'date'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Internationalization Demo
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Experience advanced i18n features with formatting and pluralization
            </p>
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Current Language Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Language</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Language Code</label>
                <p className="mt-1 text-lg font-mono text-gray-900">{language}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <p className="mt-1 text-lg font-mono text-gray-900">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </p>
              </div>
            </div>
          </div>

          {/* Number Formatting */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Number Formatting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Regular Numbers</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Input: {sampleNumber}</label>
                    <p className="text-lg font-mono">{formatNumber(sampleNumber)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Compact: 1500000</label>
                    <p className="text-lg font-mono">{formatNumber(1500000, { notation: 'compact' })}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Currency</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Local Currency: {sampleNumber}</label>
                    <p className="text-lg font-mono">{formatCurrency(sampleNumber)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">USD: {sampleNumber}</label>
                    <p className="text-lg font-mono">{formatCurrency(sampleNumber, 'USD')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Percentages</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">0.1234 as %</label>
                    <p className="text-lg font-mono">{formatPercentage(0.1234)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">0.5 as %</label>
                    <p className="text-lg font-mono">{formatPercentage(0.5)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time Formatting */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Date & Time Formatting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Date</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Full Date</label>
                    <p className="text-lg font-mono">{formatDate(sampleDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Short Date</label>
                    <p className="text-lg font-mono">
                      {formatDate(sampleDate, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Time</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Standard Time</label>
                    <p className="text-lg font-mono">{formatTime(sampleDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">With Seconds</label>
                    <p className="text-lg font-mono">
                      {formatTime(sampleDate, { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Relative Time</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">2 hours ago</label>
                    <p className="text-lg font-mono">{getRelativeTimeString(pastDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Manual: 1 day ago</label>
                    <p className="text-lg font-mono">
                      {formatTime(new Date(), { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pluralization */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pluralization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 5, 11, 100].map((count) => (
                <div key={count} className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Count: {count}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Items:</strong> {plural('items', count)}</p>
                    <p><strong>Users:</strong> {plural('users', count)}</p>
                    <p><strong>Comments:</strong> {plural('comments', count)}</p>
                    <p><strong>Days:</strong> {plural('days', count)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* List Formatting */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">List Formatting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Conjunction (and)</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Fruits</label>
                    <p className="text-lg">{formatList(fruits)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Two items</label>
                    <p className="text-lg">{formatList(fruits.slice(0, 2))}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Disjunction (or)</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Options</label>
                    <p className="text-lg">
                      {formatList(fruits, { type: 'disjunction' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}