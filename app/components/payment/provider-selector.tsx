/**
 * Payment Provider Selection Component
 * 
 * This component allows users to select their preferred payment provider
 * and displays the capabilities and features of each available provider.
 */

import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { CheckCircle, XCircle, CreditCard, Globe, Zap, Shield } from 'lucide-react';

interface ProviderCapabilities {
  supportsSubscriptions: boolean;
  supportsOneTimePayments: boolean;
  supportsRefunds: boolean;
  supportsTrials: boolean;
  supportsUsageBased: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
  requiresWebhooks: boolean;
  supportsPaymentMethods: string[];
}

interface PaymentProvider {
  type: string;
  capabilities: ProviderCapabilities;
  isConfigured: boolean;
}

interface ProviderInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const PROVIDER_INFO: Record<string, ProviderInfo> = {
  stripe: {
    type: 'stripe',
    name: 'Stripe',
    description: 'Leading payment processor with comprehensive features',
    icon: '💳',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
  },
  paypal: {
    type: 'paypal',
    name: 'PayPal',
    description: 'Popular digital wallet and payment platform',
    icon: '🏦',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
  },
  zalopay: {
    type: 'zalopay',
    name: 'ZaloPay',
    description: 'Vietnamese e-wallet popular in Southeast Asia',
    icon: '💰',
    color: 'bg-green-50 border-green-200 hover:border-green-300'
  },
  square: {
    type: 'square',
    name: 'Square',
    description: 'All-in-one payment and business solution',
    icon: '⬛',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-300'
  }
};

interface PaymentProviderSelectorProps {
  selectedProvider?: string;
  onProviderSelect: (provider: string) => void;
  requirements?: {
    needsSubscriptions?: boolean;
    needsTrials?: boolean;
    needsRefunds?: boolean;
    needsUsageBased?: boolean;
    primaryCurrency?: string;
    primaryCountry?: string;
  };
}

export function PaymentProviderSelector({
  selectedProvider,
  onProviderSelect,
  requirements
}: PaymentProviderSelectorProps) {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetchProviders();
    if (requirements) {
      fetchRecommendations();
    }
  }, [requirements]);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/payments/providers');
      const data = await response.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!requirements) return;
    
    try {
      const response = await fetch('/api/payments/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirements)
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const getProviderScore = (providerType: string): number => {
    const rec = recommendations.find(r => r.type === providerType);
    return rec?.recommendationScore || 0;
  };

  const isRecommended = (providerType: string): boolean => {
    return getProviderScore(providerType) > 0;
  };

  const getBestMatch = (): string | null => {
    if (recommendations.length === 0) return null;
    const best = recommendations.reduce((prev, current) => 
      (current.recommendationScore > prev.recommendationScore) ? current : prev
    );
    return best.recommendationScore > 0 ? best.type : null;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const bestMatch = getBestMatch();

  return (
    <div className="space-y-6">
      {requirements && recommendations.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-600" />
            <h3 className="font-medium text-green-800">Recommended for Your Needs</h3>
          </div>
          {bestMatch && (
            <p className="text-sm text-green-700">
              <strong>{PROVIDER_INFO[bestMatch]?.name || bestMatch}</strong> is the best match 
              for your requirements with a score of {getProviderScore(bestMatch)}/31.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          const info = PROVIDER_INFO[provider.type];
          const isSelected = selectedProvider === provider.type;
          const recommended = isRecommended(provider.type);
          const score = getProviderScore(provider.type);
          
          return (
            <Card
              key={provider.type}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary shadow-md' 
                  : info?.color || 'hover:border-gray-300'
              } ${!provider.isConfigured ? 'opacity-60' : ''}`}
              onClick={() => provider.isConfigured && onProviderSelect(provider.type)}
            >
              {recommended && bestMatch === provider.type && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Best Match
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info?.icon || '💳'}</span>
                    <div>
                      <CardTitle className="text-lg">
                        {info?.name || provider.type}
                      </CardTitle>
                      {!provider.isConfigured && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Not Configured
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
                <CardDescription className="text-sm">
                  {info?.description || 'Payment processing solution'}
                  {recommended && score > 0 && (
                    <div className="mt-1 text-green-600 font-medium text-xs">
                      Recommendation Score: {score}/31
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Features */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    {provider.capabilities.supportsSubscriptions ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span>Subscriptions</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {provider.capabilities.supportsTrials ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span>Free Trials</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {provider.capabilities.supportsRefunds ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span>Refunds</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {provider.capabilities.supportsUsageBased ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span>Usage Billing</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <CreditCard className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Payment Methods</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {provider.capabilities.supportsPaymentMethods.slice(0, 3).map((method) => (
                      <Badge key={method} variant="outline" className="text-xs py-0">
                        {method.replace('_', ' ')}
                      </Badge>
                    ))}
                    {provider.capabilities.supportsPaymentMethods.length > 3 && (
                      <Badge variant="outline" className="text-xs py-0">
                        +{provider.capabilities.supportsPaymentMethods.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Currencies & Countries */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Globe className="h-3 w-3 text-gray-500" />
                      <span className="font-medium text-gray-700">Currencies</span>
                    </div>
                    <div className="text-gray-600">
                      {provider.capabilities.supportedCurrencies.length} supported
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Shield className="h-3 w-3 text-gray-500" />
                      <span className="font-medium text-gray-700">Countries</span>
                    </div>
                    <div className="text-gray-600">
                      {provider.capabilities.supportedCountries.length} supported
                    </div>
                  </div>
                </div>

                {!provider.isConfigured && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    This provider needs to be configured in your environment variables before it can be used.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {providers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">⚙️</div>
            <h3 className="text-lg font-medium mb-2">No Payment Providers Configured</h3>
            <p className="text-gray-600 text-sm">
              Configure at least one payment provider in your environment variables to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface PaymentProviderBadgeProps {
  provider: string;
  className?: string;
}

export function PaymentProviderBadge({ provider, className = '' }: PaymentProviderBadgeProps) {
  const info = PROVIDER_INFO[provider];
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      <span>{info?.icon || '💳'}</span>
      <span>{info?.name || provider}</span>
    </Badge>
  );
}