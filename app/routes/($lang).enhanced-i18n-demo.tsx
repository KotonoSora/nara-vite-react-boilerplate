import type { Route } from "./+types/($lang).enhanced-i18n-demo";
import { useEffect, useState, useCallback } from "react";
import { 
  useEnhancedI18n, 
  useCulturalFormatting, 
  useI18nAccessibility,
  useI18nPerformance,
  useLanguageDetection,
  useAdvancedTranslation,
} from "~/lib/i18n/enhanced-hooks";
import { LanguageSwitcher } from "~/components/language-switcher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enhanced Internationalization Demo - NARA" },
    { name: "description", content: "Comprehensive demonstration of enhanced i18n features" },
  ];
}

export default function EnhancedI18nDemo() {
  const { t, language, enhanced } = useEnhancedI18n();
  const cultural = useCulturalFormatting();
  const accessibility = useI18nAccessibility();
  const performance = useI18nPerformance();
  const detection = useLanguageDetection();
  const advancedTranslation = useAdvancedTranslation();
  
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState("");
  const [performanceData, setPerformanceData] = useState(performance.metrics);
  const [translationContext, setTranslationContext] = useState({
    formality: "informal" as const,
    audience: "general" as const,
    purpose: "content" as const,
  });
  const [contextualTranslations, setContextualTranslations] = useState<Record<string, string>>({});

  // Sample data for demonstrations
  const sampleAddress = {
    name: "張小明",
    street: "123 技術街",
    city: "台北市",
    state: "台北",
    postalCode: "10001",
    country: "台灣",
  };

  const sampleName = {
    first: "小明",
    last: "張",
    middle: "文",
  };

  // Voice recognition setup
  useEffect(() => {
    const voiceInput = accessibility.setupVoiceRecognition({
      onResult: (text) => {
        setVoiceResult(text);
        setIsListening(false);
      },
      onError: (error) => {
        console.error("Voice recognition error:", error);
        setIsListening(false);
      },
    });
    
    setVoiceSupported(voiceInput?.supported || false);
  }, [accessibility]);

  // Keyboard shortcuts setup
  useEffect(() => {
    const cleanup = accessibility.setupKeyboardShortcuts({
      languageSwitcher: () => {
        console.log("Language switcher activated via keyboard");
      },
      navigation: {
        home: () => console.log("Navigate to home"),
        search: () => console.log("Activate search"),
      },
    });
    
    return cleanup;
  }, [accessibility]);

  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(performance.getPerformanceMetrics());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [performance]);

  // Advanced translation context demo
  useEffect(() => {
    if (advancedTranslation.isReady) {
      advancedTranslation.setContext(translationContext);
      
      const translations = {
        greeting: advancedTranslation.translateWithContext("user.greeting", { name: "User" }),
        welcome: advancedTranslation.translateWithContext("welcome"),
        itemCount: advancedTranslation.translateWithContext("items.count", { count: 5 }),
      };
      
      setContextualTranslations(translations);
    }
  }, [advancedTranslation, translationContext]);

  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      setIsListening(false);
    } else {
      const voiceInput = accessibility.setupVoiceRecognition({
        onResult: (text) => {
          setVoiceResult(text);
          setIsListening(false);
        },
      });
      
      if (voiceInput?.supported) {
        voiceInput.start();
        setIsListening(true);
      }
    }
  }, [isListening, accessibility]);

  const handleDetectLanguage = useCallback(async () => {
    const result = await detection.detectOptimalLanguage();
    console.log("Language detection result:", result);
  }, [detection]);

  const handlePreloadLanguages = useCallback(async () => {
    await performance.preloadPredictedLanguages();
    console.log("Predicted languages preloaded");
  }, [performance]);

  const handleContextChange = useCallback((newContext: Partial<typeof translationContext>) => {
    setTranslationContext(prev => ({ ...prev, ...newContext }));
  }, []);

  const colorExample = cultural.getCulturalColor("primary");
  const colorAppropriate = cultural.checkColorAppropriate("#FF0000", "celebration");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 Enhanced Internationalization Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Experience the next-generation i18n features with cultural adaptation, accessibility, performance optimization, and advanced context-aware translations
          </p>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Advanced Context-Aware Translations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              🎯 Context-Aware Translations
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Translation Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Formality</label>
                    <select
                      value={translationContext.formality}
                      onChange={(e) => handleContextChange({ formality: e.target.value as any })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="formal">Formal</option>
                      <option value="informal">Informal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Audience</label>
                    <select
                      value={translationContext.audience}
                      onChange={(e) => handleContextChange({ audience: e.target.value as any })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="marketing">Marketing</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                    <select
                      value={translationContext.purpose}
                      onChange={(e) => handleContextChange({ purpose: e.target.value as any })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="navigation">Navigation</option>
                      <option value="content">Content</option>
                      <option value="error">Error</option>
                      <option value="confirmation">Confirmation</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Contextual Translations</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="font-medium">Greeting:</span>
                    <span className="ml-2 text-blue-600">{contextualTranslations.greeting}</span>
                  </div>
                  <div>
                    <span className="font-medium">Welcome:</span>
                    <span className="ml-2 text-blue-600">{contextualTranslations.welcome}</span>
                  </div>
                  <div>
                    <span className="font-medium">Item Count:</span>
                    <span className="ml-2 text-blue-600">{contextualTranslations.itemCount}</span>
                  </div>
                </div>
              </div>

              {advancedTranslation.isReady && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Translation Analytics</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-1 text-sm">
                      {advancedTranslation.getAnalytics().slice(0, 5).map((stat) => (
                        <div key={stat.key} className="flex justify-between">
                          <span>{stat.key}:</span>
                          <span>{stat.count} uses</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Translation Management Tools */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              🛠️ Translation Management
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Validation Results</h3>
                {advancedTranslation.isReady && (
                  <ValidationResults 
                    validation={advancedTranslation.validateTranslations(language)}
                  />
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Export Options</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const data = advancedTranslation.exportTranslations("json");
                      if (data) {
                        downloadFile(data, `translations-${language}.json`, "application/json");
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => {
                      const data = advancedTranslation.exportTranslations("csv");
                      if (data) {
                        downloadFile(data, `translations-${language}.csv`, "text/csv");
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Developer Tools</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                  <div>
                    <span className="font-medium">Manager Status:</span>
                    <span className={`ml-2 ${advancedTranslation.isReady ? 'text-green-600' : 'text-red-600'}`}>
                      {advancedTranslation.isReady ? 'Ready' : 'Initializing...'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Current Language:</span>
                    <span className="ml-2 text-blue-600">{language}</span>
                  </div>
                  <div>
                    <span className="font-medium">Context Stack:</span>
                    <span className="ml-2 text-purple-600">
                      {Object.entries(translationContext).map(([k, v]) => `${k}:${v}`).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Detection & Intelligence */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              🧠 Intelligent Language Detection
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Current Context</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><strong>Language:</strong> {language}</p>
                  <p><strong>Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                  <p><strong>Browser Language:</strong> {navigator.language}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Language Suggestions</h3>
                <div className="flex flex-wrap gap-2">
                  {enhanced.detection.suggestAlternativeLanguages().map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDetectLanguage}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Detect Optimal Language
              </button>

              {detection.detectionResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800">Detection Result:</h4>
                  <p className="text-green-700">
                    Language: {detection.detectionResult.language} 
                    (Confidence: {(detection.detectionResult.confidence * 100).toFixed(1)}%)
                  </p>
                  <p className="text-green-700">Method: {detection.detectionResult.method}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cultural Formatting */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              🏛️ Cultural Formatting
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Address Formatting</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-mono text-sm whitespace-pre-line">
                    {cultural.formatAddress(sampleAddress, { multiline: true })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Name Formatting</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><strong>Formal:</strong> {cultural.formatName(sampleName, { formal: true })}</p>
                  <p><strong>Casual:</strong> {cultural.formatName(sampleName)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Phone Formatting</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><strong>Local:</strong> {cultural.formatPhone("1234567890")}</p>
                  <p><strong>International:</strong> {cultural.formatPhone("1234567890", { international: true })}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Cultural Colors</h3>
                <div className="flex space-x-2 items-center">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: colorExample }}
                  />
                  <span className="text-sm">Primary color for {language}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Red for celebrations: {colorAppropriate.appropriate ? "✅ Appropriate" : "❌ Not appropriate"}
                  {colorAppropriate.reason && ` (${colorAppropriate.reason})`}
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              ♿ Accessibility Features
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Voice Recognition</h3>
                {voiceSupported ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleVoiceToggle}
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        isListening
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isListening ? "🎤 Stop Listening" : "🎤 Start Voice Recognition"}
                    </button>
                    {voiceResult && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800">Recognized: "{voiceResult}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Voice recognition not supported in this browser</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Keyboard Shortcuts</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                  <p><kbd className="bg-gray-200 px-2 py-1 rounded">Alt+L</kbd> - Language Switcher</p>
                  <p><kbd className="bg-gray-200 px-2 py-1 rounded">Alt+H</kbd> - Home</p>
                  <p><kbd className="bg-gray-200 px-2 py-1 rounded">Alt+S</kbd> - Search</p>
                  <p><kbd className="bg-gray-200 px-2 py-1 rounded">/</kbd> - Quick Search</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Screen Reader</h3>
                <button
                  onClick={() => accessibility.announceLanguageChange(language, true)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Announce Current Language
                </button>
              </div>
            </div>
          </div>

          {/* Performance Monitoring */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              ⚡ Performance Optimization
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Cache Statistics</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cache Hit Rate:</span>
                    <span className="font-mono">{(performanceData.cacheHitRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Usage:</span>
                    <span className="font-mono">{(performanceData.memoryUsage / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Load Time:</span>
                    <span className="font-mono">{performanceData.loadTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missing Translations:</span>
                    <span className="font-mono">{performanceData.translationMisses}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Smart Preloading</h3>
                <button
                  onClick={handlePreloadLanguages}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Preload Predicted Languages
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Language Analytics</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {Array.from(performance.getLanguageAnalytics().entries()).slice(0, 3).map(([lang, stats]) => (
                    <div key={lang} className="flex justify-between text-sm">
                      <span>{lang}:</span>
                      <span>{stats.count} uses</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Initialization Status</h3>
                <div className={`px-3 py-2 rounded-lg text-sm ${
                  performance.isInitialized
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {performance.isInitialized ? "✅ Fully Initialized" : "⏳ Initializing..."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Preferences */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            👤 User Preferences & Personalization
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Current Preferences</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                {enhanced.preferences.current ? (
                  <>
                    <p><strong>Primary:</strong> {enhanced.preferences.current.primaryLanguage}</p>
                    <p><strong>Fallbacks:</strong> {enhanced.preferences.current.fallbackLanguages.join(", ")}</p>
                    <p><strong>Method:</strong> {enhanced.preferences.current.detectionMethod}</p>
                    <p><strong>Last Used:</strong> {new Date(enhanced.preferences.current.lastUsed).toLocaleString()}</p>
                  </>
                ) : (
                  <p className="text-gray-500">No preferences saved</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Suggested Languages</h3>
              <div className="space-y-2">
                {enhanced.preferences.suggested.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => enhanced.preferences.update(lang)}
                    className="block w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Switch to {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => enhanced.preferences.save({ detectionMethod: "manual" })}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Save Current as Preference
                </button>
                <button
                  onClick={() => enhanced.detection.detectOptimalLanguage()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Auto-Detect Best Language
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Tools */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-yellow-900 mb-4">
              🛠️ Developer Tools (Development Only)
            </h2>
            <p className="text-yellow-800 mb-4">
              Open browser console and try these commands:
            </p>
            <div className="bg-yellow-100 rounded-lg p-4 font-mono text-sm text-yellow-900 space-y-1">
              <p>naraI18nDev.validate() - Validate all translations</p>
              <p>naraI18nDev.missing() - Show missing translations</p>
              <p>naraI18nDev.usage() - Show usage statistics</p>
              <p>naraI18nDev.export() - Export all reports</p>
              <p>naraI18nDev.setContext(&#123;formality: "formal"&#125;) - Set translation context</p>
              <p>naraI18nDev.analytics() - View translation analytics</p>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

function ValidationResults({ validation }: { 
  validation: { missing: string[]; incomplete: string[]; warnings: Array<{ key: string; message: string }> } 
}) {
  const { missing, incomplete, warnings } = validation;
  const hasIssues = missing.length > 0 || incomplete.length > 0 || warnings.length > 0;

  if (!hasIssues) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-green-800 text-sm">✅ All translations are complete and valid</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {missing.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm font-medium">Missing translations:</p>
          <ul className="text-red-700 text-xs mt-1 ml-4 list-disc">
            {missing.slice(0, 3).map(key => <li key={key}>{key}</li>)}
            {missing.length > 3 && <li>...and {missing.length - 3} more</li>}
          </ul>
        </div>
      )}

      {incomplete.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm font-medium">Incomplete contexts:</p>
          <ul className="text-yellow-700 text-xs mt-1 ml-4 list-disc">
            {incomplete.slice(0, 3).map(key => <li key={key}>{key}</li>)}
            {incomplete.length > 3 && <li>...and {incomplete.length - 3} more</li>}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm font-medium">Warnings:</p>
          <ul className="text-blue-700 text-xs mt-1 ml-4 list-disc">
            {warnings.slice(0, 3).map(warning => (
              <li key={warning.key}>{warning.key}: {warning.message}</li>
            ))}
            {warnings.length > 3 && <li>...and {warnings.length - 3} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}